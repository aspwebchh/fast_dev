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
                let data = yield gm2.ajaxAsync("index.php?/gm2/forList?action_id=gzwsw_send_item&action_mode=form&method=getAreaData", null);
                let options = data.map(item => `<option value="${item.areaid}">${item.name}</option>`);
                let html = `<select class="form-control">${options}</select>`;
                self.getElement().innerHTML = html;
            });
        }
        class gzwsw_area extends control.fbase {
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
                let result = $(this.getElement()).find("select").val();
                return result;
            }
            setValue(value) {
            }
        }
        control.gzwsw_area = gzwsw_area;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=gzwsw_area.js.map