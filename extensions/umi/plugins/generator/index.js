
import nodePath,{ resolve,basename, join } from 'path';
import { getExtensionPath, TYPE_BLOCK, TYPE_PLUGIN, TYPE_UI,TYPE_TEMPLATE } from '../../index';
import inquirer from 'inquirer';
import glob from 'glob';
import fs from 'fs';

/*
paths
outputPath: 构建产物的生成目录
absOutputPath: 构建产物的生成目录（绝对路径）
pagesPath: page(s) 路径
absPagesPath: page(s) 的绝对路径
tmpDirPath: .umi 临时目录的路径
absTmpDirPath: .umi 临时目录的路径（绝对路径）
absSrcPath: src 目录的路径（绝对路径），用户缺省 src 时则对应为项目根目录
cwd: 项目根目录
absNodeModulesPath: node_modules 的绝对路径
*/
export default function (api) {
    let { log } = api;
    log.success('init--generator',api.winPath('/src/pages'))

    let templateGlobPattern=getExtensionPath(TYPE_TEMPLATE,'*');
    async function buildTemplate(){
        
       let directory=await new Promise((resolve,reject)=>{
        glob(templateGlobPattern,(err,paths)=>{
            if(err){
                resolve([]);
                return;
            }
            resolve(paths);
        })
       });
       let answers= await inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type:"list",
                name:"path",
                message:"请选择template",
                choices:directory.map(value=>{
                    return {
                        name:basename(value),
                        value
                    }
                }),
                pageSize:10,
                validate:function(value){
                    if(value!==undefined){
                        return true;
                    }
                    return '请选择tempalte'
                }
            },{
                type:"input",
                name:"outpath",
                message:"请输入生成目标路径",
               // default:api.paths.absSrcPath,
                transformer(v){
                    return join(api.paths.absSrcPath,v);
                }
            }
        ]);
        return answers;
    }
    api.registerCommand('template', {
        description: 'block related commands, e.g. add, list',
        usage: `umi template <command>`,
        details:"",
    }, (args) => {
        log.success('command-block', args)

       
    
       return  buildTemplate().then((obj)=>{
            if(!fs.existsSync(obj.path)){
                console.log('不存在')
                throw '不存在';
            }
            globFiles('**/*.@(js|less|sass|jsx)',{
               // cwd:api.paths.cwd,
                cwd:obj.path,
                //root:'extensions/templates'
            }).then(destOutPath(obj.outpath,{
                base:api.paths.absSrcPath
            }))
            log.success('完成',obj)
        })
       
    })
  
    function destOutPath(outpath,options){
        options=Object.assign({
            base:api.paths.cwd
        },options||{})
        return function(paths){
             for(let i=0;i<paths.length;i++){
                 let path=paths[i],outFilePath;
                 try{
              
                 outFilePath=resolve(options.base,outpath,path.path);
                // console.log('path:',path);
               //  console.log('outpath:',outFilePath)
                 let directory=nodePath.dirname(outFilePath);
                 if(!fs.existsSync(directory)){
                    fs.mkdirSync(directory,{recursive:true})
                 }
                 fs.copyFileSync(path.filePath,outFilePath,fs.constants.COPYFILE_EXCL)

                 }catch(e){
                    log.error(e,'已存在')
                 }
             }
        }
    }
    function globFiles(pattern,options={}){
        return new Promise((resolve,reject)=>{
            glob(pattern,options,(err,paths)=>{
                if(err){
                    throw err;
                    reject();
                    return;
                }
                resolve(paths.map(path=>{
                    return {
                        root:options.cwd,
                        filePath:nodePath.join(options.cwd,path),
                        path:path
                    }
                }))
                // resolve(paths.filter(path=>{
                //     return fs.statSync(path).isFile();
                // }))
            })
        })
    }

}
