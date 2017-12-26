var gm2;
(function (gm2) {
    var control;
    (function (control) {
        class base_control {
            constructor() {
                this.onRenderComplete = () => { };
                base_control.controlCount++;
                this.controlId = "control_" + base_control.controlCount;
            }
            setOwner(owner) {
                this.owner = owner;
            }
            getOwner() {
                return this.owner;
            }
            id() {
                return this.controlId;
            }
            getElement() {
                return document.getElementById(this.id());
            }
            render() {
                let html = this.renderHtml();
                html = html.replace(/<[^\s\>]+(?=(>| ))/, item => {
                    return item + " id='" + this.id() + "' ";
                });
                return html;
            }
            setActionIdAndMode(actionId, actionMode) {
                this.actionId = actionId;
                this.actionMode = actionMode;
            }
        }
        base_control.controlCount = 0;
        control.base_control = base_control;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=base_control.js.map