module.exports = function (api, ops) {

    const { log, Generator } = api;


    /*
      npx umi g layout [path] --global
      npx umi g page [path] 
      test 
    */
    function test(args) {
        log.success(arguments);
    }

    api.registerCommand('dx', {
        description: '测试',
        usage: `umi dx type name [options]`,
        details: '',
    }, test)
}
