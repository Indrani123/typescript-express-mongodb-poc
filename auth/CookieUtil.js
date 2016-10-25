/**
 * Created by IndraniS on 10/14/2016.
 */
"use strict";
/*Util calss of Cookie management*/
var CookieUtil = (function () {
    function CookieUtil() {
    }
    CookieUtil.setCookie = function (name, value) {
        console.log("In setCookie");
        if (name && name.length > 0) {
            console.log(name + "=" + value);
            document.cookie = name + "=" + value;
            console.log("In setCookie2");
            console.log("document cookie" + document.cookie);
        }
        console.log("document cookie" + document.cookie);
    };
    CookieUtil.getCookie = function (name) {
        var cookiesArr = document.cookie.split('; ');
        var cookies = {};
        // Parse the set of cookies.
        for (var i = cookiesArr.length - 1; i >= 0; i--) {
            var cookie = cookiesArr[i].split('=');
            cookies[cookie[0]] = cookie[1];
        }
        // Return the cookie, undefined if not set.
        return cookies[name];
    };
    CookieUtil.deleteCookie = function () {
        if (name && name.length > 0) {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
    };
    return CookieUtil;
}());
exports.CookieUtil = CookieUtil;
//# sourceMappingURL=CookieUtil.js.map