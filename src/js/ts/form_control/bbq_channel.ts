/// <reference path="fbase.ts" />
namespace gm2.control{
    import ownKeys = Reflect.ownKeys;
    export class bbq_channel extends fbase{
        private channelString = "";

        private subCchannelString = `-1 所有渠道
1019	UC
1029	小米
1051	魅族
1052	联想
1054	金立
1065	酷派
1074	4399
1027	360
1020	斗鱼
1028	百度
1350	葫芦侠
1058    电魂
1330    捞月狗
1116    爱奇艺
1355    wifi万能钥匙
1354    暴漫
1120    努比亚
1045    果盘游戏
1356    多玩
1037    卓易
1031    应用宝
1114    三星
1329    B站
`;


        private mainChannelString = `-1 所有渠道
2	电魂
5	oppo
6	vivo
7	华为
3	应用宝
        `;
        
        private selectedId = "";
        private keyword = "";

        constructor() {
            super();
            this.onRenderComplete = () => {
                let self = this;
                let ele = $( this.getElement() );
                let input = ele.find("input");
                let channelList = ele.find(".bbq_channel");

                ele.bind("click", function(e){
                    let target = e.target as HTMLLIElement;
                    if( target.tagName != "LI") {
                        return;
                    }
                    let channelName = target.innerHTML;
                    let channelId = $(target).attr("id");
                    self.selectedId = channelId;
                    input.val( channelName );
                    channelList.hide();
                });

                input.bind("focus", function(){
                    channelList.show();
                });

                input.bind("keyup", function(){
                    self.keyword = this.value.replace(/(^\s*)|(\s*$)/,"");
                    channelList.find("ul").html( self.getHtml() );
                });
            }
        }

        private channelData() : { id:string, name:string }[] {
            if( this.name() == "subChannel") {
                this.channelString = this.subCchannelString;
            } else {
                this.channelString = this.mainChannelString;
            }

            let result = this.channelString.split(/\n/).
            filter(item => item.replace(/\s+/g,"").length > 0).
            map( item => {
                let items = item.split(/\s+/);
                if( items.length >= 2 ) {
                    return {
                        id: items[0],
                        name: items[1]
                    }
                } else {
                    console.log( items );
                    return {id:"", name:""}
                }
            } );
            return result;
        }


        private getHtml() : string {
            return this.channelData().filter(item =>{
                if( this.keyword == "") {
                    return true;
                } else {
                    return  item.name.toUpperCase().indexOf( this.keyword.toUpperCase() ) != -1;
                }
            }).map(item =>{
                return `<li id="${item.id}">${item.name}</li>`;
            }).join("");
        }

        protected renderHtml():string {
            let html = `<div class="position:relative">
            <input type="text" class="form-control" placeholder="" />
                <div class="bbq_channel" style="display: none;">
                    <ul>${this.getHtml()}</ul>
                </div>
               </div>`;
            return html;
        }

        public getValue(): any {
            return this.selectedId;
        }

        public setValue( value: any ): void{
            let found = this.channelData().filter(item=>  item.id == value);
            if( found.length > 0 ) {
                $(this.getElement()).find("input").val( found[0].name );
            }
        }
    }
}