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
        let outerAddItem;
        let outerItemList;
        function renderComplete(self) {
            return __awaiter(this, void 0, Promise, function* () {
                let addButton = $('<input type="button" value="增加" class="btn btn-default"/>');
                let itemList = $(self.getElement());
                let index = 1;
                let addItem = (obj) => {
                    index++;
                    let inputId = "player_id_" + index;
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
                    itemEl.find("input[name=player_id]").attr("id", inputId);
                    if (obj) {
                        itemEl.find("input[name=player_id]").val(obj.player_id);
                        itemEl.find("input[name=value1]").val(obj.value1);
                        itemEl.find("input[name=value2]").val(obj.value2);
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
        class dfdj_change extends control.fbase {
            constructor() {
                super();
                this.htmlTemplate = ` <p name="prop_item" class="prop_item" style="position:relative;">
                                 <span class="row1">
                                     <input type="text" name="player_id" placeholder="玩家ID" />
                                    &nbsp;
                                    <input type="text" name="value1" placeholder="修改值1" />
                                    &nbsp;
                                   <input type="text" name="value2" placeholder="修改值2" />
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
                    let playerID = $(item).find("input[name=player_id]").val();
                    let value1 = $(item).find("input[name=value1]").val();
                    let value2 = $(item).find("input[name=value2]").val();
                    return { player_id: $.trim(playerID), value1: $.trim(value1), value2: $.trim(value2) };
                });
                values = values.filter(item => {
                    let playerId = item["player_id"];
                    let value1 = item["value1"];
                    let value2 = item["value2"];
                    return playerId != "" || value1 != "" || value2 != "";
                });
                return values;
            }
            setValue(value) {
                if (value.length > 0) {
                    outerItemList.empty();
                    value.forEach(item => outerAddItem(item));
                }
            }
        }
        control.dfdj_change = dfdj_change;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=dfdj_change.js.map