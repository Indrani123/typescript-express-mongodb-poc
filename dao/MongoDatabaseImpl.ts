/**
 * Created by IndraniS on 9/26/2016.
 */

import * as mongodb from "mongodb";
import {FactoryDaoPattern} from "./FactoryDaoPattern"
import {IFindLocation} from "../interfaces/Iquery/IFindLocation";
import {IFindLocationResponse} from "../interfaces/Iresponse/IFindLocationResponse";
import {IFindStoreLocationModel} from "../model/IFindStoreLocationModel";
import {MasterStore} from "../model/MasterStore";

var mongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var es6promise=require('es6-promise');
let Promise=es6promise.Promise;



export class MongoDatabaseImpl implements  FactoryDaoPattern.Idao {

    private connectionString:string;
    private db:mongodb.Db;
    private static forcedClose:boolean;
 
    constructor(serverName?: string, port?: number, databaseName?: string) {
        serverName = serverName || "localhost";
        port = port || 27017;
        databaseName = databaseName || "shops";
        MongoDatabaseImpl.forcedClose = false;
        this.connectionString = "mongodb://" + serverName + ":" + port + "/" + databaseName;
    }

    /* var collection = db.collection('test');*/
    public getCollection(collectionName: string):Promise<mongodb.Collection> {
        return new Promise((resolve, reject) => {
            this.getDb().then((db:mongodb.Db) => {
                return resolve(db.collection(collectionName));
            }).catch((error:any)=> {
                let context:any = {
                    collectionName: collectionName,
                    error: error
                };
                return reject("Error unable to get collection" + collectionName + "," + error);

            });
        });
    }

    /**
     *
     *insert data on server start*/
    public  addObject(collectionName: string, data: any):Promise<any> {
        return new Promise((resolve, reject)=> {
            this.getCollection(collectionName).then((collection:mongodb.Collection)=> {
                //insert data to MongoDb Collection
                return collection.insertOne(data).then((result:mongodb.InsertOneWriteOpResult)=> {
                    if (result.result.ok === 1 && result.result.n === 1) {
                        return resolve(result.ops[0]);
                    }
                    else {
                        let context:any = {
                            collection: collectionName
                        };
                        return reject("Error:" + collectionName);
                    }
                }).catch((error:any) => {
                    return reject("Error:" + collectionName);
                });
            });
        });
    }


    /*Used for adding all multiple*/
    public  addAll(collectionName: string, ...data: any[]):Promise<any> {
        return new Promise((resolve, reject)=> {
            this.getCollection(collectionName).then((collection:mongodb.Collection)=> {
                //insert data to MongoDb Collection
                return collection.insertMany(data).then((result:mongodb.InsertWriteOpResult)=> {
                    if (result.result.ok === 1 && result.result.n === 1) {
                        return resolve(result.ops[0]);
                    }
                    else {
                        let context:any = {
                            collection: collectionName
                        };
                        return reject("Error:" + collectionName);
                    }
                }).catch((error:any) => {
                    return reject("Error:" + collectionName);
                });
            });
        });
    }


    /*Used for Read all entries in DB*/
    public readAll(collectionName: string, fields?: any):Promise<any> {
        return new Promise((resolve, reject)=> {
            let cursor:mongodb.Cursor = null;
            this.getCollection(collectionName).then((collection:mongodb.Collection)=> {
                /*collection.find().then((result:any)=> {
                 return resolve(result);
                 });*/

                cursor = collection.find().limit(10).project(fields);
                return cursor.toArray();
            }).then((documents:Array<any>)=> {
                if (documents.length > 0) {
                    return resolve(documents[0]);
                }
                else {
                    return resolve(null);
                }
            }).catch((error:any)=> {
                return reject("Error unable to read data");
            });
        });
    }

