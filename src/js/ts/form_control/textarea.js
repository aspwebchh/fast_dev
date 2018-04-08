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
        class textarea extends control.fbase {
            constructor(...args) {
                super(...args);
                this.onRenderComplete = () => {
                    if (this.isMultiLang()) {
                        $(this.getElement()).after(this.getMultiLangSelector());
                    }
                };
            }
            renderHtml() {
                let html = `<textarea class="form-control" style="height: 200px;"></textarea>`;
                return html;
            }
            getValue() {
                let result = this.getElement().value;
                return result;
            }
            setValue(value) {
                let ele = this.getElement();
                ele.value = value;
                if (this.isMultiLang()) {
                    this.fillMultiLangDialog(value);
                }
            }
            fillControlValue(value) {
                let ele = this.getElement();
                ele.value = value;
            }
        }
        control.textarea = textarea;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=textarea.js.map