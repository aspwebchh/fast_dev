/// <reference path="../base_control.ts" />
/// <reference path="validation/validation_base.ts" />
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
var gm2;
(function (gm2) {
    var control;
    (function (control_1) {
        class LangSelector {
            constructor(control) {
                this.langs = {
                    "0": "简体中文",
                    "1": "英文",
                    "2": "繁体中文",
                    "3": "泰语",
                    "4": "韩语",
                    "5": "越南语",
                    "6": "印尼语",
                    "7": "俄罗斯语",
                    "8": "葡萄牙语",
                    "9": "法语",
                    "10": "德语",
                    "11": "西班牙语",
                    "12": "日语"
                };
                this.finished = (langList) => { };
                this.control = control;
                this.initDialog(this.control.name());
            }
            static getPageId() {
                if (LangSelector.pageId != null) {
                    return LangSelector.pageId;
                }
                LangSelector.pageId = new Date().getTime().toString(16);
                return LangSelector.pageId;
            }
            static initMask() {
                if (LangSelector.mask != null) {
                    return;
                }
                let maskHtml = `<div class="select-lang-mask"></div>`;
                let maskEle = $(maskHtml);
                top["$"]("body").append(maskEle);
                LangSelector.mask = maskEle;
            }
            static showMask() {
                this.initMask();
                LangSelector.mask.show();
            }
            static hideMask() {
                LangSelector.mask.hide();
            }
            static dialog(control) {
                let name = control.name();
                if (!LangSelector.dialogMap[name]) {
                    LangSelector.dialogMap[name] = new LangSelector(control);
                }
                return LangSelector.dialogMap[name];
            }
            getLangName(langId) {
                for (let key in this.langs) {
                    if (key == langId) {
                        return this.langs[langId];
                    }
                }
                return "";
            }
            initDialog(name) {
                if (this.dialog != null) {
                    return;
                }
                let id = `dialog_${name}`;
                let genLangHtml = () => {
                    let html = "";
                    for (let key in this.langs) {
                        html += `<li lang="${key}">${this.langs[key]}</li>`;
                    }
                    return html;
                };
                let dialogHtml = `<div class="select-lang-dialog" id="${id}">
                <h1>添加语言</h1>
                <img src="images/close.png" class="close-btn" />
                <div class="add-lang-bar">
                    <input type="button" value="添加" class="add-lang-btn"/>
                    <input type="button" value="确定" class="finish-btn"/>
                    <div class="lang-list">
                        <ul>
                        ${genLangHtml()}
                        </ul>
                    </div>
                </div>
                <div class="lang-content">
                <table>
                    <tr></tr>
                </table>
                </div>
            </div>`;
                let dialogEle = $(dialogHtml);
                let langListEl = dialogEle.find(".lang-list");
                let addLangBtn = dialogEle.find("input.add-lang-btn");
                let finishBtn = dialogEle.find("input.finish-btn");
                let closeBtn = dialogEle.find("img.close-btn");
                let content = dialogEle.find("table");
                top["$"]("body").append(dialogEle);
                addLangBtn.bind("click", function () {
                    langListEl.show();
                });
                dialogEle.bind("click", function (e) {
                    if (langListEl.get(0).contains(e.target) || e.target == addLangBtn.get(0)) {
                        return;
                    }
                    langListEl.hide();
                });
                let exists = function (lang) {
                    let langs = [];
                    content.find("tr").each(function (idx, el) {
                        let tmp = el.getAttribute("lang");
                        if (tmp) {
                            langs.push(tmp);
                        }
                    });
                    let result = langs.filter(item => item == lang);
                    if (result.length > 0) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                langListEl.find("li").bind("click", (e) => {
                    let lang = $(e.target).attr("lang");
                    let langText = $(e.target).html();
                    if (exists(lang)) {
                        content.find(`tr[lang='${lang}']`).find("textarea").focus();
                        alert("语言重复选择");
                        return;
                    }
                    this.appendItem2Form(lang, langText, "");
                    langListEl.hide();
                });
                content.bind("click", function (e) {
                    if (e.target.tagName == "INPUT" && e.target.getAttribute("action") == "del") {
                        $(e.target).parents("tr").remove();
                    }
                });
                let getResult = () => {
                    var result = [];
                    content.find("tr").each(function (index, item) {
                        let lang = item.getAttribute("lang");
                        if (lang) {
                            let langText = $(item).find("textarea").val();
                            result.push({ lang: parseInt(lang), lang_text: langText });
                        }
                    });
                    return result;
                };
                finishBtn.bind("click", () => {
                    let zoneControl = this.control.getOwner().findControl("zone");
                    if (zoneControl == null) {
                        alert("页面上没有地区选项");
                        return;
                    }
                    let controlValue = zoneControl.getValue();
                    if (typeof controlValue === 'string' && controlValue != "") {
                        controlValue = [controlValue];
                    }
                    if (controlValue.length == 0) {
                        alert("请先选择地区");
                        return;
                    }
                    let result = getResult();
                    if (result.length == 0) {
                        alert("未添加内容");
                        return;
                    }
                    if (result.filter(item => $.trim(item.lang_text) == "").length > 0) {
                        alert("内容未填写完整");
                        return;
                    }
                    let langKey = this.getLangKey();
                    let url = "index.php?/gm2/forForm?action_id=multi_lang&action_mode=form&method=saveMultiLang";
                    let ajaxSetting = {};
                    ajaxSetting.url = url;
                    ajaxSetting.type = "POST";
                    ajaxSetting.dataType = "JSON";
                    ajaxSetting.data = { "lang_key": langKey, "lang_data": result, "zone": controlValue };
                    ajaxSetting.success = (response) => {
                        if (response.error == 0) {
                            if (typeof this.finished === 'function') {
                                this.finished(result);
                            }
                        }
                        else {
                            alert(response.message);
                        }
                    };
                    $.ajax(ajaxSetting);
                });
                closeBtn.bind("click", () => {
                    this.hide();
                });
                this.dialog = dialogEle;
            }
            appendItem2Form(lang, langText, val) {
                let itemHtml = `<tr lang="${lang}">
                                            <td>${langText}</td>
                                            <td>
                                               <textarea>${val}</textarea>
                                            </td>
                                            <td>
                                                <input type="button" value="删除" action="del" />
                                            </td>
                                        </tr>`;
                this.dialog.find("table").find("tr").first().before(itemHtml);
            }
            //编辑页面的时候使用
            fillContent(langKey) {
                let url = "index.php?/gm2/forForm?action_id=multi_lang&action_mode=form&method=getMultiLang";
                let ajaxSetting = {};
                ajaxSetting.url = url;
                ajaxSetting.type = "POST";
                ajaxSetting.dataType = "JSON";
                ajaxSetting.data = { "lang_key": langKey };
                ajaxSetting.success = (response) => {
                    response.map((item) => {
                        let lang = item.languageid;
                        this.appendItem2Form(lang.toString(), this.getLangName(lang), item.translate);
                    });
                };
                $.ajax(ajaxSetting);
            }
            getLangKey() {
                return this.control.getActionId() + "#" + this.control.getActionMode() + "#" + this.control.name() + "#" + LangSelector.getPageId();
            }
            show() {
                LangSelector.showMask();
                this.dialog.css("display", "block");
            }
            hide() {
                LangSelector.hideMask();
                this.dialog.hide();
            }
        }
        LangSelector.dialogMap = {};
        class fbase extends gm2.control.base_control {
            constructor() {
                super();
                this.validations = [];
            }
            fillControlValue(value) { }
            addValidation(validation) {
                this.validations.push(validation);
            }
            getValidations() {
                return this.validations;
            }
            name() {
                return this.dataSource.get("name");
            }
            getActionId() {
                return this.actionId;
            }
            getActionMode() {
                return this.actionMode;
            }
            title() {
                return this.dataSource.get("title");
            }
            setDataSource(data) {
                this.dataSource = data;
            }
            getMultiLangSelector() {
                let selectLangBtn = $(`<a href="javascript:;" type="select_lang">选择语言</a>`);
                selectLangBtn.bind("click", () => {
                    let dialog = LangSelector.dialog(this);
                    dialog.finished = (langList) => {
                        let resultString = langList.map((item) => dialog.getLangName(item.lang)).join("，") + " 等" + langList.length + "种语言";
                        selectLangBtn.html("选择语言(已选 " + resultString + ")");
                        dialog.hide();
                        this.fillControlValue(dialog.getLangKey());
                    };
                    dialog.show();
                });
                return selectLangBtn;
            }
            isMultiLang() {
                if (this.dataSource.get("multi_lang") == "1") {
                    return true;
                }
                else {
                    return false;
                }
            }
            fillMultiLangDialog(langKey) {
                let dialog = LangSelector.dialog(this);
                dialog.fillContent(langKey);
            }
        }
        control_1.fbase = fbase;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=fbase.js.map