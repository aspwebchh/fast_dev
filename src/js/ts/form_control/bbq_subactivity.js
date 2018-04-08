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
    var host = window.location.host;
    (function (control) {
    	let outerAddItem;
        let outerItemList;
        function renderComplete(self) {
            return __awaiter(this, void 0, Promise, function* () {
                let addButton = $('<input type="button" value="增加" class="btn btn-default"/>');
                let itemList = $(self.getElement());
                let index = 0;
                let addItem = (obj) => {
                    //index++;
                    let inputId = "title_" + index;
                    let placeId = "place_" + index;
                    let html = self.htmlTemplate;
                    
                    if (!obj) {
                        index++;
                        html = html.replace(/\{\$index\}/g, index.toString());
                    }
                    else {
                        index = obj.index;
                        html = html.replace(/\{\$index\}/g, obj.index);
                    }
                    let itemEl = $(html);
                    itemList.append(itemEl);
                    itemEl.find('.row1').append(addButton);
                    itemEl.find('input[name=remove]').bind('click', function () {
                        if (itemEl.siblings().length == 0) {
                            return;
                        }
                        if (itemEl.get(0).contains(addButton.get(0))) {
                            addButton.appendTo(itemEl.prev().find('.row1'));
                        }
                        itemEl.remove();
                    });
                    itemEl.find(".suggest_placeholder").attr("id", placeId);
                    itemEl.find("input[name=title]").attr("id", inputId);
                    if (obj) {
                        itemEl.find("input[name=title]").val(obj.title);
                        itemEl.find("select[name=item_type]").val(obj.item_type);
                    }
                };

                itemList.bind("click", function (e) {
                    if (e.target.getAttribute("type") == "button" && e.target.getAttribute("value") == "增加") {
                        addItem();
                    }
                });
                addItem();
                outerAddItem = addItem;
                outerItemList = itemList;
            });
        }
        class bbq_subactivity extends control.fbase {
            constructor() {
                super();
                if(host == 'gm.bolac.360mobi.vn') {
                    var option =` <select name="item_type" class="form-control" style=" margin-right: 5px;">
                                        <option value="3">Tiếng Thái</option>
                                        <option value="5">Tiếng Việt</option>
                                   </select>`;
                }else{
                    var option =` <select name="item_type" class="form-control" style=" margin-right: 5px;">
                                        <option value="0">简体中文</option>
                                        <option value="1">英文</option>
                                        <option value="2">繁体</option>
                                        <option value="3">泰语</option>
                                        <option value="4">韩语</option>
                                        <option value="5">越南语</option>
                                        <option value="6">印尼语</option>
                                        <option value="7">俄罗斯语</option>
                                        <option value="8">葡萄牙语</option>
                                        <option value="9">法语</option>
                                        <option value="10">德语</option>
                                        <option value="11">西班牙语</option>
                                        <option value="12">日语</option>
                                    </select>`;
                }
                this.htmlTemplate = ` <div name="prop_item" class="prop_item clearfix" style="position:relative;">
                                 <span class="row1">
                                   `+option+`
                                    <input type="button" value="移除" class="btn btn-default" name="remove" style="float:left; margin-right:5px;" />
                                    <input type="text" name="title" placeholder="子活动任务描述" class="form-control" style="width: 100%; margin:10px 5px 10px 0px;"/>
                                </span>
                                <span class="row2 suggest_placeholder" style="z-index: 999; display: none; width: 300px;"></span>
                            </div>`;

                this.onRenderComplete = () => {
                    renderComplete(this);
                };
            }
            renderHtml() {
                let html = `<div></div>`;
                return html;
            }
            getValue() {
                let ele = $(this.getElement());
                let items = ele.find("[name=prop_item]");
                let htmlEles = gm2.jquery2HtmlElements(items);
                let values = htmlEles.map(item => {
                    let itemId = $(item).find("input[name=title]").val();
                    let itemType = $(item).find("select[name=item_type]").val();
                    return { title: $.trim(itemId), item_type: itemType };
                });
                values = values.filter(item => {
                    let itemId = item["title"];
                    return itemId != "";
                });
                return values;
            }
            setValue(value) {
            	if (value.length > 0) {
                     outerItemList.empty();
                     value.sort((a, b) => a.index - b.index);
                     value.forEach(item => outerAddItem(item));
                     // $(outerItemList.children().get(0)).remove();
                }
            }
        }
        control.bbq_subactivity = bbq_subactivity;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=bbq_subactivity.js.map