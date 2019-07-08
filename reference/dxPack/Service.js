/**
 * 安装webpack4.x
 * npm install --save-dev webpack
 * npm install --save-dev webpack-cli
 * 
mkdir webpack-demo && cd webpack-demo
npm init -y
npm install webpack webpack-cli --save-dev
 * 
 */
const {
    Tapable,
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    AsyncSeriesHook
} = require("tapable");
const assert = require('assert');//nodejs 断言
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');// 终端风格
const UserConfig = require('./UserConfig')

class Service {
    constructor(ops) {
        this.options = Object.assign({
            cwd: process.cwd()
        }, ops || {});
        this.commands = {};
        this.plugins = [];
        this.extraPlugins = [];
        this.hooks = {
            chainConfig: new SyncHook(['chainConfig']),
            modifyCommandOptions: new SyncWaterfallHook(['options'])
        }

    }
    init() {
        this.initConfig();
        this.plugins = this.resolvePlugins();
        this.initPlugins();
    }
    initConfig() {
        var ops = this.options;
        var config = {};
        if (typeof ops.config === 'string') {
            config = require(ops.config);
        } else if (typeof ops.config === 'object') {
            config = ops.config;
        }
        this.userConfig = new UserConfig(this);
        // var config=UserConfig.getConfig({cwd:ops.cwd})
        this.config = Object.assign({
            plugins: []
        }, config);
    }
    getUserPlugins() {
        var plugins = this.config.plugins;
        return plugins.map(this.resolvePlugin);
    }
    resolvePlugins() {
        var builtInPlugins = [
            './command/dev',
            './command/prod'
        ]
        return [...builtInPlugins.map(this.resolvePlugin), ...this.getUserPlugins()];

    }
    resolvePlugin(file) {
        var a = file;
        if (typeof file === 'string') {
            a = require(file);
        }
        return a;
    }
    initPlugin(plugin) {
        plugin.apply(this, [this]);
    }
    initPlugins() {

        this.plugins.forEach((plugin) => {
            this.initPlugin(plugin)
        })
        let count = 0;
        while (this.extraPlugins.length) {
            const extraPlugins = this.extraPlugins.slice();
            this.extraPlugins.length = 0;
            extraPlugins.forEach(plugin => {
                this.initPlugin(plugin);
                this.plugins.push(plugin);
            });
            count += 1;
            assert(count <= 10, `插件注册死循环？`);
        }

    }
    registerPlugin(opts) {
        this.extraPlugins.push(opts)
    }
    registerCommand(name, opts, fn) {
        if (typeof opts === 'function') {
            fn = opts;
            opts = null;
        }
        opts = opts || {};
        assert(!(name in this.commands), `Command ${name} exists, please select another one.`);
        this.commands[name] = { fn, opts };
    }
    runCommand(name, opts) {
        var command = this.commands[name];
        if (!command) {
            return;
        }
        opts = this.hooks.modifyCommandOptions.call(command.opts);
        command.fn(opts);
    }
    run(name = 'dev', opts) {
        this.init();
        this.runCommand(name, opts);
    }


}


module.exports = Service;