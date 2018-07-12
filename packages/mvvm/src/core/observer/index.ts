/**
 * 观察类
 */
export class Observer{
    constructor(value:Object | Array<any>)
    {
      if(Array.isArray(value))
      {
        this.observerArray(value);
      }else{
        this.walk(value);
      }
    }
    // 编译对象包装成反应
    private walk(value:Object)
    {

    }
    // 把数组转换成监听数组
    private observerArray(value:Array<any>){

    }
    // 存在
    

}


function defineReact(){

}
