/// <reference path="../base_control.ts" />
/// <reference path="validation/validation_base.ts" />

namespace gm2.control{
    interface LangItem{
        lang: number
        lang_text: string
    }

    class LangSelector{
        static  pageId: string;

        public static getPageId() : string {
            if( LangSelector.pageId != null ) {
                return LangSelector.pageId;
            }
            LangSelector.pageId = new Date().getTime().toString(16);
            return LangSelector.pageId;
        }

        static mask: JQuery;

        private static initMask() {
            if( LangSelector.mask != null ) {
                return;
            }
            let maskHtml = `<div class="select-lang-mask"></div>`;
            let maskEle = $(maskHtml);
            top["$"]("body").append(maskEle);
            LangSelector.mask = maskEle;
        }

        private static showMask() {
            this.initMask();
            LangSelector.mask.show();
        }

        private static hideMask() {
            LangSelector.mask.hide();
        }


        static dialogMap = {};

        public static dialog( control: fbase ) : LangSelector {
            let name = control.name();
            if( !LangSelector.dialogMap[ name ]) {
                LangSelector.dialogMap[ name ] = new LangSelector( control );
            }
            return LangSelector.dialogMap[ name ];
        }

        private dialog: JQuery;
        private control : fbase;
        private langs = {
            "0":"简体中文",
            "1":"英文",
            "2":"繁体中文",
            "3":"泰语",
            "4":"韩语",
            "5":"越南语",
            "6":"印尼语",
            "7":"俄罗斯语",
            "8":"葡萄牙语",
            "9":"法语",
            "10":"德语",
            "11":"西班牙语",
            "12":"日语"
        }

        public getLangName( langId: number ) {
            for(let key in this.langs) {
                if( key == langId ) {
                    return this.langs[langId];
                }
            }
            return "";
        }

        public finished = ( langList: LangItem[] ) => {}

        private initDialog( name: string ) {
            if( this.dialog != null) {
                return;
            }
            let id = `dialog_${name}`;

            let genLangHtml = () =>{
                let html = "";
                for(let key in this.langs) {
                    html +=  `<li lang="${key}">${this.langs[key]}</li>`;
                }
                return html;
            }

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
            let addLangBtn =  dialogEle.find("input.add-lang-btn");
            let finishBtn =  dialogEle.find("input.finish-btn");
            let closeBtn = dialogEle.find("img.close-btn");
            let content  = dialogEle.find("table");

            top["$"]("body").append(dialogEle);

            addLangBtn.bind("click", function(){
                langListEl.show();
            });

            dialogEle.bind("click", function(e){
                if(langListEl.get(0).contains(e.target as HTMLElement) || e.target  == addLangBtn.get(0) ) {
                    return;
                }
                langListEl.hide();
            });

            let exists = function( lang : string ) {
                let langs = [];
                content.find("tr").each(function(idx,el){
                    let tmp = el.getAttribute("lang");
                    if( tmp ) {
                        langs.push( tmp );
                    }
                });
                let result = langs.filter(item => item == lang)
                if( result.length > 0 ) {
                    return true;
                } else {
                    return false;
                }
            }

            langListEl.find("li").bind("click", (e) =>{
                let lang = $(e.target).attr("lang");
                let langText = $(e.target).html();
                if( exists( lang ) ) {
                    content.find(`tr[lang='${lang}']`).find("textarea").focus();
                    alert("语言重复选择");
                    return;
                }
                this.appendItem2Form( lang, langText,"" );
                langListEl.hide();
            });

            content.bind("click", function(e) {
                if( e.target.tagName == "INPUT" && e.target.getAttribute("action") == "del" ) {
                    $(e.target).parents("tr").remove();
                }
            });

            let getResult = () => {
                var result : LangItem[] = [];
                content.find("tr").each( function( index, item ){
                    let lang = item.getAttribute("lang");
                    if( lang ) {
                        let langText = $(item).find("textarea").val();
                        result.push({lang: parseInt( lang ), lang_text: langText});
                    }
                });
                return result;
            };

            finishBtn.bind("click", () =>{
                let zoneControl = this.control.getOwner().findControl("zone");
                if( zoneControl == null ) {
                    alert("页面上没有地区选项");
                    return;
                }
                let controlValue = zoneControl.getValue();
                if( typeof controlValue === 'string' && controlValue != "") {
                    controlValue = [controlValue];
                }
                if( controlValue.length == 0 ) {
                    alert("请先选择地区");
                    return;
                }

                let result = getResult();
                if( result.length == 0 ) {
                    alert("未添加内容");
                    return;
                }
                if( result.filter(item => $.trim( item.lang_text ) == "").length > 0 ) {
                    alert("内容未填写完整");
                    return;
                }
                let langKey = this.getLangKey();
                let url = "index.php?/gm2/forForm?action_id=multi_lang&action_mode=form&method=saveMultiLang";
                let ajaxSetting = {} as JQueryAjaxSettings;
                ajaxSetting.url = url;
                ajaxSetting.type = "POST";
                ajaxSetting.dataType = "JSON";
                ajaxSetting.data = {"lang_key": langKey, "lang_data": result, "zone": controlValue };
                ajaxSetting.success = ( response:{error:number, message:string} )  => {
                    if( response.error == 0 ) {
                        if( typeof  this.finished === 'function') {
                            this.finished( result );
                        }
                    } else {
                        alert( response.message );
                    }
                }
                $.ajax( ajaxSetting );
            });

            closeBtn.bind("click",()=>{
                this.hide();
            });

            this.dialog = dialogEle;
        }

