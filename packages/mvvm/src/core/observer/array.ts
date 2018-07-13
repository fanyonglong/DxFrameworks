/**
 * 劫持array方法 
*/
const arrayMethods=Object.create(Array.prototype);
const methodNames=['shift','unshift','push','pop','slice','splice'];
methodNames.forEach(name=>{
    let orgMethod=arrayMethods[name];
    arrayMethods[name]=function(){
        
    }
})