    /*get MongoDatabaseImpl*/
    public getDb():Promise<mongodb.Db> {
        return new Promise((resolve, reject)=> {
            if (MongoDatabaseImpl.forcedClose) {
                let context:any = {
                    connectionString: this.connectionString
                };
                return reject("Error unable to get DB" + context);
            }
            else if (this.db && typeof this.db !== 'undefined') {
                return resolve(this.db);
            }
            else {
                mongoClient.connect(this.connectionString)
                    .then((db:mongodb.Db) => {
                        this.db = db;
                        this.db.on("close", this.onClose);
                        return resolve(this.db);

                    }).catch((error:any) => {
                    let context:any = {
                        connectionString: this.connectionString,
                        error: error
                    };
                    return reject("Db error" + context.error + "connec tstr" + context.connectionString);
                });
            }
        });
    }

    /*handle close event when mongo is closed*/
    private onClose():void {
        console.log("closing DB conn....");
        MongoDatabaseImpl.forcedClose = true;
    }


    /*Delete one single object*/
    public deleteObject(collectionName: string, match: any):Promise<any> {
        return new Promise((resolve, reject)=> {
            this.getCollection(collectionName).then((collection:mongodb.Collection)=> {
                let query = {name: match};
                return collection.deleteOne(match, {});
            }).then((result:mongodb.DeleteWriteOpResultObject) => {

                if (result.result.ok === 1) {
                    return resolve(result);
                }
                else {
                    let context:any = {
                        collection: collectionName
                    };

                    return reject("Error occurred while deletion");
                }
            });
        })
    }
    
    /*Used for deleting multiple object*/
    public deleteAll(collectionName: string, filter?: any):Promise<any> {

        return new Promise((resolve, reject)=> {

            this.getCollection(collectionName).then((collection:mongodb.Collection)=> {

                collection.deleteMany(filter);
            }).then((result:any) => {
                if (result.result.ok === 1) {
                    return resolve(result);
                }
            }).catch((error:any)=> {
                return reject("Error unable to delete records:" + error);
            })
        });
    }

    public  getObjectId(collectionName: string):Promise<any> {
        return new Promise((resolve, reject)=> {
            this.readObject(collectionName).then((result:any)=> {
                if(result!=null) {
                    let d = JSON.parse(result);
                    return resolve(d);
                }
                else{
                    return null;
                }
            
            }).then((result:any)=>{
                if(result!=null) {
                    let d = JSON.parse(result);
                    return resolve(d);
                }
            }).catch((error:any)=> {
                return reject("Error occurred" + error);
            })
        });
    }

    /*Read data from mongoDb collections ie
     *                 collection.findOne({mykey:1}, function(err, item) {});;
     */

    public readObject(collectionName: string, queryByName?: string, fields?: any):Promise<any> {
        return new Promise((resolve, reject)=> {

            let cursor:mongodb.Cursor = null;

            this.getCollection(collectionName).then((collection:mongodb.Collection)=> {
                cursor = collection.find({});
                return cursor.toArray();
            }).then((documents:Array<any>)=> {
                if (documents.length > 0) {
                    return resolve(JSON.stringify(documents[0]));
                }
                else {
                    return resolve(null);
                }
            }).catch((error:any)=> {
                return reject("Error unable to read data");
            });
        });
    }
    
    /**
     * Perform aggregate operation
     * */
    
