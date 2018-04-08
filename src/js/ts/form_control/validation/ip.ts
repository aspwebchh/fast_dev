/// <reference path="../../jquery/jquery.d.ts" />
/// <reference path="../../common.ts" />

namespace gm2.control{
    export class ip extends validation_base{
        private isIpAddr( ip: string ) : boolean{
            let items = ip.split(".");
            if( items.length != 4 ) {
                return false;
            }
            let success = items.every( item => {
                return isInteger( item ) && parseInt( item ) <= 255;
            });
            return success;
        }

        public isValid ( data: any ) {
            data = $.trim(data);
            if( data == "" ) {
                return true;
            } else {
                return this.isIpAddr(data);
            }
        }
        public invalidText(field: string ) {
            return field + "格式不合法";
        }
    }
}