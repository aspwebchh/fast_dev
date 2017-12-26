/// <reference path="fbase.ts" />
/// <reference path="../common.ts" />
namespace gm2.control {

    export class bbq_zone_select extends fbase {
        constructor() {
            super();
        }

        private  val: string;

        private async  renderComplete(self:bbq_zone_select) {
            let data = await
            ajaxAsync("index.php?/gm2/forForm?action_id=bbq_zone&action_mode=form&method=getZoneData", null);
            let html = data.map(item => `<option value="${item.id}">${item.name}</option>`).join("");
            html = "<option value=''>请选择</option>" + html;
            html = "<select class='form-control'>" + html + "</select>";
            let container = $(self.getElement());
            container.html(html).find("select").val(this.val);
        }

        public onRenderComplete = () => {
            this.renderComplete(this);
        };

        protected renderHtml():string {
            let html = `<div></div>`;
            return html;
        }

        public getValue():any {
            return $(this.getElement()).find("select").val();
        }

        public setValue(value:string):void {
            this.val = value;
        }
    }
}