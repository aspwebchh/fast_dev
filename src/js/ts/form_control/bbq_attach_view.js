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
        class bbq_attach_view extends control.fbase {
            constructor() {
                super();
            }
            renderHtml() {
                let html = `<div>
                <ul>
                    <li>1</li>
                    <li>2</li>
                </ul>
            </div>`;
                return html;
            }
            getValue() {
                return this.data;
            }
            setValue(value) {
                this.data = value;
                this.fillControl();
            }
            fillControl() {
                let html = "";
                this.data.forEach(item => {
                    html += "<li>物品ID：" + item.id + "&nbsp;&nbsp;&nbsp;&nbsp;数量：" + item.number + "</li>";
                });
                html = "<ul>" + html + "</ul>";
                let ele = this.getElement();
                ele.innerHTML = html;
            }
        }
        control.bbq_attach_view = bbq_attach_view;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=bbq_attach_view.js.map