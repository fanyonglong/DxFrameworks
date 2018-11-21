

import {isObject,isPlainObject,isFunction,isString} from '../lang'
import {hasOwn} from '../util'
/**
 * 添加监听事件
 * @param {object} target 
 * @param {string} type 
 * @param {function} handler 
 */
function listenerToObj(target,type,handler,context=target,first=false,once=false){
    let eventLists=target.__events__;
    if(!eventLists){
        eventLists=target.__events__=Object.create(null);
    }

    let events=eventLists[type];
    let event={context:context,handler:handler,once:once}
    if(!events)
    {
        eventLists[type]=event;
    }else if(isPlainObject(events)){
        eventLists[type]=first?[event,events]:[events,event]
    }else{
        events[first?'unshift':'push'](event)
    }
}
/**
 * 移除监听事件
 * @param {object} target 
 * @param {string} [type] 
 * @param {function} [handler] 
 */
function removeListenerToObj(target,type,handler){
    let eventLists=target.__events__;
    if(!eventLists){
        return false;
    }
    if(!type){
        target.__events__=null;
        delete target.__events__;
        return false;
    }
    let events=eventLists[type];
    if(!events){
        return false;
    }
    if(isPlainObject(events)||!isFunction(handler)){
        eventLists[type]=null;
    }else{
        let event;
        for (let i =events.length-1;i>=0; i--) {
            event=events[i];
            if(event.handler===handler){
                events.splice(i,1);
            }
        }
    }
}

/**
 * 触发监听事件
 * @param {object} target 
 * @param {string} type 
 * @param {any} [data] 
 */
function dispatchToObj(target,type,data=[]){
    let eventLists=target.__events__;
    if(eventLists){
        let events=eventLists[type],handler,context;
        if(events&&isPlainObject(events)){
            handler=events.handler;
            context=events.context;
            if(events.once){
                eventLists[type]=null;
            }
            handler.apply(context,data)
        }else if(events){
            let _events=events.slice(0);
            let event;
            for (let i =0,len=_events.length;i<len;i++) {
                event=_events[i];
                handler=event.handler;
                context=event.context;
                if(event.once){
                    events.splice(i,1);
                }
                console.log(type,context)
                handler.apply(context,data)
            }
        }
    } 
}
class Observable{
    /**
     * 添加事件
     * @param {string|object} name 
     * @param {function} handler 
     * @param {any} [context] 
     * @param {boolean} first 
     * @param {boolean} once
     * @returns {Observable} 
     */
    on(name,handler,context,first=false,once=false){
        var that=this,isFunc=isFunction(handler);
        if(!isFunc){
            once=first;
            first=context;
            context=handler;
            handler=undefined;
        }
        if(isPlainObject(name)){
            let orgHandler=handler;
            for (let key in name) {
                if(hasOwn(name,key)){
                    handler=isFunc?orgHandler:isString(name[key])?that[name]:name[key];
                    isFunction(handler)&&listenerToObj(that,key,handler,context,first,once)
                }
            }
        }else{
            listenerToObj(that,name,handler,context,first,once)
        }
        return this;
    }
    one(name,handler,context,first=false) {
        return this.on(name,handler,context,first,true);
    }
    off(name,handler){
        removeListenerToObj(this,name,handler);
        return this;
    }
    emit(name,...data){
        dispatchToObj(this,name,data)
        return this;
    }
}

export {Observable}