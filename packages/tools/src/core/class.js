
/**
 * 支持类扩展、装饰器、混合
 */
function Class(){

}
Class.extend=function(proto){
    var superClass=this;
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError(
          "Super expression must either be null or a function, not " +
            typeof superClass
        );
    }
    var subClass=proto.constructor||function(){
    }
    subClass.fn=subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    // 继承静态属性和方法
    
    // if (superClass){
    //     // ie11 支持:setPrototypeOf 低版本chrome和FireFox支持__proto__
    //     Object.setPrototypeOf
    //       ? Object.setPrototypeOf(subClass, superClass)
    //       : (subClass.__proto__ = superClass);
    // }
    return subClass;
}
/**
 * @param  {array<function:(target, name, descriptor)=>void} ...decorators 
 */
Class.decorator=function(...decorators){
    decorators.forEach(decorator=>{
        decorator(this);
    })
}

export default Class