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
/// <reference path="../common.ts" />
var gm2;
(function (gm2) {
    var control;
    (function (control) {
        function renderComplete(self) {
            return __awaiter(this, void 0, Promise, function* () {
                let data = yield gm2.ajaxAsync("index.php?/gm2/forForm?action_id=bbq_zone&action_mode=form&method=getZoneData", null);
                let html = data.map(item => `<input type="checkbox" value="${item.id}" id="bbq_zone_item_${item.id}" /><label for="bbq_zone_item_${item.id}" style="font-weight: normal;">${item.name}</label>`).join("&nbsp;&nbsp;");
                let container = $(self.getElement());
                container.html(html);
            });
        }
        class bbq_zone extends control.fbase {
            constructor() {
                super();
                this.onRenderComplete = () => {
                    renderComplete(this);
                };
            }
            renderHtml() {
                let html = `<div></div>`;
                return html;
            }
            getValue() {
                let result = [];
                $(this.getElement()).find("input[type=checkbox]").each((index, item) => {
                    item.checked && result.push(item.value);
                });
                console.log(result);
                return result;
            }
            setValue(value) {
                value.forEach(item => {
                    $(this.getElement()).find("input[value=" + item + "]").attr("checked", "checked");
                });
            }
        }
        control.bbq_zone = bbq_zone;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=bbq_zone.js.map