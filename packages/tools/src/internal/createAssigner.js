import rest from '../function/rest'

/** 
 * 创建属性分配器
*/
export default function createAssigner(assigner){
    return rest(function(object,sources){
        let i=-1,len=sources.length,source,customizer=sources[len-1];
        customizer=assigner.length>3&&typeof customizer=='function'?(len--,customizer):undefined;
        while(++i<len){
            source=sources[i];
            if(source){
                 assigner(object,sources[i],i,customizer);
            }
        }
        return object
    })
}


  