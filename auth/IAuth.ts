/**
 * Created by IndraniS on 10/14/2016.
 */

import {IAuthenticateResponse} from "./IAuthenticateResponse";
import {ISigmaIdpOptions} from "./ISigmaIdpOptions";

export interface IAuth {

        authenticate(username:string, password:string, sigmaIdpOpts:ISigmaIdpOptions):Promise<IAuthenticateResponse>;
        validateToken(ssoToke:string,httpOpts:any):Promise<any>;


}
