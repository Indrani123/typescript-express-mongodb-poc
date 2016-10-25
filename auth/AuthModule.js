/**
 * Created by IndraniS on 10/14/2016.
 */
"use strict";
var rp = require("request-promise");
var AuthModule = (function () {
    function AuthModule() {
    }
    AuthModule.prototype.authenticate = function (username, password, sigmaIdpOpts) {
        return new Promise(function (resolve, reject) {
            var authResponse = null;
            var options = {
                method: 'POST',
                uri: sigmaIdpOpts.protocol + "://" + sigmaIdpOpts.host + ":" + sigmaIdpOpts.port +
                    '/saml-idp/api/authenticate',
                headers: {
                    'X-SigmaIDP-Username': new Buffer(username).toString('base64'),
                    'X-SigmaIDP-Password': new Buffer(password).toString('base64'),
                    'Content-type': 'application/json'
                },
                body: {},
                json: true
            };
            rp(options)
                .then(function (response) {
                if (response.tokenId != null && response.user != null) {
                    authResponse = { tokenId: response.tokenId, user: response.user,
                        code: response.code };
                    resolve(authResponse);
                }
                else {
                    authResponse = { tokenId: response.tokenId, user: response.user,
                        code: response.code, message: response.message, reason: response.reason };
                    resolve(authResponse);
                }
            })
                .catch(function (err) {
                reject("Authentication failed");
            });
        });
    };
    AuthModule.prototype.validateToken = function (ssoToken, httpOpts) {
        return new Promise(function (resolve, reject) {
            rp(httpOpts)
                .then(function (parsedBody) {
                resolve(parsedBody);
            })
                .catch(function (err) {
                reject("Authentication failed");
            });
        });
    };
    return AuthModule;
}());
exports.AuthModule = AuthModule;
//# sourceMappingURL=AuthModule.js.map