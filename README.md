# usbinfo
Used to load USB info from `idVendor` and `idProduct`.
If `idProduct` is missing or the `idProduct` is unknown, only the vendor is shown.

Uses http://www.linux-usb.org/usb.ids to identify the IDs

# Usage
```
var usbinfo = require('usbinfo')

usbinfo.getDevice('0001', '7778', (err, device) => {
  if (err) return console.log(err)
  console.log(device)
})

usbinfo.getVendor('0001', (err, vendor) => {
  if (err) return console.log(err)
  console.log(vendor)
})
```
