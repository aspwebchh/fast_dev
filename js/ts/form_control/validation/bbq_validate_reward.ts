/// <reference path="../../jquery/jquery.d.ts" />
/// <reference path="../../common.ts" />
namespace gm2.control{
    export class bbq_validate_reward extends validation_base{
        private txt : string;
        public isValid ( data: any[] ) {
            let idIsEmpty = data.every( item => item.id == "" );
            let numberIsEmpty = data.every( item => item.number == "" );
            let idIsInt = data.every( item => isInteger(item.id ));
            let numberIsInt = data.every( item => isInteger(item.number));
            if(idIsEmpty) {
                this.txt = "奖励ID为空";
                return false;
            }
            if(numberIsEmpty) {
                this.txt = "奖励数值为空";
                return false;
            }
            if(!idIsInt) {
                this.txt = "奖励ID必须为数字";
                return false;
            }
            if(!numberIsInt) {
                this.txt = "奖励数量必须为数字";
                return false;
            }
            return true;
        }

        public invalidText( field: string ) {
            return this.txt;
        }
    }
}