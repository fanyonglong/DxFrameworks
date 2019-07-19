const fs = require("fs");
const path=require('path')
const { CachedInputFileSystem, ResolverFactory } = require("enhanced-resolve");

// create a resolver
const myResolver = ResolverFactory.createResolver({
	// Typical usage will consume the `fs` + `CachedInputFileSystem`, which wraps Node.js `fs` to add caching.
	fileSystem: new CachedInputFileSystem(fs, 4000),
    alias: {
        Utilities: require.resolve('webpack')
    },
    extensions:['.js','.json'],
    aliasFields:['web'],
    descriptionFiles:['package.json'],
    enforceExtension:false,
    modules:['node_modules'],
    mainFields: ['web', 'module','main'],// 读取模块是根据描述文件加载
    mainFiles:['index'], // 默认读取目录时加载的文件
    resolveToContext:true,
	/* any other resoelver options here. Options/defaults can be seen below */
});

// resolve a file with the new resolver
const context = {
    issuer:""
};
const resolveContext = {

};
const lookupStartPath = path.resolve(__dirname);
const request = "./src/app";
myResolver.resolve(context, lookupStartPath, request, resolveContext, (
	err /*Error*/,
	filepath /*string*/
) => {
    // Do something with the path
    console.log(filepath)
});
