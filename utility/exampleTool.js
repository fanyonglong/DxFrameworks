
 function createOptionsGui(options, gui, immediately, add, descObj) {
            var titles;
            if (_.isPlainObject(immediately)) {
                descObj = immediately.desc;
                add = immediately.add;
                titles = immediately.titles;
                immediately = immediately.immediately;

            }
            immediately = immediately == undefined ? false : immediately;
            var keys = Object.keys(options), callback, addIsFunc = _.isFunction(add);
            keys.forEach(function (key) {
                var control, value = options[key], isNormal = true;
                if (addIsFunc) {
                    control = add(gui, key, value, options);
                    isNormal = control === undefined ? true : false;
                }
                if (isNormal) {
                    if (value && typeof value == 'string' && /^(#|rgb|hsl)/.test(value)) {
                        control = gui.addColor(options, key)
                    } else if (_.isPlainObject(value) && value.type == 'options') {
                        options[key] = value.value;
                        control = gui.add(options, key, value.options);
                    } else if (_.isArray(value)) {
                        options[key] = value[0];
                        control = gui.add.apply(gui, [options, key].concat(value.slice(1)))
                    } else {
                        control = gui.add(options, key)
                    }
                }
                if (_.isPlainObject(descObj) && _.has(descObj, key)) {
                    control.name(descObj[key])
                }
                if (_.isPlainObject(titles) && _.has(titles, key)) {
                    control.__li.firstElementChild.firstElementChild.setAttribute('title', titles[key])
                }
                if (!_.isFunction(value)) {
                    control.onChange(_.partial(handlerChange, key));
                    //control.onChange(_.debounce(_.partial(handlerChange, key),1000));
                }
            })
            function handlerChange(name, value) {
                if (callback) {
                    callback(name, value, options);
                }
            }
            return function (_callback) {
                callback = _callback;
                if (immediately) {
                    handlerChange('*', '')
                }
            }
        }
        function ExampleFactory(options,creator){
            if(typeof options=='function'){
                creator=options;
                options={};
            }
            if(typeof creator!=='function'){
                creator=function(example){
                   return function(page){
                        page.callback();
                   }
                }
            }
            var defaultOptions={
                container:document.body
            }
            if(!ExampleFactory.initStyle){
                ExampleFactory.initStyle=true;
                var style=document.createElement('style');
                style.setAttribute('type','text/css');
                style.innerText=`
                    .guiContainer{
                        position:absolute;right:0;top:10px
                    }
                    .exmaple-page.hidden{
                        display:none;
                    }
                `;
                document.getElementsByTagName('head')[0].appendChild(style);
            }
            function ExmapleInstance(options){
                options=Object.assign({},defaultOptions,options||{});
                var container=options.container;
                 var parent=this;
                var gui=this.gui=new dat.GUI({
                       // name:"three设置",
                        width:400,
                        useLocalStorage:true,
                        autoPlace:true,// 是否自动显示,
                        hideable:true,//按h是否自动显示隐藏
                        closed:false,
                        closeOnTop:true,
                        preset:"Default"
                });
               // this.gui.remember(this);//记住 
                var customContainer = document.createElement('div');
                customContainer.className='guiContainer';
                document.body.appendChild(customContainer);
                customContainer.appendChild(this.gui.domElement);

             
                this.controlMap={};

                var pages={},pageId=0,examplesOptions=[],currentPageValue;

                function ExamplePage(title,fn){
                    var el=this.el=document.createElement('div');
                    el.classList.add('exmaple-page','hidden')
                    container.appendChild(el);
                    var pageHandler;
                    var init=false;
                    this.parent=parent;
                    this.title=title;
                    this.callback=fn;
                    this.show=function(){
                        if(!init){
                            init=true;
                            this.call('init');
                            pageHandler=creator(this);
                        }                       
                        el.classList.remove('hidden');
                        operation.show();
                        operation.open();
                        this.call('show')
                    }
                    this.hide=function(){
                        el.classList.add('hidden');
                        operation.hide();
                        this.call('hide')
                    }
                    this.refresh=function(){
                        this.call('refresh')
                    }
                    this.onChangeHandler=null;
                    this.call=function(name){
                        if(this.onChangeHandler){
                            this.onChangeHandler(name);
                        }
                    }
                    function createChange(name,fn){
                        return function(value){
                            if(name===value){
                                fn();
                                return true;
                            }
                        };
                    }
                    this.onChange=function(name,fn){
                        if(this.onChangeHandler){
                            this.onChangeHandler=[this.onChangeHandler].concat(createChange(name,fn)).reduce(function(a,b){
                                return function(name){
                                    if(b(name)===true){
                                        return;
                                    }
                                    a(name);
                                }
                            })
                            return;
                        }
                        this.onChangeHandler=createChange(name,fn);
                    }
                    var operation=gui.addFolder(this.title+'操作');
                    operation.hide();
                    this.operation=operation;
                    var operationValue={};
                    this.addOperation=function(property,initalValue){
                        var args=Array.prototype.slice.call(arguments,2);
                        operationValue[property]=initalValue;
                        var control= operation.add.apply(operation,[operationValue,property].concat(args));
                        return control;
                    }
                    this.addColor=function(property,initalValue){
                        var args=Array.prototype.slice.call(arguments,2);
                        operationValue[property]=initalValue;
                        var control= operation.addColor.apply(operation,[operationValue,property].concat(args));
                        return control;
                    }
                    this.get=function(property){
                        var control=operation.__controllers.filter(function(c){
                            return c.property==property;
                        })
                        return control[0];
                    }
                    this.listen=function(property,fn){
                        var c=this.get(property);
                        if(c){
                            c.onFinishChange(fn)
                        }
                    }
                    this.getValue=function(property){
                        return this.get(property).getValue()
                    }
                   
                }
                this.addExample=function(title,fn){
                    
                    var value='example_'+(pageId++);
                    examplesOptions.push(title)
                    
                    var option=document.createElement('option');
                    option.value=value;
                    option.text=title;
                    pages[value]=new ExamplePage(title,fn);
                    exampleControl.__select.appendChild(option);
                }
                function showPage(value){
                     if(value==currentPageValue){
                            return; 
                     }
                    var prevPage=currentPageValue;
                    var page=pages[value];
                    if(prevPage&&prevPage!==value&&pages[prevPage]){
                        pages[prevPage].hide();
                    }
                    if(page){
                        page.show();
                        currentPageValue=value;
                        window.location.hash=value;
                        exampleControl.setValue(value)
                    }
                }
                var exampleControl=this.add('examples','',examplesOptions);
                exampleControl.onChange(function(v){
                    showPage(v);
                });
                this.add('刷新',function(){
                    var page=pages[currentPageValue];
                    if(page){
                        page.refresh();
                    }
                });
                function getHash(){
                     return window.location.hash.substr(1);
                }
                creator=creator(this);
                setTimeout(function(){
                    var keys=Object.keys(pages);
                    if(keys.length>0){
                        var hash=getHash();
                        showPage(hash||keys[0]);
                    }
                }, 0);
               
            }
            ExmapleInstance.prototype.add=function(property,initalValue){
                var gui=this.gui;
                var args=Array.prototype.slice.call(arguments,2);
                this[property]=initalValue;
                var control= gui.add.apply(gui,[this,property].concat(args));

                this.controlMap[property]=control;
                return control;
            }
            ExmapleInstance.prototype.addOperation=ExmapleInstance.prototype.add;
            ExmapleInstance.prototype.set=function(property,value){
                this.controlMap[property].setValue(value);
            }
            ExmapleInstance.prototype.get=function(property){
                return this.controlMap[property].getValue();
            }
            return new ExmapleInstance(options);
        }

  let pi2 = Math.PI * 2;
        Particle.id=0;
        function Particle() {
            //Original position 原始数据
            this.type='particle';
            this.original = {}
            this.id='particle_'+(Particle.id++);
            this.destX = Infinity;
            this.destY = Infinity;// 目标位置
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.zIndex=0;
            this.vx = 0;//velocity 速度
            this.vy = 0;
            this.accX = 0;//加速度
            this.accY = 0;//
            this.force = 0;// 作用力
            this.friction = 1;//摩擦力
            this.accelerate = 0.001;//加速度系数
            this.angle = 0;
            this.radius = 5;
            this.gravity = 0;// 重力
            this.life = Infinity;
            this.isDeath = false;
            this.delta = 0;
            this.spring = 1;// 弹力
            this.globalAlpha = 1;
            
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.opacity = 1;
            this.strokeStyle = 'none';
            this.fillStyle = 'none';
            this.lineWidth=1;

            this.loop = false;
            this.forever = false;  //永远
            this.fillMode = '';//forwards  
            this.paths=null;// 路径
            this.closePath=false;
            this.hooks = {
                remove: new signals.Signal(),
                restart: new signals.Signal(),
                startDraw: new signals.Signal(),
                draw: new signals.Signal(),
                endDraw: new signals.Signal()
            }
            this.hooks.startDraw.add(function (ctx) {
                ctx.beginPath();
                if (this.fillStyle !== 'none') {
                    ctx.fillStyle = this.fillStyle;
                }
                if (this.strokeStyle !== 'none') {
                    ctx.strokeStyle = this.strokeStyle;
                }
                ctx.lineWidth=this.lineWidth;
            }, this)
            this.hooks.draw.add(function (ctx) {
                if(this.paths){
                    let paths=this.paths,len=paths.length;
                    if(len>0){
                        ctx.moveTo(paths[0][0],paths[0][1]);
                        for(let i=1;i<len;i++){
                            ctx.lineTo(paths[i][0],paths[i][1]);
                        }
                    }
                }else{
                    ctx.arc(this.x, this.y, this.radius, 0, pi2, false);
                }
                if (this.destX !== Infinity) {
                    this.accX = (this.destX - this.x) * this.accelerate;
                }
                if (this.destY !== Infinity) {
                    this.accY = (this.destY - this.y) * this.accelerate;
                }

                this.vx += this.accX;
                this.vy += this.accY;
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.x += this.vx;
                this.y += this.vy;
                this.y += this.gravity;


            }, this)
            this.hooks.endDraw.add(function (ctx) {
                if(this.closePath){
                    ctx.closePath();
                }
                if(this.strokeStyle!=='none'){
                    ctx.stroke()
                }
                if(this.fillStyle!=='none'){
                    ctx.fill()
                }
            }, this);
        }
        Particle.prototype = {
            constructor: Particle,
            init(options) {
                $.extend(this, options);
                $.extend(this.original, options);
            },
            toRgba: function (opacity) {
                return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + (opacity !== void 0 ? opacity : this.opacity) + ')'
            },
            toRgb: function () {
                return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')'
            },
            setAngleSpeed(speed) {
                this.vx = speed * Math.cos(this.angle);
                this.vy = speed * Math.sin(this.angle);
            },
            startDraw: function (ctx) {
                this.hooks.startDraw.dispatch(ctx)
            },
            draw: function (ctx) {
                this.hooks.draw.dispatch(ctx)
            },
            endDraw: function (ctx) {
                this.hooks.endDraw.dispatch(ctx)
            },
            remove() {
                this.delta = this.life;
                this.isDeath = true;
                this.hooks.remove.dispatch();
                if(this.parent){
                    this.parent.removeChild(this);
                }
            },
            get lifePercent() {
                // return (this.life-this.delta)/this.life;
                return this.delta / this.life;
            },
            restart() {
                this.delta = 0;
                this.hooks.restart.dispatch();
            }
        }
        function Container() {
            this.type = "container";
            this.children = [];
            this.hooks = {
                add: new signals.Signal(),
                remove:new  signals.Signal(),
            }
            this.parent=null;
        }
        Container.prototype.add = function (el) {
            el.parent=this;
            this.hooks.add.dispatch(el);
            this.children.push(el)
        }
        Container.prototype.getAllPerticle=function(){
            let fatterChildren=this.children.reduce(function(fatter,particle){
                 if(particle.type=='container'){
                     return fatter.concat(particle.getAllPerticle())
                 }
                 return fatter.concat(particle);
             },[]);
             return fatterChildren;
        }
        Container.prototype.forEach=function(callback){
             let children=this.getAllPerticle();
             children.forEach(callback);
        }
        Container.prototype.remove = function () {
            this.hooks.remove.dispatch();
            if(this.parent){
                this.parent.removeChild(this);
            }
        }
        Container.prototype.removeChild = function (el) {
            let index = this.children.indexOf(el);
            if (index != -1) {
                el.parent=null;
                this.children.splice(index, 1);
            }
            
        }
        Container.prototype.removeAll = function () {
            this.children.length = 0;
        }
        Container.prototype.getSize = function () {
            return this.children.length;
        }

        function ParticleRender(options) {

            options = $.extend({
                container: document.body,
                width: 800,
                height: 600,
                maxLite: 500,
                gravity: [0, 0],
                bounds:false,// 边界碰撞检测 [minx,miny,maxx,maxy]
                collisionResponse: false,
                link:0, //链接
                linkLineWidth:1,
                linkStrokeStyle:"#ff0000",
                distance:30 //距离
            }, options)
            
            let container = options.container;
            let canvas = options.canvas;
            if (canvas && canvas.nodeType == 1 && canvas.tagName.toLowerCase() !== 'canvas') {
                container = canvas;
                canvas = null;
            }
            if (!canvas) {
                canvas = document.createElement('canvas');
            }
            canvas.width = options.width;
            canvas.height = options.height;
            let ctx = canvas.getContext('2d');
            if (!canvas.parentNode && container) {
                container.appendChild(canvas);
            }
            // event
            var hooks = {
                create: new signals.Signal(),
                middle: new signals.Signal(),
                renderBefore: new signals.Signal(),
                render: new signals.Signal(),
                renderAfter: new signals.Signal(),
                startDraw: new signals.Signal(),
                draw: new signals.Signal(),
                endDraw: new signals.Signal(),
                tick: new signals.Signal()
            }


            let particles = new Container(ctx);
            function defaultCreator(index, container) {
                return new Particle();
            }
            function create(count, container, creator) {
                var i = -1;
                container = container || particles;
                creator = creator || defaultCreator
                while (++i < count) {
                    let particle = creator(i, container);
                    container.add(particle);
                }
                return particles;
            }
            let lastTime;
            function renderBefore(ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
            }
            function render(time) {
                lastTime = lastTime ? lastTime : time;
                let delta = time - lastTime;
                lastTime = time;
                hooks.renderBefore.dispatch(ctx);
                hooks.render.dispatch(ctx, delta);
                hooks.renderAfter.dispatch(ctx);
            }
            function renderAfter(ctx) {
                ctx.restore();
            }
            function renderContainer(ctx, delta) {
                let children = this.children, deletes = [];
                for (let i = 0, len = children.length; i < len; i++) {
                    let particle = children[i];
                    if (particle.type==='container') {
                        if (particle.getSize() > 0) {
                            renderContainer.call(particle, ctx, delta)
                        } else {
                            deletes.push(particle);
                        }
                    }
                    else if (!particle.isDeath) {
                        particle.delta += delta;
                        if (particle.loop && particle.delta >= particle.life) {
                            particle.restart();
                        }
                        else if (particle.delta >= particle.life) {
                            particle.delta = particle.life;
                            particle.isDeath = true;
                            deletes.push(particle);
                        }
                        // particle.startDraw(ctx);
                        hooks.startDraw.dispatch(particle, ctx);
                        hooks.draw.dispatch(particle, ctx);
                        hooks.endDraw.dispatch(particle, ctx);
                        // particle.draw(ctx);
                        //particle.endDraw(ctx)
                    }
                }
                for (let i = 0, len = deletes.length; i < len; i++) {
                    deletes[i].remove();
                }
            }
            function renderParticles(ctx, delta) {
                renderContainer.call(particles, ctx, delta)
            }
            let pi2 = Math.PI * 2;
            function startDraw(particle, ctx) {
                hooks.middle.dispatch(particle, ctx);
                particle.startDraw(ctx);
            }
            function draw(particle, ctx) {
                particle.draw(ctx);
            }
            function endDraw(particle, ctx) {
                particle.endDraw(ctx);
            }
            function collisionResponse(particle, ctx) {
                if (particle.collision && particle.collision()) {

                }
            }
            function collisionAABB(particle, ctx){
                let x=particle.x;
                let y=particle.y;
                if(x<=options.bounds[0]||x>=options.bounds[2]){
                    particle.vx*=-1;
                }else if(y<=options.bounds[1]||y>=options.bounds[3]){
                    particle.vy*=-1;
                }
            }
            function linkParticle(particle,ctx){
                if(particle.parent){
                     let minDs=0,maxLink=options.link,linkCount=0,linkParticle=[];
       
                     particle.parent.forEach(function(sibling){
                         let dx=particle.x-sibling.x;
                         let dy=particle.y-sibling.y;
                         let ds=dx*dx+dy*dy;
                         if(particle.id!==sibling.id&&ds<=options.distance*options.distance){
                            if(linkCount<maxLink){                         
                              linkCount++;
                              linkParticle.push(sibling);
                            }
                         }          

                     })
                     for(let i=0,len=linkParticle.length;i<len;i++){

                        ctx.beginPath();
                        ctx.strokeStyle=options.linkStrokeStyle;
                        ctx.lineWidth=options.linkLineWidth;
                        ctx.moveTo(particle.x,particle.y);
                        ctx.lineTo(linkParticle[i].x,linkParticle[i].y);
                        ctx.stroke();
                        
                     }
                }
            }
            let middles = []
            //renderer
            hooks.renderBefore.add(renderBefore)
            hooks.render.add(renderParticles);
            hooks.renderAfter.add(renderAfter);
            //draw
            hooks.startDraw.add(startDraw);
            hooks.draw.add(draw);
            hooks.endDraw.add(endDraw);
            // middle
            if (options.collisionResponse) {
                hooks.middle.add(collisionResponse);
            }
            if(options.bounds){
                hooks.middle.add(collisionAABB);
            }
            if(options.link){
                hooks.middle.add(linkParticle);
            }
            // ticker add render
            hooks.tick.add(render);
            function start() {
                function ticker(time) {
                    hooks.tick.dispatch(time);
                    requestAnimationFrame(ticker);
                }
                requestAnimationFrame(ticker);
            }
            start();
            return {
                ctx: ctx,
                hooks: hooks,
                particles: particles,
                render: render,
                create: create
            }
        }
