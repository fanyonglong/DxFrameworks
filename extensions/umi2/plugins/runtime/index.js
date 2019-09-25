module.exports=function(api,ops){

  //  api.log.success('runtime',ops);


  api.addRuntimePlugin(require.resolve('./runtime.js'));
  /*
   'patchRoutes',
        'render',
        'rootContainer',
        'modifyRouteProps',
        'onRouteChange',
        'modifyInitialProps',
        'initialProps',
  */
  api.addRuntimePluginKey('onDx');
  //umi/src/runtimePlugin
  //apply
  api.addEntryCode(`    
        plugins.applyForEach('onDx',{initialValue:"testRuntime"})
  `)
}
