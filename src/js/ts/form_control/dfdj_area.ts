/// <reference path="fbase.ts" />
/// <reference path="../common.ts" />
namespace gm2.control{
    interface seajsInterface{
        use(a : any, b : any):void
    }

    async function renderComplete( self : dfdj_area ) {
        let data = [{areaid:100,name:"首测服"},{areaid:101,name:"开发服"}];
        let options = data.map( item => `<option value="${item.areaid}">${item.name}</option>`).join("");
        options = "<option value=''>请选择</option>" + options;
        let html = `<select class="form-control">${options}</select>`;
        self.getElement().innerHTML = html;
        $(self.getElement()).find("select").bind("change", function(){
            if( typeof dfdj_hero_config !== "undefined") {
                dfdj_hero_config.onAreaChange(this.value);
            }
        });
    }

    export class dfdj_area extends fbase{
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
           let result =   $( this.getElement() ).find("select").val();
            return result;
        }

        public setValue( value: any ): void{
            $(this.getElement()).find("select").val(value);
        }
    }
}