/// <reference path="jquery/jquery.d.ts" />
/// <reference path="eventbase.d.ts" />
/// <reference path="common.ts" />
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
var queryString = gm2.queryString;
var mapToObject = gm2.mapToObject;
var Page = function (pageCanvas) {
    this.recordCount;
    this.pageSize;
    this.numericButtonCount;
    this.pageCanvas = pageCanvas;
    this.pageIndex = 1;
};
Page.prototype = new EventBase();
Page.prototype.getPageHtml = function () {
    this.pageCount = Math.ceil(this.recordCount / this.pageSize);
    var prev = this.pageIndex == 1 ? " <span>上一页</span>"
        : "<a href='javascript:;' pageindex='" + (this.pageIndex - 1)
            + "'>上一页</a>";
    var next = this.pageCount <= this.pageIndex ? " <span>下一页</span>"
        : "<a href='javascript:;' pageIndex='" + (this.pageIndex + 1)
            + "'>下一页</a>";
    var first = this.pageIndex == 1 ? "<span>1</span>"
        : "<a href='javascript:;' pageindex='1'>1</a>";
    var last = this.pageCount <= this.pageIndex ? "<span>" + this.pageCount
        + "</span>" : "<a href='javascript:;' pageindex='"
        + (this.pageCount) + "'>" + this.pageCount + "</a>";
    var pageStr = "";
    var pageMathIndex = Math.floor(this.numericButtonCount / 2);
    var pageStartIndex;
    var pageEndIndex;
    if (this.pageCount < this.numericButtonCount) {
        pageStartIndex = 1;
        pageEndIndex = this.pageCount;
    }
    else {
        if (this.pageCount - pageMathIndex < this.pageIndex) {
            pageStartIndex = this.pageCount - this.numericButtonCount + 1;
            pageEndIndex = this.pageCount;
        }
        else {
            if (this.pageIndex - pageMathIndex < 1) {
                pageStartIndex = 1;
                pageEndIndex = this.numericButtonCount;
            }
            else {
                pageStartIndex = this.pageIndex - pageMathIndex;
                pageEndIndex = this.pageIndex + pageMathIndex;
            }
        }
    }
    for (var i = pageStartIndex; i <= pageEndIndex; i++) {
        if (this.pageIndex == i)
            pageStr += " <span class='current'>" + i + "</span>";
        else
            pageStr += "<a href='javascript:;' pageindex='" + i + "'>" + i
                + "</a>";
    }
    if (pageStartIndex == 1)
        first = '';
    if (pageEndIndex == this.pageCount)
        last = '';
    //pageStr = first + prev + pageStr + next + last;
    //pageStr = prev + first + pageStr + last + next;
    pageStr = this.getPageButtonHtml(prev, first, pageStr, last, next);
    return pageStr;
};
Page.prototype.onPageChanged = function (pageIndex) {
    this.pageIndex = pageIndex;
    this.fireEvent('pageChanged');
};
Page.prototype.pageEvent = function (page) {
    this.onclick = function (e) {
        e = e || window.event;
        var t = e.target || e.srcElement;
        if (t.tagName == "A")
            page.onPageChanged(parseInt(t.getAttribute("pageindex")));
    };
};
Page.prototype.render = function () {
    var pageCanvas = document.getElementById(this.pageCanvas);
    pageCanvas.innerHTML = this.getRecordCountHtml(this.recordCount) + this.getPageHtml();
    this.pageEvent.call(pageCanvas, this);
};
Page.prototype.initialize = function () {
    this.onPageChanged(this.pageIndex);
};
Page.prototype.getRecordCountHtml = function (recordCount) {
    throw '未实现此方法';
};
Page.prototype.getPageButtonHtml = function (first, prev, pageStr, next, last) {
    throw '未实现此方法';
};
//---普通样式的分页效果------------------------------------------------------------------------------------------------------
var PageV1 = function (pageCanvas) {
    this.pageCanvas = pageCanvas;
};
PageV1.prototype = new Page("");
PageV1.prototype.getRecordCountHtml = function (recordCount) {
    var html = '共<font>' + recordCount + '</font>条记录';
    return html;
};
PageV1.prototype.getPageButtonHtml = function (prev, first, pageStr, last, next) {
    return prev + first + pageStr + last + next;
};
//---新版本GM UI样式的分页效果-------------------------------------------------------------------------------------
var PageV2 = function (pageCanvas) {
    this.pageCanvas = pageCanvas;
};
PageV2.prototype = new Page("");
PageV2.prototype.getRecordCountHtml = function (recordCount) {
    let start = (this.pageIndex - 1) * this.pageSize + 1;
    let end = start + this.pageSize - 1;
    let html = `<div class="col-sm-6">
                <div class="dataTables_info" id="editable_info" role="alert" aria-live="polite" aria-relevant="all">
                 显示 ${start} 到 ${end} 项，共 ${recordCount} 项
                </div>
               </div>`;
    return html;
};
PageV2.prototype.getPageButtonHtml = function (prev, first, pageStr, last, next) {
    prev = prev.indexOf('span') == -1 ? "<li>" + prev + "</li>" : "<li class='disabled'>" + prev + "</li>";
    next = next.indexOf('span') == -1 ? "<li>" + next + "</li>" : "<li class='disabled'>" + next + "</li>";
    first = "<li>" + first + "</li>";
    last = "<li>" + last + "</li>";
    var regex = /<[^>]+?>[^<]+<[^>]+?>/g;
    var newPageStr = "";
    pageStr.replace(regex, function (match) {
        newPageStr += match.indexOf('span') != -1 ? '<li class="active">' + match + '</li>' : '<li>' + match + '</li>';
    });
    pageStr = newPageStr;
    var html = "<ul class='pagination'>";
    html += prev + first + pageStr + last + next;
    html += "</ul>";
    html = `<div class="col-sm-6"><div class="dataTables_paginate paging_simple_numbers" id="editable_paginate">` + html + "</div></div>";
    return html;
};
function renderPage(placeholder, dataCount, pageSize) {
    var Page;
    if (!pageSize || isNaN(pageSize)) {
        pageSize = 20;
    }
    Page = PageV2;
    if (dataCount <= 0) {
        return;
    }
    var page = new Page(placeholder);
    let pageIndex = queryString().get('page');
    page.pageSize = pageSize;
    page.numericButtonCount = 5;
    page.recordCount = dataCount;
    page.pageIndex = parseInt(pageIndex) || 1;
    page.addListener('pageChanged', function () {
        let query = mapToObject(queryString());
        for (var key in query) {
            if (query[key] === '') {
                delete query[key];
            }
            if (query[key]) {
                query[key] = query[key].replace(/\+/g, ' ');
            }
        }
        query['page'] = this.pageIndex;
        query["c"] = "gm2";
        query["m"] = "index";
        window.location.href = 'index.php?' + $.param(query);
    });
    page.render();
}
//# sourceMappingURL=page.js.map