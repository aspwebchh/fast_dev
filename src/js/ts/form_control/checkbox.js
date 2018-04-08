/// <reference path="../common.ts" />
/// <reference path="fbase.ts" />
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
        class checkbox extends control.fbase {
            renderHtml() {
                let items = this.dataSource.get("list_item");
                let html = items.map(item => `<label style="font-weight: normal;"><input type="checkbox" value="${item.get("value")}" name="${this.name()}" />&nbsp;${item.get("title")}&nbsp;&nbsp;</label>`);
                return `<div>${html.join("")}</div>`;
            }
            getValue() {
                let inputs = gm2.jquery2HtmlElements($(this.getElement()).find("input"));
                let result = inputs.filter(item => item.checked).map(item => item.value).join(",");
                return result;
            }
            setValue(value) {
                let val = $.trim(value);
                if (val == '') {
                    return;
                }
                let items = val.split(",");
                let ele = this.getElement();
                $(ele).find("input").each((index, item) => {
                    items.forEach(val => {
                        if (item.value == val) {
                            item.checked = true;
                        }
                    });
                });
            }
        }
        control.checkbox = checkbox;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=checkbox.js.map