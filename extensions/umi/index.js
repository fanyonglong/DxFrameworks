
/**
 * umi开发环境扩展
 * @dev fanyonglong
*/
const { join, resolve } = require('path');
const TYPE_BLOCK = 0b00000001;
const TYPE_PLUGIN = 0b00000010;
const TYPE_UI = 0b00000100;
const TYPE_TEMPLATE=0b00001000;


const PATHS = {
    [TYPE_BLOCK]: resolve(__dirname, 'blocks'),
    [TYPE_PLUGIN]: resolve(__dirname, 'plugins'),
    [TYPE_UI]: resolve(__dirname, 'ui'),
    [TYPE_TEMPLATE]: resolve(__dirname, 'templates')
}
 const defaultPlugins = [
   getExtensionPath(TYPE_UI, 'zengliang/lib/index'),
   getExtensionPath(TYPE_PLUGIN, 'generator')
]
function getExtensionPath(type, name) {
    let allTypes = TYPE_BLOCK | TYPE_PLUGIN | TYPE_UI|TYPE_TEMPLATE;
    let path;
    if (type & allTypes) {
        path = join(PATHS[type], name)
    }
    return path;
}

function composeConfig(...configs) {
    if(configs.length==1){
        return configs[0];
    }
    return configs.reduce((a, b) => {
        return (config) => {
            a(config);
            b(config);
        }
    })
}

function initConfig(config) {
    console.log('init-----------')
}
function extendConfig(config){
    config.plugins=config.plugins?[...config.plugins,...defaultPlugins]:[...defaultPlugins];
    config.chainWebpack=config.chainWebpack?composeConfig(config.chainWebpack,initConfig):initConfig;
    return config;
}

module.exports={
    TYPE_BLOCK,
    TYPE_PLUGIN,
    TYPE_UI,
    TYPE_TEMPLATE,
    PATHS,
    getExtensionPath,
    extendConfig,
    composeConfig,
    defaultPlugins
}
