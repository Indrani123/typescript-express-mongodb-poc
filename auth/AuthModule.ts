/**
 * Created by IndraniS on 10/14/2016.
 */

import {IAuth} from "./IAuth";
import * as rp from "request-promise";
import {IAuthenticateResponse} from "./IAuthenticateResponse";
import {ISigmaIdpOptions} from "./ISigmaIdpOptions";

export class AuthModule implements IAuth {

    public  authenticate(username:string, password:string, sigmaIdpOpts:ISigmaIdpOptions):Promise<IAuthenticateResponse> {
        return new Promise((resolve, reject)=> {
            let authResponse:IAuthenticateResponse=null;
            var options = {
                method: 'POST',
                uri:  sigmaIdpOpts.protocol+"://"+sigmaIdpOpts.host+":"+sigmaIdpOpts.port+
                '/saml-idp/api/authenticate',
                headers: {
                    'X-SigmaIDP-Username':new Buffer(username).toString('base64'),
                    'X-SigmaIDP-Password':new Buffer(password).toString('base64'),
                    'Content-type': 'application/json'
                },
                body: {

                },
                json: true
            };
            rp(options)
                .then(function (response) {
                    
                    if(response.tokenId!=null && response.user!=null) {

                        authResponse = {tokenId: response.tokenId, user: response.user,
                            code: response.code};
                        resolve(authResponse);
                    }
                    else
                    {   
                        authResponse={tokenId:response.tokenId,user:response.user,
                            code:response.code,message:response.message,reason:response.reason};
                        resolve(authResponse);
                    }
          
                })
                .catch(function (err) {
                    
                    reject("Authentication failed");
                });
        })

    }

    public validateToken(ssoToken:string, httpOpts:any):Promise<any> {
        return new Promise((resolve, reject)=> {
            rp(httpOpts)
                .then(function (parsedBody) {
                    resolve(parsedBody)
                })
                .catch(function (err) {
                    reject("Authentication failed");
                });

        })
    }
    
    
}
