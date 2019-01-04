// tslint:disable:no-var-requires no-implicit-dependencies
const test = require("tape");
import { Test } from "tape";
import { getProduct, getVendor } from "./usbinfo";

test("Test Get Product - existing vendor and device - 1", async (t: Test) => {
  // tslint:disable-next-line:no-debugger
  const expected = {
    product: "Counterfeit flash drive [Kingston]",
    productId: "7778",
    vendor: "Fry's Electronics",
    vendorId: "0001",
  };

  const device = await getProduct("0001", "7778").catch((err) => t.fail(err));

  t.deepEqual(device, expected);
  t.end();
});

test("Test Get Product - existing vendor and device - 2", async (t: Test) => {
  const expected = {
    product: "LUFA CDC Demo Application",
    productId: "2044",
    vendor: "Atmel Corp.",
    vendorId: "03eb",
  };

  const device = await getProduct("03eb", "2044").catch((err) => t.fail(err));

  t.deepEqual(device, expected);
  t.end();
});

test("Test Get Product - existing vendor and device - no padded id", async (t: Test) => {
  const expected = {
    product: "Counterfeit flash drive [Kingston]",
    productId: "7778",
    vendor: "Fry's Electronics",
    vendorId: "0001",
  };

  const device = await getProduct("1", "7778").catch((err) => t.fail(err));
  t.deepEqual(device, expected);
  t.end();
});

test("Test Get Product - NOT existing vendor and device", async (t: Test) => {
  const device = await getProduct("lolo", "haha").catch((err) => t.pass());
  if (device) {
    return t.end("Fake device was found");
  } else {
    t.end();
  }
});

test("Test Get Product - existing vendor but not device", async (t: Test) => {
  const expected = {
    product: undefined,
    productId: "yyyy",
    vendor: "Fry's Electronics",
    vendorId: "0001",
  };
  const device = await getProduct("0001", "yyyy").catch((err) => t.fail(err));
  t.deepEqual(device, expected);
  t.end();
});

test("Test Get Vendor - existing vendor with no devices", async (t: Test) => {
  const expected = {
    vendor: "Iwatsu America, Inc.",
    vendorId: "03ec",
  };

  const vendor = await getVendor("3ec").catch((err) => t.fail(err));
  t.deepEqual(vendor, expected);
  t.end();
});

test("Test Get Vendor - NON existing vendor", async (t: Test) => {
  const device = await getVendor("xxxxx").catch((err) => t.pass());
  if (device) {
    t.fail("Fake vendor found");
  } else {
    t.end();
  }
});
