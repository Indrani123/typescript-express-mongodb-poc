/**
 * Created by IndraniS on 9/27/2016.
 */
export class Stores implements  IStores{
    storename:string;
    miles:number;
    location:string;
    
    constructor(storename:string,miles:number,location:string) {
        this.storename=storename;
        this.miles=miles;
        this.location=location;
    }
    
    public toString():string{
        return "storename:"+this.storename +"," +"miles:" +this.miles+"," +this.location;
        
    }
}