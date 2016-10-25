"use strict";
var MongoDatabaseImpl_1 = require("./MongoDatabaseImpl");
/**
 * Created by IndraniS on 10/24/2016.
 */
var config_1 = require("../config");
var FactoryDaoPattern;
(function (FactoryDaoPattern) {
    var DaoFactory = (function () {
        function DaoFactory() {
        }
        DaoFactory.getDao = function (type) {
            if (type === "mongo") {
                return new MongoDatabaseImpl_1.MongoDatabaseImpl(config_1.daoConfig.host, config_1.daoConfig.port, config_1.daoConfig.COLLECTION_NAME);
            }
            return null;
        };
        return DaoFactory;
    }());
    FactoryDaoPattern.DaoFactory = DaoFactory;
})(FactoryDaoPattern = exports.FactoryDaoPattern || (exports.FactoryDaoPattern = {}));
//# sourceMappingURL=FactoryDaoPattern.js.map