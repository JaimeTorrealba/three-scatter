import {
  __commonJS
} from "./chunk-BUSYA2B4.js";

// node_modules/.pnpm/alea@1.0.1/node_modules/alea/alea.js
var require_alea = __commonJS({
  "node_modules/.pnpm/alea@1.0.1/node_modules/alea/alea.js"(exports, module) {
    (function(root, factory) {
      if (typeof exports === "object") {
        module.exports = factory();
      } else if (typeof define === "function" && define.amd) {
        define(factory);
      } else {
        root.Alea = factory();
      }
    })(exports, function() {
      "use strict";
      Alea.importState = function(i) {
        var random = new Alea();
        random.importState(i);
        return random;
      };
      return Alea;
      function Alea() {
        return (function(args) {
          var s0 = 0;
          var s1 = 0;
          var s2 = 0;
          var c = 1;
          if (args.length == 0) {
            args = [+/* @__PURE__ */ new Date()];
          }
          var mash = Mash();
          s0 = mash(" ");
          s1 = mash(" ");
          s2 = mash(" ");
          for (var i = 0; i < args.length; i++) {
            s0 -= mash(args[i]);
            if (s0 < 0) {
              s0 += 1;
            }
            s1 -= mash(args[i]);
            if (s1 < 0) {
              s1 += 1;
            }
            s2 -= mash(args[i]);
            if (s2 < 0) {
              s2 += 1;
            }
          }
          mash = null;
          var random = function() {
            var t = 2091639 * s0 + c * 23283064365386963e-26;
            s0 = s1;
            s1 = s2;
            return s2 = t - (c = t | 0);
          };
          random.next = random;
          random.uint32 = function() {
            return random() * 4294967296;
          };
          random.fract53 = function() {
            return random() + (random() * 2097152 | 0) * 11102230246251565e-32;
          };
          random.version = "Alea 0.9";
          random.args = args;
          random.exportState = function() {
            return [s0, s1, s2, c];
          };
          random.importState = function(i2) {
            s0 = +i2[0] || 0;
            s1 = +i2[1] || 0;
            s2 = +i2[2] || 0;
            c = +i2[3] || 0;
          };
          return random;
        })(Array.prototype.slice.call(arguments));
      }
      function Mash() {
        var n = 4022871197;
        var mash = function(data) {
          data = data.toString();
          for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 4294967296;
          }
          return (n >>> 0) * 23283064365386963e-26;
        };
        mash.version = "Mash 0.9";
        return mash;
      }
    });
  }
});
export default require_alea();
//# sourceMappingURL=alea.js.map
