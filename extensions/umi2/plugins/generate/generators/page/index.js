const { join }= require('path');
const randomColor =require('random-color');
const assert =require('assert');
const chalk = require('chalk');

module.exports=function(api) {
  const { paths, config, log } = api;

  return class Generator extends api.Generator {
    constructor(args, options) {
      super(args, options);
    }

    writing() {
      const jsxExt = this.isTypeScript ? 'tsx' : 'js';
      const cssExt = this.options.less ? 'less' : 'css';
      const context = {
        name: 'index',
        title: `Global Layout`,
        color: randomColor().hexString(),
        isTypeScript: this.isTypeScript,
        jsxExt,
        cssExt,
      };
      if (this.options.global) {
        assert(
          !this.args.length,
          `You don't need to specify the path with --global, e.g. umi g layout --global`,
        );
        this.fs.copyTpl(
          this.templatePath('page.js.tpl'),
          join(paths.absSrcPath, `pages`, `index.${jsxExt}`),
          context,
        );
        this.fs.copyTpl(
          this.templatePath('page.css.tpl'),
          join(paths.absSrcPath, `pages`, `index.${cssExt}`),
          context,
        );
        return;
      }

      const path = this.args[0];
      assert(typeof path === 'string', `You should specify the path, e.g. umi g layout abc`);
      this.fs.copyTpl(
        this.templatePath('page.js.tpl'),
        join(paths.absPagesPath, path, `index.${jsxExt}`),
        {
          ...context,
          name: '_layout',
          title: `Layout for ${path}`,
        },
      );
      this.fs.copyTpl(
        this.templatePath('page.css.tpl'),
        join(paths.absPagesPath, path, `index.${cssExt}`),
        context,
      );
    }
  };
};
