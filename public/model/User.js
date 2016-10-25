"use strict";
var User = (function () {
    function User(name, password, email) {
        this.name = name;
        this.password = password;
        this.email = email;
    }
    User.prototype.toString = function () {
        return "[" + "user:" + this.name + "," + "email:" + this.email + "]";
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map