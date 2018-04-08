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
        class bbq_pic extends control.fbase {
            constructor() {
                super();
                this.imageUrl = "";
                var self = this;
                this.onRenderComplete = () => {
                    let ele = $(this.getElement());
                    let file = ele.find("input[type=file]");
                    file.bind("change", function () {
                        let formData = new FormData();
                        formData.append("file", this.files[0]);
                        let xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = (arg) => {
                            if (xhr.readyState == 4) {
                                if (xhr.status == 200) {
                                    let data = eval("(" + xhr.responseText + ")");
                                    let error = data.error;
                                    if (error) {
                                        alert(data.message);
                                    }
                                    else {
                                        self.imageUrl = data.url;
                                        self.showPic();
                                    }
                                }
                                else {
                                    alert("上传图片出错");
                                }
                            }
                        };
                        xhr.open("post", "index.php?/gm2/forForm?action_id=bbq_game_notice_pic&action_mode=form&method=upload");
                        xhr.send(formData);
                    });
                };
            }
            showPic() {
                $(this.getElement()).find("img").attr("src", this.imageUrl).show().bind("click", function () { window.open(this.src); }).css("cursor", "pointer");
            }
            renderHtml() {
                let html = `<div>
                                <input type="file" />
                                <img style="height: 130px; margin-top: 5px; display: none" >
							</div>	`;
                return html;
            }
            getValue() {
                return $(this.getElement()).find("img").attr("src");
            }
            setValue(value) {
                this.imageUrl = value;
                this.showPic();
            }
        }
        control.bbq_pic = bbq_pic;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=bbq_pic.js.map