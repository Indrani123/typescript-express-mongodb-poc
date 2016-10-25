/**
 * Created by IndraniS on 10/14/2016.
 */
export interface  IAuthenticateResponse{
    tokenId: string;
    code: string;
    user? : any;
    reason?: string;
    message?: string;

}