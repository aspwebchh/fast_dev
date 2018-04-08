/// <reference path="fbase.ts" />
/// <reference path="../common.ts" />
namespace gm2.control{
    async function renderComplete( self : bbq_zone ) {
        let data = await ajaxAsync("index.php?/gm2/forForm?action_id=bbq_zone&action_mode=form&method=getZoneData", null);
        let html = data.map( item => `<input type="checkbox" value="${item.id}" id="bbq_zone_item_${item.id}" /><label for="bbq_zone_item_${item.id}" style="font-weight: normal;">${item.name}</label>`).join("&nbsp;&nbsp;");
        let container = $(self.getElement());
        container.html( html );
    }

    export class bbq_zone extends fbase{
        constructor() {
            super();
            this.onRenderComplete = () =>{
                renderComplete( this );
            };
        }

        protected renderHtml():string {
            let html = `<div></div>`;
            return html;
        }

        public getValue(): any {
            let result = [];
            $(this.getElement()).find("input[type=checkbox]").each((index: number, item: HTMLInputElement) => {
                    item.checked && result.push(item.value)
            });
            console.log(result);
            return result;
        }

        public setValue( value: string[] ): void{
            value.forEach( item =>{
                $(this.getElement()).find("input[value="+ item +"]").attr("checked","checked");
            });
        }
    }
}