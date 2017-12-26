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
        class bbq_channel extends control.fbase {
            constructor() {
                super();
                this.channelString = "";
                this.subCchannelString = `-1 所有渠道
1019	UC
1029	小米
1051	魅族
1052	联想
1054	金立
1065	酷派
1074	4399
1027	360
1020	斗鱼
1028	百度
1350	葫芦侠
1058    电魂
1330    捞月狗
1116    爱奇艺
1355    wifi万能钥匙
1354    暴漫
1120    努比亚
1045    果盘游戏
1356    多玩
1037    卓易
1031    应用宝
1114    三星
1329    B站
`;
                this.mainChannelString = `-1 所有渠道
2	电魂
5	oppo
6	vivo
7	华为
3	应用宝
        `;
                this.selectedId = "";
                this.keyword = "";
                this.onRenderComplete = () => {
                    let self = this;
                    let ele = $(this.getElement());
                    let input = ele.find("input");
                    let channelList = ele.find(".bbq_channel");
                    ele.bind("click", function (e) {
                        let target = e.target;
                        if (target.tagName != "LI") {
                            return;
                        }
                        let channelName = target.innerHTML;
                        let channelId = $(target).attr("id");
                        self.selectedId = channelId;
                        input.val(channelName);
                        channelList.hide();
                    });
                    input.bind("focus", function () {
                        channelList.show();
                    });
                    input.bind("keyup", function () {
                        self.keyword = this.value.replace(/(^\s*)|(\s*$)/, "");
                        channelList.find("ul").html(self.getHtml());
                    });
                };
            }
            channelData() {
                if (this.name() == "subChannel") {
                    this.channelString = this.subCchannelString;
                }
                else {
                    this.channelString = this.mainChannelString;
                }
                let result = this.channelString.split(/\n/).
                    filter(item => item.replace(/\s+/g, "").length > 0).
                    map(item => {
                    let items = item.split(/\s+/);
                    if (items.length >= 2) {
                        return {
                            id: items[0],
                            name: items[1]
                        };
                    }
                    else {
                        console.log(items);
                        return { id: "", name: "" };
                    }
                });
                return result;
            }
            getHtml() {
                return this.channelData().filter(item => {
                    if (this.keyword == "") {
                        return true;
                    }
                    else {
                        return item.name.toUpperCase().indexOf(this.keyword.toUpperCase()) != -1;
                    }
                }).map(item => {
                    return `<li id="${item.id}">${item.name}</li>`;
                }).join("");
            }
            renderHtml() {
                let html = `<div class="position:relative">
            <input type="text" class="form-control" placeholder="" />
                <div class="bbq_channel" style="display: none;">
                    <ul>${this.getHtml()}</ul>
                </div>
               </div>`;
                return html;
            }
            getValue() {
                return this.selectedId;
            }
            setValue(value) {
                let found = this.channelData().filter(item => item.id == value);
                if (found.length > 0) {
                    $(this.getElement()).find("input").val(found[0].name);
                }
            }
        }
        control.bbq_channel = bbq_channel;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=bbq_channel.js.map