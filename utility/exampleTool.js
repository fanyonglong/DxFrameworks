
        function ExampleFactory(options,creator){
            if(typeof options=='function'){
                creator=options;
                options={};
            }
            if(typeof creator!=='function'){
                creator=function(page){
                    page.callback();
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
                    var prevPage=currentPageValue;
                    var page=pages[value];
                    if(prevPage&&prevPage!==value&&pages[prevPage]){
                        pages[prevPage].hide();
                    }
                    if(page){
                        page.show();
                        currentPageValue=value;
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
                
                setTimeout(function(){
                    var keys=Object.keys(pages);
                    if(keys.length>0){
                        showPage(keys[0]);
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
            ExmapleInstance.prototype.set=function(property,value){
                this.controlMap[property].setValue(value);
            }
            ExmapleInstance.prototype.get=function(property){
                return this.controlMap[property].getValue();
            }
            return new ExmapleInstance(options);
        }
