/// <reference path="../../jquery/jquery.d.ts" />
/// <reference path="../../common.ts" />
namespace gm2.control{
    export class bbq_validate_bat extends validation_base{
        private txt : string;
        public isValid ( data: {status: number, count: any, index:number}[] ) {
            for(let item of data) {
                if( item.count == "") {
                    this.txt = item.status == 0 ? "请输入礼包码数量" : "请输入通码值"
                    return false;;
                }
                if( item.status == 0 && !isInteger(item.count) ) {
                    this.txt = "礼包码数量必须为数值";
                    return false;
                }
                if( item.status == 0 && item.count > 50001) {
                    this.txt = "礼包码数量上限为50000个";
                    return false;
                }
            }
            return true;
        }

        public invalidText( field: string ) {
            return this.txt;
        }
    }
}