'use strict'

var test = require('tape')
var usbinfo = require('..')

test('Test Get Product - existing vendor and device - 1', function (t) {
  var expected = {
    vendorId: '0001',
    productId: '7778',
    product: 'Counterfeit flash drive [Kingston]',
    vendor: 'Fry\'s Electronics'
  }

  usbinfo.getProduct('0001', '7778', (err, device) => {
    if (err) t.fail(err)
    t.deepEqual(device, expected)
    t.end()
  })
})

test('Test Get Product - existing vendor and device - 2', function (t) {
  var expected = {
    vendorId: '03eb',
    productId: '2044',
    product: 'LUFA CDC Demo Application',
    vendor: 'Atmel Corp.'
  }

  usbinfo.getProduct('03eb', '2044', (err, device) => {
    if (err) t.fail(err)
    t.deepEqual(device, expected)
    t.end()
  })
})

test('Test Get Product - NOT existing vendor and device', function (t) {
  usbinfo.getProduct('xxx', 'yyyy', (err, device) => {
    if (err) t.fail(err)
    t.notOk(device)
    t.end()
  })
})

test('Test Get Product - existing vendor but not device', function (t) {
  usbinfo.getProduct('0001', 'yyyy', (err, device) => {
    if (err) t.fail(err)
    t.notOk(device)
    t.end()
  })
})

test('Test Get Vendor - existing vendor with no devices', function (t) {
  var expected = {
    vendorId: '03ec',
    vendor: 'Iwatsu America, Inc.'
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
