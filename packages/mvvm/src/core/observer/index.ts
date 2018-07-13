/// <reference path="../../../typings/types.d.ts" />
import Dep from './Dep'
import {arrayMethods,arrayMethodNames} from './array'
import {defineProp,hasProto,isObject,hasOwn,isServerRendering,isLikeObject} from '../util'
import {VNode} from '../vdom/vnode'



/**
 * 观察对象属性变化
 */
export class Observer{
    value:any;
    dep:Dep;
    vmCount:number;
    constructor(value:any)
    {
      this.value=value;
      this.dep=new Dep();
      this.vmCount=0;
      defineProp(value,'__ob__',this);
      if(Array.isArray(value))
      {
        let augment:(target:any,proto:any,keys:Array<string>)=>void=hasProto?protoAugment:copyAugment;
        augment(value,arrayMethods,arrayMethodNames);
        this.observerArray(value);
      }else{
        this.walk(value);
      }
    }
    // 编译对象包装成反应
    private walk(obj:Object)
    {
          let keys=Object.keys(obj);
          for (let i = 0,len=keys.length;i < len; i++) {
            defineReactive(obj,keys[i]);
          }
    }
    // 把数组转换成监听数组
    private observerArray(array:Array<any>){
          for (let i = 0,len=array.length;i < len; i++) {
            observe(array[i])       
          }
    }
}

/**
* 用来是否创建观察对象
* 在某些情况下，我们可能希望禁用组件内部的观察。
* 更新计算。
 */
export let shouldObserve: boolean = true
/**
 * 创建一个观察对象
 * @param value 目标对象
 * @param asRootData 默认false
 */
export function observe (value: any, asRootData?:boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  // 如果当前对象存在观察实例对象,就设原来的，否则创建新的
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isLikeObject(value)) &&
    Object.isExtensible(value) &&
    !value._isDragon
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    (<Observer>ob).vmCount++
  }
  return ob
}
/**
 * 定义属性访问监听
 * @param obj 目标对象
 * @param key 属性名
 * @param val 属性值
 * @param customSetter 自定义set函数
 * @param shallow  是否浅监听，默认如果值是对象深度监听，
 */
export function defineReactive(obj:Object,key:string,val?:any,customSetter?:Function,shallow?:boolean){
  const dep = new Dep();// 创建一个依赖对象
  const property = Object.getOwnPropertyDescriptor(obj, key)
  // 如果属性不可配置，直接返回
  if (property && property.configurable === false) {
    return
  }
  const getter = property && property.get
  const setter = property && property.set
  // 如果不存在getter或存在setter并且只有两个参数,就设置值
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }
  // 如果不浅监听，就去监听值对象
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        // 如果值是对象，不为null
        if (childOb) {
          (<Observer>childOb).dep.depend();//对值对象添加依赖
          // 如果值是数组，就递归处理
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val;// 存在getter，就从getter获取值
      // 如果新值与旧值相等，就返回
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      // 如果不等于生产环境，执行自定义setter
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // 如果setter不为空，通过setter赋值
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal);// 如果不浅监听，就去监听值对象
      dep.notify();// 通知依赖函数，值发生变化
    }
  })
}
/**
 * 递归对数组值对象添加依赖
 * @param value 
 */
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}


 /**
 * 原型扩展
*/
function protoAugment(target:any,proto:any,keys?:string[])
{
    target.prototype.__proto__=proto;
}
 /**
 * 复制扩展
*/
 function copyAugment(target:any,proto:any,keys:string[])
{
    for (let i = 0,len=keys.length;i < len; i++) {
        target.prototype[keys[i]]=proto[keys[i]];
    }
}
