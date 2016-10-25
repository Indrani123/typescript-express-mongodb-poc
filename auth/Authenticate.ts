/**
 * Created by IndraniS on 10/20/2016.
 */
import * as express from "express";
import {IAuth} from "./IAuth";
import {AuthModule} from "./AuthModule";
import {IAuthenticateResponse} from "./IAuthenticateResponse";
import {sigmaIdpOpts} from "../config";


export class Authenticate {

    static isAuthenticated:boolean = false;

    constructor() {
    }

    /*Middle ware for storing sigma A&A session*/
    public static setSessionStore(req:express.Request, res:express.Response, next:Function):void{

            let username = req.body.username;
            let password = req.body.password;
            let auth:IAuth;
            auth = new AuthModule();

            if (Authenticate.isAuthenticated) {
                next();
            }
            else {
                auth.authenticate(username, password, sigmaIdpOpts).then((authResponse:IAuthenticateResponse)=> {

                        if(authResponse.tokenId!=null) {
                            res.cookie("sigmaIdpSSOToken", authResponse.tokenId, {maxAge: 100000});

                            Authenticate.isAuthenticated = true;
                        }

                    next();
                }).catch((error:any)=> {
                    Authenticate.isAuthenticated=false;
                    console.log("Unable to set cookies");
                })
            }
        }
    /*Middle ware for removing sigma A&A session*/
    public static removeSessionStore(req:express.Request, res:express.Response, next:Function):void{

    }

    }
