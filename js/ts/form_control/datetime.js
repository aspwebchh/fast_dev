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
/// <reference path="../jquery/jquery.d.ts" />
var gm2;
(function (gm2) {
    var control;
    (function (control) {
        class datetime extends control.fbase {
            constructor() {
                super();
                this.onRenderComplete = () => {
                    if ($('[data-plugin="datepicker"]').length > 0 && $.fn.datepicker) {
                        let obj = $('[data-plugin="datepicker"]');
                        obj.datepicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss' });
                    }
                };
            }
            renderHtml() {
                let html = `<div class="input-group" data-plugin="datepicker">
								<input class="form-control"  type="text">
								<div class="input-group-btn">
									<button type="button" class="btn btn-default">
										<i class="icon icon-date"></i>
									</button>
								</div>
							</div>	`;
                return html;
            }
            getValue() {
                let result = $(this.getElement()).find("input").val();
                return result;
            }
            setValue(value) {
                let ele = $(this.getElement()).find("input").get(0);
                ele.value = value.replace("+", " ");
            }
        }
        control.datetime = datetime;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=datetime.js.map