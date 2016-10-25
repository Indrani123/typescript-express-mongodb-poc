"use strict";
var AuthModule_1 = require("./AuthModule");
var sigmaIdpOpts = {
    protocol: "http",
    host: "localhost",
    port: 8090
};
var auth;
auth = new AuthModule_1.AuthModule();
auth.authenticate("sam", "welcome", sigmaIdpOpts).then(function (authResponse) {
    console.log("response from the authenticate API:", authResponse);
});
//# sourceMappingURL=authTest.js.map