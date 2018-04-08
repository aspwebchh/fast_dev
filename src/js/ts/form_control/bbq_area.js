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
                let data = yield gm2.ajaxAsync("index.php?/gm2/forZone?action_id=m_game_data&method=getBBQZone", null); 
                let html = "";
                for(var i=0;i<data.length;i++){
                	html += '<label style="font-weight: normal;">'
                			+'<input value='+data[i].id+' type="checkbox" name="zonelist">&nbsp;'+data[i].name+'&nbsp;&nbsp;'                	
                			+'</label>';
                }
                self.getElement().innerHTML = html;
            });
        }
        class bbq_area extends control.fbase {
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
        control.bbq_area = bbq_area;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=bbq_area.js.map