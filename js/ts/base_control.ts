namespace gm2.control{
    export abstract class base_control{
        public onRenderComplete = () => {};

        private static controlCount = 0;

        protected abstract renderHtml(): string;

        protected actionId;
        protected actionMode;

        private controlId:string;

        protected owner : Base;

        constructor() {
            base_control.controlCount ++;
            this.controlId ="control_" + base_control.controlCount;
        }

        public setOwner( owner: Base ) {
            this.owner = owner;
        }

        public getOwner() : Base{
            return this.owner;
        }

        public id() : string {
            return this.controlId;
        }

        public getElement(): HTMLElement{
            return document.getElementById(this.id());
        }

        public render(): string {
            let html = this.renderHtml();
            html = html.replace(/<[^\s\>]+(?=(>| ))/, item => {
                return item + " id='" + this.id() + "' "
            });
            return html;
        }

        public setActionIdAndMode( actionId: string, actionMode:string ) {
            this.actionId = actionId;
            this.actionMode = actionMode;
        }
    }
}