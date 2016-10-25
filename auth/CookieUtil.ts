/**
 * Created by IndraniS on 10/14/2016.
 */

/*Util calss of Cookie management*/

export class CookieUtil{


    public static setCookie(name: string, value: string){
        console.log("In setCookie");
        if (name && name.length > 0) {
            console.log(name + "=" + value);
            document.cookie = name + "=" + value;
            console.log("In setCookie2");
            console.log("document cookie"+document.cookie);
        }
        console.log("document cookie"+document.cookie);
    }

    public static getCookie(name  : string):string{
        let cookiesArr = document.cookie.split('; ');
        let cookies = {};
        // Parse the set of cookies.
        for (var i = cookiesArr.length - 1; i >= 0; i--) {
            let cookie = cookiesArr[i].split('=');

            cookies[cookie[0]] = cookie[1];
        }
        // Return the cookie, undefined if not set.
        return cookies[name];
    }


    public static deleteCookie(){
        if (name && name.length > 0) {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
    }

}