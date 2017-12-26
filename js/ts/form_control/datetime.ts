/// <reference path="fbase.ts" />
/// <reference path="../jquery/jquery.d.ts" />
namespace gm2.control{
    interface jquery extends JQuery{
        datepicker: (arg:any) =>{}
    }
    export class datetime extends fbase{
        constructor() {
            super();
            this.onRenderComplete = () => {
                if($('[data-plugin="datepicker"]').length > 0 && $.fn.datepicker){
                    let obj = $('[data-plugin="datepicker"]') as jquery;
                    obj.datepicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
                }
            }
        }

        protected renderHtml():string {
            let html = `<div class="input-group" data-plugin="datepicker">
								<input class="form-control"  type="text">
								<div class="input-group-btn">
									<button type="button" class="btn btn-default">
										<i class="icon icon-date"></i>
									</button>
								</div>
							</div>	`;
            return html;
        }

        public getValue(): any {
            let result = $(this.getElement()).find("input").val();
            return result;
        }

        public setValue( value: any ): void{
            let ele = $(this.getElement()).find("input").get(0) as HTMLInputElement;
            ele.value = value.replace("+"," ");
        }
    }
}