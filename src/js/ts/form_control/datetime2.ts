/// <reference path="fbase.ts" />
/// <reference path="../jquery/jquery.d.ts" />
namespace gm2.control{
    interface jquery extends JQuery{
        datepicker: (arg:any) =>{}
    }
    export class datetime2 extends fbase{
        constructor() {
            super();
            this.onRenderComplete = () => {
                if($('[data-plugin="datepicker"]').length > 0 && $.fn.datepicker){
                    let obj = $('[data-plugin="datepicker"]') as jquery;
                    obj.datepicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
                }

                let convertTime = (ts) =>{
                    if( ts <= 0 ) {
                        return "0秒";
                    }
                    var d = Math.floor(ts / 86400000)
                    var h = Math.floor((ts % 86400000)/3600000)
                    var m = Math.floor((ts % 3600000) / 60000)
                    var s = Math.floor((ts % 60000) / 1000)
                    return d.toString() + "天" + h.toString() + "时" + m.toString() + "分" + s + "秒";
                }

                let input = $(this.getElement()).find("input");
                let dateTimeTip = $(this.getElement()).find("div[name=datetime_tip]");
                let self = this;
                input.blur( function(){
                    this.value = $.trim(this.value);
                    if( this.value == "") {
                        dateTimeTip.html("");
                        return;
                    }
                    let time = Date.parse(this.value.replace(/-/g,"/"));
                    if( self.name() == "begin_time") {
                        let now = new Date().getTime();
                        let diff = time - now;
                        dateTimeTip.html(convertTime(diff) + "后开始");
                    } else {
                        let beginTime = $.trim( $("input[name=begin_time]").val() );
                        if( beginTime == "" ) {
                            return;
                        }
                        let beginTimeNum = Date.parse(beginTime.replace(/-/g,"/"));
                        let diff = time - beginTimeNum;
                        dateTimeTip.html( "持续" + convertTime(diff) );
                    }
                });
            }
        }

        protected renderHtml():string {
            let html = `<div class="input-group" data-plugin="datepicker" style="position: relative">
                                <div name="datetime_tip" style="position:absolute; left:300px;top:4px; z-index: 999; color: #999"></div>
								<input class="form-control"  type="text" name="${this.name()}">
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