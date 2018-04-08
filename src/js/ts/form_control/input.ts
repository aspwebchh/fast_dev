/// <reference path="fbase.ts" />
namespace gm2.control{

    export class input extends fbase{
        public onRenderComplete = () => {
            if(this.isMultiLang()) {
                $(this.getElement()).after(this.getMultiLangSelector())
            }
        };

        protected renderHtml():string {
            let placeholder = this.dataSource.get("placeholder") || "";
            let html = `<input type="text" class="form-control"  placeholder="${placeholder}" />`;
            return html;
        }

        public getValue(): any {
            let result = (this.getElement() as HTMLInputElement).value;
            return result;
        }

        public setValue( value: any ): void{
            let ele = this.getElement() as HTMLInputElement;
            if( this.isMultiLang() ){
                this.fillMultiLangDialog(value);
            }
            ele.value = value;
        }

        public fillControlValue(  value ) {
            let ele = this.getElement() as HTMLInputElement;
            ele.value = value;
        }
    }
}