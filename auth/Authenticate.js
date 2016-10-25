"use strict";
var AuthModule_1 = require("./AuthModule");
var config_1 = require("../config");
var Authenticate = (function () {
    function Authenticate() {
    }
    /*Middle ware for storing sigma A&A session*/
    Authenticate.setSessionStore = function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;
        var auth;
        auth = new AuthModule_1.AuthModule();
        if (Authenticate.isAuthenticated) {
            next();
        }
        else {
            auth.authenticate(username, password, config_1.sigmaIdpOpts).then(function (authResponse) {
                if (authResponse.tokenId != null) {
                    res.cookie("sigmaIdpSSOToken", authResponse.tokenId, { maxAge: 100000 });
                    Authenticate.isAuthenticated = true;
                }
                next();
            }).catch(function (error) {
                Authenticate.isAuthenticated = false;
                console.log("Unable to set cookies");
            });
        }
    };
    /*Middle ware for removing sigma A&A session*/
    Authenticate.removeSessionStore = function (req, res, next) {
    };
    Authenticate.isAuthenticated = false;
    return Authenticate;
}());
exports.Authenticate = Authenticate;
//# sourceMappingURL=Authenticate.js.map