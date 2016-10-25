import {MongoDatabaseImpl} from "./MongoDatabaseImpl";
import {MasterStore} from "../model/MasterStore";
import {IFindLocation} from "../interfaces/Iquery/IFindLocation";
/**
 * Created by IndraniS on 10/24/2016.
 */

import {daoConfig} from "../config";


    export namespace FactoryDaoPattern {

        export interface Idao {

            getCollection(collectionName:string):Promise<any>;
            addObject(collectionName:string, data:any):Promise<any>;
            addAll(collectionName:string, ...data:any[]):Promise<any>;
            readObject(collectionName:string, queryByName:string, fields?:any):Promise<any>;
            readAll(collectionName:string, fields:any):Promise<any>;
            getDb():Promise<any>;
            deleteObject(collectionName:string, match:any):Promise<any>;
            deleteAll(collectionName:string, filter?:any):Promise<any>;
            getObjectId(collectionName:string, query:string):Promise<string>;
            aggregateResult(collectionName:string, pipeline:any):Promise<any>;
            
            /*** API used to add New Stores**
             * */
            addNewStoresToExistDb(collectionName: string,masterStores: Array<MasterStore>):Promise<any>;
            /**
             * API to get List of UserLocation based zipCode
             * */
            getListLocation(collectionName: string, zipCode?: string):Promise<any>;

            /**
             * API Used for find Location based on Store Name
             * @return Json response data from find store location
             * */
            findLocationBasedOnStoreName(collectionName: string, locationParameter:IFindLocation):Promise<any>


        }
        export class DaoFactory {
            public static getDao(type:string):Idao {
                if (type === "mongo") {
                    return new MongoDatabaseImpl(daoConfig.host, daoConfig.port, daoConfig.COLLECTION_NAME);
                }

                return null;
            }
        }
    }
