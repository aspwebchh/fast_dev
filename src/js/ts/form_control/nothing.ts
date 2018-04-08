/// <reference path="fbase.ts" />
namespace gm2.control{
    export class nothing extends fbase{
        protected renderHtml():string {
            return "";
        }

        public getValue(): any {
            return "";
        }

        public setValue( value: any ): void{
        }
    }
}