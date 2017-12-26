/// <reference path="fbase.ts" />
/// <reference path="../jquery/jquery.d.ts" />
namespace gm2.control{
    interface jquery extends JQuery{
        datepicker: (arg:any) =>{}
    }
    export class bbq_pic extends fbase{
        public imageUrl  = "";
        constructor() {
            super();
            var self = this;
            this.onRenderComplete = () => {
                let ele = $( this.getElement() );
                let file = ele.find("input[type=file]");
                file.bind("change", function(){
                    let formData = new FormData();
                    formData.append("file", this.files[0]);
                    let xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = ( arg ) => {
                        if ( xhr.readyState == 4 ) {
                            if( xhr.status == 200 ) {
                                let data = eval("("+ xhr.responseText +")");
                                let error = data.error;
                                if( error ) {
                                    alert( data.message );
                                } else {
                                    self.imageUrl = data.url;
                                    self.showPic();
                                }
                            } else {
                                alert("上传图片出错");
                            }
                        }
                    }
                    xhr.open("post","index.php?/gm2/forForm?action_id=bbq_game_notice_pic&action_mode=form&method=upload");
                    xhr.send(formData);
                })
            }
        }

        public showPic() {
            $(this.getElement()).find("img").attr("src",this.imageUrl).show().bind("click", function(){window.open(this.src);}).css("cursor","pointer");
        }

        protected renderHtml():string {
            let html = `<div>
                                <input type="file" />
                                <img style="height: 130px; margin-top: 5px; display: none" >
							</div>	`;
            return html;
        }

        public getValue(): any {
            return $(this.getElement()).find("img").attr("src");
        }

        public setValue( value: any ): void {
            this.imageUrl = value;
            this.showPic();
        }
    }
}