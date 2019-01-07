# usbinfo

Identify USB devices based on their vendor and product IDs using the [Linux USB ID list](http://www.linux-usb.org/usb.ids).

# Usage

`idVendor` and `idProduct` should be hex strings (e.g. `0002`). Padding is optional.

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
