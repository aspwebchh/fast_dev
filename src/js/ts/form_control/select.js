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
/// <reference path="fbase.ts" />
var gm2;
(function (gm2) {
    var control;
    (function (control) {
        class select extends control.fbase {
            renderHtml() {
                let items = this.dataSource.get("list_item");
                let optHtml = items.map(item => `<option value="${item.get("value")}" ${item.get("selected") ? "selected" : ""}>${item.get("title")}</option>`);
                let html = `<select class="form-control" >
                            <option value="">请选择</option>
                            ${optHtml}
                        </select>`;
                return html;
            }
            getValue() {
                let result = this.getElement().value;
                return result;
            }
            setValue(value) {
                let ele = this.getElement();
                ele.value = value;
            }
        }
        control.select = select;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=select.js.map