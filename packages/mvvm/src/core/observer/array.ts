/**
 * 劫持array方法 
*/
export const arrayMethods=Object.create(Array.prototype);
export const arrayMethodNames=['shift','unshift','push','pop','slice','splice'];
arrayMethodNames.forEach(name=>{
    let orgMethod=arrayMethods[name];
    arrayMethods[name]=function(...args:Array<any>){

    }
})

