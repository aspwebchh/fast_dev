/// <reference path="lbase.ts" />
namespace gm2.control{
    export class add extends lbase{
        public renderHtml(): string {
            return `<button type="button" class="btn btn-primary" onclick="openNewTab('添加', 'index.php?/gm2/index?action_id=${this.actionId}&action_mode=${this.actionMode}')">添加</button>`;
        }
    }
}