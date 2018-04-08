/// <reference path="fbase.ts" />
/// <reference path="../common.ts" />
namespace gm2.control{
    interface seajsInterface{
        use(a : any, b : any):void
    }


    async function renderComplete( self : gzwsw_area ) {
        let data = await ajaxAsync("index.php?/gm2/forList?action_id=gzwsw_send_item&action_mode=form&method=getAreaData", null);
        let options = data.map( item => `<option value="${item.areaid}">${item.name}</option>`);
        let html = `<select class="form-control">${options}</select>`;
        self.getElement().innerHTML = html;
    }

    export class gzwsw_area extends fbase{
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
           let result =   $( this.getElement()).find("select").val();
            return result;
        }

        public setValue( value: any ): void{

        }
    }
}