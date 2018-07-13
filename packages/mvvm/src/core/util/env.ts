/**
 * 执环境检测
*/
// 判断浏览器是否支持原型对象,IE11以下不支持原型对象扩展
let hasProto='__proto__' in {};
var inBrowser = typeof window !== 'undefined';
export {
    hasProto,
    inBrowser
}

let _isServer:any;
/*
判断是否服务端渲染
*/
export const isServerRendering:()=>boolean = () => {
    return false
}