/// <reference path="../../jquery/jquery.d.ts" />
namespace gm2.control{
    export class required extends validation_base{
        public isValid ( data: any ) {
            data = $.trim(data);
            return data != "";
        }
        public invalidText( field: string ) {
            return field + "值为空";
        }
    }
}