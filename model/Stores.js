"use strict";
/**
 * Created by IndraniS on 9/27/2016.
 */
var Stores = (function () {
    function Stores(storename, miles, location) {
        this.storename = storename;
        this.miles = miles;
        this.location = location;
    }
    Stores.prototype.toString = function () {
        return "storename:" + this.storename + "," + "miles:" + this.miles + "," + this.location;
    };
    return Stores;
}());
exports.Stores = Stores;
//# sourceMappingURL=Stores.js.map