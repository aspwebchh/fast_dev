/// <reference path="jquery/jquery.d.ts" />
/// <reference path="common.ts" />
/// <reference path="form_control/fbase.ts" />
namespace gm2{
    import enumerate = Reflect.enumerate;
    import award = gm2.control.award;
    import fbase = gm2.control.fbase;

    interface ListResult{
        data_count:number,
        data_list:any[]
    }

    interface FormResult{
        error: number,
        message: string,
        data: any
    }
    //列表

    
    //视图
    const VIEW_FILED_TYPE_LIST = "list";
    const VIEW_FIELD_TYPE_MAP = "map";

    const MODE_LIST = "list";
    const MODE_FORM = "form";
    const MODE_VIEW = "view";

    export class Base{
        protected actionId: string;
        protected actionType: string;
        private constrolList: control.base_control[] = [];

        constructor( actionId: string, actionType : string ) {
            this.actionId = actionId;
            this.actionType = actionType || "";
        }

        public findControl( name: string ) : fbase {
            let result = this.constrolList.filter( (item : fbase)  => item.name() == name );
            if( result.length > 0 ) {
                return result[0] as fbase;
            } else {
                return null;
            }
        }

        protected async getActionConfig( mode: string ) : Promise<string> {
            let url = `index.php?c=gm2&m=getAction&action_id=${this.actionId}&action_mode=${mode}&action_type=${this.actionType}`;
            let xml = await ajaxAsync( url, null, "GET", "html" );
            return xml;
        }

        protected attrs( fields ) : Map<string,any>[] {
            let result = [];
            fields.each((index, item)=>{
                let data = new Map();
                let type = item.getAttribute("type");
                data.set("name",item.getAttribute("name"));
                data.set("title",item.getAttribute("title"));
                data.set("validation", item.getAttribute("validation"));
                data.set("multi_lang", item.getAttribute("multi_lang") || "0")
                data.set( "type", type );
                data.set("placeholder", item.getAttribute("placeholder"));
                let isOperate = item.getAttribute("operate") == "1" ? 1 : 0;
                let operate = [];
                if( isOperate ) {
                    let editElements = item.getElementsByTagName("Edit");
                    if( editElements.length > 0 ) {
                        let editElement = editElements[0];
                        let keyField = editElement.getAttribute("KeyField");
                        let operateItem = {};
                        operateItem["type"] = "edit";
                        operateItem["title"] = "编辑";
                        operateItem["key_field"] = keyField;
                        operate.push(operateItem);
                    }
                    let delElements = item.getElementsByTagName("Delete");
                    if( delElements.length > 0 ) {
                        let delElement = delElements[0];
                        let keyField = delElement.getAttribute("KeyField");
                        let operateItem = {};
                        operateItem["type"] = "delete";
                        operateItem["title"] = "删除";
                        operateItem["key_field"] = keyField;
                        operate.push(operateItem);
                    }
                }
                data.set("operate",operate);

                let listItems = $(item).children("ListItem");
                if( listItems.length > 0 )  {
                    let listItemData = [];
                    listItems.each( ( idx, itm ) => {
                        let title = itm.getAttribute("title");
                        let value = itm.getAttribute("value");
                        let selected = itm.getAttribute("selected");
                        let dataItem = new Map();
                        dataItem.set("title", title);
                        dataItem.set("value", value);
                        dataItem.set("selected", selected == "true" ? true : false);
                        listItemData.push(dataItem);
                    } );
                    data.set( "list_item", listItemData );
                }
                result.push( data );
            });
            return result;
        }

        protected async callValidation(  validationName: string ) : Promise<control.validation_base> {
            return new Promise<control.validation_base>((resolve,reject)=>{
                let basePath = window.location.href.match(".+(?=index.php)");
                let controlScriptPath = basePath + "/js/ts/form_control/validation/" + validationName + ".js?v=18";
                let script = document.createElement("script");
                script.onload = () => {
                    let validation = eval(`new gm2.control.${validationName}();`) as control.validation_base;
                    resolve(validation)
                }
                script.onerror = () => {
                    reject( "验证对象不一样" );
                }
                script.src = controlScriptPath;
                document.body.appendChild(script);
            });
        }

