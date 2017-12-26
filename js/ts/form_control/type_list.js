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
    if(host == 'gm.bolac.360mobi.vn') {
        var str1 = "Vật phẩm ID";  var str2 = "Item ID";  var str3 = "Số Đá";
        var str4 = "Chế độ chỉ định";  var str5 = "Tổ đội với N người";  var str6 = "Đem kỹ năng, pet, skin chỉ định vào trận";
        var str7 = "Đồng đội đem kỹ năng, pet, skin chỉ định vào trận";  var str8 = "Đạt hạng N";
    }else{
        var str1 = "物品ID";  var str2 = "道具ID";  var str3 = "宝石数目";
        var str4 = "指定模式";  var str5 = "与N名组队";  var str6 = "携带指定技能宠物皮肤等";
        var str7 = "队友携带指定技能宠物皮肤等";  var str8 = "战斗获取N名";
    }
    (function (control) {
        class type_list extends control.fbase {
            constructor() {
                super();
                this.onRenderComplete = () => {
                    this.getSelect().bind("change", function () {
                        $(this).siblings().hide();
                        $(this).siblings("br").css("display", "");
                        $(this).siblings("input").val("");
                        if (this.value == 1 || this.value == 7 || this.value == 13) {
							$(this).siblings().hide();                            
                        }else if(this.value == 3){                        	                       	
                            $(this).siblings("input").eq(0).css("display", "inline");
                            $(this).siblings("span").eq(0).css("display", "inline");
                            $(this).siblings("span").eq(0).text(str1);
                       }else if(this.value == 12){                        	                       	
                            $(this).siblings("input").eq(0).css("display", "inline");
                            $(this).siblings("span").eq(0).css("display", "inline");
                            $(this).siblings("span").eq(0).text(str2);
                       }else if(this.value == 14){                        	                       	
                            $(this).siblings("input").eq(0).css("display", "inline");
                            $(this).siblings("span").eq(0).css("display", "inline");
                            $(this).siblings("span").eq(0).text(str3);
                        } else {
                        	$(this).siblings().show();
                        	$(this).siblings("span").eq(0).text(str4);
                            $(this).siblings("span").eq(1).text(str5);
                            $(this).siblings("span").eq(2).text(str6);
                            $(this).siblings("span").eq(3).text(str7);
                            $(this).siblings("span").eq(4).text(str8);
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
                if(host == 'gm.bolac.360mobi.vn') {
                    var option = `<div>
                			<select  name="subActivityType" class="form-control" style="display: inline; margin-right: 5px;">
                                <option value="1">Đăng nhập (Không)</option>
                                <option value="2">Kèm điều kiện tham gia thi đấu</option>
                                <option value="3">Tiêu hao vật phẩm</option>
                                <option value="4">Kèm điều kiện tham gia thi đấu đạt N lần kích sát</option>
                                <option value="5">Kèm điều kiện tham gia thi đấu đạt N lần trợ công</option>
                                <option value="6">Kèm điều kiện tham gia thi đấu đạt N điểm</option>
                                <option value="7">Tích lũy nạp</option>
                                <option value="8">Kèm điều kiện trong 1 trận thi đấu đạt N lần kích sát</option>
                                <option value="9">Kèm điều kiện trong 1 trận thi đấu đạt N lần trợ công</option>
                                <option value="10">Kèm điều kiện trong 1 trận thi đấu đạt N điểm</option>
                                <option value="11">Kèm điều kiện trong 1 trận thi đấu đạt N lần tử vong</option>
                                <option value="12">Mua item trong Nhà Nấm</option>
                                <option value="13">Vòng Quay</option>
                                <option value="14">Nạp đúng mốc</option>
                            </select>`;
                }else {
                    var option = `<div>
                			<select  name="subActivityType" class="form-control" style="display: inline; margin-right: 5px;">
                                <option value="1">登陆（无）</option>
                                <option value="2">附带条件竞技参加</option>
                                <option value="3">消耗物品</option>
                                <option value="4">附带条件竞技参加N次击杀</option>
                                <option value="5">附带条件竞技参加N次助攻</option>
                                <option value="6">附带条件竞技参加N点积分</option>
                                <option value="7">累计充值</option>
                                <option value="8">附带条件单场竞技参加N次击杀</option>
                                <option value="9">附带条件单场竞技参加N次助攻</option>
                                <option value="10">附带条件单场竞技参加N点积分</option>
                                <option value="11">附带条件单场竞技参加N次死亡</option>
                                <option value="12">瓦瓦莉商店中购买道具</option>
                                <option value="13">夺宝</option>
                                <option value="14">单笔购买原谅宝石</option>

                            </select>`;
                }
                let html = option +`
                            </br>
                            <span style="display: none;">参数1</span>
                            <input name="subActivityParams1" type="text" class="form-control"  style="width: 20%; display: none;"/>
                            <span style="display: none;">参数2</span>
                            <input name="subActivityParams2" type="text" class="form-control" style="width: 20%; display: none;"/>
                            <span style="display: none;">参数3</span>
                            <input name="subActivityParams3" type="text" class="form-control" style="width: 20%; display: none;"/>
                            <span style="display: none;">参数4</span>
                            <input name="subActivityParams4" type="text" class="form-control" style="width: 20%; display: none;"/>
                            <span style="display: none;">参数5</span>
                            <input name="subActivityParams5" type="text" class="form-control" style="width: 20%; display: none;"/>
                            </div>
                      `;
                    return html;

            }
            getValue() {
                let ele = $(this.getElement());
                let type = ele.find("[name=subActivityType]").val();
                
                let params1 = ele.find("[name=subActivityParams1]").val();
                let params2 = ele.find("[name=subActivityParams2]").val();
                let params3 = ele.find("[name=subActivityParams3]").val();
                let params4 = ele.find("[name=subActivityParams4]").val();
                let params5 = ele.find("[name=subActivityParams5]").val();
                
                return { type: $.trim(type), params1: params1, params2: params2,params3: params3,params4: params4,params5: params5 };
            }
            setValue(value) {
            	let ele = $(this.getElement());
            	ele.find("option[value=" + value.type + "]").attr("selected", "selected");

				if(value.type == '3'){
                	ele.find("input").eq(0).css("display", "inline");
            		ele.find("span").eq(0).css("display", "inline");
                	ele.find("span").eq(0).text(str1);
                	ele.find("input").eq(0).attr("value",value.params1);
              	}else if(value.type == '12'){
                	ele.find("input").eq(0).css("display", "inline");
            		ele.find("span").eq(0).css("display", "inline");
                	ele.find("span").eq(0).text(str2);
                	ele.find("input").eq(0).attr("value",value.params1);
                }else if(value.type == '14'){
                	ele.find("input").eq(0).css("display", "inline");
            		ele.find("span").eq(0).css("display", "inline");
                	ele.find("span").eq(0).text(str3);
                	ele.find("input").eq(0).attr("value",value.params1);
            	}else if(value.type == '1' || value.type == '7' || value.type == '13'){
            		ele.find("input").eq(0).attr("value","");
                    ele.find("input").eq(1).attr("value","");
                    ele.find("input").eq(2).attr("value","");
                    ele.find("input").eq(3).attr("value","");
                    ele.find("input").eq(4).attr("value","");
            	}else{
            		ele.find("input").css("display", "inline");
            		ele.find("span").css("display", "inline");
                    ele.find("span").eq(0).text(str4);
                    ele.find("span").eq(1).text(str5);
                    ele.find("span").eq(2).text(str6);
                    ele.find("span").eq(3).text(str7);
                    ele.find("span").eq(4).text(str8);
                    ele.find("input").eq(0).attr("value",value.params1);
                    ele.find("input").eq(1).attr("value",value.params2);
                    ele.find("input").eq(2).attr("value",value.params3);
                    ele.find("input").eq(3).attr("value",value.params4);
                    ele.find("input").eq(4).attr("value",value.params5);
            	}            	
            }
        }
        control.type_list = type_list;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=type_list.js.map