/*
模板生成
@dev fanyl
*/
const {readdirSync}=require('fs');
module.exports=function(api,opts){
    const { paths, config, log } = api;

    readdirSync(`${__dirname}/generators`)
    .filter(f => !f.startsWith('.'))
    .forEach(f => {
      api.registerGenerator(`dx:${f}`, {
        // eslint-disable-next-line import/no-dynamic-require
        Generator: require(`./generators/${f}`)(api),
        resolved: `${__dirname}/generators/${f}/index`,
      });
    });
}
