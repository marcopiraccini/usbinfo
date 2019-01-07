/*
Copyright (c) 2014-2016, Marco Piraccini <marco.piraccini@gmail.com>
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

import eos from "end-of-stream";
import fs from "fs";
import split2 from "split2";

const countTabs = (line: string) => {
  return line.split("").reduce((prev, car) => {
    if (car === "\t") {
      return ++prev;
    }
    return prev;
  }, 0);
};

/**
 * Get the UDB info, with cache
 */
const getUsbInfoCached = async () => {
  let usbInfo: any;
  return new Promise((resolve, reject) => {
    if (usbInfo) {
      return resolve(usbInfo);
    }

    const knownTypes = [
      "C",
      "AT",
      "HID",
      "R",
      "BIAS",
      "PHY",
      "HUT",
      "L",
      "HCC",
      "VT",
    ];

    interface INameToValueMap {
      [key: string]: any;
    }

    const elements: INameToValueMap = {};
    let currentPath: any[] = [];
    let currentLevel = 0;
    let currentType: string = "device";
    // When a tab is met, the number of tab is counted.
    // if numberOfTabs = currentLevel + 1 =>
    //    currentLevel++
    //    currentPath.push(key)
    // (All that works because the list is ordered)

    const usbInfoStream = fs
      .createReadStream(__dirname + "/../ids/usb.ids")
      .pipe(split2())
      .on("data", (line) => {
        if (line.trim().startsWith("#") || !line.trim()) {
          return;
        } // Skip comments and empty lines

        const lineArr = line.split(" ");
        // Get the current type (is level === 0)
        // C -> Class (List of known device classes, subclasses and protocols)
        // AT -> List of Audio Class Terminal Types
        // HID -> List of HID Descriptor Types
        // R -> List of HID Descriptor Item Types
        // BIAS -> List of Physical Descriptor Bias Types
        // PHY -> List of Physical Descriptor Item Types
        // HUT -> List of HID Usages
        // L -> List lf languages
        // HCC -> HID Descriptor bCountryCode
        // VT -> List of Video Class Terminal Types
        if (knownTypes.indexOf(lineArr[0].trim()) !== -1) {
          currentType = lineArr.shift();
        }

        const key = lineArr.shift().trim();
        let value;

        if (lineArr) {
          value = lineArr.join(" ").trim();
        }

        const numberOfTabs = countTabs(line); // calculate the "level" form the number of the used tabs

        if (numberOfTabs === 0) {
          currentPath = [key];
          currentLevel = 0;
        }
        // Increment the level
        if (numberOfTabs === currentLevel + 1) {
          currentLevel++;
          currentPath.push(key);
        } else {
          // Same level, changing path
          currentPath[currentPath.length - 1] = key;
        }

        const element = {
          key,
          value,
          // tslint:disable-next-line:object-literal-sort-keys
          path: currentPath.slice(0),
        };

        if (!elements.hasOwnProperty(currentType)) {
          elements[currentType] = [];
        }
        elements[currentType].push(element);
      });

    eos(usbInfoStream, (err) => {
      if (err) {
        return reject("stream had an error or closed early");
      } // TODO: better mgmt
      usbInfo = elements;
      resolve(usbInfo);
    });
  });
};

const pad = (input: string, length: number, padding: any) => {
  while (
    (input = input.toString()).length + (padding = padding.toString()).length <
    length
  ) {
    padding += padding;
  }
  return padding.substr(0, length - input.length) + input;
};

export const getVendor = async (vendorId: string) => {
  return new Promise(async (resolve, reject) => {
    vendorId = pad(vendorId, 4, "0");
    const usbInfo = await getUsbInfoCached().catch((err) => {
      // tslint:disable-next-line:no-console
      console.error(err);
    });

    const info = usbInfo as { device: any[] };

    const found = info.device.reduce((prev, item) => {
      if (item.path[0] === vendorId && item.path.length === 1) {
        prev = item;
      }
      return prev;
    }, null);

    if (!found) {
      return reject();
    }

    return resolve({
      vendor: found.value,
      vendorId: found.path[0],
    });
  });
};

export const getProduct = (vendorId: any, productId: any) => {
  return new Promise(async (resolve, reject) => {
    productId = pad(productId, 4, "0");
    vendorId = pad(vendorId, 4, "0");

    const info: any = await getUsbInfoCached().catch((err) => reject(err));

    const vendor: any = await getVendor(vendorId).catch((err) => reject(err));
    if (!vendor) {
      return resolve();
    }

    const found = info.device.reduce((prev: any, item: any) => {
      if (item.path[0] === vendorId && item.path[1] === productId) {
        prev = item;
      }
      return prev;
    }, null);

    const ret = {
      product: undefined,
      productId,
      vendor: vendor.vendor,
      vendorId,
    };

    if (found) {
      ret.product = found.value;
    }

    resolve(ret);
  });
};
