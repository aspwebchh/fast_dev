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
        function loadSuggest() {
            return __awaiter(this, void 0, Promise, function* () {
                return new Promise((resolve, reject) => {
                    seajs.use(['item_query_suggest.js?v=20170215'], function (sug) {
                        resolve(sug);
                    });
                });
            });
        }
        function renderComplete(self) {
            return __awaiter(this, void 0, Promise, function* () {
                //let suggest = await loadSuggest();
                //let data = await ajaxAsync("index.php?/gm2/forList?action_id=tdmob_send_item&action_mode=form&method=getItems", null);
                let addButton = $('<input type="button" value="增加" class="btn btn-default"/>');
                let itemList = $(self.getElement());
                let index = 1;
                let addItem = (obj) => {
                    index++;
                    let inputId = "item_id_" + index;
                    let placeId = "place_" + index;
                    let html = self.htmlTemplate;
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
                    itemEl.find("input[name=item_id]").attr("id", inputId);
                    //suggest.tdMobileItemSuggest( data, inputId, placeId, function( dataItem ) {
                    //    $( document.getElementById(inputId)).val( dataItem.id );
                    //} );
                };
                addButton.bind('click', function () {
                    addItem();
                });
                addItem();
            });
        }
        class gzwsw_attach extends control.fbase {
            constructor() {
                super();
                this.htmlTemplate = ` <p name="prop_item" class="prop_item" style="position:relative;">
                                 <span class="row1">
                                    <select name="type">
                                        <option value="">请选择</option>
                                        <option value="1">主公</option>
                                        <option value="2">卡牌</option>
                                        <option value="3">武器</option>
                                        <option value="4">翅膀</option>
                                        <option value="5">宠物</option>
                                        <option value="6">卡包</option>
                                        <option value="7">货币</option>
                                        <option value="8">经验</option>
                                    </select>
                                     <input type="text" name="item_id" placeholder="物品ID" />
                                    &nbsp;
                                    <input type="text" name="item_count" placeholder="数量" />
                                    &nbsp;
                                    <input type="button" value="移除" class="btn btn-default" name="remove"/>
                                    &nbsp;
                                </span>
                                <span class="row2 suggest_placeholder" style="z-index: 999; display: none; width: 300px;"></span>
                            </p>`;
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
                    let itemId = $(item).find("input[name=item_id]").val();
                    let itemCount = $(item).find("input[name=item_count]").val();
                    let type = $(item).find("select[name=type]").val();
                    return { id: $.trim(itemId), number: $.trim(itemCount), type: type };
                });
                values = values.filter(item => {
                    let itemId = item["id"];
                    let itemCount = item["number"];
                    let type = item["type"];
                    return itemId != "" || itemCount != "" || type != "";
                });
                return values;
            }
            setValue(value) {
            }
        }
        control.gzwsw_attach = gzwsw_attach;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=gzwsw_attach.js.map