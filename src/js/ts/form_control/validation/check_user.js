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
var gm2;
(function (gm2) {
    var control;
    (function (control) {
        class check_user extends control.validation_base {
            isValid(data) {
                data = $.trim(data);
                return /^\w+(,\w+)*$/.test(data);
            }
            invalidText(field) {
                return field + "为纯数字，多个请用逗号分隔";
            }
        }
        control.check_user = check_user;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=check_user.js.map