/// <reference path="fbase.ts" />
namespace gm2.control{
    export class bbq_attach_view extends fbase{
        private data : {id:number, number: number}[];

        constructor() {
            super();
        }

        protected renderHtml():string {
            let html = `<div>
                <ul>
                    <li>1</li>
                    <li>2</li>
                </ul>
            </div>`;
            return html;
        }

        public getValue(): any {
            return this.data;
        }

        public setValue( value: {id:number, number: number}[] ): void {
            this.data = value;
            this.fillControl();
        }

        private fillControl() {
            let html = "";
            this.data.forEach(item=>{
                html += "<li>物品ID：" + item.id + "&nbsp;&nbsp;&nbsp;&nbsp;数量：" + item.number + "</li>";
            });
            html = "<ul>" + html + "</ul>";
            let ele = this.getElement();
            ele.innerHTML = html;
        }
    }
}