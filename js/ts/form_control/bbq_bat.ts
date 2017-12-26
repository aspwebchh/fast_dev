/// <reference path="fbase.ts" />
namespace gm2.control{
    interface seajsInterface{
        use(a : any, b : any):void
    }

    declare var seajs : seajsInterface;

    let outerAddItem;
    let outerItemList;

    async function renderComplete( self : bbq_bat ) {
        let addButton = $( '<input type="button" value="增加" class="btn btn-default"/>' );
        let itemList = $( self.getElement() )                                                                                                                                                                                                                                  ;
        let index = 0;
        let addItem = ( obj ? : any ) => {
            let inputId = "item_id_" + index;
            let placeId =  "place_" + index;
            let html = self.htmlTemplate as string;
            if(!obj) {
                index++;
                html = html.replace(/\{\$index\}/g, index.toString());
            } else {
                index = obj.index;
                html = html.replace(/\{\$index\}/g, obj.index);
            }
            let itemEl = $( html );
            itemList.append( itemEl );
            itemEl.find( '.row1' ).append( addButton );
            itemEl.find( 'input[name=remove]' ).bind( 'click', function() {
                if( itemEl.siblings().length == 0 ) {
                    return;
                }
                if( itemEl.get( 0 ).contains( addButton.get( 0 ) ) ) {
                    addButton.appendTo( itemEl.prev().find( '.row1' ) );
                }
                if( obj && obj.sync ) {
                    alert("已同步， 无法称除");
                    return;
                }
                itemEl.remove();
            });
            itemEl.find(".suggest_placeholder").attr("id", placeId);
            itemEl.find("input[name=item_id]").attr("id", inputId);

            if(obj) {
                itemEl.find("input[name=count]").val( obj.count );
                itemEl.find("input[name=index]").val( obj.index );
                itemEl.find("select[name=status]").val( obj.status );
            }
        }
        itemList.bind("click", function(e){
            if( e.target.getAttribute("type") == "button" && e.target.getAttribute("value") == "增加" ) {
                addItem();
            }
        });
        addItem();
        outerAddItem = addItem;
        outerItemList = itemList;
    }

    export class bbq_bat extends fbase{
        public htmlTemplate = ` <p name="prop_item" class="prop_item" style="position:relative;">
                                 <span class="row1">
                                     <span>
                                        第{$index}批
                                        <input type="hidden" value="{$index}" name="index" />
                                     </span>
                                     <select name="status" style="width:100px;" onchange="$(this).next().attr('placeholder',( $(this).val() == 99 ? '通码值' : '礼包码数量' ))">
                                        <option value="0">常规</option>
                                        <option value="99">通码</option>
                                     </select>
                                     <input type="text" name="count" placeholder="礼包码数量" />
                                     &nbsp;
                                     <input type="button" value="移除" class="btn btn-default" name="remove"/>
                                     &nbsp;
                                </span>
                                <span class="row2 suggest_placeholder" style="z-index: 999; display: none; width: 300px;"></span>
                            </p>`;

        constructor() {
            super();
            this.onRenderComplete = () => {
                renderComplete( this );
            };
        }
        protected renderHtml():string {
            let html = `<div></div>`;
            return html;
        }

        public getValue(): any {
            let ele = $( this.getElement() );
            let items = ele.find("[name=prop_item]");
            let htmlEles = jquery2HtmlElements( items );
            let values = htmlEles.map( item => {
                let count = $( item ).find("input[name=count]").val();
                let index = $( item ).find("input[name=index]").val();
                let status = $( item).find("select[name=status]").val();
                return { count: $.trim( count ), index: index, status: status };
            } );
            //values = values.filter( item => {
            //    let count = item["count"];
            //    return count != "";
            //});
            return values;
        }

        public setValue( value: any[] ): void {
            if(value.length > 0 ) {
                outerItemList.empty();
                value.sort((a,b)=>a.index - b.index);
                value.forEach(item=>outerAddItem(item));
            }
        }
    }
}