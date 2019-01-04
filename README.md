# usbinfo

Used to load USB info from `idVendor` and `idProduct` for Device and Vendor.
Other info (classes, protocols) will be added.
Uses http://www.linux-usb.org/usb.ids to identify the IDs

# Usage

`idVendor` and `idProduct` must be in the form of hex strings, filled with
trailing zeroes (e.g. `0002` and not`2`). If not, the pad with leading zeroes is done automatically.

### getProduct

In this example `product` is `{ vendorId: '03eb', productId: '2044', product: 'LUFA CDC Demo Application', vendor: 'Atmel Corp.' }`.
If the vendor is found but the product id is not found, only vendor description is returned.

```typescript
import { getProduct } from "usbinfo";

const product = await getProduct("0001", "7778").catch(err =>
  console.error("Product not found")
);
// product == { vendorId: '03eb', productId: '2044', product: 'LUFA CDC Demo Application', vendor: 'Atmel Corp.' };
```

### getVendor

In this example `vendor` is `{ vendorId: '03eb', vendor: 'Atmel Corp.' }`

```typescript
import { getVendor } from "usbinfo";
const vendor = await getVendor("03eb").catch(err =>
  console.error("Vendor not found")
);
```
