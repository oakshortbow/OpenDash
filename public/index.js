"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = void 0;
var world = "world";
console.log(hello(world));
function hello(msg) {
    if (msg === void 0) { msg = world; }
    return "Hello ".concat(world, "! ");
}
exports.hello = hello;
