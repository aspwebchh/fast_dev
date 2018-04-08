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
/// <reference path="jquery/jquery.d.ts" />
var gm2;
(function (gm2) {
    function queryString() {
        let urlItems = window.location.search.split("?");
        let values = new Map();
        if (urlItems.length == 0) {
            return values;
        }
        let params = urlItems[urlItems.length - 1];
        let result = params.split("&").reduce((rt, item) => {
            let [key, val] = item.split("=");
            rt.set(key, decodeURIComponent(val));
            return rt;
        }, values);
        return result;
    }
    gm2.queryString = queryString;
    function ajaxAsync(url = "", data, method = "GET", dataType = "json") {
        return __awaiter(this, void 0, Promise, function* () {
            return new Promise((resolve, reject) => {
                let ajaxSetting = {};
                ajaxSetting.url = url;
                ajaxSetting.type = method;
                ajaxSetting.dataType = dataType;
                ajaxSetting.data = data;
                ajaxSetting.success = (response) => {
                    resolve(response);
                };
                ajaxSetting.error = (xhr) => {
                    reject("请求出错，请联系网站管理员");
                };
                $.ajax(ajaxSetting);
            });
        });
    }
    gm2.ajaxAsync = ajaxAsync;
    function mapToObject(map) {
        let result = {};
        for (let [key, val] of map.entries()) {
            result[key] = val;
        }
        return result;
    }
    gm2.mapToObject = mapToObject;
    function jquery2HtmlElements(jquery) {
        let result = [];
        jquery.each((index, item) => result.push(item));
        return result;
    }
    gm2.jquery2HtmlElements = jquery2HtmlElements;
    function isInteger(val) {
        return /^\-?\d+$/.test(val);
    }
    gm2.isInteger = isInteger;
    function syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                }
                else {
                    cls = 'string';
                }
            }
            else if (/true|false/.test(match)) {
                cls = 'boolean';
            }
            else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
    gm2.syntaxHighlight = syntaxHighlight;
})(gm2 || (gm2 = {}));
//# sourceMappingURL=common.js.map