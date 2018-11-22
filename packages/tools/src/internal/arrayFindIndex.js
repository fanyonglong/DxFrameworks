
import arraySome from './arraySome'
export default function arrayFindIndex(array,predicate){
    let index=-1;
    arraySome(array,(value,i,array)=>{
        if(predicate(value,i,array)===true){
            index=i;
            return true;
        }
    })
    return index;
}