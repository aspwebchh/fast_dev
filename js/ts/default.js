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
/// <reference path="jquery/jquery.d.ts" />
/// <reference path="common.ts" />
/// <reference path="form_control/fbase.ts" />
var gm2;
(function (gm2) {
    //列表
    //视图
    const VIEW_FILED_TYPE_LIST = "list";
    const VIEW_FIELD_TYPE_MAP = "map";
    const MODE_LIST = "list";
    const MODE_FORM = "form";
    const MODE_VIEW = "view";
    class Base {
        constructor(actionId, actionType) {
            this.constrolList = [];
            this.actionId = actionId;
            this.actionType = actionType || "";
        }
        findControl(name) {
            let result = this.constrolList.filter((item) => item.name() == name);
            if (result.length > 0) {
                return result[0];
            }
            else {
                return null;
            }
        }
        getActionConfig(mode) {
            return __awaiter(this, void 0, Promise, function* () {
                let url = `index.php?c=gm2&m=getAction&action_id=${this.actionId}&action_mode=${mode}&action_type=${this.actionType}`;
                let xml = yield gm2.ajaxAsync(url, null, "GET", "html");
                return xml;
            });
        }
        attrs(fields) {
            let result = [];
            fields.each((index, item) => {
                let data = new Map();
                let type = item.getAttribute("type");
                data.set("name", item.getAttribute("name"));
                data.set("title", item.getAttribute("title"));
                data.set("validation", item.getAttribute("validation"));
                data.set("multi_lang", item.getAttribute("multi_lang") || "0");
                data.set("type", type);
                data.set("placeholder", item.getAttribute("placeholder"));
                let isOperate = item.getAttribute("operate") == "1" ? 1 : 0;
                let operate = [];
                if (isOperate) {
                    let editElements = item.getElementsByTagName("Edit");
                    if (editElements.length > 0) {
                        let editElement = editElements[0];
                        let keyField = editElement.getAttribute("KeyField");
                        let operateItem = {};
                        operateItem["type"] = "edit";
                        operateItem["title"] = "编辑";
                        operateItem["key_field"] = keyField;
                        operate.push(operateItem);
                    }
                    let delElements = item.getElementsByTagName("Delete");
                    if (delElements.length > 0) {
                        let delElement = delElements[0];
                        let keyField = delElement.getAttribute("KeyField");
                        let operateItem = {};
                        operateItem["type"] = "delete";
                        operateItem["title"] = "删除";
                        operateItem["key_field"] = keyField;
                        operate.push(operateItem);
                    }
                }
                data.set("operate", operate);
                let listItems = $(item).children("ListItem");
                if (listItems.length > 0) {
                    let listItemData = [];
                    listItems.each((idx, itm) => {
                        let title = itm.getAttribute("title");
                        let value = itm.getAttribute("value");
                        let selected = itm.getAttribute("selected");
                        let dataItem = new Map();
                        dataItem.set("title", title);
                        dataItem.set("value", value);
                        dataItem.set("selected", selected == "true" ? true : false);
                        listItemData.push(dataItem);
                    });
                    data.set("list_item", listItemData);
                }
                result.push(data);
            });
            return result;
        }
        callValidation(validationName) {
            return __awaiter(this, void 0, Promise, function* () {
                return new Promise((resolve, reject) => {
                    let basePath = window.location.href.match(".+(?=index.php)");
                    let controlScriptPath = basePath + "/js/ts/form_control/validation/" + validationName + ".js?v=18";
                    let script = document.createElement("script");
                    script.onload = () => {
                        let validation = eval(`new gm2.control.${validationName}();`);
                        resolve(validation);
                    };
                    script.onerror = () => {
                        reject("验证对象不一样");
                    };
                    script.src = controlScriptPath;
                    document.body.appendChild(script);
                });
            });
        }
        callControl(controlDir, controlName) {
            return __awaiter(this, void 0, Promise, function* () {
                return new Promise((resolve, reject) => {
                    if (controlName == '') {
                        controlName = "nothing";
                    }
                    let basePath = window.location.href.match(".+(?=index.php)");
                    let controlScriptPath = basePath + "/js/ts/" + controlDir + "/" + controlName + ".js?v=18";
                    let script = document.createElement("script");
                    script.onload = () => {
                        let control = eval(`new gm2.control.${controlName}();`);
                        control.setActionIdAndMode(this.actionId, MODE_FORM);
                        control.setOwner(this);
                        this.constrolList.push(control);
                        resolve(control);
                    };
                    script.onerror = () => {
                        reject("控件不存在");
                    };
                    script.src = controlScriptPath;
                    document.body.appendChild(script);
                });
            });
        }
        callControlRenderCompleteFn(controls) {
            controls.forEach((item) => {
                item.onRenderComplete();
            });
        }
        hideLoadingBar() {
            $("#loading").remove();
        }
    }
    gm2.Base = Base;
    class View extends Base {
        constructor(actionId, actionType) {
            super(actionId, actionType);
            this.dataSource = View.fromLocalStorage(this.actionId, this.actionType);
            if (this.dataSource) {
                this.mode = View.MODE_FROM_STRORAGE;
                this.render().then(() => {
                    this.hideLoadingBar();
                });
            }
            else {
                this.mode = View.MODE_FROM_SERVER;
                this.getDataAndRender().then(() => {
                    this.hideLoadingBar();
                });
            }
        }
        static getStorageKey(actionId, actionType = "") {
            return actionId + "_" + MODE_VIEW + "_" + actionType;
        }
        static localStorage(actionId, actionType, data) {
            let localStKey = View.getStorageKey(actionId, actionType);
            localStorage[localStKey] = JSON.stringify(data);
        }
        static fromLocalStorage(actionId, actionType) {
            let localStKey = View.getStorageKey(actionId, actionType);
            if (!localStorage[localStKey]) {
                return null;
            }
            return JSON.parse(localStorage[localStKey]);
        }
        getDataAndRender() {
            return __awaiter(this, void 0, Promise, function* () {
                this.dataSource = yield this.getDataFromServer();
                this.render();
            });
        }
        getDataFromServer() {
            return __awaiter(this, void 0, Promise, function* () {
                let query = gm2.queryString();
                query.set("method", "data");
                query.set("c", "gm2");
                query.set("m", "forView");
                let url = `index.php?` + $.param(gm2.mapToObject(query));
                let result = yield gm2.ajaxAsync(url, null, "GET", "json");
                return result;
            });
        }
        genHtml(doc, data) {
            let html = "";
            let jdoc = $(doc);
            if (doc.tagName == "FIELDS") {
                let fields = jdoc.children("Field");
                for (let i = 0; i < fields.length; i++) {
                    let item = fields[i];
                    let name = item.getAttribute("name");
                    data = data || {};
                    html += this.genHtml(fields[i], data[name]);
                }
            }
            else {
                let name = doc.getAttribute("name");
                let type = doc.getAttribute("type");
                let title = doc.getAttribute("title");
                switch (type) {
                    case VIEW_FIELD_TYPE_MAP:
                        {
                            let contentHtml = ``;
                            let fields = jdoc.children("Field");
                            for (let i = 0; i < fields.length; i++) {
                                let item = fields[i];
                                let name = item.getAttribute("name");
                                data = data || {};
                                contentHtml += this.genHtml(fields[i], data[name]);
                            }
                            html = `<div class="form-group">
                                                <label class="col-sm-1 control-label">${title}</label>
                                            <div class="col-sm-10">
                                               ${contentHtml}
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>`;
                        }
                        break;
                    case VIEW_FILED_TYPE_LIST:
                        {
                            let thead = "";
                            let fields = jdoc.children("Field");
                            for (let i = 0; i < fields.length; i++) {
                                let field = fields[i];
                                let title = field.getAttribute("title");
                                thead += `<th>${title}</th>`;
                            }
                            let tbody = "";
                            data = data || [];
                            for (let i = 0; i < data.length; i++) {
                                tbody += "<tr>";
                                let dataItem = data[i];
                                for (let j = 0; j < fields.length; j++) {
                                    let field = fields[j];
                                    let name = field.getAttribute("name");
                                    tbody += `<td>${dataItem[name]}</td>`;
                                }
                                tbody += "</tr>";
                            }
                            console.log(tbody);
                            let contentHtml = `<table class="table">
                                <thead><tr>${thead}</tr></thead>
                                <tbody>${tbody}</tbody>
                             </table>`;
                            html = `<div class="form-group">
                                                <label class="col-sm-1 control-label">${title}</label>
                                            <div class="col-sm-10">
                                               ${contentHtml}
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>`;
                        }
                        break;
                    default:
                        data = (data === null || data == undefined) ? "" : data;
                        try {
                            data = JSON.parse(data);
                        }
                        catch (ex) { }
                        if (typeof data == "object") {
                            data = "<pre>" + gm2.syntaxHighlight(data) + "</pre>";
                        }
                        html = `<div class="form-group">
                                                <label class="col-sm-1 control-label">${title}</label>
                                            <div class="col-sm-10">
                                               ${data}
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>`;
                        break;
                }
            }
            return html;
        }
        render() {
            return __awaiter(this, void 0, Promise, function* () {
                if (!this.dataSource) {
                    return;
                }
                let xmlConfig = yield this.getActionConfig(MODE_VIEW);
                let config = $(xmlConfig);
                let title = config.attr("title");
                let fields = config.children("fields");
                let contentHtml = this.genHtml(fields[0], this.dataSource);
                let backBtnHtml = ` <div class="form-group">
                                                <div class="col-sm-10">
                                                    <input type="button" class="btn btn-success" value="返回上一页" onclick="window.history.back();"/>
                                                </div>
                                            </div>`;
                if (this.mode == View.MODE_FROM_SERVER) {
                    backBtnHtml = "";
                }
                let html = `<div class="wrapper wrapper-content animated fadeInRight">
                          <div id="error_txt"></div>
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="ibox float-e-margins">
                                    <div class="ibox-title">
                                        <h5>${title}<small></small></h5>
                                        <div class="ibox-tools"></div>
                                    </div>
                                    <div class="ibox-content">
                                        <form onsubmit="return false;" class="form-horizontal">
                                              ${contentHtml}
                                              ${backBtnHtml}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                $("body").append(html);
            });
        }
    }
    View.MODE_FROM_SERVER = 1;
    View.MODE_FROM_STRORAGE = 2;
    class Form extends Base {
        constructor(actionId, actionType) {
            super(actionId, actionType);
            this.controls = [];
            this.init().then(() => {
                this.hideLoadingBar();
            });
        }
        init() {
            return __awaiter(this, void 0, Promise, function* () {
                let xmlConfig = yield this.getActionConfig(MODE_FORM);
                let config = $(xmlConfig);
                let title = config.attr("title");
                let controls = config.find("Control");
                let controlsData = this.attrs(controls);
                let html = yield this.renderForm(title, controlsData);
                $('body').append(html);
                this.callControlRenderCompleteFn(this.controls);
                this.initSubmitEvent();
                this.fillForm();
            });
        }
        fillForm() {
            return __awaiter(this, void 0, Promise, function* () {
                if (gm2.queryString().get("id") == null) {
                    return;
                }
                let query = gm2.queryString();
                let zone = query.get("zone");
                let url = `index.php?c=gm2&m=forForm&action_id=${this.actionId}&action_mode=${MODE_FORM}&method=data&action_type=${this.actionType}&zone=${zone}`;
                url = this.attachId(url);
                let result = yield gm2.ajaxAsync(url, null);
                this.controls.forEach(item => {
                    item.setValue(result[item.name()]);
                });
            });
        }
        attachId(url) {
            let query = gm2.queryString();
            let id = query.get("id");
            if (id == null) {
                return url;
            }
            else {
                return url + `&id=${id}`;
            }
        }
        initSubmitEvent() {
            let getValidationInfo = () => {
                let isValid = true;
                let invalidTexts = [];
                for (let control of this.controls) {
                    let validations = control.getValidations();
                    for (let validation of validations) {
                        if (!validation.isValid(control.getValue())) {
                            isValid = false;
                            invalidTexts.push(validation.invalidText(control.title()));
                        }
                    }
                }
                return [isValid, invalidTexts];
            };
            let submitBtn = $("#submit_button");
            submitBtn.bind("click", (e) => __awaiter(this, void 0, Promise, function* () {
                let errorPlaceholder = $("#error_txt");
                errorPlaceholder.hide();
                let [isValid, invalidTexts] = getValidationInfo();
                if (!isValid) {
                    let invalidTextsHtml = invalidTexts.map(item => {
                        return "<li>" + item + "</li>";
                    }).join("");
                    errorPlaceholder.html("<ul>" + invalidTextsHtml + "</ul>").show();
                    return;
                }
                let submitData = this.controls.reduce((data, control) => {
                    data[control.name()] = control.getValue();
                    return data;
                }, {});
                let url = `index.php?c=gm2&m=forForm&action_id=${this.actionId}&action_mode=${MODE_FORM}&method=submit&action_type=${this.actionType}`;
                url = this.attachId(url);
                //submitBtn.attr("disabled","disabled");
                //submitBtn.html("请等待...");
                let result = yield gm2.ajaxAsync(url, submitData, "post", "json");
                if (result.error) {
                    alert(result.message);
                    submitBtn.removeAttr("disabled");
                    submitBtn.html("提交");
                    return;
                }
                View.localStorage(this.actionId, this.actionType, result);
                window.location.href = `index.php?c=gm2&m=index&action_id=${this.actionId}&action_mode=${MODE_VIEW}&action_type=${this.actionType}`;
            }));
        }
        renderForm(title, struct) {
            return __awaiter(this, void 0, Promise, function* () {
                let genControlHtml = (item) => __awaiter(this, void 0, Promise, function* () {
                    let type = item.get("type");
                    let control = yield this.callControl("form_control", type);
                    let validtion = item.get("validation");
                    if (validtion) {
                        let validationItems = validtion.split("|");
                        for (let validationItem of validationItems) {
                            let validationControl = yield this.callValidation(validationItem);
                            control.addValidation(validationControl);
                        }
                    }
                    this.controls.push(control);
                    control.setDataSource(item);
                    return control.render();
                });
                let controlHtmls = "";
                for (let structItem of struct) {
                    let controlHtml = yield genControlHtml(structItem);
                    let title = structItem.get("title");
                    controlHtmls += `<div class="form-group">
                                                <label class="col-sm-1 control-label">${title}</label>
                                            <div class="col-sm-10">
                                               ${controlHtml}
                                            </div>
                                        </div>
                                        <div class="hr-line-dashed"></div>`;
                }
                let html = `<div class="wrapper wrapper-content animated fadeInRight">
                          <div id="error_txt"></div>
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="ibox float-e-margins">
                                    <div class="ibox-title">
                                        <h5>${title}<small></small></h5>
                                        <div class="ibox-tools"></div>
                                    </div>
                                    <div class="ibox-content">
                                        <form onsubmit="return false;" class="form-horizontal">
                                            ${controlHtmls}
                                            <div class="form-group">
                                                <label class="col-sm-1 control-label"></label>
                                                <div class="col-sm-10">
                                                    <button class="btn btn-primary" id="submit_button">提交</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                return html;
            });
        }
    }
    class List extends Base {
        constructor(actionId, actionType) {
            super(actionId, actionType);
            this.controls = [];
            this.init().then(() => {
                this.hideLoadingBar();
            });
        }
        isExportList(searchControls) {
            let expt = searchControls.attr("export");
            if (expt === "true") {
                return true;
            }
            else {
                return false;
            }
        }
        getDataListDic(data) {
            let result = {};
            data.forEach((item) => result[item.get("name")] = item.get("title"));
            return result;
        }
        init() {
            return __awaiter(this, void 0, Promise, function* () {
                let xmlConfig = yield this.getActionConfig(MODE_LIST);
                let config = $(xmlConfig);
                this.title = config.attr("title");
                let fields = config.find("Field");
                let controls = config.children("Controls").children("Control");
                let searchControls = config.children("SearchControls").children("SearchControl");
                let expt = this.isExportList(config.children("SearchControls"));
                let searchHtml = yield this.renderSearch(this.attrs(searchControls), expt);
                let controlHtml = yield this.renderAction(this.attrs(controls));
                let data = yield this.getListData();
                let dic = this.getDataListDic(this.attrs(fields));
                let container = $('<div class="wrapper wrapper-content animated fadeInRight"></div>');
                let html = yield this.renderList(this.attrs(fields), controlHtml, data);
                container.append(searchHtml).append(html);
                $("body").append(container);
                this.callControlRenderCompleteFn(this.controls);
                this.initSearchFormEvent(dic);
                this.renderPage(data.data_count);
            });
        }
        renderPage(dataCount) {
            renderPage("page1", dataCount, List.PER_PAGE);
        }
        initSearchFormEvent(dataListDic) {
            $("#search_btn").bind("click", () => {
                let query = gm2.queryString();
                let data = this.controls.reduce((result, item) => {
                    if (item.getValue() != null && item.getValue().length > 0) {
                        result[item.name()] = item.getValue();
                    }
                    else {
                        delete result[item.name()];
                    }
                    return result;
                }, gm2.mapToObject(query));
                window.location.href = "index.php?" + $.param(data);
            });
            $("#reset_btn").bind("click", () => {
                let query = gm2.queryString();
                this.controls.forEach((item) => {
                    query.delete(item.name());
                });
                window.location.href = "index.php?" + $.param(gm2.mapToObject(query));
            });
            $("#export_btn").bind("click", () => {
                let query = gm2.queryString();
                query.set("method", "export");
                query.set("m", "forList");
                let url = `index.php?` + $.param(gm2.mapToObject(query)) + "&dic=" + JSON.stringify(dataListDic);
                window.location.href = url;
            });
            let fillControl = () => {
                let query = gm2.queryString();
                this.controls.forEach((item) => {
                    query.forEach((v, k) => {
                        if (item.name() == k) {
                            item.setValue(v);
                        }
                    });
                });
            };
            fillControl();
        }
        renderSearch(controls, expt = false) {
            return __awaiter(this, void 0, Promise, function* () {
                if (controls.length == 0) {
                    return "";
                }
                let genControlHtml = (item) => __awaiter(this, void 0, Promise, function* () {
                    let type = item.get("type");
                    let control = yield this.callControl("form_control", type);
                    this.controls.push(control);
                    control.setDataSource(item);
                    return control.render();
                });
                let group = controls.reduce((result, item) => {
                    let last = result[result.length - 1];
                    if (last.length < 4) {
                        last.push(item);
                    }
                    else {
                        let newList = [];
                        newList.push(item);
                        result.push(newList);
                    }
                    return result;
                }, [[]]);
                let controlHtmls = "";
                for (let i = 0; i < group.length; i++) {
                    let groupItem = group[i];
                    controlHtmls += ` <div class="form-group">`;
                    for (let j = 0; j < groupItem.length; j++) {
                        let control = groupItem[j];
                        let controlHtml = yield genControlHtml(control);
                        let title = control.get("title");
                        controlHtmls += `<label class="col-sm-1 control-label">
                                        ${title}
                                    </label>
                                    <div class="col-sm-2">
                                        ${controlHtml}
                                    </div>`;
                    }
                    controlHtmls += "</div> <div class='hr-line-dashed'></div>";
                }
                let exportBtnHtml = ``;
                if (expt) {
                    exportBtnHtml += `&nbsp;<button type="button" class="btn btn-primary" id="export_btn">导出</button>`;
                }
                let html = `    <div class="row">
                                <div class="col-sm-12">
                                    <div class="ibox float-e-margins">
                                        <div class="ibox-title">
                                            <h5>${this.title}<small></small></h5>
                                            <div class="ibox-tools"></div>
                                        </div>
                                        <div class="ibox-content">
                                            <form onsubmit="return false;" class="form-horizontal">
                                             ${controlHtmls}

                                                <div class="form-group">
                                                    <div  style="text-align: right;">
                                                      <button class="btn btn-primary" id="search_btn">查询</button>
                                                         ${exportBtnHtml}
                                                       <button type="button" class="btn btn-default" id="reset_btn">重置</button>
                                                    </div>
                                                </div>
                                           </form>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                return html;
            });
        }
        getListData() {
            return __awaiter(this, void 0, Promise, function* () {
                let query = gm2.queryString();
                query.set("c", "gm2");
                query.set("m", "forList");
                query.set("method", "getList");
                let url = `index.php?` + $.param(gm2.mapToObject(query));
                let result = yield gm2.ajaxAsync(url, null, "GET", "json");
                return result;
            });
        }
        renderAction(controls) {
            return __awaiter(this, void 0, Promise, function* () {
                if (controls.length == 0) {
                    return "";
                }
                let genControlHtml = (item) => __awaiter(this, void 0, Promise, function* () {
                    let type = item.get("type");
                    let control = yield this.callControl("list_control", type);
                    return control.render();
                });
                let controlHtml = "";
                for (let item of controls) {
                    controlHtml += yield genControlHtml(item);
                    controlHtml += "&nbsp;";
                }
                let html = `<div class="panel-heading p10">
                            ${controlHtml}
                        </div>`;
                return html;
            });
        }
        renderList(struct, actionHtml, data) {
            return __awaiter(this, void 0, Promise, function* () {
                let thead = struct.map(item => `<th>${item.get("title")}</th>`).join("");
                if (data.data_list == null) {
                    data.data_list = [];
                }
                data.data_list = data.data_list.filter(item => item != null);
                let tbody = data.data_list.map(dataItem => {
                    let trow = struct.map(structItem => {
                        let colContent = dataItem[structItem.get("name")] || "";
                        //处理自定义模式
                        let operate = structItem.get("operate");
                        if (operate && operate.length > 0) {
                            let html = operate.map(item => {
                                let type = item.type;
                                let title = item.title;
                                let keyField = item.key_field;
                                if (type == "edit") {
                                    let key = dataItem[keyField] || "";
                                    let link = `<a href="index.php?m=index&c=gm2&action_id=${this.actionId}&action_mode=form&action_type=${type}&${keyField}=${key}">${title}</a>`;
                                    return link;
                                }
                                else if (type == "delete") {
                                    let key = dataItem[keyField] || "";
                                    let link = `<a onclick="return confirm('确定要删除吗？')" href="index.php?m=index&c=gm2&action_id=${this.actionId}&action_mode=view&action_type=${type}&${keyField}=${key}">${title}</a>`;
                                    return link;
                                }
                                else {
                                    return "";
                                }
                            }).join(" ");
                            html = `<td>${colContent} ${html}</td>`;
                            return html;
                        }
                        else {
                            return "<td>" + colContent + "</td>";
                        }
                    }).join("");
                    return `<tr class="gradeA">
                            ${trow}
                        </tr>`;
                }).join("");
                let html = `<div class="row">
                            <div class="col-sm-12">
                                <div class="ibox float-e-margins">
                                    <div class="ibox-title">
                                        <h5>数据列表</h5>
                                        <div class="ibox-tools"></div>
                                    </div>
                                    <div class="ibox-content">
                                        <table class="table table-striped table-bordered table-hover dataTables-example">
                                            <thead>
                                            <tr>
                                                ${thead}
                                            </tr>
                                            </thead>
                                            <tbody id="data_list">
                                                 ${tbody}
                                            </tbody>
                                        </table>
                                        <div class="row" id="page1">

                                          </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                return html;
            });
        }
    }
    List.PER_PAGE = 20;
    class Default {
        constructor() {
            this.init();
        }
        init() {
            return __awaiter(this, void 0, Promise, function* () {
                let query = gm2.queryString();
                let actionId = query.get("action_id");
                let actionMode = query.get("action_mode");
                let actionType = query.get("action_type");
                switch (actionMode) {
                    case MODE_FORM:
                        new Form(actionId, actionType);
                        break;
                    case MODE_LIST:
                        new List(actionId, actionType);
                        break;
                    case MODE_VIEW:
                        new View(actionId, actionType);
                        break;
                    default:
                        break;
                }
            });
        }
    }
    new Default();
})(gm2 || (gm2 = {}));
//# sourceMappingURL=default.js.map