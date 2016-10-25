/**
 * Created by IndraniS on 10/14/2016.
 */
import {IAuth} from "./IAuth";
import {AuthModule} from "./AuthModule";
import {IAuthenticateResponse} from "./IAuthenticateResponse";
import {ISigmaIdpOptions} from "./ISigmaIdpOptions";



var sigmaIdpOpts:ISigmaIdpOptions = {
   protocol:"http",
   host:"localhost",
   port:8090

};


let auth:IAuth;
auth=new AuthModule();

auth.authenticate("sam","welcome",sigmaIdpOpts).then((authResponse:IAuthenticateResponse)=>{
   console.log("response from the authenticate API:",authResponse);
   
});