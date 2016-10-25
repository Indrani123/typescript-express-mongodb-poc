/**
 * Created by IndraniS on 9/27/2016.
 */

/*
import {Stores} from "../model/Stores";
import {MasterStore} from "../model/MasterStore";
import {MasterStoreList} from "../model/MasterStoreList";
import {MongoDatabaseImpl} from "../dao/MongoDatabaseImpl.ts";

import {IFindLocation} from "../interfaces/Iquery/IFindLocation";
import {IUserLocation} from "../interfaces/IUserLocation";
import {ifError} from "assert";

let store:Array<IStores>=[];
let store2:Stores[]=[];
const COLLECTION_NAME="shops";

/!*
//Insert Stoire data

store2.push(new Stores("seven-evleven",10,"REGISTRY OF BIRTHS & DEATHS"));
store2.push(new Stores("seven-evleven",15,"OFFICE OF THE PARKING CLERK"));
store2.push(new Stores("horiton",5,"ELECTIONS"));


let lstSTores=new MasterStore("02201-1020",store);

let massterstore:MasterStore[]=[];
    massterstore.push(new MasterStore("02201-1020",store));
     massterstore.push(new MasterStore("02201-2006",store2));

let lstOfStores = new MasterStoreList(massterstore);*!/


let dao= new MongoDatabaseImpl("localhost",27017,COLLECTION_NAME);


/!*Test to get location based on storename with i the limit miles or based on zipcode,storename and miles*!/
let storename="subway";
let miles=10;
let zipCode="1111";

let locationFindParameters1 ={storename,miles,zipCode};

let locationFindParameters2 ={storename,miles};

//WithZipCode
/!*dao.findLocationBasedOnStoreName(COLLECTION_NAME,locationFindParameters1).then((result:any)=>{
   // console.log("got output from the Dao:",result);
    let data=JSON.parse(result);
    let masterStores=data[0].masterStores;
    let storesData=JSON.stringify(masterStores);
    let locationData=JSON.parse(storesData);
    console.log("location of the store with zipcode:",locationData[0].stores[0].location);
    
});

//WithoutZipCode
dao.findLocationBasedOnStoreName(COLLECTION_NAME,locationFindParameters2).then((result:any)=>{
  //  console.log("got output from the Dao:",result);
    let data=JSON.parse(result);
    let masterStores=data[0].masterStores;
    let storesData=JSON.stringify(masterStores);
    let locationData=JSON.parse(storesData);

    for(let location of locationData){
        console.log("without zipcode",location);
    }
})*!/;



//console.log(_id);

let userLocationArray:Array<IUserLocation>=[];
let demoUserLocation:IUserLocation;
let userLocation:string="Fergussan-road";

store.push(new Stores("mac-D",10,"BOSTON CITY HALL"));
store.push(new Stores("pizzahut",15,"Link RECORDS"));
store.push(new Stores("chezianno",5,"SB"));

demoUserLocation={userLoc:userLocation,stores:store};

userLocationArray.push(demoUserLocation);

let massterstore:Array<MasterStore>=[];
massterstore.push(new MasterStore("02201-1020",userLocationArray));



/!*db.getCollection('shops').update(
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
 *!/


/!*
dao.addNewStoresToExistDb(COLLECTION_NAME,massterstore).then((result:any)=>{
    console.log("get result",result);
});
*!/

dao.getZipCodeList(COLLECTION_NAME).then((result:any)=>{
   console.log("IN zipCode list response")
   for(let item in result){
       console.log("item",result[item]);
   }
});
*/


function identity<T>(arg: T): T {
    return arg;
}
let output = identity<string>("myString");
let output2 = identity<number>(1);

console.log(typeof output)
console.log(typeof output2)
