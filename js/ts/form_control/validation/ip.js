/// <reference path="../../jquery/jquery.d.ts" />
/// <reference path="../../common.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var gm2;
(function (gm2) {
    var control;
    (function (control) {
        class ip extends control.validation_base {
            isIpAddr(ip) {
                let items = ip.split(".");
                if (items.length != 4) {
                    return false;
                }
                let success = items.every(item => {
                    return gm2.isInteger(item) && parseInt(item) <= 255;
                });
                return success;
            }
            isValid(data) {
                data = $.trim(data);
                if (data == "") {
                    return true;
                }
                else {
                    return this.isIpAddr(data);
                }
            }
            invalidText(field) {
                return field + "格式不合法";
            }
        }
        control.ip = ip;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=ip.js.map