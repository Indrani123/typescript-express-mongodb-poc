
/**
 * Created by IndraniS on 9/26/2016.
 */
import {IUser} from '../../interfaces/IUser';


export class User implements IUser {
    name:string;
    password:string;
    email:string;
   

    constructor(name:string,password:string,email:string){
        this.name=name;
        this.password=password;
        this.email=email;
    }


    toString():string{
        return "["+"user:"+this.name +"," +"email:"+this.email+"]";
    }

}