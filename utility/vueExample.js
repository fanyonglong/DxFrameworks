   function addGui(gui, obj, callback, options) {
                _.each(obj, function (v, k) {
                    if (_.isPlainObject(v)) {
                        d3Helper.addGui(gui.addFolder(k), v, callback, options ? options[k] : null)
                        return;
                    }
                    var type = 'add';
                    var args = [];
                    if (options && options[k]) {
                        type = options[k].type || type;
                        args = options[k].args || [];
                    }
                    if (type == 'color') {
                        type = 'addColor'
                    }

                    gui[type].apply(gui, [obj, k].concat(args)).onFinishChange(function (v) {
                        callback(v, k);
                    })
                })
                return obj;
            }
function createViewExample() {
            var examples=[];         
            function init() {
                var routes=[];
                var gui=new dat.GUI(),first='',pathList=[];
                gui.open();
                examples=examples.map(function(ops){
                    var path=ops.path ||('/'+_.uniqueId('exmaple_'));
                    if(!ops.template&&!ops.render){
                        ops.template='<div></div>';
                    }
                    ops.path=path;
                    return ops
                })
                var currentHash=location.hash.slice(1);
                var listPage=gui.add({examples:currentHash||examples[0].path},'examples',examples.reduce(function(a,b){
                    a[b.title]=b.path;
                    return a;
                },{})).onChange(function(value){
                    router.push(value);
                    //   this.$router.push('/foo', increment)
                });
                
                var BaseApp=Vue.extend({
                    created:function(){
                       // console.log('create-gui');
                        var newGui=gui.addFolder(this.$options.$title);
                        this.$gui=newGui;
                    },
                    destroyed:function(){
                     //   console.log('destroyed-gui');
                        gui.removeFolder(this.$gui)
                    }
                })
                while(examples.length){
                
                    var ops=examples.shift();           
                   
            
                    ops.$title=ops.title;
                
                    routes.push({
                        path:ops.path ,
                        component: BaseApp.extend(_.omit(ops,'title','path'))
                    });
                    pathList.push({
                        path:ops.path,
                        title:ops.title
                    });
                }

                // pathList.forEach(function (item) {
                //        var option=document.createElement('option');
                //        option.text=item.title;
                //        option.value=item.value;
                //        listPage.__select.appendChild(option)
                //   })
                Vue.use(VueRouter)
                var router = new VueRouter({
                    mode: 'hash',//'history',
                    base: '/',
                    routes: routes
                });
                if(!currentHash){
                    router.push(routes[0].path)
                }
                var elApp = document.createElement('div');
                 document.body.appendChild(elApp);
                var view=new Vue({
                    router:router,
                    template:`<div id="app" class="container-full vh-100 vw-100">
                            <router-view class="h-100 w-100"></router-view>
                        </div>`
                }).$mount(elApp);
            }
            setTimeout(init, 0);
            return function addExample(options) {       
                examples.push(options)
            }
        }
