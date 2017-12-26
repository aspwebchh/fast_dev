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
        class gzwsw_validate_attach extends control.validation_base {
            isValid(data) {
                if (data.length == 0) {
                    this.txt = "未选择物品";
                    return false;
                }
                let typeIsEmpty = data.every(item => item.type == "");
                let idIsEmpty = data.every(item => item.id == "");
                let numberIsEmpty = data.every(item => item.number == "");
                let typeIsInt = data.every(item => gm2.isInteger(item.type));
                let idIsInt = data.every(item => gm2.isInteger(item.id));
                let numberIsInt = data.every(item => gm2.isInteger(item.number));
                if (typeIsEmpty) {
                    this.txt = "类型为空";
                    return false;
                }
                if (idIsEmpty) {
                    this.txt = "ID为空";
                    return false;
                }
                if (numberIsEmpty) {
                    this.txt = "数值为空";
                    return false;
                }
                if (!typeIsInt) {
                    this.txt = "类型必须为数字";
                    return false;
                }
                if (!idIsInt) {
                    this.txt = "ID必须为数字";
                    return false;
                }
                if (!numberIsInt) {
                    this.txt = "数量必须为数字";
                    return false;
                }
                return true;
            }
            invalidText(field) {
                return this.txt;
            }
        }
        control.gzwsw_validate_attach = gzwsw_validate_attach;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=gzwsw_validate_attach.js.map