
/**
 * Created by IndraniS on 9/23/2016.
 */
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import {IFindLocation} from "./interfaces/Iquery/IFindLocation";
import {IUserLocationResponse} from "./interfaces/Iresponse/IUserLocationResponse";
import {IAddStore} from "./interfaces/Iquery/IAddStore";
import {Authenticate} from "./auth/Authenticate";

import {FactoryDaoPattern} from "./dao/FactoryDaoPattern";


let es6promise=require('es6-promise');
let Promise=es6promise.Promise;

let app=express();
let COLLECTION_NAME="shops";

let dao: FactoryDaoPattern.Idao = FactoryDaoPattern.DaoFactory.getDao("mongo");


app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser('secret'));


app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/findstores', function (req, res) {
    let storeName = req.body.storename;
    let miles = req.body.miles;
    let zipCode = req.body.zipCode || null;
    let userLoc = req.body.userLoc;

    var findStoresOpts:IFindLocation;

    findStoresOpts = {storename: storeName, miles: miles, zipCode: zipCode, userLoc: userLoc};
    console.log("finsStoreOpts:" + findStoresOpts.storename);
    console.log("finsStoreOpts:" + findStoresOpts.miles);
    console.log("finsStoreOpts:" + findStoresOpts.zipCode);

    dao.findLocationBasedOnStoreName(COLLECTION_NAME, findStoresOpts).then(function (result) {
        if (typeof result != "undefined") {
            console.log(typeof result)
            res.send(result);
        }
        else {
            res.send({ErrorMsg: "location not found for store" + storeName});
        }
    });
});

app.get('/getUserLoc/:zipCode?',function (req, res) {
    let zipCode = req.params.zipCode||null;
    //model the response data
    let userLocResponse:IUserLocationResponse;

    dao.getListLocation(COLLECTION_NAME, zipCode).then((result:any)=> {
        let jsoData=JSON.parse(result);
        userLocResponse={userLoc:jsoData[0].userLoc};
        res.send(userLocResponse);

    });

});

app.post('/addUpdateStore', function (req, res) {
    //Do it on post data
    let masterStore=req.body.masterStores;
   //model this data using the
    let storesData:IAddStore;
    storesData = {masterStores:masterStore};
    console.log("storeData--->"+storesData);
    dao.addNewStoresToExistDb(COLLECTION_NAME,storesData.masterStores).then((result:any)=>{
        console.log("result:"+result);
        let response=JSON.parse(result);
        res.send({response});
    });
});

app.post('/signIn',Authenticate.setSessionStore, function (req, res) {
    
   if(Authenticate.isAuthenticated){
       res.status(200).send('authenticated success');
   }
    else{
       res.status(401).send('unauthorized');
   }
  
});

let server = app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