        protected async callControl( controlDir: string, controlName: string ) : Promise<control.base_control> {
            return new Promise<control.base_control>((resolve,reject)=>{
                if( controlName == '') {
                    controlName = "nothing";
                }
                let basePath = window.location.href.match(".+(?=index.php)");
                let controlScriptPath = basePath + "/js/ts/"+ controlDir +"/" + controlName + ".js?v=18";
                let script = document.createElement("script");
                script.onload = () => {
                    let control = eval(`new gm2.control.${controlName}();`) as control.base_control;
                    control.setActionIdAndMode(this.actionId, MODE_FORM);
                    control.setOwner(this);
                    this.constrolList.push(control);
                    resolve(control)
                }
                script.onerror = () => {
                    reject( "控件不存在" );
                }
                script.src = controlScriptPath;
                document.body.appendChild(script);
            });
        }

        protected callOnloadScript( onloadControls : JQuery) {
            let items = jquery2HtmlElements( onloadControls.find("Control") );
            let controls = items.map( item => item.getAttribute("type") );
            for(let i = 0; i < controls.length; i++) {
                let controlName = controls[i];
                let basePath = window.location.href.match(".+(?=index.php)");
                let controlScriptPath = basePath + "/js/ts/onload/" + controlName + ".js?v=18";
                let script = document.createElement("script");
                script.onload = () => {
                    let control = eval(`new gm2.control.${controlName}();`) as control.load_base;
                    control.run();
                }
                script.src = controlScriptPath;
                document.body.appendChild(script);
            }
        }

        protected callControlRenderCompleteFn( controls: control.fbase[]) {
            controls.forEach( (item:control.fbase) =>{
                item.onRenderComplete();
            });
        }

        protected hideLoadingBar() {
            $("#loading").remove();
        }
    }

    class View extends Base{

        public static MODE_FROM_SERVER = 1;
        public static MODE_FROM_STRORAGE = 2;

        private mode : number;

        private static getStorageKey ( actionId: string, actionType: string = "" ) {
            return actionId + "_" + MODE_VIEW + "_" + actionType;
        }

        public static localStorage( actionId : string, actionType: string, data: any ) {
            let localStKey =  View.getStorageKey(actionId, actionType);
            localStorage[localStKey] = JSON.stringify(data);
        }

        public static fromLocalStorage( actionId: string, actionType: string ) {
            let localStKey =  View.getStorageKey(actionId, actionType);
            if( !localStorage[localStKey] ) {
                return null;
            }
            return JSON.parse( localStorage[localStKey] );
        }

        private dataSource: any;

        constructor(actionId: string, actionType: string) {
            super(actionId, actionType);
            this.dataSource = View.fromLocalStorage(this.actionId, this.actionType);
            if( this.dataSource ) {
                this.mode = View.MODE_FROM_STRORAGE;
                this.render().then(()=>{
                    this.hideLoadingBar();
                });
            } else {
                this.mode = View.MODE_FROM_SERVER;
                this.getDataAndRender().then(()=>{
                    this.hideLoadingBar();
                });
            }
        }

        private async getDataAndRender() {
            this.dataSource = await this.getDataFromServer();
            this.render();
        }

        private async getDataFromServer() : Promise<any> {
            let query = queryString();
            query.set("method","data");
            query.set("c","gm2");
            query.set("m","call");
            let url = `index.php?` + $.param(mapToObject(query));
            let result = await ajaxAsync( url,null,"GET","json");
            return result;
        }

