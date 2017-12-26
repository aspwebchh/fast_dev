/// <reference path="../common.ts" />
/// <reference path="fbase.ts" />

namespace gm2.control{
    export class checkbox extends fbase{
        protected renderHtml():string {
            let items = this.dataSource.get("list_item") as Map<string,string>[];
            let html = items.map( item => `<label style="font-weight: normal;"><input type="checkbox" value="${item.get("value")}" name="${this.name()}" />&nbsp;${item.get("title")}&nbsp;&nbsp;</label>`);
            return `<div>${html.join("")}</div>`;
        }

        public getValue(): any {
            let inputs = jquery2HtmlElements( $(this.getElement()).find("input") ) as HTMLInputElement[];
            let result = inputs.filter( item => item.checked).map( item => item.value).join(",");
            return result;
        }

        public setValue( value ): void {
            let val = $.trim( value );
            if( val == '' ) {
                return;
            }
            let items = val.split(",");
            let ele = this.getElement() as HTMLDivElement;
            $(ele).find("input").each( (index,item:HTMLInputElement) => {
                items.forEach( val => {
                   if( item.value == val ) {
                       item.checked = true;
                   }
                });
            });
        }
    }
}