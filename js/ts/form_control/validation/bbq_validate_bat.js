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
/// <reference path="../../jquery/jquery.d.ts" />
/// <reference path="../../common.ts" />
var gm2;
(function (gm2) {
    var control;
    (function (control) {
        class bbq_validate_bat extends control.validation_base {
            isValid(data) {
                for (let item of data) {
                    if (item.count == "") {
                        this.txt = item.status == 0 ? "请输入礼包码数量" : "请输入通码值";
                        return false;
                        ;
                    }
                    if (item.status == 0 && !gm2.isInteger(item.count)) {
                        this.txt = "礼包码数量必须为数值";
                        return false;
                    }
                    if (item.status == 0 && item.count > 50001) {
                        this.txt = "礼包码数量上限为50000个";
                        return false;
                    }
                }
                return true;
            }
            invalidText(field) {
                return this.txt;
            }
        }
        control.bbq_validate_bat = bbq_validate_bat;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=bbq_validate_bat.js.map