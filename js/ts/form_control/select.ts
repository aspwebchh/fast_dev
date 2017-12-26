/// <reference path="fbase.ts" />
namespace gm2.control{
    export class select extends fbase{
        protected renderHtml():string {
            let items = this.dataSource.get("list_item") as Map<string,string>[];
            let optHtml = items.map( item => `<option value="${item.get("value")}" ${item.get("selected") ? "selected" : ""}>${item.get("title")}</option>`);
            let html = `<select class="form-control" >
                            <option value="">请选择</option>
                            ${optHtml}
                        </select>`;
            return html;
        }

        public getValue(): any {
            let result = (this.getElement() as HTMLSelectElement).value;
            return result;
        }

        public setValue( value: any ): void{
            let ele = this.getElement() as HTMLInputElement;
            ele.value = value;
        }
    }
}