        private appendItem2Form ( lang: string, langText: string, val: string ){
            let itemHtml = `<tr lang="${lang}">
                                            <td>${langText}</td>
                                            <td>
                                               <textarea>${val}</textarea>
                                            </td>
                                            <td>
                                                <input type="button" value="删除" action="del" />
                                            </td>
                                        </tr>`;
            this.dialog.find("table").find("tr").first().before( itemHtml );
        }


        //编辑页面的时候使用
        public fillContent( langKey: string ) {
            let url = "index.php?/gm2/forForm?action_id=multi_lang&action_mode=form&method=getMultiLang";
            let ajaxSetting = {} as JQueryAjaxSettings;
            ajaxSetting.url = url;
            ajaxSetting.type = "POST";
            ajaxSetting.dataType = "JSON";
            ajaxSetting.data = {"lang_key": langKey};
            ajaxSetting.success = ( response:{languageid: number,translate: string}[] )  => {
                response.map( (item:{languageid: number,translate: string}) => {
                    let lang = item.languageid;
                    this.appendItem2Form(lang.toString(), this.getLangName(lang), item.translate)
                });
            }
            $.ajax( ajaxSetting );
        }

        public getLangKey() {
            return this.control.getActionId() + "#" + this.control.getActionMode() + "#" + this.control.name() + "#" + LangSelector.getPageId();
        }

        public show() {
            LangSelector.showMask();
            this.dialog.css("display","block");
        }

        public hide() {
            LangSelector.hideMask();
            this.dialog.hide();
        }

        constructor( control : fbase) {
            this.control = control;
            this.initDialog(this.control.name());
        }
    }


    export abstract class fbase extends gm2.control.base_control{
        public abstract getValue(): any;
        public abstract setValue(value: any) : void;
        public fillControlValue(  value: any ) {}

        protected dataSource: Map<string,any>;
        protected validations : validation_base[] = [];

        public addValidation( validation: validation_base) {
            this.validations.push(validation);
        }

        public getValidations() : validation_base[]{
            return this.validations;
        }

        constructor() {
            super();
        }

        public name(): string {
            return this.dataSource.get("name");
        }

        public getActionId() : string{
            return this.actionId;
        }

        public getActionMode() :string{
            return this.actionMode;
        }

        public title(): string{
            return this.dataSource.get("title");
        }

        public setDataSource(data: Map<string,any>) : void{
            this.dataSource = data;
        }

        protected getMultiLangSelector() : JQuery{
            let selectLangBtn = $(`<a href="javascript:;" type="select_lang">选择语言</a>`);
            selectLangBtn.bind("click", ()=>{
                let dialog = LangSelector.dialog(this);
                dialog.finished = (langList: LangItem[]) =>{
                    let resultString = langList.map( (item : LangItem) => dialog.getLangName( item.lang )).join("，") + " 等" + langList.length + "种语言";
                    selectLangBtn.html( "选择语言(已选 " +  resultString + ")" );
                    dialog.hide();
                    this.fillControlValue( dialog.getLangKey() );
                }
                dialog.show();
            });
            return selectLangBtn;
        }

        protected isMultiLang() {
            if( this.dataSource.get("multi_lang") == "1") {
                return true;
            } else {
                return false;
            }
        }

        protected fillMultiLangDialog( langKey : string ) {
            let dialog = LangSelector.dialog(this);
            dialog.fillContent(langKey);
        }
    }
}