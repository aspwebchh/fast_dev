/// <reference path="fbase.ts" />
namespace gm2.control{
    export class textarea extends fbase{
        public onRenderComplete = () => {
            if(this.isMultiLang()) {
                $(this.getElement()).after(this.getMultiLangSelector())
            }
        };

        protected renderHtml():string {
            let html = `<textarea class="form-control" style="height: 200px;"></textarea>`;
            return html;
        }

        public getValue(): any {
            let result = (this.getElement() as HTMLInputElement).value;
            return result;
        }

        public setValue( value: any ): void {
            let ele = this.getElement() as HTMLInputElement;
            ele.value = value;
            if( this.isMultiLang() ) {
                this.fillMultiLangDialog( value );
            }
        }

        public fillControlValue(  value ) {
            let ele = this.getElement() as HTMLInputElement;
            ele.value = value;
        }
    }
}