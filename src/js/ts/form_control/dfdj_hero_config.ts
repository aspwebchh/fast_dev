/// <reference path="fbase.ts" />
/// <reference path="../common.ts" />
namespace gm2.control {
    interface seajsInterface {
        use(a:any, b:any):void
    }

    declare var seajs:seajsInterface;

    function heroData() {
        let strData : string = `U001	关羽
                        U002	公子小白
                        U013	郭嘉
                        U012	貂蝉
                        U017	吕布
                        U020	徐庶
                        U021	上官婉儿
                        U022	司马昭
                        U026	刘禅
                        U030	蔡文姬
                        U031	苏妲己
                        H001	武圣
                        H002	战鬼
                        H003	貂蝉
                        H004	郭嘉
                        H005	刘禅
                        H006	墨子
                        H007	徐庶
                        H008	钟会
                        H009	笑脸
                        H010	绿叶`;
        let data = strData.split(/\n/).map( item => {
            let id = item.match(/[^\s]+/)[0];
            let name = item.match(/[\u4e00-\u9fa5]+/)[0];
            return {id: id, name: name};
        });
        return data;
    }

    function initSelectHeroDialog( htmlInput : HTMLInputElement ) {
        let data = heroData();
        let contentHtml = data.map( item =>{
            return `<li> <label><input type="checkbox" value="${item.id}">${item.name}</label></li>`
        }).join("");
        let dialogHtml = `<div class="select_hero_dialog">
            <ul>
                ${contentHtml}
                <li> <label><input type="checkbox" value="all" >所有英雄免费</label></li>
                <li><input type="button" value="确定"/></li>
            </ul>
        </div>`;
        let  dialogEle = $( dialogHtml );
        $("body").append( dialogEle );
        $(document).bind("click", ( e )=>{
            let target = e.target as HTMLElement;
            if( target == htmlInput ) {
                return;
            }
            if( dialogEle.get( 0 ).contains( target ) ) {
                return;
            }
            dialogEle.remove();
        });
        dialogEle.find("input[type='button']").bind( "click", () => {
            let result = [];
            let checkboxes = dialogEle.find("input[type=checkbox]");
            checkboxes.each((index, ele: HTMLInputElement )=>{
               if( ele.checked ) {
                   result.push( ele.value );
               }
            });
            if( result.length == 0 ) {
                alert("未选择任何选项");
                return;
            }
            let all = result.filter(item=> item == "all");
            if( all.length > 0 ) {
                htmlInput.value = all.toString();
            } else {
                htmlInput.value = result.join(",");
            }
            dialogEle.remove();
        } );
        let inputVal = htmlInput.value;
        let inputValItems = inputVal.split(",");
        inputValItems.forEach( item => {
            dialogEle.find("input[type=checkbox][value="+ item +"]").attr("checked","checked");
        } );
        return dialogEle;
    }

    function showSelectHeroDialog( htmlInput : HTMLInputElement ) {
        let dialog = initSelectHeroDialog( htmlInput );
        let jqueryInput = $( htmlInput );
        dialog.css({
            "position":"absolute",
            "top": jqueryInput.offset().top + jqueryInput.get(0).offsetHeight,
            "left": jqueryInput.offset().left
        }).show();
    }

    let itemList: JQuery;
    let index :number;
    let addButton: JQuery;
    let htmlTemplate = `<p name="prop_item" class="prop_item" style="position:relative;">
                                 <span class="row1">
                                    <input type="input" placeholder="开始时间" class="form-control" style="width: 150px; display: inline-block;" name="begin_time" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" />
                                    &nbsp;
                                    <input type="input" placeholder="结束时间" class="form-control" style="width: 150px; display: inline-block;" name="end_time"  onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})"/>
                                    &nbsp;
                                    <input type="input" placeholder="英雄ID" class="form-control"  style="width: 150px; display: inline-block;" name="hero_id"/>
                                    &nbsp;
                                    <input type="button" value="移除" class="btn btn-default" name="remove"/>
                                    &nbsp;
                                </span>
                                <span class="row2 suggest_placeholder" style="z-index: 999; display: none; width: 300px;"></span>
                            </p>`;

    let clearItems = () =>{
        itemList.empty();
    }

    let addItem = (obj ?:any) => {
        index++;
        let placeId = "place_" + index;
        let html = htmlTemplate;
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
        itemEl.find("[name=hero_id]").bind( "click", (e)=>{
            let targetEle = e.target as HTMLInputElement;
            showSelectHeroDialog( targetEle );
        } );
        if( obj ) {
            itemEl.find("[name=begin_time]").val( obj.begin_time );
            if( obj.end_time ) {
                itemEl.find("[name=end_time]").val( obj.end_time );
            }
            if( obj.all_hero_free ) {
                itemEl.find("[name=hero_id]").val( "all" );
            } else {
                itemEl.find("[name=hero_id]").val( obj.hero_list.join(",") );
            }
        }
    }

    async function renderComplete(self:dfdj_hero_config) {
        addButton = $('<input type="button" value="增加" class="btn btn-default"/>');
        itemList = $(self.getElement());
        index = 1;
        addButton.bind('click', function () {
            addItem();
        });
        addItem();
    }

    export class dfdj_hero_config extends fbase {
        public static async onAreaChange( areaId ) {
            if( areaId == null || areaId == "" ) {
                clearItems();
                addItem();
                return;
            }
            let url = "index.php?/gm2/forList?action_id=dfdj_query_hero&action_mode=list&page=1&areaId="+ areaId +"&method=getList";
            let data = await ajaxAsync( url, null );
            let dataList = data.data_list as any[];
            if( dataList.length > 0 ) {
                clearItems();
            }
            dataList.forEach(item=>addItem(item));
        }

        constructor() {
            super();
            this.onRenderComplete = () => {
                renderComplete(this);
            };
        }

        protected renderHtml():string {
            let html = `<div></div>`;
            return html;
        }

        public getValue():any {
            let ele = $(this.getElement());
            let items = ele.find("[name=prop_item]");
            let htmlEles = jquery2HtmlElements(items);
            let values = htmlEles.map(item => {
                let beginTime = $(item).find("input[name=begin_time]").val();
                let endTime = $(item).find("input[name=end_time]").val();
                let heroId = $(item).find("input[name=hero_id]").val();
                return { begin_time: beginTime, end_time: endTime, hero_id: heroId };
            });
            return values;
        }

        public setValue(value:any):void {

        }
    }
}