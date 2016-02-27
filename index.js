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

'use strict'

var fs = require('fs')
var split2 = require('split2')
var eos = require('end-of-stream')

var knownTypes = ['C', 'AT', 'HID', 'R', 'BIAS', 'PHY', 'HUT', 'L', 'HCC', 'VT']

var elements = []
var currentPath = []
var currentLevel = 0
// When a tab is met, the number of tab is counted.
// if numberOfTabs = currentLevel + 1 =>
//    currentLevel++
//    currentPath.push(key)

var usbInfoStream = fs.createReadStream('./ids/usb.ids')
  .pipe(split2())
  .on('data', function (line) {
    if ((line.trim().startsWith('#')) || (!line.trim())) return // Skip comments and empty lines

    var lineArr = line.split(' ')
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
    var type
    if (knownTypes.indexOf(lineArr[0].trim()) !== -1) {
      type = lineArr.shift()
    }

    var key = lineArr.shift().trim()
    var value

    if (lineArr) {
      value = lineArr.join(' ')
    }

    var numberOfTabs = countTabs(line) // calculate the "level" form the number of the used tabs

    if (numberOfTabs === 0) {
      currentPath = [key]
      currentLevel = 0
    }
    // Increment the level
    if (numberOfTabs === (currentLevel + 1)) {
      currentLevel++
      currentPath.push(key)
    }

    var element = {
      key: key,
      value: value,
      path: currentPath.slice(0)
    }
    if (type) element.type = type

    elements.push(element)
  })

eos(usbInfoStream, function (err) {
  if (err) return console.log('stream had an error or closed early')
})

function countTabs (line) {
  return line.split('').reduce((prev, car) => {
    if (car === '\t') return ++prev
    return prev
  }, 0)
}
