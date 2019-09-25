const { join,basename } = require('path');
const assert = require('assert');
const chalk = require('chalk');

/*

私有方法不自动触发:(定义方式)
_private_method:下划线
constructor:(){ this.methods=noop}

可用优先级为（按运行顺序）：

initializing -您的初始化方法（检查当前项目状态，获取配置等）
prompting-在提示用户输入选项的地方（您要致电的地方this.prompt()）
configuring-保存配置并配置项目（创建.editorconfig文件和其他元数据文件）
default -如果方法名称与优先级不匹配，它将被推送到该组。
writing -在其中写入生成器特定文件（路由，控制器等）的位置
conflicts -处理冲突的地方（内部使用）
install -运行安装的位置（npm，凉亭）
end-最后一次打扫，打扫，说再见等
**/
module.exports = function (api) {
    const { paths, config, log } = api;

    return class Generator extends api.Generator {
        constructor(args, options) {
            super(args, options);
            this.argument('connect',{
                description:"是否connect", //参数说明
              //  required:true, //布尔值是否为必需
                optional:true, //布尔值是否可选
                type:"boolean", //字符串，数字，数组或对象
                default:false// 此参数的默认值
                            })
            log.success('constructor')
        }
        initializing(){
            log.success('initializing')
        }
        async prompting(){
            log.success('prompting');

           let answers=this.answers= await this
            .prompt([{
                    type:"input",
                    name:"outpath",
                    message:"请输入生成目标路径",
                    validate:function(value){
                        if(value!==undefined&&String(value).trim()!==""){
                            return true;
                        }
                        return '请输入生成目标路径'
                    },
                   // default:api.paths.absSrcPath,
                    transformer(v){
                        return join(paths.absSrcPath,v);
                    }
                }
            ]);

        }
        //https://github.com/SBoudrias/mem-fs-editor
        writing(){
            log.success('writing',this.answers.outpath);
            let {outpath}=this.answers;
            const context = {
                name: basename(outpath)
            };
            this.fs.copyTpl(
                this.templatePath('./index.js.tpl'),
                join(paths.absSrcPath,`${outpath}.js`),context);
        }
        /*
        您只需要调用this.npmInstall()即可运行npm安装。
        Yeoman将确保该npm install命令仅被运行一次，即使它被多个生成器多次调用也是如此。
        例如，您想将lodash安装为dev依赖项：
        */
        installingLodash() {
            log.success('writing',this.answers.outpath,this.args)
             //  this.npmInstall(['lodash'], { 'save-dev': true });
             // 等效npm install lodash --save-dev
        }
    }
}
