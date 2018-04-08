/// <reference path="../../jquery/jquery.d.ts" />
/// <reference path="../../common.ts" />
namespace gm2.control{
    export class bbq_validate_attach extends validation_base{
        private txt : string;
        public isValid ( data: any[] ) {
            if( data.length == 1 ) {
                if(data[0].id == "" && data[0].number == "") {
                    return true;
                }
            }
            let idIsEmpty = data.every( item => item.id == "" );
            let numberIsEmpty = data.every( item => item.number == "" );
            let idIsInt = data.every( item => isInteger(item.id ));
            let numberIsInt = data.every( item => isInteger(item.number));
            if(idIsEmpty) {
                this.txt = "ID为空";
                return false;
            }
            if(numberIsEmpty) {
                this.txt = "数值为空";
                return false;
            }
            if(!idIsInt) {
                this.txt = "ID必须为数字";
                return false;
            }
            if(!numberIsInt) {
                this.txt = "数量必须为数字";
                return false;
            }
            return true;
        }

        public invalidText( field: string ) {
            return this.txt;
        }
    }
}