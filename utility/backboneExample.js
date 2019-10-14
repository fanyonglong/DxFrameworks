(function (exports) {
            
            var { Model, View, Router, Collection, Event, history } = Backbone;
            var ContainerView = Backbone.View.extend({
                _isContainerView: true,
                template: null,
                container: null,
                constructor: function (options) {
                    options = options || {}
                    _.bindAll(this, '_renderTemplate');
                    this.views = new Map();
                    var oldInitialize = this.initialize;
                    this.initialize = function () { };
                    Backbone.View.call(this, options);
                    this._initialize(options);
                    this.initialize = oldInitialize;
                    this.initialize.call(this, options);

                },
                _initialize: function (options) {
                    if (options.template) {
                        this.template = options.template;
                    }
                    if (options.container) {
                        this.container = options.container;
                    }
                    if (this.model) {
                        this.listenTo(this.model, 'change', this.render.bind(this));
                        this.listenTo(this.model, 'destroy', this.remove.bind(this));
                    }
                    if (this.collection) {
                        this.listenTo(this.collection, 'update', this.render.bind(this));
                    }
                    if (this.container) {
                        this.$el.appendTo(this.container);
                    }
                    if (options.width && options.height) {
                        this.width = options.width;
                        this.height = options.height;
                    }
                    this.render();
                    this.resize();
                },
                clear:function(){
                    if(this.model){
                        this.model.destroy();
                    }
                },
                hide: function () {
                    this.$el.hide();
                },
                show: function () {
                    this.$el.show();
                },
                resize: function () {
                    if (this.width) {
                        this.$el.width(this.width)
                    }
                    if (this.height) {
                        this.$el.height(this.height)
                    }
                },
                hasView: function (view) {
                    return this.views.has(view.cid);
                },
                addView: function (view, appendTo) {
                    if (!this.hasView(view)) {
                        this.views.set(view.cid, view);
                        if (appendTo) {
                            appendTo(this.$el);
                        } else {
                            this.$el.append(view.$el);
                        }
                    }
                    return this;
                },

                removeView: function (view) {
                    if (this.hasView(view)) {
                        this.views.delete(view.cid);
                        view.remove();
                    }
                    return this;
                },
                removeAllView: function () {
                    var that = this;
                    this.views.values.forEach(function (view) {
                        that.removeView(view);
                    })
                },
                _renderTemplate: function (templates) {
                    var htmls = [], that = this,ops;
                    for (var i = 0; i < templates.length; i++) {
                        var template=templates[i];
                        if (typeof template == 'string') {
                            htmls.push(template);
                        }
                        else if (typeof template == 'function') {
                            if (this.collection) {
                                this.collection.forEach(function (model) {
                                    htmls.push(template(model.attributes));
                                })
                            } else {
                                htmls.push(template(this.model ? this.model.attributes : {}));
                            }
                        } else if (template instanceof Backbone.View) {
                            htmls.push(template.$el);
                        } else if (template && template.prototype && template.prototype._isContainerView) {
                            htmls.push((new template()).$el);
                        } else if (_.isArray(template)) {
                            ops=_.extend({renderType:'custom'},template[1]||{});
                            template=template[0];
                            if(ops.renderType==='custom'){
                                htmls.push(template(this));
                            }if(ops.renderType==='collection'){
                                this.collection.forEach(function (model) {
                                    htmls.push(template(model.attributes));
                                })
                            }if(ops.renderType==='model'){
                                htmls.push(template(this.model.attributes));
                            }
                  
                        }
                    }
                    return htmls;
                },
                render: function () {
                    var htmls = [];
                    var template = _.isArray(this.template) ? this.template : [this.template];
                    htmls = htmls.concat(this._renderTemplate(template));
                    this.$el.html(htmls);
                    return this;
                }
            })
            function createExample() {
                // Backbone.history.start({silent:false})
                var gui = new dat.GUI({
                    width: 280
                });
                gui.domElement.parentNode.style.zIndex = 100;
                var router = new Router()
                var views = new ContainerView({
                    container: document.body,
                    className: "container-full vh-100 vw-100"
                })
                var prevView, curerntView, viewStack = [];
                function start() {
                    setTimeout(function () {

                        Backbone.history.start({ silent: false })
                        var cid;
                        if (viewStack.length > 0 && Backbone.history.getFragment() == "") {
                            router.navigate(viewStack[0].cid, true)
                            cid = viewStack[0].cid;
                        } else {
                            cid = Backbone.history.getFragment();
                        }
                        $(listPage.__select).html(viewStack.map(function (item) {
                            return $('<option></option>').text(item.title).val(item.cid);
                        })).val(cid);
                        //    listPage.setValue(viewStack[0].cid);
                    }, 0)
                }
                function switchView(prevView, curerntView) {
                    if (prevView) {
                        prevView.gui.hide();
                        prevView.hide()
                    }
                    curerntView.gui.show();
                    curerntView.show();

                }
                function addView(view) {
                    prevView = curerntView

                    views.addView(view);
                    curerntView = view;
                    switchView(prevView, curerntView)
                }
                var loadedViews={};
                function loadShowView(options){
                    var view =loadedViews[options.cid];
                    if(!view){
                       view = new (ContainerView.extend(_.extend({
                            gui:options.gui,
                            className: "h-100 w-100"
                        }, options)))();
                        view.$el.attr('id', options.cid)
                        loadedViews[options.cid]=view;
                    }
                    addView(view);
              
                }

                var listPage = gui.add({ page: "" }, 'page', []).onChange(function (v) {
                    if (v) {
                        //that.views.get(v);
                        router.navigate(v, true)
                    }
                });
                start();

                
                var cid=0;
                return function (options) {
                    options.title = options.title || "";
                    options.cid='exmaple'+(cid++);
                    options.gui= gui.addFolder(options.title);
                    options.gui.hide();
                    viewStack.push(options);
                    router.route(options.cid, loadShowView.bind(null, options))
                }
            }
              function addGuiModel(gui, model, options) {
            options = _.defaults(options || {}, {
                features: {}
            })
            var attributes = model.toJSON(), features = options.features;
            function defineAttr(obj, value, name) {
                var descriptor = Object.getOwnPropertyDescriptor(obj, name);
                if (descriptor.configurable === false) {
                    return;
                }
                Object.defineProperty(obj, name, {
                    get: function () {
                        return model.get(name)
                    },
                    set: function (v) {
                        //]
                        model.set(name, v, {
                            silent: true
                        })
                    }
                });
                function setValue(value) {
                    model.trigger('change:' + name, model, value);
                    model.trigger('change', model);

                }
                var feature = _.extend({
                    immediately: false,// 立即更新
                    type: "input",
                    args: []
                }, features[name] || {});
                var args = [obj, name].concat(feature.args);
                var listenName = feature.immediately ? 'onChange' : 'onFinishChange';
                if (feature.type === 'input') {
                    gui.add.apply(gui, args)[listenName](setValue)
                }
                else if (feature.type === 'color') {
                    gui.addColor.apply(gui, args)[listenName](setValue)
                }
            }
            _.each(attributes, _.partial(defineAttr, attributes))
        }
    exports.addGuiModel=addGuiModel;
            exports.ContainerView = ContainerView;
            exports.createViewExample = createExample;
        })(this);
