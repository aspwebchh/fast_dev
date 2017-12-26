/// <reference path="../../jquery/jquery.d.ts" />
/// <reference path="../../common.ts" />
namespace gm2.control{
    export class validate_award extends validation_base{
        private txt : string;
        public isValid ( data: any[] ) {
            for( let item of data ) {
                let itemId = item["item_id"];
                let itemCount = item["item_count"];
                //if( itemId == "" ) {
                //    this.txt = "物品ID为空";
                //    return false;
                //}
                //if( !isInteger(itemId)) {
                //    this.txt = "物品ID必须为数值";
                //    return false;
                //}
                if( itemCount == "") {
                    this.txt = "物品数量为空";
                    return false;
                }
                if( !isInteger(itemCount)) {
                    this.txt = "物品数量必须为数值";
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