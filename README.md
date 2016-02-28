# usbinfo
Used to load USB info from `idVendor` and `idProduct` for Device and Vendor.
Other info (classes, protocols) will be added.
Uses http://www.linux-usb.org/usb.ids to identify the IDs

# Usage
`idVendor` and `idProduct` must be in the form of hex strings.

### getProduct
In this example `product` is `  { vendorId: '03eb', productId: '2044', product: 'LUFA CDC Demo Application', vendor: 'Atmel Corp.' }`
```
var usbinfo = require('usbinfo')

usbinfo.getProduct('0001', '7778', (err, product) => {
  if (err) return console.log(err)
  // do something (...)
})
```

### getVendor
In this example `vendor` is `  { vendorId: '03eb', vendor: 'Atmel Corp.' }`
```
usbinfo.getVendor('03eb', (err, vendor) => {
  if (err) return console.log(err)
  // do something (...)
})
```
