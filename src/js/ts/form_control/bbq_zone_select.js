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
        class bbq_zone_select extends control.fbase {
            constructor() {
                super();
                this.onRenderComplete = () => {
                    this.renderComplete(this);
                };
            }
            renderComplete(self) {
                return __awaiter(this, void 0, Promise, function* () {
                    let data = yield gm2.ajaxAsync("index.php?/gm2/forForm?action_id=bbq_zone&action_mode=form&method=getZoneData", null);
                    let html = data.map(item => `<option value="${item.id}">${item.name}</option>`).join("");
                    html = "<option value=''>请选择</option>" + html;
                    html = "<select class='form-control'>" + html + "</select>";
                    let container = $(self.getElement());
                    container.html(html).find("select").val(this.val);
                });
            }
            renderHtml() {
                let html = `<div></div>`;
                return html;
            }
            getValue() {
                return $(this.getElement()).find("select").val();
            }
            setValue(value) {
                this.val = value;
            }
        }
        control.bbq_zone_select = bbq_zone_select;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=bbq_zone_select.js.map