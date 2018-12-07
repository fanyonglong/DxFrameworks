/**
 * 执行n次回调函数
 * @param {number} n 
 * @param {function} fn 
 */
export default function before(n,fn){
    let result;
    return function(){
        if(n-->0){
            result=fn.apply(this,arguments)
        }
        return result;
    }
}