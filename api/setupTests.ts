import crypto from "node:crypto";

Object.defineProperty(global, "crypto", {
  value: {
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
  },
});
