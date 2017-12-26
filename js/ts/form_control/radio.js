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
        class radio extends control.fbase {
            renderHtml() {
                let items = this.dataSource.get("list_item");
                let html = items.map(item => `<label style="font-weight: normal;"><input type="radio" value="${item.get("value")}" name="${this.name()}" />&nbsp;${item.get("title")}&nbsp;&nbsp;</label>`);
                return `<div>${html.join("")}</div>`;
            }
            getValue() {
                let result = $(this.getElement()).find("input:checked").val();
                return result;
            }
            setValue(value) {
                let ele = this.getElement();
                $(ele).find("input[value=" + value + "]").attr("checked", "checked");
            }
        }
        control.radio = radio;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=radio.js.map