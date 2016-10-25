"use strict";
/**
 * Created by IndraniS on 9/27/2016.
 */
var MasterStore = (function () {
    function MasterStore(zipCode, userLocation) {
        this.zipCode = zipCode;
        this.userLocation = userLocation;
    }
    MasterStore.prototype.toString = function () {
        return "storename:" + this.zipCode + "," + "stores" + this.userLocation;
    };
    return MasterStore;
}());
exports.MasterStore = MasterStore;
//# sourceMappingURL=MasterStore.js.map