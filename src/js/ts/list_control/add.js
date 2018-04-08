var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
/// <reference path="lbase.ts" />
var gm2;
(function (gm2) {
    var control;
    (function (control) {
        class add extends control.lbase {
            renderHtml() {
                return `<button type="button" class="btn btn-primary" onclick="openNewTab('添加', 'index.php?/gm2/index?action_id=${this.actionId}&action_mode=${this.actionMode}')">添加</button>`;
            }
        }
        control.add = add;
    })(control = gm2.control || (gm2.control = {}));
})(gm2 || (gm2 = {}));
//# sourceMappingURL=add.js.map