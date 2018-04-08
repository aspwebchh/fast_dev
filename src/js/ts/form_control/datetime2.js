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
        class datetime2 extends control.fbase {
            constructor() {
                super();
                this.onRenderComplete = () => {
                    if ($('[data-plugin="datepicker"]').length > 0 && $.fn.datepicker) {
                        let obj = $('[data-plugin="datepicker"]');
                        obj.datepicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss' });
                    }
                    let convertTime = (ts) => {
                        if (ts <= 0) {
                            return "0秒";
                        }
                        var d = Math.floor(ts / 86400000);
                        var h = Math.floor((ts % 86400000) / 3600000);
                        var m = Math.floor((ts % 3600000) / 60000);
                        var s = Math.floor((ts % 60000) / 1000);
                        return d.toString() + "天" + h.toString() + "时" + m.toString() + "分" + s + "秒";
                    };
                    let input = $(this.getElement()).find("input");
                    let dateTimeTip = $(this.getElement()).find("div[name=datetime_tip]");
                    let self = this;
                    input.blur(function () {
                        this.value = $.trim(this.value);
                        if (this.value == "") {
                            dateTimeTip.html("");
                            return;
                        }
                        let time = Date.parse(this.value.replace(/-/g, "/"));
                        if (self.name() == "begin_time") {
                            let now = new Date().getTime();
                            let diff = time - now;
                            dateTimeTip.html(convertTime(diff) + "后开始");
                        }
                        else {
                            let beginTime = $.trim($("input[name=begin_time]").val());
                            if (beginTime == "") {
                                return;
                            }
                            let beginTimeNum = Date.parse(beginTime.replace(/-/g, "/"));
                            let diff = time - beginTimeNum;
                            dateTimeTip.html("持续" + convertTime(diff));
                        }
                    });
                };
            }
            renderHtml() {
                let html = `<div class="input-group" data-plugin="datepicker" style="position: relative">
                                <div name="datetime_tip" style="position:absolute; left:300px;top:4px; z-index: 999; color: #999"></div>
								<input class="form-control"  type="text" name="${this.name()}">
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
        control.datetime2 = datetime2;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=datetime2.js.map