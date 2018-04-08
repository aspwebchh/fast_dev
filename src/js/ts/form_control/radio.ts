/// <reference path="../common.ts" />
/// <reference path="fbase.ts" />

namespace gm2.control{
    export class radio extends fbase{
        protected renderHtml():string {
            let items = this.dataSource.get("list_item") as Map<string,string>[];
            let html = items.map( item => `<label style="font-weight: normal;"><input type="radio" value="${item.get("value")}" name="${this.name()}" />&nbsp;${item.get("title")}&nbsp;&nbsp;</label>`);
            return `<div>${html.join("")}</div>`;
        }

        public getValue(): any {
            let result =  $(this.getElement()).find("input:checked").val();
            return result;
        }

        public setValue( value: any ): void {
            let ele = this.getElement() as HTMLDivElement;
            $(ele).find("input[value="+ value +"]").attr("checked","checked");
        }
    }
}