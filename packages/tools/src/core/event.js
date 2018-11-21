import {isBoolean} from './lang'
class Event{
    constructor(type,{bubbles=false,cancelable=false}={}){
        this.type=type;
        this.bubbles=bubbles;
        this.cancelable=cancelable;
        this.isPreventDefaulted=false;// 是否取消默认
        this.isStopPropagationed=false;
    }
    preventDefault(){
        if(this.cancelable){
            return;
        }
        this.isPreventDefaulted=true;
    }
    stopPropagation(){
        if(this.bubbles){
            return;
        }
        this.isStopPropagationed=true;
    }
}

export function addEventListener(target,type,callback,options){
    target.addEventListener(type,callback,options)
}
export function removeEventListener(target,type,callback,options){
    target.removeEventListener(type,callback,options)
}
export function dispatchEvent(event){
    target.dispatchEvent(event)
}
class EventTarget{
    constructor(context){
        this._eventList={}
    }
    addEventListener(type,callback){
        let _eventList=this._eventList;
        let events=_eventList[type]=_eventList[type]||[];
        events.push(callback);
    }
    removeEventListener(type,callback){
        let _eventList=this._eventList;
        let events=_eventList[type]=_eventList[type]||[];
        let index=events.indexOf(callback)
        if(index!=-1){
            events.splice(index,1)
        }
    }
    dispatchEvent(event){
        let {type}=event;
        let _eventList=this._eventList;
        let events=_eventList[type]=_eventList[type]||[];
        events=events.slice(0);
        for (let index = 0,length=events.length; index < length; index++) {
            let callback = events[index];
            callback.call(this,event);  
        }
    }
}