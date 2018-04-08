/// <reference path="../../jquery/jquery.d.ts" />
namespace gm2.control{
    export class check_user extends validation_base{
        public isValid ( data: any ) {
            data = $.trim(data);
            return /^\w+(,\w+)*$/.test(data);
        }
        public invalidText( field: string ) {
            return field + "为纯数字，多个请用逗号分隔";
        }
    }
}