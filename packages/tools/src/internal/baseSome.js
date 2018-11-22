import baseEach from './baseEach'
export default function baseSome(obj,predicate){
    let result=false;
    baseEach(obj,(value,key,obj)=>{
        result=predicate(value,key,obj)
        return !result;
    })
    return !!result;
}