        private genHtml( doc: HTMLElement, data:any ) {
            let html = "";
            let jdoc = $( doc );
            if( doc.tagName == "FIELDS" ) {
                let fields = jdoc.children("Field");
                for(let i = 0; i < fields.length; i++) {
                    let item = fields[i];
                    let name = item.getAttribute("name");
                    data = data || {};
                    html += this.genHtml( fields[i], data[name] );
                }
            } else {
                let name = doc.getAttribute("name");
                let type = doc.getAttribute("type");
                let title = doc.getAttribute("title");
                switch (type) {
                    case VIEW_FIELD_TYPE_MAP: {
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
                    case VIEW_FILED_TYPE_LIST: {
                        let thead = "";
                        let fields = jdoc.children("Field");
                        for(let i = 0; i < fields.length;i++) {
                            let field = fields[i];
                            let title = field.getAttribute("title");
                            thead += `<th>${title}</th>`;
                        }
                        let tbody = "";
                        data = data || [];
                        for(let i = 0; i < data.length; i++) {
                            tbody += "<tr>";
                            let dataItem = data[ i ];
                            for(let j = 0; j < fields.length;j++) {
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
                        try{
                            data = JSON.parse(data);
                        }catch (ex) {}
                        if( typeof data == "object") {
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

        private async render() {
            if( !this.dataSource ) {
                return;
            }
            let xmlConfig = await this.getActionConfig( MODE_VIEW );
            let config = $( xmlConfig );
            let title = config.attr("title");
            let fields = config.children("fields");
            let contentHtml = this.genHtml( fields[0], this.dataSource );
            let backBtnHtml = ` <div class="form-group">
                                                <div class="col-sm-10">
                                                    <input type="button" class="btn btn-success" value="返回上一页" onclick="window.history.back();"/>
                                                </div>
                                            </div>`;
            if(this.mode == View.MODE_FROM_SERVER) {
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
            $("body").append( html );
        }
    }

    class Form extends Base{
        private controls: control.fbase[] = [];

        constructor( actionId: string,  actionType: string ) {
            super(actionId, actionType);
            this.init().then(()=>{
                this.hideLoadingBar();
            });
        }

        private async init() {
            let xmlConfig = await this.getActionConfig(MODE_FORM);
            let config = $(xmlConfig);
            let title = config.attr("title");
            let controls = config.find("Control");
            let controlsData = this.attrs(controls);
            let html = await this.renderForm( title, controlsData );
            $('body').append(html);
            this.callControlRenderCompleteFn( this.controls );
            this.initSubmitEvent();
            this.fillForm();
        }

        private async fillForm() {
            if(queryString().get("id") == null) {
                return;
            }
            let query = queryString();
            let zone = query.get("zone");
            let url = `index.php?c=gm2&m=call&action_id=${this.actionId}&action_mode=${MODE_FORM}&method=data&action_type=${this.actionType}&zone=${zone}`;
            url = this.attachId(url);
            let result = await ajaxAsync( url, null );
            this.controls.forEach(item=>{
                item.setValue(result[item.name()]);
            });
        }

        private attachId( url : string ) {
            let query = queryString();
            let id = query.get("id");
            if(id == null) {
                return url;
            } else {
                return url + `&id=${id}`;
            }
        }

        private initSubmitEvent() {
            let getValidationInfo = () => {
                let isValid = true;
                let invalidTexts: string[] = [];
                for(let control of this.controls) {
                    let validations = control.getValidations();
                    for(let validation of validations) {
                        if( !validation.isValid(control.getValue())) {
                            isValid = false;
                            invalidTexts.push(validation.invalidText(control.title()));
                        }
                    }
                }
                return [isValid,invalidTexts];
            }

            let submitBtn = $("#submit_button");
            submitBtn.bind("click",async (e:JQueryEventObject) => {
                let errorPlaceholder = $("#error_txt");
                errorPlaceholder.hide();
                let [isValid, invalidTexts] = getValidationInfo() as [boolean, string[]];
                if(!isValid) {
                    let invalidTextsHtml = invalidTexts.map( item => {
                        return "<li>" + item + "</li>";
                    }).join("");
                    errorPlaceholder.html( "<ul>" + invalidTextsHtml + "</ul>").show();
                    return;
                }
                let submitData = this.controls.reduce<{}>( ( data:{}, control : control.fbase ) => {
                    data[control.name()] = control.getValue();
                    return data;
                } ,{});
                let url = `index.php?c=gm2&m=call&action_id=${this.actionId}&action_mode=${MODE_FORM}&method=submit&action_type=${this.actionType}`;
                url = this.attachId(url);
                //submitBtn.attr("disabled","disabled");
                //submitBtn.html("请等待...");
                let result = await ajaxAsync(url, submitData,"post","json") as FormResult;
                if( result.error ) {
                    alert( result.message );
                    submitBtn.removeAttr("disabled");
                    submitBtn.html("提交");
                    return;
                }
                View.localStorage( this.actionId, this.actionType, result );
                window.location.href = `index.php?c=gm2&m=index&action_id=${this.actionId}&action_mode=${MODE_VIEW}&action_type=${this.actionType}`;
            });
        }

        private async renderForm( title:string, struct: Map<string,any>[] ) {
            let genControlHtml = async (item:Map<string,any>) =>{
                let type = item.get("type");
                let control = await this.callControl( "form_control", type ) as control.fbase;
                let validtion = item.get("validation") as string;
                if( validtion ) {
                    let validationItems = validtion.split("|");
                    for( let validationItem of validationItems ) {
                        let validationControl = await this.callValidation( validationItem );
                        control.addValidation( validationControl );
                    }
                }
                this.controls.push(control);
                control.setDataSource( item );
                return control.render();
            };

            let controlHtmls = "";
            for(let structItem of struct) {
                let controlHtml = await genControlHtml( structItem );
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
        }
    }

    class List extends Base{
       private static PER_PAGE = 20;

        private title: string;
        private controls: control.fbase[] = [];

        constructor( actionId: string , actionType: string) {
            super(actionId, actionType);
            this.init().then(()=>{
                this.hideLoadingBar();
            });
        }

        private isExportList( searchControls : JQuery ) {
            let expt = searchControls.attr("export");
            if(expt === "true") {
                return true;
            } else {
                return false;
            }
        }

        private getDataListDic( data: Map<string,any>[] ) {
            let result = {};
            data.forEach((item:Map<string,any>) => result[item.get("name")] = item.get("title"));
            return result;
        }

        private async init() {
            let xmlConfig = await this.getActionConfig( MODE_LIST );
            let config = $(xmlConfig);
            this.title = config.attr("title");
            let fields = config.find("Field");
            let controls = config.children("Controls").children("Control");
            let searchControls = config.children("SearchControls").children("SearchControl");
            let expt = this.isExportList( config.children("SearchControls") );
            let searchHtml = await this.renderSearch( this.attrs( searchControls ), expt );
            let controlHtml = await this.renderAction( this.attrs( controls ) );
            let data = await this.getListData();
            let dic = this.getDataListDic( this.attrs( fields ) );
            let container = $('<div class="wrapper wrapper-content animated fadeInRight"></div>');
            let html = await this.renderList( this.attrs( fields ), controlHtml, data );
            container.append(searchHtml).append( html );
            $( "body").append(container);

            this.callControlRenderCompleteFn( this.controls );
            this.initSearchFormEvent( dic );
            this.renderPage( data.data_count );
            this.callOnloadScript(config.find("Onload"));
        }

        private renderPage( dataCount: number ) {
            renderPage("page1", dataCount, List.PER_PAGE );
        }

        private initSearchFormEvent( dataListDic : Object) {
            $("#search_btn").bind("click",()=>{
                let query = queryString();
                let data = this.controls.reduce<{}>((result, item: gm2.control.fbase)=>{
                    if( item.getValue() != null && item.getValue().length > 0  ) {
                        result[item.name()] = item.getValue();
                    } else {
                        delete result[item.name()];
                    }
                    return result;
                }, mapToObject(query));
               window.location.href = "index.php?" + $.param( data );
            });

            $("#reset_btn").bind("click",()=>{
                let query = queryString();
                this.controls.forEach((item:control.fbase)=>{
                    query.delete( item.name() );
                });
                window.location.href = "index.php?" + $.param( mapToObject( query ) );
            });

            $("#export_btn").bind("click", ()=>{
                let query = queryString();
                query.set("method","export");
                query.set("m","call");
                let url = `index.php?` + $.param( mapToObject( query ) ) + "&dic=" + JSON.stringify(dataListDic) ;
                window.location.href = url;
            });

            let fillControl = () =>{
                let query = queryString();
                this.controls.forEach( (item:gm2.control.fbase) =>{
                    query.forEach((v,k)=>{
                        if( item.name() == k ) {
                            item.setValue(v);
                        }
                    });
                });
            };
            fillControl();
        }

        private async renderSearch( controls: Map<string,any>[], expt : boolean = false ): Promise<string> {
            if( controls.length == 0 ) {
                return "";
            }
            let genControlHtml = async (item:Map<string,any>) =>{
                let type = item.get("type");
                let control = await this.callControl( "form_control", type ) as control.fbase;
                this.controls.push(control);
                control.setDataSource( item );
                return control.render();
            };

            let group = controls.reduce<Map<string,any>[][]>((result, item:Map<string,any>)=>{
                let last = result[ result.length - 1 ];
                if( last.length < 4 ) {
                    last.push(item);
                } else {
                    let newList = [];
                    newList.push(item);
                    result.push(newList);
                }
                return result;
            },[[]]);

            let controlHtmls = "";
            for( let i = 0; i < group.length; i++ ) {
                let groupItem = group[i];
                controlHtmls += ` <div class="form-group">`;
                for( let j = 0; j < groupItem.length; j++) {
                    let control = groupItem[j];
                    let controlHtml = await genControlHtml( control );
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
            if( expt ) {
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
        }

        private async getListData() : Promise<ListResult> {
            let query = queryString();
            query.set("c","gm2");
            query.set("m","call");
            query.set("method","getList");
            let url = `index.php?` + $.param(mapToObject(query));
            let result = await ajaxAsync( url,null,"GET","json");
            return result as ListResult;
        }

        private async renderAction( controls : Map<string,any>[] ) : Promise<string> {
            if( controls.length == 0 ) {
                return "";
            }
            let genControlHtml = async (item:Map<string,any>) =>{
                let type = item.get("type");
                let control = await this.callControl( "list_control", type ) as control.lbase;
                return control.render();
            };
            let controlHtml = "";
            for(let item of controls) {
                controlHtml += await genControlHtml( item );
                controlHtml += "&nbsp;";
            }
            let html = `<div class="panel-heading p10">
                            ${controlHtml}
                        </div>`;
            return html;
        }

        private async renderList( struct: Map<string,any>[], actionHtml : string, data: ListResult ) {
            let thead = struct.map(item => `<th>${item.get("title")}</th>`).join("");
            if( data.data_list == null) {
                data.data_list = [];
            }
            data.data_list = data.data_list.filter(item=> item != null);
            let tbody = data.data_list.map(dataItem=>{
                let trow = struct.map( structItem => {
                    let colContent = dataItem[ structItem.get("name") ] || "";
                    //处理自定义模式
                    let operate = structItem.get("operate");
                    if(operate && operate.length > 0) {
                        let html = operate.map( item => {
                            let type = item.type;
                            let title = item.title;
                            let keyField = item.key_field;
                            if( type == "edit" ) {
                                let key = dataItem[keyField] || "";
                                let link = `<a href="index.php?m=index&c=gm2&action_id=${this.actionId}&action_mode=form&action_type=${type}&${keyField}=${key}">${title}</a>`;
                                return link;
                            } else if( type == "delete") {
                                let key = dataItem[keyField] || "";
                                let link = `<a onclick="return confirm('确定要删除吗？')" href="index.php?m=index&c=gm2&action_id=${this.actionId}&action_mode=view&action_type=${type}&${keyField}=${key}">${title}</a>`;
                                return link;
                            } else {
                                return "";
                            }
                        }).join(" ");
                        html = `<td>${colContent} ${html}</td>`;
                        return html;
                    } else {
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
        }
    }

    class Default{
        constructor() {
            this.init();
        }

        async init() {
            let query = queryString();
            let actionId = query.get("action_id");
            let actionMode = query.get("action_mode");
            let actionType = query.get("action_type");
            switch (actionMode) {
                case MODE_FORM:
                    new Form( actionId, actionType );
                    break;
                case MODE_LIST:
                    new List(actionId, actionType );
                    break;
                case MODE_VIEW:
                    new View( actionId, actionType );
                    break;
                default:
                    break;
            }
        }
    }
    new Default();
}