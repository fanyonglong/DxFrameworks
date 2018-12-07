// @flow
import {hasOwn} from '../util'

type extendClass={
    constructor?:Function  
}
export function inherits(subClass:Function, superClass:Function){

}


export class Class{
    constructor(){

    }
    static extend(proto:extendClass):Function{
        let subClass=hasOwn(proto,'constructor')?proto.constructor:function(){

        };
        inherits(subClass,this);
        return subClass;
    }
}