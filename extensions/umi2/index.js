
import {readdirSync} from 'fs';
import assert from 'assert'
export default function(api,opts){

    api._registerConfig(()=>{    
        return api=>{
            return {
                name: 'dx',
                validate: function(val){
                    assert(typeof val==='object','dx必须是对象')
                },
                onChange(newConfig, oldConfig) {
                    api.service.restart(/* why */ 'Config dx Changed');
                },
                group: 'basic',
                type: 'object',
              //  default: {},
                title: {
                  'zh-CN': '路由 Base',
                  'en-US': 'Route Base',
                },
            };
        }
    })
    api.onOptionChange(newOpts=>{
        opts=newOpts;    
    })
    // readdirSync(`${__dirname}/plugins`).forEach(f=>{
      
    // })
    const plugins=[
        'command',
        'generate',
        'runtime',
        
    ]
    plugins.forEach((f)=>{
        api.registerPlugin({
            id:'dx-plugin:'+f,
            apply:require(`./plugins/${f}`),
            opts:{name:"test555"}
        })
    })
    
}
