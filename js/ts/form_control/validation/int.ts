/// <reference path="../../jquery/jquery.d.ts" />
/// <reference path="../../common.ts" />

namespace gm2.control{
    export class int extends validation_base{
        public isValid ( data: any ) {
            data = $.trim(data);
            if( data == "" ) {
                return true;
            } else {
                return isInteger(data);
            }
        }
        public invalidText(field: string ) {
            return field + "必须是数值";
        }
    }
}