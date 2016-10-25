/**
 * Created by IndraniS on 9/26/2016.
 */
"use strict";
var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var es6promise = require('es6-promise');
var Promise = es6promise.Promise;
var MongoDatabaseImpl = (function () {
    function MongoDatabaseImpl(serverName, port, databaseName) {
        serverName = serverName || "localhost";
        port = port || 27017;
        databaseName = databaseName || "shops";
        MongoDatabaseImpl.forcedClose = false;
        this.connectionString = "mongodb://" + serverName + ":" + port + "/" + databaseName;
    }
    /* var collection = db.collection('test');*/
    MongoDatabaseImpl.prototype.getCollection = function (collectionName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getDb().then(function (db) {
                return resolve(db.collection(collectionName));
            }).catch(function (error) {
                var context = {
                    collectionName: collectionName,
                    error: error
                };
                return reject("Error unable to get collection" + collectionName + "," + error);
            });
        });
    };
    /**
     *
     *insert data on server start*/
    MongoDatabaseImpl.prototype.addObject = function (collectionName, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName).then(function (collection) {
                //insert data to MongoDb Collection
                return collection.insertOne(data).then(function (result) {
                    if (result.result.ok === 1 && result.result.n === 1) {
                        return resolve(result.ops[0]);
                    }
                    else {
                        var context = {
                            collection: collectionName
                        };
                        return reject("Error:" + collectionName);
                    }
                }).catch(function (error) {
                    return reject("Error:" + collectionName);
                });
            });
        });
    };
    /*Used for adding all multiple*/
    MongoDatabaseImpl.prototype.addAll = function (collectionName) {
        var _this = this;
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName).then(function (collection) {
                //insert data to MongoDb Collection
                return collection.insertMany(data).then(function (result) {
                    if (result.result.ok === 1 && result.result.n === 1) {
                        return resolve(result.ops[0]);
                    }
                    else {
                        var context = {
                            collection: collectionName
                        };
                        return reject("Error:" + collectionName);
                    }
                }).catch(function (error) {
                    return reject("Error:" + collectionName);
                });
            });
        });
    };
    /*Used for Read all entries in DB*/
    MongoDatabaseImpl.prototype.readAll = function (collectionName, fields) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var cursor = null;
            _this.getCollection(collectionName).then(function (collection) {
                /*collection.find().then((result:any)=> {
                 return resolve(result);
                 });*/
                cursor = collection.find().limit(10).project(fields);
                return cursor.toArray();
            }).then(function (documents) {
                if (documents.length > 0) {
                    return resolve(documents[0]);
                }
                else {
                    return resolve(null);
                }
            }).catch(function (error) {
                return reject("Error unable to read data");
            });
        });
    };
    /*get MongoDatabaseImpl*/
    MongoDatabaseImpl.prototype.getDb = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (MongoDatabaseImpl.forcedClose) {
                var context = {
                    connectionString: _this.connectionString
                };
                return reject("Error unable to get DB" + context);
            }
            else if (_this.db && typeof _this.db !== 'undefined') {
                return resolve(_this.db);
            }
            else {
                mongoClient.connect(_this.connectionString)
                    .then(function (db) {
                    _this.db = db;
                    _this.db.on("close", _this.onClose);
                    return resolve(_this.db);
                }).catch(function (error) {
                    var context = {
                        connectionString: _this.connectionString,
                        error: error
                    };
                    return reject("Db error" + context.error + "connec tstr" + context.connectionString);
                });
            }
        });
    };
    /*handle close event when mongo is closed*/
    MongoDatabaseImpl.prototype.onClose = function () {
        console.log("closing DB conn....");
        MongoDatabaseImpl.forcedClose = true;
    };
    /*Delete one single object*/
    MongoDatabaseImpl.prototype.deleteObject = function (collectionName, match) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName).then(function (collection) {
                var query = { name: match };
                return collection.deleteOne(match, {});
            }).then(function (result) {
                if (result.result.ok === 1) {
                    return resolve(result);
                }
                else {
                    var context = {
                        collection: collectionName
                    };
                    return reject("Error occurred while deletion");
                }
            });
        });
    };
    /*Used for deleting multiple object*/
    MongoDatabaseImpl.prototype.deleteAll = function (collectionName, filter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName).then(function (collection) {
                collection.deleteMany(filter);
            }).then(function (result) {
                if (result.result.ok === 1) {
                    return resolve(result);
                }
            }).catch(function (error) {
                return reject("Error unable to delete records:" + error);
            });
        });
    };
    MongoDatabaseImpl.prototype.getObjectId = function (collectionName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.readObject(collectionName).then(function (result) {
                if (result != null) {
                    var d = JSON.parse(result);
                    return resolve(d);
                }
                else {
                    return null;
                }
            }).then(function (result) {
                if (result != null) {
                    var d = JSON.parse(result);
                    return resolve(d);
                }
            }).catch(function (error) {
                return reject("Error occurred" + error);
            });
        });
    };
    /*Read data from mongoDb collections ie
     *                 collection.findOne({mykey:1}, function(err, item) {});;
     */
    MongoDatabaseImpl.prototype.readObject = function (collectionName, queryByName, fields) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var cursor = null;
            _this.getCollection(collectionName).then(function (collection) {
                cursor = collection.find({});
                return cursor.toArray();
            }).then(function (documents) {
                if (documents.length > 0) {
                    return resolve(JSON.stringify(documents[0]));
                }
                else {
                    return resolve(null);
                }
            }).catch(function (error) {
                return reject("Error unable to read data");
            });
        });
    };
    /**
     * Perform aggregate operation
     * */
    MongoDatabaseImpl.prototype.aggregateResult = function (collectionName, pipeline) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var cursor = null;
            _this.getCollection(collectionName).then(function (collection) {
                cursor = collection.aggregate(pipeline);
                return cursor.toArray();
            }).then(function (result) {
                return resolve(JSON.stringify(result));
            }).catch(function (error) {
                return reject("Error unable to read data" + error);
            });
        });
    };
    /**
     * API to get List of UserLocation based zipCode
    * */
    MongoDatabaseImpl.prototype.getListLocation = function (collectionName, zipCode) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var pipeLine = [
                // De-normalize the array content
                { "$unwind": "$masterStores" },
                { "$unwind": "$masterStores.userLocation" },
                {
                    "$match": { "masterStores.zipCode": zipCode }
                },
                {
                    "$group": {
                        "_id": {
                            "_id": "$_id",
                        },
                        "userLoc": { "$push": "$masterStores.userLocation.userLoc" }
                    }
                },
                {
                    "$group": {
                        "_id": "$_id._id",
                        "userLoc": {
                            "$first": "$userLoc"
                        } } }];
            var pipeLine2 = [
                // De-normalize the array content
                { "$unwind": "$masterStores" },
                { "$unwind": "$masterStores.userLocation" },
                {
                    "$group": {
                        "_id": {
                            "_id": "$_id",
                        },
                        "userLoc": { "$push": "$masterStores.userLocation.userLoc" }
                    } },
                {
                    "$group": {
                        "_id": "$_id._id",
                        //"userLoc" : "$_id.userLoc",
                        "userLoc": {
                            "$first": "$userLoc"
                        } } }];
            if (zipCode == null) {
                _this.getCollection(collectionName).then(function (collection) {
                    _this.aggregateResult(collectionName, pipeLine2).then(function (response) {
                        return resolve(response);
                    }).catch(function (error) {
                        return reject("Unable to get result");
                    });
                });
            }
            else {
                _this.getCollection(collectionName).then(function (collection) {
                    _this.aggregateResult(collectionName, pipeLine).then(function (response) {
                        return resolve(response);
                    }).catch(function (error) {
                        return reject("Unable to get result");
                    });
                });
            }
        });
    };
    /**
     * API Used for find Location based on Store Name
     * @return Json response data from find store location
     * */
    MongoDatabaseImpl.prototype.findLocationBasedOnStoreName = function (collectionName, locationParameter) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var pipeline1 = [
                // Unwind each array:Deconstructs an array field from the input documents to output a document for each element
                { "$unwind": "$masterStores" },
                { "$unwind": "$masterStores.userLocation" },
                { "$unwind": "$masterStores.userLocation.stores" },
                // {"$unwind": "$masterStores.userLocation"},
                // Match possible documents
                // Filter just the matching elements
                {
                    "$match": {
                        "masterStores.userLocation.userLoc": locationParameter.userLoc,
                        "masterStores.userLocation.stores.storename": locationParameter.storename,
                        "masterStores.userLocation.stores.miles": { $lte: locationParameter.miles }
                    }
                },
                // Group to inner array
                {
                    "$group": {
                        "_id": {
                            "_id": "$_id",
                            "zipCode": "$masterStores.zipCode",
                            "userLoc": "$masterStores.userLocation.userLoc"
                        },
                        "location": { "$push": "$masterStores.userLocation.stores.location" },
                        "miles": { "$push": "$masterStores.userLocation.stores.miles" }
                    }
                },
                // Group to outer array
                {
                    "$group": {
                        "_id": "$_id._id",
                        //  "userLoc" : "$_id.userLoc",
                        "masterStores": {
                            "$push": {
                                "zipCode": "$_id.zipCode",
                                "location": "$location",
                                "miles": "$miles"
                            }
                        }
                    }
                }
            ];
            var pipeline2 = [
                // Unwind each array:Deconstructs an array field from the input documents to output a document for each element
                { "$unwind": "$masterStores" },
                { "$unwind": "$masterStores.userLocation" },
                { "$unwind": "$masterStores.userLocation.stores" },
                // Match possible documents
                // Filter just the matching elements
                {
                    "$match": {
                        "masterStores.zipCode": locationParameter.zipCode,
                        "masterStores.userLocation.userLoc": locationParameter.userLoc,
                        "masterStores.userLocation.stores.storename": locationParameter.storename,
                        "masterStores.userLocation.stores.miles": { $lte: locationParameter.miles }
                    }
                },
                // Group to inner array
                {
                    "$group": {
                        "_id": {
                            "_id": "$_id",
                            "zipCode": "$masterStores.zipCode",
                        },
                        "location": { "$push": "$masterStores.userLocation.stores.location" },
                        "miles": { "$push": "$masterStores.userLocation.stores.miles" }
                    }
                },
                // Group to outer array
                {
                    "$group": {
                        "_id": "$_id._id",
                        //  "userLoc" : "$_id.userLoc",
                        "masterStores": {
                            "$push": {
                                // "zipCode": "$_id.zipCode",
                                "location": "$location",
                                "miles": "$miles"
                            }
                        }
                    }
                }
            ];
            _this.getCollection(collectionName).then(function (collection) {
                if (locationParameter.zipCode === null) {
                    _this.aggregateResult(collectionName, pipeline1).then(function (response) {
                        resolve(MongoDatabaseImpl.parseLocationData(response));
                    });
                }
                else {
                    _this.aggregateResult(collectionName, pipeline2).then(function (response) {
                        resolve(MongoDatabaseImpl.parseLocationData(response));
                    });
                }
            }).catch(function (error) {
                return reject("Unable to get result");
            });
        });
    };
    /*db.getCollection('shops').update(
     {"_id": 1},
     {$addToSet: {
     "masterStores" :
     {

     "zipCode" : "2220-0101",
     "userLocation" : [
     {
     "userLoc" : "jw-marriot",
     "stores" : [
     {
     "storename" : "subway",
     "miles" : 10,
     "location" : "BOSTON CITY HALL"
     }
     ]
     }]


     }
     }
     })
     */
    MongoDatabaseImpl.prototype.UpdateNewMasterStore = function (collectionName, masterStores, id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _id = null;
            var id_query = null;
            var update_query = {
                "$push": {
                    masterStores: masterStores
                }
            };
            _this.getObjectId(collectionName).then(function (result) {
                console.log(result);
                _id = result._id;
            }).then(function () {
                // console.log(masterStores.zipCode);
                console.log("got id:" + _id);
                id_query = { "_id": new ObjectID(_id) };
                _this.getCollection(collectionName).then(function (collection) {
                    collection.findOneAndUpdate(id_query, update_query).
                        then(function (result) {
                        if (result.ok === 1) {
                            return resolve(result);
                        }
                        else {
                            return reject("Error");
                        }
                    }).catch(function (error) {
                        return reject("Error:" + collectionName);
                    });
                });
            });
        });
    };
    /*** API used to add New Stores***/
    MongoDatabaseImpl.prototype.addNewStoresToExistDb = function (collectionName, masterStores) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getCollection(collectionName).then(function (collection) {
                var _id;
                var insert_query = {
                    masterStores: masterStores
                };
                collection.count(collectionName).then(function (collectionCount) {
                    if (collectionCount == 0) {
                        //action =first Time insert
                        return collection.insertOne(insert_query).then(function (result) {
                            if (result.result.ok === 1 && result.result.n === 1) {
                                return resolve(JSON.stringify({ info: "Successfully added data" }));
                            }
                            else
                                return reject("Error:" + collectionName);
                        }).catch(function (error) {
                            return reject("Error:" + collectionName);
                        });
                    }
                    else {
                        //action =Insert  on same objectId
                        console.log("1", masterStores);
                        for (var _i = 0, masterStores_1 = masterStores; _i < masterStores_1.length; _i++) {
                            var masterStore = masterStores_1[_i];
                            console.log("result----->:", masterStore);
                            _this.UpdateNewMasterStore(collectionName, masterStore).then(function (result) {
                                console.log("result----->:", result);
                                return resolve(JSON.stringify({ info: "Successfully added data" }));
                            }).catch(function (error) {
                                return reject("Error occurred");
                            });
                        }
                    }
                });
            });
        });
    };
    /**
     * API to get zip code List
     *
     * **/
    MongoDatabaseImpl.prototype.getZipCodeList = function (collectionName) {
        var _this = this;
        return new Promise(function (reject, resolve) {
            var pipeline = [
                // De-normalize the array content
                { "$unwind": "$masterStores" },
                { "$unwind": "$masterStores.userLocation" },
                {
                    "$group": {
                        "_id": {
                            "_id": "$_id",
                        },
                        "zipCode": { "$push": "$masterStores.zipCode" }
                    }
                },
                {
                    "$group": {
                        "_id": "$_id._id",
                        "zipCode": {
                            "$first": "$zipCode"
                        }
                    }
                }
            ];
            _this.getCollection(collectionName).then(function (collection) {
                var d = [];
                _this.aggregateResult(collectionName, pipeline).then(function (response) {
                    d = MongoDatabaseImpl.parseZipCodeListData(response);
                    resolve.all(d);
                });
                console.log("resolve d");
            }).catch(function (error) {
                return reject("Unable to get result");
            });
        });
    };
    MongoDatabaseImpl.parseZipCodeListData = function (response) {
        var data = JSON.parse(response);
        var zipCodeList = [];
        for (var item in data) {
            return (JSON.stringify(data[item].zipCode));
        }
    };
    MongoDatabaseImpl.parseLocationData = function (response) {
        var data = JSON.parse(response);
        var jsonRes;
        var findLocationArray = [];
        for (var item in data) {
            var stores = data[item].masterStores;
            for (var store in stores) {
                //when there is no zipCode
                if (!!stores[store].zipCode) {
                    findLocationArray.push({ zipCode: stores[store].zipCode, location: stores[store].location, miles: stores[store].miles });
                }
                else {
                    findLocationArray.push({ location: stores[store].location, miles: stores[store].miles });
                }
                jsonRes = { responseModel: findLocationArray };
            }
            return JSON.stringify(jsonRes.responseModel);
        }
    };
    return MongoDatabaseImpl;
}());
exports.MongoDatabaseImpl = MongoDatabaseImpl;
//# sourceMappingURL=MongoDatabaseImpl.js.map