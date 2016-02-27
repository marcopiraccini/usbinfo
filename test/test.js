'use strict'

var test = require('tape')
var usbinfo = require('..')

test('Test Get Device - existing vendor and device - 1', function (t) {
  var expected = {
    vendorId: '0001',
    deviceId: '7778',
    description: 'Counterfeit flash drive [Kingston]'
  }

  usbinfo.getDevice('0001', '7778', (err, device) => {
    if (err) t.fail(err)
    t.deepEqual(device, expected)
    t.end()
  })
})

test('Test Get Device - existing vendor and device - 2', function (t) {
  var expected = {
    vendorId: '03eb',
    deviceId: '2044',
    description: 'LUFA CDC Demo Application'
  }

  usbinfo.getDevice('03eb', '2044', (err, device) => {
    if (err) t.fail(err)
    t.deepEqual(device, expected)
    t.end()
  })
})

test('Test Get Device - NOT existing vendor and device', function (t) {
  usbinfo.getDevice('xxx', 'yyyy', (err, device) => {
    if (err) t.fail(err)
    t.notOk(device)
    t.end()
  })
})

test('Test Get Device - existing vendor but not device', function (t) {
  usbinfo.getDevice('0001', 'yyyy', (err, device) => {
    if (err) t.fail(err)
    t.notOk(device)
    t.end()
  })
})

test('Test Get Vendor - existing vendor with no devices', function (t) {
  var expected = {
    vendorId: '03ec',
    description: 'Iwatsu America, Inc.'
  }

  usbinfo.getVendor('03ec', (err, vendor) => {
    if (err) t.fail(err)
    t.deepEqual(vendor, expected)
    t.end()
  })
})

test('Test Get Vendor - NON existing vendor', function (t) {
  usbinfo.getVendor('xxxxx', (err, device) => {
    if (err) t.fail(err)
    t.notOk(device)
    t.end()
  })
})
