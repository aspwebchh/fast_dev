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
        class validate_award extends control.validation_base {
            isValid(data) {
                for (let item of data) {
                    let itemId = item["item_id"];
                    let itemCount = item["item_count"];
                    //if( itemId == "" ) {
                    //    this.txt = "物品ID为空";
                    //    return false;
                    //}
                    //if( !isInteger(itemId)) {
                    //    this.txt = "物品ID必须为数值";
                    //    return false;
                    //}
                    if (itemCount == "") {
                        this.txt = "物品数量为空";
                        return false;
                    }
                    if (!gm2.isInteger(itemCount)) {
                        this.txt = "物品数量必须为数值";
                        return false;
                    }
                }
                return true;
            }
            invalidText(field) {
                return this.txt;
            }
        }
        control.validate_award = validate_award;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=validate_award.js.map