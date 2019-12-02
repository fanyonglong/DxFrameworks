const path=require('path');
const {readdirSync}=require('fs'); 
module.exports=(api,option={})=>{
    let {log:{error,debug}}=api;
    api.onOptionChange(newOption=>{
      debug('ifactory-plugin-option:change')
      option=newOption;
    })
    let root=path.resolve(__dirname);
    let plugins=readdirSync(path.resolve(__dirname,'plugins')).filter(name=>!name.startsWith('.'));
    plugins.forEach((pluginName)=>{
        api.registerPlugin({
          id:`ifactory-plugin:${pluginName}`,
          apply:require(`./plugins/${pluginName}`),
          opts:{
            ...option,
            root:root
          }
        })
    })
}
