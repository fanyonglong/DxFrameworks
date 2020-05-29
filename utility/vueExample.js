
function defaultGuiMiddleware(root, gui) {
    let callback = root.callback, options = root.options, obj = root.obj, v = root.value, k = root.key, type = root.type || 'add', args = root.args || [];
    if (_.isPlainObject(v)) {
        addGui(gui.addFolder(k), v, callback, options ? options[k] : null)
        return;
    }
    if (!(_.isString(v) || _.isNumber(v) || _.isBoolean(v))) {
        return;
    }

    gui[type].apply(gui, [obj, k].concat(args)).onFinishChange(function (v) {
        callback && callback(v, k);
    })
}
function parseGuiColorMiddleware(root, gui) {
    var options = root.options, k = root.key, v = root.value;
    if (_.isString(v) && v.charAt(0) == '#' && v.length === 7) {
        root.type = 'addColor';
    }
}
function parseGuiOptionMiddleware(root, gui) {
    var options = root.options, k = root.key, v = root.value;
    var type = 'add';
    var args = [];
    var option;
    if (_.isFunction(options)) {
        option = options(k, v);
    }
    else if (options && options[k]) {
        option = options[k];
    }
    if (option) {
        type = option.type || type;
        args = option.args || [];
    }
    if (type == 'color') {
        type = 'addColor'
    }
    root.type = type;
    root.args = args;
}
var vueGuiMiddlewares = [parseGuiOptionMiddleware, parseGuiColorMiddleware, defaultGuiMiddleware];
function addGuiMiddleware(fn) {
    vueGuiMiddlewares.unshift(fn);
}
function addGui(gui, obj, callback, options) {
    var root = {
        obj: obj,
        callback: callback,
        options: options
    }
    _.each(obj, function (v, k) {
        var i = -1;
        root.key = k;
        root.value = v;
        while (++i < vueGuiMiddlewares.length && vueGuiMiddlewares[i](root, gui) !== false) {

        }
    })
    return obj;
}
function loadStyle(css) {
    var style = document.createElement('style');
    try {
        style.appendChild(document.createTextNode(css));
    } catch (e) {
        style.styleSheet.cssText = css;
    }
    document.getElementsByTagName('head')[0].appendChild(style);
}
function createViewExample() {
    var examples = [];
    function init() {
        var routes = [];
        var gui = new dat.GUI(), first = '', pathList = [];
        gui.domElement.parentNode.style.zIndex = 9999;
        gui.open();
        loadStyle('.dg .c input{line-height:1.5;}')
        examples = examples.map(function (ops) {
            var path = ops.path || ('/' + _.uniqueId('exmaple_'));
            if (!ops.template && !ops.render) {
                ops.template = '<div></div>';
            }
            ops.path = path;
            return ops
        })
        var currentHash = location.hash.slice(1);
        var listPage = gui.add({ examples: currentHash || examples[0].path }, 'examples', examples.reduce(function (a, b) {
            a[b.title] = b.path;
            return a;
        }, {})).onChange(function (value) {
            router.push(value);
            //   this.$router.push('/foo', increment)
        });

        var BaseApp = Vue.extend({
            beforeCreate(){
                //console.log('parent-beforeCreate')
            },
            created: function () {
                // console.log('create-gui');
                var newGui = gui.addFolder(this.$options.$title);
                this.$gui = newGui;
               // console.log('parent-created')
            },
            destroyed: function () {
                //   console.log('destroyed-gui');
                gui.removeFolder(this.$gui)
            }
        })
        while (examples.length) {

            var ops = examples.shift();


            ops.$title = ops.title;

            routes.push({
                path: ops.path,
                component: BaseApp.extend(_.omit(ops, 'title', 'path'))
            });
            pathList.push({
                path: ops.path,
                title: ops.title
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
        if (!currentHash) {
            router.push(routes[0].path)
        }
        var elApp = document.createElement('div');
        document.body.appendChild(elApp);
        var view = new Vue({
            router: router,
            template: `<div id="app" class="container-full vh-100 vw-100">
                            <router-view class="h-100 w-100"></router-view>
                        </div>`
        }).$mount(elApp);
    }
    setTimeout(init, 0);
    return function addExample(options) {
        examples.push(options)
    }
}

(function () {
    loadStyle(`.ep-left {
        width: 260px;
        transition: width ease .5s;
    }
    .ep-mune{

    }
    .ep-mune .nav-link{
       position: relative;
    }
    .ep-submenu{

    }
    .ep-collapse .ep-left {
        width: 50px;
    }
    .ep-collapse .ep-menu-hide{
        display: none;
    }
    .ep-collapse .ep-submenu{
        position: absolute;
        left: 100%;;
        top:0;
        min-width: 240px;
    }`)
    // 首页
    var LeftMenu = {
        template: `
        <div class="ep-mune-wrap">
        <div class="d-flex">
            <button class="ml-auto navbar-toggler align-items" @click="collapseMenu" type="button">
            <span class="fa fa-bars"></span>
            </button>    
        </div>
        <ul class="ep-mune nav flex-column">
            <li v-for="(menuItem,index) in menus" :key="index" class="nav-item dropdown">
                <a :class="[menuItem.cls?menuItem.cls:'fa fa-home']" class="nav-link d-flex" v-bind="getItemProp(menuItem,index)"   role="button" href="#">
                <i class="mr-2 ep-menu-icon align-self-center"></i>
                <span class="ep-menu-hide align-self-center" >{{menuItem.name}}</span>
                <i class="ep-menu-hide ml-auto fa fa-angle-down align-self-center" v-if="menuItem.children&&menuItem.children.length>0"></i>
                    </a>
                <div v-if="menuItem.children&&menuItem.children.length>0" class="collapse ep-submenu mx-2 bg-white rounded shadow-none border p-2" :id="'collapse_'+index">
                    <ul class="nav flex-column nav-pills">
                        <li v-for="(subItem,subIndex) in menuItem.children" :key="subIndex" class="nav-item" >
                            <a @click.prevent="onSubMenuItemClick(subItem,index+'_'+subIndex)" :class="[subItem.cls,currentActiveIndex==(index+'_'+subIndex)?'active':'']" class="nav-link" href="#"><span>{{subItem.name}}</span></a>
                        </li>
                    </ul>    
                </div>
            </li>
         </ul>  
        </div>
    `,
        props: {
            menus: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return { currentActiveIndex: '', collapse: false }
        },
        filters: {
            fCollapse(item, index) {
                if (item.children && item.children.length > 0) {
                    return {
                        'data-target': '#collapse_' + index,
                        'data-toggle': "collapse"
                    }
                }
                return {};
            }
        },
        methods: {
            collapseMenu() {
                this.collapse = !this.collapse;
                if (this.collapse) {
                    document.body.classList.add('ep-collapse')
                } else {
                    document.body.classList.remove('ep-collapse')
                }
            },
            getItemProp(item, index) {
                if (item.children && item.children.length > 0) {
                    return {
                        'data-target': '#collapse_' + index,
                        'data-toggle': "collapse"
                    }
                }
                return {};
            },
            onSubMenuItemClick(item, index) {
                if (index == this.currentActiveIndex) {
                    return;
                }
                this.currentActiveIndex = index;
                this.$emit('onChange', item)

            }
        }
    }
    var RightContent = {
        template: `
      <div class="w-100 h-100">
        <iframe v-if="url" ref="frame" class="w-100 h-100" :src="url"></iframe>    
    </div>
    `,
        props: {
            url: String
        },
        methods:{
            getCode(){
                if(!this.url){
                    return;
                }
                if(this.$refs.frame){
                    return this.$refs.frame.contentDocument.documentElement.outerHTML;
                }
                // var html='';
                // $.ajax({
                //     url:this.url,
                //     type:"get",
                //     dataType:"html",
                //     async:false,
                //     success(re){
                //         html=re;
                //     }
                // });
                // return html;
            }
        }
    };
    var app;
    function initApp(){
            // 首页
     app = new Vue({
        template: `
      <div class="ep-contaienr container-fluid vh-100 px-0">
        <div class="d-flex h-100">
            <div class="ep-left bg-dark shadow-lg">
                <d-left-menu :menus="menus" @onChange="onMenuChange"></d-left-menu>
            </div>
        <div class="ep-right flex-fill position-relative">
            <d-right-content ref="right" :url="currentUrl"></d-right-content>
            <button @click="onShowCode" data-toggle="modal" data-target="#myModal" v-if="currentUrl" type="button"  class="btn btn-outline-primary btn-sm position-fixed" style="z-index:10000;right:10px;bottom:10px"><span class="fa fa-code"></span></button>
            <div class="modal" tabindex="-1" role="dialog" id="myModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" >
                   <textarea style="width:100%" rows="50">{{code}}</textarea>
                </div>
    
                </div>
            </div>
            </div>
            </div>
            </div>
        </div>
    `,
        components: {
            DLeftMenu: LeftMenu,
            DRightContent: RightContent
        },
        data() {
            return {
                currentUrl: "",
                code:"",
                menus: [{ cls: "fa fa-home", name: "home", children: [{ name: "child 1", url: "../exmaple.html" }] }]
            }
        },
        methods: {

            onMenuChange(item) {
                if (!item.url) {
                    return;
                }
                this.currentUrl = item.url;
            },
            setData(data) {
                this.menus = data;
            },
            onShowCode(){
                if(this.currentUrl){
                   this.code= this.$refs.right.getCode();
                }
            }
        }
    });
    }
    window.initMenuExample=function(menus){
        initApp();
        var root = document.createElement('div');
        root.id = 'app';
        document.body.appendChild(root);
        app.menus=menus;
        app.$mount('#app')
    }
})();
