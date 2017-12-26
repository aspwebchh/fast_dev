/// <reference path="fbase.ts" />
namespace gm2.control{
    export class player_id_list extends fbase{
        constructor() {
            super();
            this.onRenderComplete = () =>{
                this.getSelect().bind("change",function(){
                    $(this).siblings().hide();
                    if( this.value == 2 ) {
                        $( this ).siblings("input[type=file]").css("display","inline");
                    } else {
                        $( this ).siblings("input[type=text]").css("display","inline");
                    }
                });

                this.getText().bind("change", () =>{
                    this.getHidden().val( this.getText().val() );
                });

                this.getFile().bind("change", () =>{
                    let input = this.getFile().get(0) as HTMLInputElement;
                    let file = input.files.item(0) as File;
                    if( !/\.(txt|text)/i.test(file.name)) {
                        alert("请使用文本文件");
                        return;
                    }
                    let fileReader = new FileReader();
                    fileReader.onload = (e:Event) => {
                        let target = e.target as any;
                        let result = target.result;
                        result = result.replace(/(^\s+)|(\s+$)/,"");
                        let data =  result.split(/\s+/).join(",").trim();
                        if(!/^[^\s]+(,[^\s]+)*$/.test(data)) {
                            alert("文件格式不正确");
                            return;
                        }
                        this.getHidden().val(data);
                    }
                    fileReader.readAsText(file);
                });
            };
        }

        private getSelect() : JQuery{
            return  $(this.getElement()).find("select");
        }

        private getFile() : JQuery{
            return  $(this.getElement()).find("input[type=file]");
        }

        private getText() : JQuery{
            return  $(this.getElement()).find("input[type=text]");
        }

        private getHidden() : JQuery{
            return  $(this.getElement()).find("input[type=hidden]");
        }

        protected renderHtml():string {
            let html = `<div>
                            <select  class="form-control" style="width: 20%; display: inline; margin-right: 5px;" >
                                <option value="1">单个</option>
                                <option value="2">批量</option>
                            </select>
                            <input type="text" class="form-control"  style="width: 75%; display: inline;" />
                            <input type="file" clas="form-control" style="width: 70%; display: none;" />
                            <input type="hidden" />
                        </div>`;
            return html;
        }

        public getValue(): any {
            return this.getHidden().val();
        }

        public setValue( value: any ): void{

        }
    }
}