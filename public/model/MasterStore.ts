

import {IUserLocation} from "../../interfaces/IUserLocation";

/**
 * Created by IndraniS on 9/27/2016.
 */
    
export class MasterStore {
    zipCode:string;
    userLocation:Array<IUserLocation>
    
    constructor(zipCode:string,userLocation:IUserLocation[]){
        this.zipCode=zipCode;
        this.userLocation=userLocation;
    }

    public toString():string{
        return "storename:"+this.zipCode +"," +"stores" +this.userLocation;

    }
}