    public aggregateResult(collectionName: string,pipeline: any):Promise<any>{
        return new Promise((resolve,reject)=>{
            let cursor:mongodb.AggregationCursor=null;
            this.getCollection(collectionName).then((collection:mongodb.Collection)=>{
                cursor=collection.aggregate(pipeline);
                return cursor.toArray();
            }).then((result:Array<any>)=> {
            return resolve(JSON.stringify(result));

            }).catch((error:any)=> {
                return reject("Error unable to read data"+error);
            });
        });
    }
    /**
     * API to get List of UserLocation based zipCode
    * */
    public getListLocation(collectionName: string, zipCode?: string):Promise<any>{
    return new Promise((resolve,reject)=>{
            let pipeLine=[
                // De-normalize the array content
                { "$unwind": "$masterStores" },
                { "$unwind": "$masterStores.userLocation"},
                {
                    "$match": {"masterStores.zipCode": zipCode}
                },
                {    // Group to inner array
                    "$group": {
                        "_id": {
                            "_id": "$_id",
                        },
                        "userLoc": { "$push": "$masterStores.userLocation.userLoc"}
                    }
                },
                {// Group to outer array
                    "$group": {
                        "_id": "$_id._id",
                         "userLoc": {
                            "$first":
                                "$userLoc"
                        }}}]
        let pipeLine2=[
            // De-normalize the array content
            { "$unwind": "$masterStores" },
            { "$unwind": "$masterStores.userLocation"},
            {// Group to inner array
                "$group": {
                    "_id": {
                        "_id": "$_id",
                    },
                    "userLoc": { "$push": "$masterStores.userLocation.userLoc"}
                }},
            {// Group to outer array
                "$group": {
                    "_id": "$_id._id",
                    //"userLoc" : "$_id.userLoc",

                    "userLoc": {
                        "$first":
                            "$userLoc"
                    }}}]
        if(zipCode==null){
            this.getCollection(collectionName).then((collection:mongodb.Collection)=>{
                this.aggregateResult(collectionName,pipeLine2).then((response:any)=>{
                    return  resolve(response);
                }).catch((error:any)=>{
                    return reject("Unable to get result");
                })
            })
        }
        else {
            this.getCollection(collectionName).then((collection:mongodb.Collection)=> {
                this.aggregateResult(collectionName, pipeLine).then((response:any)=> {
                    return resolve(response);
                }).catch((error:any)=> {
                    return reject("Unable to get result");
                })

            })
        }
            
     })
}
    /**
     * API Used for find Location based on Store Name
     * @return Json response data from find store location
     * */
    public findLocationBasedOnStoreName(collectionName: string, locationParameter:IFindLocation):Promise<any> {
        return new Promise((resolve, reject) => {
            let pipeline1 =[
                // Unwind each array:Deconstructs an array field from the input documents to output a document for each element
                {"$unwind": "$masterStores"},
                {"$unwind": "$masterStores.userLocation"},
                {"$unwind": "$masterStores.userLocation.stores"},
                // {"$unwind": "$masterStores.userLocation"},
                // Match possible documents
                // Filter just the matching elements
                {
                    "$match": {
                        "masterStores.userLocation.userLoc":locationParameter.userLoc,
                        "masterStores.userLocation.stores.storename": locationParameter.storename,
                        "masterStores.userLocation.stores.miles": {$lte: locationParameter.miles}
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
                                "miles":   "$miles"
                            }
                        }
                    }
                }
            ]
            let pipeline2 = [
                // Unwind each array:Deconstructs an array field from the input documents to output a document for each element
                {"$unwind": "$masterStores"},
                {"$unwind": "$masterStores.userLocation"},
                {"$unwind": "$masterStores.userLocation.stores"},
                // Match possible documents
                // Filter just the matching elements
                {
                    "$match": {
                        "masterStores.zipCode":locationParameter.zipCode,
                        "masterStores.userLocation.userLoc":locationParameter.userLoc,
                        "masterStores.userLocation.stores.storename": locationParameter.storename,
                        "masterStores.userLocation.stores.miles": {$lte: locationParameter.miles}
                    }
                },
                // Group to inner array
                {
                    "$group": {
                        "_id": {
                            "_id": "$_id",
                            "zipCode": "$masterStores.zipCode",
                           // "userLoc": "$masterStores.userLocation.userLoc"
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
                                "miles":   "$miles"
                            }
                        }
                    }
                }
            ]

    this.getCollection(collectionName).then((collection:mongodb.Collection)=>{
                
                if(locationParameter.zipCode===null){
                    this.aggregateResult(collectionName,pipeline1).then((response:any)=>{
                        resolve(MongoDatabaseImpl.parseLocationData(response));
                    })
                }
                else{
                    this.aggregateResult(collectionName,pipeline2).then((response:any)=>{
                        resolve(MongoDatabaseImpl.parseLocationData(response));
                    })
                }
            }).catch((error:any)=>{
                return reject("Unable to get result");
            })

        });

    }
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
    public  UpdateNewMasterStore(collectionName: string, masterStores: MasterStore,id?:number):Promise<any> {
        return new Promise((resolve, reject)=> {
            let _id:string = null;
            let id_query:any=null;
            let update_query = {
                "$push": {
                    masterStores
                }
            }
            this.getObjectId(collectionName).then((result:any)=> {
                console.log(result);
                _id = result._id;


            }).then(()=> {
               // console.log(masterStores.zipCode);
                console.log("got id:"+_id);
                 id_query = {"_id":new ObjectID(_id)};
                this.getCollection(collectionName).then((collection:mongodb.Collection)=>{
                   
                    collection.findOneAndUpdate(id_query, update_query).

                    then((result:any) => {
                        if (result.ok === 1) {
                            return resolve(result);
                        }
                        else{
                            return reject("Error");
                        }

                    }).catch((error:any) => {
                        return reject("Error:" + collectionName);
                    })
                })


            })

        })
    }

    /*** API used to add New Stores***/
