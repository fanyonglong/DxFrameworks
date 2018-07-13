
 export * from './env'
 export * from '../../shared/util'

 export function deifneReadonly()
 {

 }
/**
 * 定义一个属性
 * @param target 
 * @param key 
 * @param value 
 * @param enumerable 属性是否可迭代 默认：false 
 */
 export function defineProp(target:any,key:string|number|symbol,value:any,enumerable:boolean=false)
 {
        Object.defineProperty(target,key,{
            enumerable:enumerable,
            configurable:true,
            writable:true,
            value:value
        })
 }

