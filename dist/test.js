"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-var-requires no-implicit-dependencies
const test = require("tape");
const usbinfo_1 = require("./usbinfo");
test("Test Get Product - existing vendor and device - 1", (t) => __awaiter(this, void 0, void 0, function* () {
    // tslint:disable-next-line:no-debugger
    const expected = {
        product: "Counterfeit flash drive [Kingston]",
        productId: "7778",
        vendor: "Fry's Electronics",
        vendorId: "0001",
    };
    const device = yield usbinfo_1.getProduct("0001", "7778").catch((err) => t.fail(err));
    t.deepEqual(device, expected);
    t.end();
}));
test("Test Get Product - existing vendor and device - 2", (t) => __awaiter(this, void 0, void 0, function* () {
    const expected = {
        product: "LUFA CDC Demo Application",
        productId: "2044",
        vendor: "Atmel Corp.",
        vendorId: "03eb",
    };
    const device = yield usbinfo_1.getProduct("03eb", "2044").catch((err) => t.fail(err));
    t.deepEqual(device, expected);
    t.end();
}));
test("Test Get Product - existing vendor and device - no padded id", (t) => __awaiter(this, void 0, void 0, function* () {
    const expected = {
        product: "Counterfeit flash drive [Kingston]",
        productId: "7778",
        vendor: "Fry's Electronics",
        vendorId: "0001",
    };
    const device = yield usbinfo_1.getProduct("1", "7778").catch((err) => t.fail(err));
    t.deepEqual(device, expected);
    t.end();
}));
test("Test Get Product - NOT existing vendor and device", (t) => __awaiter(this, void 0, void 0, function* () {
    const device = yield usbinfo_1.getProduct("lolo", "haha").catch((err) => t.pass());
    if (device) {
        return t.end("Fake device was found");
    }
    else {
        t.end();
    }
}));
test("Test Get Product - existing vendor but not device", (t) => __awaiter(this, void 0, void 0, function* () {
    const expected = {
        product: undefined,
        productId: "yyyy",
        vendor: "Fry's Electronics",
        vendorId: "0001",
    };
    const device = yield usbinfo_1.getProduct("0001", "yyyy").catch((err) => t.fail(err));
    t.deepEqual(device, expected);
    t.end();
}));
test("Test Get Vendor - existing vendor with no devices", (t) => __awaiter(this, void 0, void 0, function* () {
    const expected = {
        vendor: "Iwatsu America, Inc.",
        vendorId: "03ec",
    };
    const vendor = yield usbinfo_1.getVendor("3ec").catch((err) => t.fail(err));
    t.deepEqual(vendor, expected);
    t.end();
}));
test("Test Get Vendor - NON existing vendor", (t) => __awaiter(this, void 0, void 0, function* () {
    const device = yield usbinfo_1.getVendor("xxxxx").catch((err) => t.pass());
    if (device) {
        t.fail("Fake vendor found");
    }
    else {
        t.end();
    }
}));
//# sourceMappingURL=test.js.map