public  addNewStoresToExistDb(collectionName: string,masterStores: Array<MasterStore>):Promise<any> {
        return new Promise((resolve, reject)=> {
            this.getCollection(collectionName).then((collection:mongodb.Collection)=> {
                let _id:string;

                let insert_query = {
                    masterStores
                }
               
                collection.count(collectionName).then((collectionCount:number)=> {
                    if (collectionCount == 0) {

                       //action =first Time insert
                        return collection.insertOne(insert_query).then((result:mongodb.InsertOneWriteOpResult)=> {
                            if (result.result.ok === 1 && result.result.n === 1) {
                                return resolve(JSON.stringify({info:"Successfully added data"}));
                            }
                            else
                                return reject("Error:" + collectionName);

                        }).catch((error:any) => {
                            return reject("Error:" + collectionName);
                        });
                    }
                    else {
                        //action =Insert  on same objectId
                        console.log("1",masterStores);
                            for(let masterStore of masterStores){ //Need to improve Performance
                                console.log("result----->:",masterStore);
                                this.UpdateNewMasterStore(collectionName, masterStore).then((result:any)=> {
                                    console.log("result----->:",result);
                                    return resolve(JSON.stringify({info:"Successfully added data"}));
                                }).catch((error:any)=>{
                                    return reject("Error occurred");
                                })
                            }
                        
                        
                    }

                })
            })

        })
    }


/**
 * API to get zip code List
 *
 * **/
    public getZipCodeList(collectionName: string):Promise<any>{
        return new Promise((reject,resolve)=>{
            let pipeline=[
                // De-normalize the array content
                { "$unwind": "$masterStores" },
                { "$unwind": "$masterStores.userLocation"},
                {    // Group to inner array
                    "$group": {
                        "_id": {
                            "_id": "$_id",
                        },
                        "zipCode": { "$push": "$masterStores.zipCode"}
                    }
                },
                {// Group to outer array
                    "$group": {
                        "_id": "$_id._id",
                        "zipCode": {
                            "$first":
                                "$zipCode"
                        }
                    }
                }
            ]
            this.getCollection(collectionName).then((collection:mongodb.Collection)=>{
                let d:Array<string>=[];
                this.aggregateResult(collectionName,pipeline).then((response:any)=>{
                    
                   d=MongoDatabaseImpl.parseZipCodeListData(response);
                    resolve.all(d);
                })
                console.log("resolve d");
              
            }).catch((error:any)=>{
                return reject("Unable to get result");
            })
      
        })
}

    
public static parseZipCodeListData(response:any):any{
   
        let data=JSON.parse(response);
        let zipCodeList:Array<string>=[];
        for(let item in data) {
            return (JSON.stringify(data[item].zipCode));
        }
    
}

    
public static parseLocationData(response:any):any{
    let data=JSON.parse(response);
    let jsonRes:IFindLocationResponse<IFindStoreLocationModel>;
    let findLocationArray:Array<IFindStoreLocationModel>=[];
        for(let item in  data){
            let stores=data[item].masterStores;
            for(let store  in stores){
                
                //when there is no zipCode
                if(!!stores[store].zipCode){

                    findLocationArray.push({zipCode:stores[store].zipCode,location:stores[store].location,miles:stores[store].miles});
                }
                else{
                    findLocationArray.push({location:stores[store].location,miles:stores[store].miles});
                }
                jsonRes={responseModel:findLocationArray};
            }
            return JSON.stringify(jsonRes.responseModel);
        }

    }

    
}






