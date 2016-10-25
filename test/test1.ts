/**
 * Created by IndraniS on 9/26/2016.
 */

import {MongoDatabaseImpl} from "../dao/MongoDatabaseImpl.ts";
import {User} from "../model/User";

const COLLECTION_NAME="framework-contracts-user";

let dao= new MongoDatabaseImpl("localhost",27017,"framework-contracts-user");
let u1=new User("Sherya","welcome","isen@gmail.com");
let u2=new User("Indrani","welcome","isen@gmail.com");

/*Used for add Obe Object  one */
dao.addObject(COLLECTION_NAME,u1).then((result:User)=>{
    console.log("result:"+result);
});

/*Used for adding multiple Objects */

dao.addAll(COLLECTION_NAME,u1,u2).then((result:User)=>{
    console.log("result:"+result);
});



/*Used for reading one  single object*/
dao.readObject(COLLECTION_NAME,"Indrani").then((result:any)=>{
    for (let item of result) {
        console.log(item);
    }
});

/*Used for reading multiple  single object*/
dao.readAll(COLLECTION_NAME).then((result:any)=>{
    for (let item of result) {
        console.log(item);
    }
});

/*Used for deleting one  single object*/
dao.deleteObject(COLLECTION_NAME,"Shreya").then((result:any)=>{
    for (let item of result) {
        console.log(item);
    }
});

/*Used for deleting all data*/
dao.deleteAll(COLLECTION_NAME);





