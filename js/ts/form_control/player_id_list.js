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
        class player_id_list extends control.fbase {
            constructor() {
                super();
                this.onRenderComplete = () => {
                    this.getSelect().bind("change", function () {
                        $(this).siblings().hide();
                        if (this.value == 2) {
                            $(this).siblings("input[type=file]").css("display", "inline");
                        }
                        else {
                            $(this).siblings("input[type=text]").css("display", "inline");
                        }
                    });
                    this.getText().bind("change", () => {
                        this.getHidden().val(this.getText().val());
                    });
                    this.getFile().bind("change", () => {
                        let input = this.getFile().get(0);
                        let file = input.files.item(0);
                        if (!/\.(txt|text)/i.test(file.name)) {
                            alert("请使用文本文件");
                            return;
                        }
                        let fileReader = new FileReader();
                        fileReader.onload = (e) => {
                            let target = e.target;
                            let result = target.result;
                            result = result.replace(/(^\s+)|(\s+$)/, "");
                            let data = result.split(/\s+/).join(",").trim();
                            if (!/^[^\s]+(,[^\s]+)*$/.test(data)) {
                                alert("文件格式不正确");
                                return;
                            }
                            this.getHidden().val(data);
                        };
                        fileReader.readAsText(file);
                    });
                };
            }
            getSelect() {
                return $(this.getElement()).find("select");
            }
            getFile() {
                return $(this.getElement()).find("input[type=file]");
            }
            getText() {
                return $(this.getElement()).find("input[type=text]");
            }
            getHidden() {
                return $(this.getElement()).find("input[type=hidden]");
            }
            renderHtml() {
                let html = `<div>
                            <select  class="form-control" style="width: 20%; display: inline; margin-right: 5px;" >
                                <option value="1">单个</option>
                                <option value="2">批量</option>
                            </select>
                            <input type="text" class="form-control"  style="width: 75%; display: inline;" />
                            <input type="file" clas="form-control" style="width: 70%; display: none;" />
                            <input type="hidden" />
                        </div>`;
                return html;
            }
            getValue() {
                return this.getHidden().val();
            }
            setValue(value) {
            }
        }
        control.player_id_list = player_id_list;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=player_id_list.js.map