/*! elementor - v2.5.16 - 28-05-2019 */
!function (e) {
    var t = {};

    function n(i) {
        if (t[i]) return t[i].exports;
        var o = t[i] = {i: i, l: !1, exports: {}};
        return e[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }

    n.m = e, n.c = t, n.d = function (e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: i})
    }, n.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, n.t = function (e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (n.r(i), Object.defineProperty(i, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e) for (var o in e) n.d(i, o, function (t) {
            return e[t]
        }.bind(null, o));
        return i
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 43)
}([function (e, t, n) {
    "use strict";
    var i, o = n(3), r = n(57), s = n(9);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return _.extend(e, {
                input: 'input[data-setting][type!="checkbox"][type!="radio"]',
                checkbox: 'input[data-setting][type="checkbox"]',
                radio: 'input[data-setting][type="radio"]',
                select: "select[data-setting]",
                textarea: "textarea[data-setting]",
                responsiveSwitchers: ".elementor-responsive-switcher",
                contentEditable: '[contenteditable="true"]',
                tooltipTarget: ".tooltip-target"
            }), e
        }, templateHelpers: function () {
            var e = o.prototype.templateHelpers.apply(this, arguments);
            return e.data.controlValue = this.getControlValue(), e
        }, events: function () {
            return {
                "input @ui.input": "onBaseInputChange",
                "change @ui.checkbox": "onBaseInputChange",
                "change @ui.radio": "onBaseInputChange",
                "input @ui.textarea": "onBaseInputChange",
                "change @ui.select": "onBaseInputChange",
                "input @ui.contentEditable": "onBaseInputChange",
                "click @ui.responsiveSwitchers": "onResponsiveSwitchersClick"
            }
        }, behaviors: function () {
            var e = {}, t = this.options.model.get("dynamic");
            if (t && t.active) {
                var n = _.filter(elementor.dynamicTags.getConfig("tags"), function (e) {
                    return _.intersection(e.categories, t.categories).length
                });
                n.length && (e.tags = {behaviorClass: r, tags: n, dynamicSettings: t})
            }
            return e
        }, initialize: function () {
            o.prototype.initialize.apply(this, arguments), this.registerValidators(), this.listenTo(this.elementSettingsModel, "change:external:" + this.model.get("name"), this.onAfterExternalChange)
        }, getControlValue: function () {
            return this.elementSettingsModel.get(this.model.get("name"))
        }, setValue: function (e) {
            this.setSettingsModel(e)
        }, setSettingsModel: function (e) {
            this.elementSettingsModel.set(this.model.get("name"), e), this.triggerMethod("settings:change")
        }, applySavedValue: function () {
            this.setInputValue('[data-setting="' + this.model.get("name") + '"]', this.getControlValue())
        }, getEditSettings: function (e) {
            var t = this.getOption("elementEditSettings").toJSON();
            return e ? t[e] : t
        }, setEditSetting: function (e, t) {
            this.getOption("elementEditSettings").set(e, t)
        }, getInputValue: function (e) {
            var t = this.$(e);
            if (t.is('[contenteditable="true"]')) return t.html();
            var n = t.val(), i = t.attr("type");
            return -1 !== ["radio", "checkbox"].indexOf(i) ? t.prop("checked") ? n : "" : "number" === i && _.isFinite(n) ? +n : ("SELECT" === e.tagName && t.prop("multiple") && null === n && (n = []), n)
        }, setInputValue: function (e, t) {
            var n = this.$(e), i = n.attr("type");
            "checkbox" === i ? n.prop("checked", !!t) : "radio" === i ? n.filter('[value="' + t + '"]').prop("checked", !0) : n.val(t)
        }, addValidator: function (e) {
            this.validators.push(e)
        }, registerValidators: function () {
            this.validators = [];
            var e = {};
            this.model.get("required") && (e.required = !0), jQuery.isEmptyObject(e) || this.addValidator(new s({validationTerms: e}))
        }, onRender: function () {
            o.prototype.onRender.apply(this, arguments), this.model.get("responsive") && this.renderResponsiveSwitchers(), this.applySavedValue(), this.triggerMethod("ready"), this.toggleControlVisibility(), this.addTooltip()
        }, onBaseInputChange: function (e) {
            clearTimeout(this.correctionTimeout);
            var t = e.currentTarget, n = this.getInputValue(t), i = this.validators.slice(0),
                o = this.elementSettingsModel.validators[this.model.get("name")];
            if (o && (i = i.concat(o)), i) {
                var r = this.getControlValue(t.dataset.setting);
                if (!i.every(function (e) {
                        return e.isValid(n, r)
                    })) return void(this.correctionTimeout = setTimeout(this.setInputValue.bind(this, t, r), 1200))
            }
            this.updateElementModel(n, t), this.triggerMethod("input:change", e)
        }, onResponsiveSwitchersClick: function (e) {
            var t = jQuery(e.currentTarget).data("device");
            this.triggerMethod("responsive:switcher:click", t), elementor.changeDeviceMode(t)
        }, renderResponsiveSwitchers: function () {
            var e = Marionette.Renderer.render("#tmpl-elementor-control-responsive-switchers", this.model.attributes);
            this.ui.controlTitle.after(e)
        }, onAfterExternalChange: function () {
            this.hideTooltip(), this.applySavedValue()
        }, addTooltip: function () {
            this.ui.tooltipTarget && this.ui.tooltipTarget.tipsy({
                gravity: function () {
                    var e = jQuery(this).data("tooltip-pos");
                    return void 0 !== e ? e : "n"
                }, title: function () {
                    return this.getAttribute("data-tooltip")
                }
            })
        }, hideTooltip: function () {
            this.ui.tooltipTarget && this.ui.tooltipTarget.tipsy("hide")
        }, updateElementModel: function (e) {
            this.setValue(e)
        }
    }, {
        getStyleValue: function (e, t, n) {
            return "DEFAULT" === e ? n.default : t
        }, onPasteStyle: function () {
            return !0
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = navigator.userAgent;
    t.default = {
        webkit: -1 !== i.indexOf("AppleWebKit"),
        firefox: -1 !== i.indexOf("Firefox"),
        ie: /Trident|MSIE/.test(i),
        edge: -1 !== i.indexOf("Edge"),
        mac: -1 !== i.indexOf("Macintosh")
    }
}, function (e, t, n) {
    "use strict";
    var i, o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    };
    i = n(0).extend({
        applySavedValue: function () {
            var e = this.getControlValue(), t = this.$("[data-setting]"), n = this;
            _.each(e, function (e, i) {
                var o = t.filter(function () {
                    return i === this.dataset.setting
                });
                n.setInputValue(o, e)
            })
        }, getControlValue: function (e) {
            var t = this.elementSettingsModel.get(this.model.get("name"));
            if (!jQuery.isPlainObject(t)) return {};
            if (e) {
                var n = t[e];
                return void 0 === n && (n = ""), n
            }
            return elementorCommon.helpers.cloneObject(t)
        }, setValue: function (e, t) {
            var n = this.getControlValue();
            "object" === (void 0 === e ? "undefined" : o(e)) ? _.each(e, function (e, t) {
                n[t] = e
            }) : n[e] = t, this.setSettingsModel(n)
        }, updateElementModel: function (e, t) {
            var n = t.dataset.setting;
            this.setValue(n, e)
        }
    }, {
        getStyleValue: function (e, t) {
            return _.isObject(t) ? t[e.toLowerCase()] : ""
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.CompositeView.extend({
        ui: function () {
            return {controlTitle: ".elementor-control-title"}
        }, behaviors: function () {
            return elementor.hooks.applyFilters("controls/base/behaviors", {}, this)
        }, getBehavior: function (e) {
            return this._behaviors[Object.keys(this.behaviors()).indexOf(e)]
        }, className: function () {
            var e = "elementor-control elementor-control-" + this.model.get("name") + " elementor-control-type-" + this.model.get("type"),
                t = this.model.get("classes"), n = this.model.get("responsive");
            return _.isEmpty(t) || (e += " " + t), _.isEmpty(n) || (e += " elementor-control-responsive-" + n.max), e
        }, templateHelpers: function () {
            var e = {_cid: this.model.cid};
            return {data: _.extend({}, this.model.toJSON(), e)}
        }, getTemplate: function () {
            return Marionette.TemplateCache.get("#tmpl-elementor-control-" + this.model.get("type") + "-content")
        }, initialize: function (e) {
            this.elementSettingsModel = e.elementSettingsModel;
            var t = this.model.get("type"),
                n = jQuery.extend(!0, {}, elementor.config.controls[t], this.model.attributes);
            this.model.set(n), this.listenTo(this.elementSettingsModel, "change", this.toggleControlVisibility)
        }, toggleControlVisibility: function () {
            var e = elementor.helpers.isActiveControl(this.model, this.elementSettingsModel.attributes);
            this.$el.toggleClass("elementor-hidden-control", !e), elementor.getPanelView().updateScrollbar()
        }, onRender: function () {
            var e = this.model.get("label_block") ? "block" : "inline", t = this.model.get("show_label"),
                n = "elementor-label-" + e;
            n += " elementor-control-separator-" + this.model.get("separator"), t || (n += " elementor-control-hidden-label"), this.$el.addClass(n), this.toggleControlVisibility()
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = n(0).extend({
        getSelect2Placeholder: function () {
            return this.ui.select.children('option:first[value=""]').text()
        }, getSelect2DefaultOptions: function () {
            return {
                allowClear: !0,
                placeholder: this.getSelect2Placeholder(),
                dir: elementorCommon.config.isRTL ? "rtl" : "ltr"
            }
        }, getSelect2Options: function () {
            return jQuery.extend(this.getSelect2DefaultOptions(), this.model.get("select2options"))
        }, onReady: function () {
            this.ui.select.select2(this.getSelect2Options())
        }, onBeforeDestroy: function () {
            this.ui.select.data("select2") && this.ui.select.select2("destroy"), this.$el.remove()
        }
    }), e.exports = i
}, , , function (e, t, n) {
    "use strict";
    var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, o = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(n(1));
    var r, s = n(10), l = n(9), a = n(26);
    r = a.extend({
        tagName: "div",
        controlsCSSParser: null,
        allowRender: !0,
        toggleEditTools: !1,
        renderAttributes: {},
        className: function () {
            var e = "elementor-element elementor-element-edit-mode " + this.getElementUniqueID();
            return this.toggleEditTools && (e += " elementor-element--toggle-edit-tools"), e
        },
        attributes: function () {
            return {"data-id": this.getID(), "data-element_type": this.model.get("elType")}
        },
        ui: function () {
            return {
                tools: "> .elementor-element-overlay > .elementor-editor-element-settings",
                editButton: "> .elementor-element-overlay .elementor-editor-element-edit",
                duplicateButton: "> .elementor-element-overlay .elementor-editor-element-duplicate",
                addButton: "> .elementor-element-overlay .elementor-editor-element-add",
                removeButton: "> .elementor-element-overlay .elementor-editor-element-remove"
            }
        },
        behaviors: function () {
            var e = elementor.hooks.applyFilters("elements/" + this.options.model.get("elType") + "/contextMenuGroups", this.getContextMenuGroups(), this),
                t = {contextMenu: {behaviorClass: n(8), groups: e}};
            return elementor.hooks.applyFilters("elements/base/behaviors", t, this)
        },
        getBehavior: function (e) {
            return this._behaviors[Object.keys(this.behaviors()).indexOf(e)]
        },
        events: function () {
            return {
                mousedown: "onMouseDown",
                "click @ui.editButton": "onEditButtonClick",
                "click @ui.duplicateButton": "onDuplicateButtonClick",
                "click @ui.addButton": "onAddButtonClick",
                "click @ui.removeButton": "onRemoveButtonClick"
            }
        },
        getElementType: function () {
            return this.model.get("elType")
        },
        getIDInt: function () {
            return parseInt(this.getID(), 16)
        },
        getChildType: function () {
            return elementor.helpers.getElementChildType(this.getElementType())
        },
        getChildView: function (e) {
            var t, i = e.get("elType");
            return t = "section" === i ? n(27) : "column" === i ? n(96) : elementor.modules.elements.views.Widget, elementor.hooks.applyFilters("element/view", t, e, this)
        },
        getTemplateType: function () {
            return "js"
        },
        getEditModel: function () {
            return this.model
        },
        getContextMenuGroups: function () {
            var e = o.default.mac ? "⌘" : "^";
            return [{
                name: "general",
                actions: [{
                    name: "edit",
                    icon: "eicon-edit",
                    title: elementor.translate("edit_element", [this.options.model.getTitle()]),
                    callback: this.options.model.trigger.bind(this.options.model, "request:edit")
                }, {
                    name: "duplicate",
                    icon: "eicon-clone",
                    title: elementor.translate("duplicate"),
                    shortcut: e + "+D",
                    callback: this.duplicate.bind(this)
                }]
            }, {
                name: "transfer",
                actions: [{
                    name: "copy",
                    title: elementor.translate("copy"),
                    shortcut: e + "+C",
                    callback: this.copy.bind(this)
                }, {
                    name: "paste",
                    title: elementor.translate("paste"),
                    shortcut: e + "+V",
                    callback: this.paste.bind(this),
                    isEnabled: this.isPasteEnabled.bind(this)
                }, {
                    name: "pasteStyle",
                    title: elementor.translate("paste_style"),
                    shortcut: e + "+⇧+V",
                    callback: this.pasteStyle.bind(this),
                    isEnabled: function () {
                        return !!elementorCommon.storage.get("transfer")
                    }
                }, {
                    name: "resetStyle",
                    title: elementor.translate("reset_style"),
                    callback: this.resetStyle.bind(this)
                }]
            }, {
                name: "delete",
                actions: [{
                    name: "delete",
                    icon: "eicon-trash",
                    title: elementor.translate("delete"),
                    shortcut: "⌦",
                    callback: this.removeElement.bind(this)
                }]
            }]
        },
        initialize: function () {
            a.prototype.initialize.apply(this, arguments), this.collection && this.listenTo(this.collection, "add remove reset", this.onCollectionChanged, this);
            var e = this.getEditModel();
            this.listenTo(e.get("settings"), "change", this.onSettingsChanged).listenTo(e.get("editSettings"), "change", this.onEditSettingsChanged).listenTo(this.model, "request:edit", this.onEditRequest).listenTo(this.model, "request:toggleVisibility", this.toggleVisibility), this.initControlsCSSParser()
        },
        startTransport: function (e) {
            elementorCommon.storage.set("transfer", {
                type: e,
                elementsType: this.getElementType(),
                elements: [this.model.toJSON({copyHtmlCache: !0})]
            })
        },
        copy: function () {
            this.startTransport("copy")
        },
        cut: function () {
            this.startTransport("cut")
        },
        paste: function () {
            this.trigger("request:paste")
        },
        isPasteEnabled: function () {
            var e = elementorCommon.storage.get("transfer");
            return !(!e || this.isCollectionFilled()) && this.getElementType() === e.elementsType
        },
        isStyleTransferControl: function (e) {
            return void 0 !== e.style_transfer ? e.style_transfer : "content" !== e.tab || e.selectors || e.prefix_class
        },
        duplicate: function () {
            var e = elementorCommon.storage.get("transfer");
            this.copy(), this.paste(), elementorCommon.storage.set("transfer", e)
        },
        pasteStyle: function () {
            var e = this, t = elementorCommon.storage.get("transfer").elements[0].settings, n = e.getEditModel(),
                o = n.get("settings"), r = o.attributes, s = o.controls, l = {};
            jQuery.each(s, function (n, o) {
                if (e.isStyleTransferControl(o)) {
                    var s = t[n], a = r[n];
                    if (void 0 !== s && void 0 !== a && !("object" === (void 0 === s ? "undefined" : i(s)) ^ "object" === (void 0 === a ? "undefined" : i(a)))) {
                        if ("object" === (void 0 === s ? "undefined" : i(s))) {
                            var c = !0;
                            if (jQuery.each(s, function (e) {
                                    if (s[e] !== a[e]) return c = !1
                                }), c) return
                        }
                        if (s !== a) elementor.getControlView(o.type).onPasteStyle(o, s) && (l[n] = s)
                    }
                }
            }), e.allowRender = !1, elementor.channels.data.trigger("element:before:paste:style", n), n.setSetting(l), elementor.channels.data.trigger("element:after:paste:style", n), e.allowRender = !0, e.renderOnChange()
        },
        resetStyle: function () {
            var e = this, t = e.getEditModel(), n = t.get("settings").controls, i = {};
            e.allowRender = !1, elementor.channels.data.trigger("element:before:reset:style", t), jQuery.each(n, function (t, n) {
                e.isStyleTransferControl(n) && (i[t] = n.default)
            }), t.setSetting(i), elementor.channels.data.trigger("element:after:reset:style", t), e.allowRender = !0, e.renderOnChange()
        },
        toggleVisibility: function () {
            this.model.set("hidden", !this.model.get("hidden")), this.toggleVisibilityClass()
        },
        toggleVisibilityClass: function () {
            this.$el.toggleClass("elementor-edit-hidden", !!this.model.get("hidden"))
        },
        addElementFromPanel: function (e) {
            e = e || {};
            var t = elementor.channels.panelElements.request("element:selected"), n = {elType: t.model.get("elType")};
            if ("widget" === n.elType) n.widgetType = t.model.get("widgetType"); else {
                if ("section" !== n.elType) return;
                n.isInner = !0
            }
            var i = t.model.get("custom");
            i && jQuery.extend(n, i), e.trigger = {
                beforeAdd: "element:before:add",
                afterAdd: "element:after:add"
            }, e.onAfterAdd = function (e, t) {
                "section" === t.getElementType() && t.isInner() && t.addChildElement()
            }, this.addChildElement(n, e)
        },
        addControlValidator: function (e, t) {
            t = t.bind(this);
            var n = new l({customValidationMethod: t}), i = this.getEditModel().get("settings").validators;
            i[e] || (i[e] = []), i[e].push(n)
        },
        addRenderAttribute: function (e, t, n, o) {
            var r = this;
            return "object" === (void 0 === e ? "undefined" : i(e)) ? (jQuery.each(e, function (e) {
                r.addRenderAttribute(e, this, null, o)
            }), r) : "object" === (void 0 === t ? "undefined" : i(t)) ? (jQuery.each(t, function (t) {
                r.addRenderAttribute(e, t, this, o)
            }), r) : (r.renderAttributes[e] || (r.renderAttributes[e] = {}), r.renderAttributes[e][t] || (r.renderAttributes[e][t] = []), Array.isArray(n) || (n = [n]), void(r.renderAttributes[e][t] = o ? n : r.renderAttributes[e][t].concat(n)))
        },
        getRenderAttributeString: function (e) {
            if (!this.renderAttributes[e]) return "";
            var t = this.renderAttributes[e], n = [];
            return jQuery.each(t, function (e) {
                n.push(e + '="' + _.escape(this.join(" ")) + '"')
            }), n.join(" ")
        },
        isInner: function () {
            return !!this.model.get("isInner")
        },
        initControlsCSSParser: function () {
            this.controlsCSSParser = new s({
                id: this.model.cid,
                settingsModel: this.getEditModel().get("settings"),
                dynamicParsing: this.getDynamicParsingSettings()
            })
        },
        enqueueFonts: function () {
            var e = this.getEditModel(), t = e.get("settings");
            _.each(t.getFontControls(), function (t) {
                var n = e.getSetting(t.name);
                _.isEmpty(n) || elementor.helpers.enqueueFont(n)
            })
        },
        renderStyles: function (e) {
            e || (e = this.getEditModel().get("settings")), this.controlsCSSParser.stylesheet.empty(), this.controlsCSSParser.addStyleRules(e.getStyleControls(), e.attributes, this.getEditModel().get("settings").controls, [/{{ID}}/g, /{{WRAPPER}}/g], [this.getID(), "#elementor ." + this.getElementUniqueID()]), this.controlsCSSParser.addStyleToDocument();
            var t = elementor.hooks.applyFilters("editor/style/styleText", "", this);
            t && this.controlsCSSParser.elements.$stylesheetElement.append(t)
        },
        renderCustomClasses: function () {
            var e = this, t = e.getEditModel().get("settings"), n = t.getClassControls();
            _.each(n, function (n) {
                var i = t.previous(n.name);
                n.classes_dictionary && void 0 !== n.classes_dictionary[i] && (i = n.classes_dictionary[i]), e.$el.removeClass(n.prefix_class + i)
            }), _.each(n, function (n) {
                var i = t.attributes[n.name], o = i;
                n.classes_dictionary && void 0 !== n.classes_dictionary[i] && (o = n.classes_dictionary[i]), elementor.helpers.isActiveControl(n, t.attributes) && (o || 0 === o) && e.$el.addClass(n.prefix_class + o)
            }), e.$el.addClass(_.result(e, "className")), e.toggleVisibilityClass()
        },
        renderCustomElementID: function () {
            var e = this.getEditModel().get("settings").get("_element_id");
            this.$el.attr("id", e)
        },
        renderUI: function () {
            this.renderStyles(), this.renderCustomClasses(), this.renderCustomElementID(), this.enqueueFonts()
        },
        runReadyTrigger: function () {
            var e = this;
            _.defer(function () {
                elementorFrontend.elementsHandler.runReadyTrigger(e.el), elementorFrontend.isEditMode() && e.$el.find(".elementor-element.elementor-" + e.model.get("elType") + ":not(.elementor-element-edit-mode)").each(function () {
                    elementorFrontend.elementsHandler.runReadyTrigger(this)
                })
            })
        },
        getID: function () {
            return this.model.get("id")
        },
        getElementUniqueID: function () {
            return "elementor-element-" + this.getID()
        },
        renderOnChange: function (e) {
            if (this.allowRender) {
                if (e instanceof elementorModules.editor.elements.models.BaseSettings) {
                    var t = e.hasChanged(), n = !t, i = !t;
                    if (_.each(e.changedAttributes(), function (t, o) {
                            var r = e.getControl(o);
                            if ("_column_size" !== o) {
                                if (!r) return i = !0, void(n = !0);
                                "none" !== r.render_type && (i = !0), -1 === ["none", "ui"].indexOf(r.render_type) && ("template" !== r.render_type && (e.isStyleControl(o) || e.isClassControl(o) || "_element_id" === o) || (n = !0))
                            } else i = !0
                        }), !i) return;
                    if (!n) return void this.renderUI()
                }
                var o = this.getTemplateType(), r = this.getEditModel();
                "js" === o ? (this.getEditModel().setHtmlCache(), this.render(), r.renderOnLeave = !0) : r.renderRemoteServer()
            }
        },
        getDynamicParsingSettings: function () {
            var e = this;
            return {
                onServerRequestStart: function () {
                    e.$el.addClass("elementor-loading")
                }, onServerRequestEnd: function () {
                    e.render(), e.$el.removeClass("elementor-loading")
                }
            }
        },
        serializeData: function () {
            var e = a.prototype.serializeData.apply(this, arguments);
            return e.settings = this.getEditModel().get("settings").parseDynamicSettings(e.settings, this.getDynamicParsingSettings()), e
        },
        save: function () {
            var e = this.model;
            elementor.templates.startModal({
                onReady: function () {
                    elementor.templates.getLayout().showSaveTemplateView(e)
                }
            })
        },
        removeElement: function () {
            elementor.channels.data.trigger("element:before:remove", this.model);
            var e = this._parent;
            e.isManualRemoving = !0, this.model.destroy(), e.isManualRemoving = !1, elementor.channels.data.trigger("element:after:remove", this.model)
        },
        onBeforeRender: function () {
            this.renderAttributes = {}
        },
        onRender: function () {
            if (this.renderUI(), this.runReadyTrigger(), this.toggleEditTools) {
                var e = this.ui.editButton;
                this.ui.tools.hoverIntent(function () {
                    e.addClass("elementor-active")
                }, function () {
                    e.removeClass("elementor-active")
                }, {timeout: 500})
            }
        },
        onCollectionChanged: function () {
            elementor.saver.setFlagEditorChange(!0)
        },
        onEditSettingsChanged: function (e) {
            elementor.channels.editor.trigger("change:editSettings", e, this)
        },
        onSettingsChanged: function (e) {
            elementor.saver.setFlagEditorChange(!0), this.renderOnChange(e)
        },
        onEditButtonClick: function () {
            this.model.trigger("request:edit")
        },
        onEditRequest: function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            if ("edit" === elementor.channels.dataEditMode.request("activeMode")) {
                var t = this.getEditModel(), n = elementor.getPanelView();
                "editor" === n.getCurrentPageName() && n.getCurrentPageView().model === t || (e.scrollIntoView && elementor.helpers.scrollToView(this.$el, 200), n.openEditor(t, this))
            }
        },
        onDuplicateButtonClick: function (e) {
            e.stopPropagation(), this.duplicate()
        },
        onRemoveButtonClick: function (e) {
            e.stopPropagation(), this.removeElement()
        },
        onMouseDown: function (e) {
            jQuery(e.target).closest(".elementor-inline-editing").length || elementorFrontend.elements.window.document.activeElement.blur()
        },
        onDestroy: function () {
            this.controlsCSSParser.removeStyleFromDocument(), this.getEditModel().get("settings").validators = {}, elementor.channels.data.trigger("element:destroy", this.model)
        }
    }), e.exports = r
}, function (e, t, n) {
    "use strict";
    var i = n(94);
    e.exports = Marionette.Behavior.extend({
        defaults: {groups: [], eventTargets: ["el"]}, events: function () {
            var e = {};
            return this.getOption("eventTargets").forEach(function (t) {
                var n = "contextmenu";
                "el" !== t && (n += " " + t), e[n] = "onContextMenu"
            }), e
        }, initialize: function () {
            this.listenTo(this.view.options.model, "request:contextmenu", this.onRequestContextMenu)
        }, initContextMenu: function () {
            var e = this.getOption("groups"), t = _.findWhere(e, {name: "delete"}), n = e.indexOf(t);
            -1 === n && (n = e.length), e.splice(n, 0, {
                name: "tools",
                actions: [{
                    name: "navigator",
                    title: elementor.translate("navigator"),
                    callback: elementor.navigator.open.bind(elementor.navigator, this.view.model)
                }]
            }), this.contextMenu = new i({groups: e}), this.contextMenu.getModal().on("hide", this.onContextMenuHide)
        }, getContextMenu: function () {
            return this.contextMenu || this.initContextMenu(), this.contextMenu
        }, onContextMenu: function (e) {
            !elementorCommon.hotKeys.isControlEvent(e) && elementor.userCan("design") && "edit" === elementor.channels.dataEditMode.request("activeMode") && (e.preventDefault(), e.stopPropagation(), this.getContextMenu().show(e), elementor.channels.editor.reply("contextMenu:targetView", this.view))
        }, onRequestContextMenu: function (e) {
            var t = this.getContextMenu().getModal(), n = t.getSettings("iframe"),
                i = _.findWhere(this.contextMenu.getSettings("groups"), {name: "tools"});
            i.isVisible = !1, t.setSettings("iframe", null), this.onContextMenu(e), i.isVisible = !0, t.setSettings("iframe", n)
        }, onContextMenuHide: function () {
            elementor.channels.editor.reply("contextMenu:targetView", null)
        }, onDestroy: function () {
            this.contextMenu && this.contextMenu.destroy()
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = elementorModules.Module.extend({
        errors: [], __construct: function (e) {
            var t = e.customValidationMethod;
            t && (this.validationMethod = t)
        }, getDefaultSettings: function () {
            return {validationTerms: {}}
        }, isValid: function () {
            var e = this.validationMethod.apply(this, arguments);
            return !e.length || (this.errors = e, !1)
        }, validationMethod: function (e) {
            var t = [];
            return this.getSettings("validationTerms").required && (("" + e).length || t.push("Required value is empty")), t
        }
    })
}, function (e, t, n) {
    "use strict";
    var i, o = n(22);
    (i = elementorModules.ViewModule.extend({
        stylesheet: null, getDefaultSettings: function () {
            return {id: 0, settingsModel: null, dynamicParsing: {}}
        }, getDefaultElements: function () {
            return {$stylesheetElement: jQuery("<style>", {id: "elementor-style-" + this.getSettings("id")})}
        }, initStylesheet: function () {
            var e = elementorFrontend.config.breakpoints;
            this.stylesheet = new o, this.stylesheet.addDevice("mobile", 0).addDevice("tablet", e.md).addDevice("desktop", e.lg)
        }, addStyleRules: function (e, t, n, i, o) {
            var r = this,
                s = r.getSettings("settingsModel").parseDynamicSettings(t, r.getSettings("dynamicParsing"), e);
            _.each(e, function (e) {
                e.styleFields && e.styleFields.length && r.addRepeaterControlsStyleRules(t[e.name], e.styleFields, n, i, o), e.dynamic && e.dynamic.active && t.__dynamic__ && t.__dynamic__[e.name] && r.addDynamicControlStyleRules(t.__dynamic__[e.name], e), e.selectors && r.addControlStyleRules(e, s, n, i, o)
            })
        }, addControlStyleRules: function (e, t, n, o, r) {
            var s = this;
            i.addControlStyleRules(this.stylesheet, e, n, function (e) {
                return s.getStyleControlValue(e, t)
            }, o, r)
        }, getStyleControlValue: function (e, t) {
            var n = t[e.name];
            if (e.selectors_dictionary && (n = e.selectors_dictionary[n] || n), _.isNumber(n) || !_.isEmpty(n)) return n
        }, addRepeaterControlsStyleRules: function (e, t, n, i, o) {
            var r = this;
            t.forEach(function (t, s) {
                var l = e.models[s];
                r.addStyleRules(t, l.attributes, n, i.concat(["{{CURRENT_ITEM}}"]), o.concat([".elementor-repeater-item-" + l.get("_id")]))
            })
        }, addDynamicControlStyleRules: function (e, t) {
            var n = this;
            elementor.dynamicTags.parseTagsText(e, t.dynamic, function (e, t, i) {
                var o = elementor.dynamicTags.createTag(e, t, i);
                if (o) {
                    var r = o.model;
                    r.getStyleControls().length && n.addStyleRules(r.getStyleControls(), r.attributes, r.controls, ["{{WRAPPER}}"], ["#elementor-tag-" + e])
                }
            })
        }, addStyleToDocument: function () {
            elementor.$previewContents.find("head").append(this.elements.$stylesheetElement), this.elements.$stylesheetElement.text(this.stylesheet)
        }, removeStyleFromDocument: function () {
            this.elements.$stylesheetElement.remove()
        }, onInit: function () {
            elementorModules.ViewModule.prototype.onInit.apply(this, arguments), this.initStylesheet()
        }
    })).addControlStyleRules = function (e, t, n, o, r, s) {
        var l = o(t);
        void 0 !== l && _.each(t.selectors, function (a, c) {
            var u;
            try {
                u = a.replace(/{{(?:([^.}]+)\.)?([^}| ]*)(?: *\|\| *(?:([^.}]+)\.)?([^}| ]*) *)*}}/g, function (e, r, s, a, c) {
                    var u = r && !n[r], d = "";
                    if (u || (d = i.parsePropertyPlaceholder(t, l, n, o, s, r)), !d && 0 !== d) {
                        if (c) {
                            var m = (d = c).match(/^(['"])(.*)\1$/);
                            if (m) d = m[2]; else if (!isFinite(d)) {
                                if (a && !n[a]) return "";
                                d = i.parsePropertyPlaceholder(t, l, n, o, c, a)
                            }
                        }
                        if (!d && 0 !== d) {
                            if (u) return "";
                            throw""
                        }
                    }
                    return d
                })
            } catch (e) {
                return
            }
            if (!_.isEmpty(u)) {
                var d = /^(?:\([^)]+\)){1,2}/, m = c.match(d), h = {};
                if (m) {
                    m = m[0], c = c.replace(d, "");
                    var p, g = /\(([^)]+)\)/g, f = [];
                    for (p = g.exec(m); p;) f.push(p[1]), p = g.exec(m);
                    _.each(f, function (e) {
                        if ("desktop" !== e) {
                            var t = e.replace(/\+$/, "");
                            h[t === e ? "max" : "min"] = t
                        }
                    })
                }
                _.each(r, function (e, t) {
                    var n = e.source ? e.source : e, i = new RegExp(n, "g");
                    c = c.replace(i, s[t])
                }), !Object.keys(h).length && t.responsive && "desktop" === (h = _.pick(elementorCommon.helpers.cloneObject(t.responsive), ["min", "max"])).max && delete h.max, e.addRules(c, u, h)
            }
        })
    }, i.parsePropertyPlaceholder = function (e, t, n, i, o, r) {
        return r && (t = i(e = _.findWhere(n, {name: r}))), elementor.getControlView(e.type).getStyleValue(o, t, e)
    }, e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.Behavior.extend({
        defaults: {elChildType: "widget"},
        events: {
            sortstart: "onSortStart",
            sortreceive: "onSortReceive",
            sortupdate: "onSortUpdate",
            sortover: "onSortOver",
            sortout: "onSortOut"
        },
        initialize: function () {
            this.listenTo(elementor.channels.dataEditMode, "switch", this.onEditModeSwitched).listenTo(this.view.options.model, "request:sort:start", this.startSort).listenTo(this.view.options.model, "request:sort:update", this.updateSort).listenTo(this.view.options.model, "request:sort:receive", this.receiveSort)
        },
        onEditModeSwitched: function (e) {
            "edit" === e ? this.activate() : this.deactivate()
        },
        onRender: function () {
            var e = this;
            _.defer(function () {
                e.onEditModeSwitched(elementor.channels.dataEditMode.request("activeMode"))
            })
        },
        onDestroy: function () {
            this.deactivate()
        },
        activate: function () {
            if (elementor.userCan("design") && !this.getChildViewContainer().sortable("instance")) {
                var e = this.getChildViewContainer(), t = {
                    connectWith: e.selector,
                    placeholder: "elementor-sortable-placeholder elementor-" + this.getOption("elChildType") + "-placeholder",
                    cursorAt: {top: 20, left: 25},
                    helper: this._getSortableHelper.bind(this),
                    cancel: "input, textarea, button, select, option, .elementor-inline-editing, .elementor-tab-title"
                }, n = _.extend(t, this.view.getSortableOptions());
                e.sortable(n)
            }
        },
        _getSortableHelper: function (e, t) {
            var n = this.view.collection.get({cid: t.data("model-cid")});
            return '<div style="height: 84px; width: 125px;" class="elementor-sortable-helper elementor-sortable-helper-' + n.get("elType") + '"><div class="icon"><i class="' + n.getIcon() + '"></i></div><div class="elementor-element-title-wrapper"><div class="title">' + n.getTitle() + "</div></div></div>"
        },
        getChildViewContainer: function () {
            return this.view.getChildViewContainer(this.view)
        },
        deactivate: function () {
            var e = this.getChildViewContainer();
            e.sortable("instance") && e.sortable("destroy")
        },
        startSort: function (e, t) {
            e.stopPropagation();
            var n = this.view.collection.get({cid: t.item.data("model-cid")});
            elementor.channels.data.reply("dragging:model", n).reply("dragging:parent:view", this.view).trigger("drag:start", n).trigger(n.get("elType") + ":drag:start")
        },
        updateSort: function (e) {
            var t = elementor.channels.data.request("dragging:model"), n = e.item, i = this.view.collection,
                o = n.parent().children().index(n), r = this.view.children.findByModelCid(t.cid);
            this.view.addChildElement(t.clone(), {
                at: o,
                trigger: {beforeAdd: "drag:before:update", afterAdd: "drag:after:update"},
                onBeforeAdd: function () {
                    r._isRendering = !0, i.remove(t)
                }
            }), elementor.saver.setFlagEditorChange(!0)
        },
        receiveSort: function (e, t) {
            if (e.stopPropagation(), this.view.isCollectionFilled()) jQuery(t.sender).sortable("cancel"); else {
                var n = elementor.channels.data.request("dragging:model"),
                    i = "section" === n.get("elType") && n.get("isInner"),
                    o = "column" === this.view.getElementType() && this.view.isInner();
                if (i && o) jQuery(t.sender).sortable("cancel"); else {
                    var r = t.item.index(), s = n.toJSON({copyHtmlCache: !0});
                    this.view.addChildElement(s, {
                        at: r,
                        trigger: {beforeAdd: "drag:before:update", afterAdd: "drag:after:update"},
                        onAfterAdd: function () {
                            var e = elementor.channels.data.request("dragging:parent:view");
                            e.isManualRemoving = !0, n.destroy(), e.isManualRemoving = !1
                        }
                    })
                }
            }
        },
        onSortStart: function (e, t) {
            if ("column" === this.options.elChildType) {
                var n = 0;
                t.item.data("sortableItem").items.forEach(function (e) {
                    if (e.item[0] === t.item[0]) return n = e.height, !1
                }), t.placeholder.height(n)
            }
            this.startSort(e, t)
        },
        onSortOver: function (e) {
            e.stopPropagation();
            var t = elementor.channels.data.request("dragging:model");
            jQuery(e.target).addClass("elementor-draggable-over").attr({
                "data-dragged-element": t.get("elType"),
                "data-dragged-is-inner": t.get("isInner")
            }), this.$el.addClass("elementor-dragging-on-child")
        },
        onSortOut: function (e) {
            e.stopPropagation(), jQuery(e.target).removeClass("elementor-draggable-over").removeAttr("data-dragged-element data-dragged-is-inner"), this.$el.removeClass("elementor-dragging-on-child")
        },
        onSortReceive: function (e, t) {
            this.receiveSort(e, t)
        },
        onSortUpdate: function (e, t) {
            e.stopPropagation(), this.getChildViewContainer()[0] === t.item.parent()[0] && this.updateSort(t)
        },
        onAddChild: function (e) {
            e.$el.attr("data-model-cid", e.model.cid)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.Behavior.extend({
        onRenderCollection: function () {
            this.handleInnerTabs(this.view)
        }, handleInnerTabs: function (e) {
            var t = e.children.filter(function (e) {
                return "tabs" === e.model.get("type")
            });
            _.each(t, function (t) {
                t.$el.find(".elementor-control-content").remove();
                var n = t.model.get("name"), i = e.children.filter(function (e) {
                    return "tab" === e.model.get("type") && e.model.get("tabs_wrapper") === n
                });
                _.each(i, function (n, i) {
                    t._addChildView(n);
                    var o = n.model.get("name"), r = e.children.filter(function (e) {
                        return o === e.model.get("inner_tab")
                    });
                    0 === i ? n.$el.addClass("elementor-tab-active") : _.each(r, function (e) {
                        e.$el.addClass("elementor-tab-close")
                    })
                })
            })
        }, onChildviewControlTabClicked: function (e) {
            var t = e.model.get("name"), n = this.view.children.filter(function (t) {
                return "tab" !== t.model.get("type") && e.model.get("tabs_wrapper") === t.model.get("tabs_wrapper")
            }), i = this.view.children.filter(function (t) {
                return "tab" === t.model.get("type") && e.model.get("tabs_wrapper") === t.model.get("tabs_wrapper")
            });
            _.each(i, function (e) {
                e.$el.removeClass("elementor-tab-active")
            }), e.$el.addClass("elementor-tab-active"), _.each(n, function (e) {
                e.model.get("inner_tab") === t ? e.$el.removeClass("elementor-tab-close") : e.$el.addClass("elementor-tab-close")
            }), elementor.getPanelView().updateScrollbar()
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    e.exports = function () {
        var e, t = Array.prototype.slice, n = {actions: {}, filters: {}};

        function i(e, t, i, o) {
            var r, s, l;
            if (n[e][t]) if (i) if (r = n[e][t], o) for (l = r.length; l--;) (s = r[l]).callback === i && s.context === o && r.splice(l, 1); else for (l = r.length; l--;) r[l].callback === i && r.splice(l, 1); else n[e][t] = []
        }

        function o(e, t, i, o, r) {
            var s = {callback: i, priority: o, context: r}, l = n[e][t];
            if (l) {
                var a = !1;
                if (jQuery.each(l, function () {
                        if (this.callback === i) return a = !0, !1
                    }), a) return;
                l.push(s), l = function (e) {
                    for (var t, n, i, o = 1, r = e.length; o < r; o++) {
                        for (t = e[o], n = o; (i = e[n - 1]) && i.priority > t.priority;) e[n] = e[n - 1], --n;
                        e[n] = t
                    }
                    return e
                }(l)
            } else l = [s];
            n[e][t] = l
        }

        function r(e, t, i) {
            var o, r, s = n[e][t];
            if (!s) return "filters" === e && i[0];
            if (r = s.length, "filters" === e) for (o = 0; o < r; o++) i[0] = s[o].callback.apply(s[o].context, i); else for (o = 0; o < r; o++) s[o].callback.apply(s[o].context, i);
            return "filters" !== e || i[0]
        }

        return e = {
            removeFilter: function (t, n) {
                return "string" == typeof t && i("filters", t, n), e
            }, applyFilters: function () {
                var n = t.call(arguments), i = n.shift();
                return "string" == typeof i ? r("filters", i, n) : e
            }, addFilter: function (t, n, i, r) {
                return "string" == typeof t && "function" == typeof n && o("filters", t, n, i = parseInt(i || 10, 10), r), e
            }, removeAction: function (t, n) {
                return "string" == typeof t && i("actions", t, n), e
            }, doAction: function () {
                var n = t.call(arguments), i = n.shift();
                return "string" == typeof i && r("actions", i, n), e
            }, addAction: function (t, n, i, r) {
                return "string" == typeof t && "function" == typeof n && o("actions", t, n, i = parseInt(i || 10, 10), r), e
            }
        }
    }
}, function (e, t, n) {
    "use strict";
    var i = n(10);
    e.exports = elementorModules.ViewModule.extend({
        model: null,
        hasChange: !1,
        changeCallbacks: {},
        addChangeCallback: function (e, t) {
            this.changeCallbacks[e] = t
        },
        bindEvents: function () {
            elementor.on("preview:loaded", this.onElementorPreviewLoaded), this.model.on("change", this.onModelChange)
        },
        addPanelPage: function () {
            var e = this.getSettings("name");
            elementor.getPanelView().addPage(e + "_settings", {
                view: elementor.settings.panelPages[e] || elementor.settings.panelPages.base,
                title: this.getSettings("panelPage.title"),
                options: {model: this.model, controls: this.model.controls, name: e}
            })
        },
        updateStylesheet: function (e) {
            var t = this.getControlsCSS();
            e || t.stylesheet.empty(), t.addStyleRules(this.model.getStyleControls(), this.model.attributes, this.model.controls, [/{{WRAPPER}}/g], [this.getSettings("cssWrapperSelector")]), t.addStyleToDocument()
        },
        initModel: function () {
            this.model = new elementorModules.editor.elements.models.BaseSettings(this.getSettings("settings"), {controls: this.getSettings("controls")})
        },
        initControlsCSSParser: function () {
            var e;
            this.getControlsCSS = function () {
                return e || (e = new i({
                    id: this.getSettings("name"),
                    settingsModel: this.model
                }), this.controlsCSS = e), e
            }
        },
        getDataToSave: function (e) {
            return e
        },
        save: function (e) {
            var t = this;
            if (t.hasChange) {
                var n = this.model.toJSON({remove: ["default"]}), i = this.getDataToSave({data: n});
                NProgress.start(), elementorCommon.ajax.addRequest("save_" + this.getSettings("name") + "_settings", {
                    data: i,
                    success: function () {
                        NProgress.done(), t.setSettings("settings", n), t.hasChange = !1, e && e.apply(t, arguments)
                    },
                    error: function () {
                        alert("An error occurred")
                    }
                })
            }
        },
        addPanelMenuItem: function () {
            var e = this.getSettings("panelPage.menu");
            if (e) {
                var t = {
                    icon: e.icon,
                    title: this.getSettings("panelPage.title"),
                    type: "page",
                    pageName: this.getSettings("name") + "_settings"
                };
                elementor.modules.layouts.panel.pages.menu.Menu.addItem(t, "settings", e.beforeItem)
            }
        },
        onInit: function () {
            this.initModel(), this.initControlsCSSParser(), this.addPanelMenuItem(), this.debounceSave = _.debounce(this.save, 3e3), elementorModules.ViewModule.prototype.onInit.apply(this, arguments)
        },
        onModelChange: function (e) {
            var t = this;
            t.hasChange = !0, this.getControlsCSS().stylesheet.empty(), _.each(e.changed, function (e, n) {
                t.changeCallbacks[n] && t.changeCallbacks[n].call(t, e)
            }), t.updateStylesheet(!0), t.debounceSave()
        },
        onElementorPreviewLoaded: function () {
            this.updateStylesheet(), this.addPanelPage(), elementor.userCan("design") || elementor.panel.currentView.setPage("page_settings")
        }
    })
}, , , , , , , function (e, t, n) {
    "use strict";
    e.exports = Marionette.Region.extend({
        storage: null, storageSizeKeys: null, constructor: function () {
            Marionette.Region.prototype.constructor.apply(this, arguments);
            var e = elementorCommon.storage.get(this.getStorageKey());
            this.storage = e || this.getDefaultStorage(), this.storageSizeKeys = Object.keys(this.storage.size)
        }, saveStorage: function (e, t) {
            this.storage[e] = t, elementorCommon.storage.set(this.getStorageKey(), this.storage)
        }, saveSize: function () {
            this.saveStorage("size", elementor.helpers.getElementInlineStyle(this.$el, this.storageSizeKeys))
        }
    })
}, function (e, t, n) {
    "use strict";
    !function (t) {
        var n = function e() {
            var n = this, i = {}, o = {}, r = {}, s = function (e) {
                var t = {};
                return (e = e.split("-").filter(String)).forEach(function (e) {
                    var n = e.split("_"), i = n[0], o = n[1];
                    t[i] = "max" === i ? function (e) {
                        var t = Object.keys(r), n = t.indexOf(e) + 1;
                        if (n >= t.length) throw new RangeError("Max value for this device is out of range.");
                        return r[t[n]] - 1
                    }(o) : r[o]
                }), t
            };
            this.addDevice = function (e, t) {
                r[e] = t;
                var i = Object.keys(r);
                if (i.length < 2) return n;
                i.sort(function (e, t) {
                    return r[e] - r[t]
                });
                var o = {};
                return i.forEach(function (e) {
                    o[e] = r[e]
                }), r = o, n
            }, this.addRawCSS = function (e, t) {
                o[e] = t
            }, this.addRules = function (e, o, r) {
                var l = "all";
                if (_.isEmpty(r) || (l = function (e) {
                        var n = [];
                        return t.each(e, function (e) {
                            n.push(e + "_" + this)
                        }), n.join("-")
                    }(r)), i[l] || function (e) {
                        i[e] = {};
                        var t = Object.keys(i);
                        if (!(t.length < 2)) {
                            t.sort(function (e, t) {
                                if ("all" === e) return -1;
                                if ("all" === t) return 1;
                                var n = s(e);
                                return s(t).max - n.max
                            });
                            var n = {};
                            t.forEach(function (e) {
                                n[e] = i[e]
                            }), i = n
                        }
                    }(l), o) {
                    if (i[l][e] || (i[l][e] = {}), "string" == typeof o) {
                        o = o.split(";").filter(String);
                        var a = {};
                        try {
                            t.each(o, function () {
                                var e = this.split(/:(.*)?/);
                                a[e[0].trim()] = e[1].trim().replace(";", "")
                            })
                        } catch (e) {
                            return
                        }
                        o = a
                    }
                    return t.extend(i[l][e], o), n
                }
                var c = e.match(/[^{]+\{[^}]+}/g);
                t.each(c, function () {
                    var e = this.match(/([^{]+)\{([^}]+)}/);
                    e && n.addRules(e[1].trim(), e[2].trim(), r)
                })
            }, this.getRules = function () {
                return i
            }, this.empty = function () {
                i = {}, o = {}
            }, this.toString = function () {
                var n = "";
                return t.each(i, function (i) {
                    var o = e.parseRules(this);
                    "all" !== i && (o = function (e) {
                        var n = s(e), i = [];
                        return t.each(n, function (e) {
                            i.push("(" + e + "-width:" + this + "px)")
                        }), "@media" + i.join(" and ")
                    }(i) + "{" + o + "}"), n += o
                }), t.each(o, function () {
                    n += this
                }), n
            }
        };
        n.parseRules = function (e) {
            var i = "";
            return t.each(e, function (e) {
                var t = n.parseProperties(this);
                t && (i += e + "{" + t + "}")
            }), i
        }, n.parseProperties = function (e) {
            var n = "";
            return t.each(e, function (e) {
                this && (n += e + ":" + this + ";")
            }), n
        }, e.exports = n
    }(jQuery)
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.Behavior.extend({
        ui: {insertButton: ".elementor-template-library-template-insert"},
        events: {"click @ui.insertButton": "onInsertButtonClick"},
        onInsertButtonClick: function () {
            var e = elementor.config.document.remoteLibrary.autoImportSettings;
            e || !this.view.model.get("hasPageSettings") ? elementor.templates.importTemplate(this.view.model, {withPageSettings: e}) : i.showImportDialog(this.view.model)
        }
    }, {
        dialog: null, showImportDialog: function (e) {
            var t = i.getDialog();
            t.onConfirm = function () {
                elementor.templates.importTemplate(e, {withPageSettings: !0})
            }, t.onCancel = function () {
                elementor.templates.importTemplate(e)
            }, t.show()
        }, initDialog: function () {
            i.dialog = elementorCommon.dialogsManager.createWidget("confirm", {
                id: "elementor-insert-template-settings-dialog",
                headerMessage: elementor.translate("import_template_dialog_header"),
                message: elementor.translate("import_template_dialog_message") + "<br>" + elementor.translate("import_template_dialog_message_attention"),
                strings: {confirm: elementor.translate("yes"), cancel: elementor.translate("no")}
            })
        }, getDialog: function () {
            return i.dialog || i.initDialog(), i.dialog
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(23);
    i = Marionette.ItemView.extend({
        className: function () {
            var e = "elementor-template-library-template", t = this.model.get("source");
            return e += " elementor-template-library-template-" + t, "remote" === t && (e += " elementor-template-library-template-" + this.model.get("type")), this.model.get("isPro") && (e += " elementor-template-library-pro-template"), e
        }, ui: function () {
            return {previewButton: ".elementor-template-library-template-preview"}
        }, events: function () {
            return {"click @ui.previewButton": "onPreviewButtonClick"}
        }, behaviors: {insertTemplate: {behaviorClass: o}}
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i = r(n(88)), o = r(n(89));

    function r(e) {
        return e && e.__esModule ? e : {default: e}
    }

    e.exports = Marionette.CompositeView.extend({
        id: "elementor-panel-history",
        template: "#tmpl-elementor-panel-history-tab",
        childView: i.default,
        childViewContainer: "#elementor-history-list",
        emptyView: o.default,
        currentItem: null,
        updateCurrentItem: function () {
            var e = this;
            this.children.length <= 1 || _.defer(function () {
                var t = e.collection.find(function (e) {
                    return "not_applied" === e.get("status")
                }), n = e.children.findByModel(t);
                if (n) {
                    e.currentItem && e.currentItem.removeClass("elementor-history-item-current"), e.currentItem = n.$el, e.currentItem.addClass("elementor-history-item-current")
                }
            })
        },
        onRender: function () {
            this.updateCurrentItem()
        },
        onRenderEmpty: function () {
            this.$el.addClass("elementor-empty")
        },
        onChildviewClick: function (e, t) {
            if (e.$el !== this.currentItem) {
                var n = t.model.collection.findIndex(t.model);
                elementor.history.history.doItem(n)
            }
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.CompositeView.extend({
        templateHelpers: function () {
            return {view: this}
        }, getBehavior: function (e) {
            return this._behaviors[Object.keys(this.behaviors()).indexOf(e)]
        }, initialize: function () {
            this.collection = this.model.get("elements")
        }, addChildModel: function (e, t) {
            return this.collection.add(e, t, !0)
        }, addChildElement: function (e, t) {
            if (!this.isCollectionFilled()) {
                t = jQuery.extend({trigger: !1, edit: !0, onBeforeAdd: null, onAfterAdd: null}, t);
                var n, i, o = this.getChildType();
                if (e instanceof Backbone.Model ? i = (n = e).get("elType") : (n = {
                        id: elementor.helpers.getUniqueID(),
                        elType: o[0],
                        settings: {},
                        elements: []
                    }, e && jQuery.extend(n, e), i = n.elType), -1 === o.indexOf(i)) return this.children.last().addChildElement(n, t);
                t.clone && (n = this.cloneItem(n)), t.trigger && elementor.channels.data.trigger(t.trigger.beforeAdd, n), t.onBeforeAdd && t.onBeforeAdd();
                var r = this.addChildModel(n, {at: t.at}), s = this.children.findByModel(r);
                return t.onAfterAdd && t.onAfterAdd(r, s), t.trigger && elementor.channels.data.trigger(t.trigger.afterAdd, n), t.edit && r.trigger("request:edit"), s
            }
        }, cloneItem: function (e) {
            var t = this;
            return e instanceof Backbone.Model ? e.clone() : (e.id = elementor.helpers.getUniqueID(), e.settings._element_id = "", e.elements.forEach(function (n, i) {
                e.elements[i] = t.cloneItem(n)
            }), e)
        }, isCollectionFilled: function () {
            return !1
        }, onChildviewRequestAddNew: function (e) {
            this.addChildElement({}, {
                at: e.$el.index() + 1,
                trigger: {beforeAdd: "element:before:add", afterAdd: "element:after:add"}
            })
        }, onChildviewRequestPaste: function (e) {
            var t = this;
            if (!t.isCollectionFilled()) {
                var n = elementorCommon.storage.get("transfer").elements, i = t.collection.indexOf(e.model);
                elementor.channels.data.trigger("element:before:add", n[0]), n.forEach(function (e) {
                    i++, t.addChildElement(e, {at: i, clone: !0})
                }), elementor.channels.data.trigger("element:after:add", n[0])
            }
        }
    })
}, function (e, t, n) {
    "use strict";
    var i = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(n(95));
    var o, r = n(7);
    o = r.extend({
        template: Marionette.TemplateCache.get("#tmpl-elementor-section-content"),
        addSectionView: null,
        className: function () {
            return r.prototype.className.apply(this, arguments) + " elementor-section elementor-" + (this.isInner() ? "inner" : "top") + "-section"
        },
        tagName: function () {
            return this.model.getSetting("html_tag") || "section"
        },
        childViewContainer: "> .elementor-container > .elementor-row",
        behaviors: function () {
            var e = r.prototype.behaviors.apply(this, arguments);
            return _.extend(e, {
                Sortable: {
                    behaviorClass: n(11),
                    elChildType: "column"
                }
            }), elementor.hooks.applyFilters("elements/section/behaviors", e, this)
        },
        errors: {
            columnWidthTooLarge: "New column width is too large",
            columnWidthTooSmall: "New column width is too small"
        },
        initialize: function () {
            r.prototype.initialize.apply(this, arguments), this.listenTo(this.collection, "add remove reset", this._checkIsFull), this._checkIsEmpty()
        },
        getContextMenuGroups: function () {
            var e = r.prototype.getContextMenuGroups.apply(this, arguments),
                t = e.indexOf(_.findWhere(e, {name: "transfer"}));
            return e.splice(t + 1, 0, {
                name: "save",
                actions: [{name: "save", title: elementor.translate("save_as_block"), callback: this.save.bind(this)}]
            }), e
        },
        addChildModel: function (e) {
            var t = e instanceof Backbone.Model, n = this.isInner();
            return t ? e.set("isInner", n) : e.isInner = n, r.prototype.addChildModel.apply(this, arguments)
        },
        getSortableOptions: function () {
            return {
                connectWith: (this.isInner() ? ".elementor-inner-section" : ".elementor-top-section") + " > .elementor-container > .elementor-row",
                handle: "> .elementor-element-overlay .elementor-editor-element-edit",
                items: "> .elementor-column",
                forcePlaceholderSize: !0,
                tolerance: "pointer"
            }
        },
        getColumnPercentSize: function (e, t) {
            return +(t / e.parent().width() * 100).toFixed(3)
        },
        getDefaultStructure: function () {
            return this.collection.length + "0"
        },
        getStructure: function () {
            return this.model.getSetting("structure")
        },
        setStructure: function (e) {
            if (+elementor.presetsFactory.getParsedStructure(e).columnsCount !== this.collection.length) throw new TypeError("The provided structure doesn't match the columns count.");
            this.model.setSetting("structure", e)
        },
        redefineLayout: function () {
            var e = elementor.presetsFactory.getPresetByStructure(this.getStructure());
            this.collection.each(function (t, n) {
                t.setSetting("_column_size", e.preset[n]), t.setSetting("_inline_size", null)
            })
        },
        resetLayout: function () {
            this.setStructure(this.getDefaultStructure())
        },
        resetColumnsCustomSize: function () {
            this.collection.each(function (e) {
                e.setSetting("_inline_size", null)
            })
        },
        isCollectionFilled: function () {
            return 10 <= this.collection.length
        },
        _checkIsFull: function () {
            this.$el.toggleClass("elementor-section-filled", this.isCollectionFilled())
        },
        _checkIsEmpty: function () {
            this.collection.length || this.model.get("allowEmpty") || this.addChildElement(null, {edit: !1})
        },
        getColumnAt: function (e) {
            var t = this.collection.at(e);
            return t ? this.children.findByModelCid(t.cid) : null
        },
        getNextColumn: function (e) {
            return this.getColumnAt(this.collection.indexOf(e.model) + 1)
        },
        getPreviousColumn: function (e) {
            return this.getColumnAt(this.collection.indexOf(e.model) - 1)
        },
        showChildrenPercentsTooltip: function (e, t) {
            e.ui.percentsTooltip.show(), e.ui.percentsTooltip.attr("data-side", elementorCommon.config.isRTL ? "right" : "left"), t.ui.percentsTooltip.show(), t.ui.percentsTooltip.attr("data-side", elementorCommon.config.isRTL ? "left" : "right")
        },
        hideChildrenPercentsTooltip: function (e, t) {
            e.ui.percentsTooltip.hide(), t.ui.percentsTooltip.hide()
        },
        resizeChild: function (e, t, n) {
            var i = this.getNextColumn(e) || this.getPreviousColumn(e);
            if (!i) throw new ReferenceError("There is not any next column");
            var o = i.$el,
                r = +(t + (+i.model.getSetting("_inline_size") || this.getColumnPercentSize(o, o[0].getBoundingClientRect().width)) - n).toFixed(3);
            if (r < 2) throw new RangeError(this.errors.columnWidthTooLarge);
            if (n < 2) throw new RangeError(this.errors.columnWidthTooSmall);
            return i.model.setSetting("_inline_size", r), !0
        },
        destroyAddSectionView: function () {
            this.addSectionView && !this.addSectionView.isDestroyed && this.addSectionView.destroy()
        },
        onRender: function () {
            r.prototype.onRender.apply(this, arguments), this._checkIsFull()
        },
        onSettingsChanged: function (e) {
            r.prototype.onSettingsChanged.apply(this, arguments), e.changed.structure && this.redefineLayout()
        },
        onAddButtonClick: function () {
            if (!this.addSectionView || this.addSectionView.isDestroyed) {
                var e = this.model.collection.indexOf(this.model), t = new i.default({at: e});
                t.render(), this.$el.before(t.$el), t.$el.hide(), setTimeout(function () {
                    t.$el.slideDown()
                }), this.addSectionView = t
            } else this.addSectionView.fadeToDeath()
        },
        onAddChild: function () {
            this.isBuffering || this.model.get("allowEmpty") || this.resetLayout()
        },
        onRemoveChild: function () {
            this.isManualRemoving && (this._checkIsEmpty(), this.resetLayout())
        },
        onChildviewRequestResizeStart: function (e) {
            var t = this.getNextColumn(e);
            if (t) {
                this.showChildrenPercentsTooltip(e, t);
                var n = e.$el.find("iframe").add(t.$el.find("iframe"));
                elementor.helpers.disableElementEvents(n)
            }
        },
        onChildviewRequestResizeStop: function (e) {
            var t = this.getNextColumn(e);
            if (t) {
                this.hideChildrenPercentsTooltip(e, t);
                var n = e.$el.find("iframe").add(t.$el.find("iframe"));
                elementor.helpers.enableElementEvents(n)
            }
        },
        onChildviewRequestResize: function (e, t) {
            var n = +e.model.getSetting("_inline_size") || this.getColumnPercentSize(e.$el, e.$el.data("originalWidth"));
            t.element.css({width: "", left: "initial"});
            var i = this.getColumnPercentSize(t.element, t.size.width);
            try {
                this.resizeChild(e, n, i)
            } catch (e) {
                return
            }
            e.model.setSetting("_inline_size", i)
        },
        onDestroy: function () {
            r.prototype.onDestroy.apply(this, arguments), this.destroyAddSectionView()
        }
    }), e.exports = o
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.ItemView), i(t, [{
            key: "template", value: function () {
                return Marionette.TemplateCache.get("#tmpl-elementor-add-section")
            }
        }, {
            key: "attributes", value: function () {
                return {"data-view": "choose-action"}
            }
        }, {
            key: "ui", value: function () {
                return {
                    addNewSection: ".elementor-add-new-section",
                    closeButton: ".elementor-add-section-close",
                    addSectionButton: ".elementor-add-section-button",
                    addTemplateButton: ".elementor-add-template-button",
                    selectPreset: ".elementor-select-preset",
                    presets: ".elementor-preset"
                }
            }
        }, {
            key: "events", value: function () {
                return {
                    "click @ui.addSectionButton": "onAddSectionButtonClick",
                    "click @ui.addTemplateButton": "onAddTemplateButtonClick",
                    "click @ui.closeButton": "onCloseButtonClick",
                    "click @ui.presets": "onPresetSelected"
                }
            }
        }, {
            key: "behaviors", value: function () {
                return {contextMenu: {behaviorClass: n(8), groups: this.getContextMenuGroups()}}
            }
        }, {
            key: "className", value: function () {
                return "elementor-add-section elementor-visible-desktop"
            }
        }, {
            key: "addSection", value: function (e, t) {
                return elementor.getPreviewView().addChildElement(e, jQuery.extend({}, this.options, t))
            }
        }, {
            key: "setView", value: function (e) {
                this.$el.attr("data-view", e)
            }
        }, {
            key: "showSelectPresets", value: function () {
                this.setView("select-preset")
            }
        }, {
            key: "closeSelectPresets", value: function () {
                this.setView("choose-action")
            }
        }, {
            key: "getTemplatesModalOptions", value: function () {
                return {importOptions: {at: this.getOption("at")}}
            }
        }, {
            key: "getContextMenuGroups", value: function () {
                var e = function () {
                    return elementor.elements.length > 0
                };
                return [{
                    name: "paste",
                    actions: [{
                        name: "paste",
                        title: elementor.translate("paste"),
                        callback: this.paste.bind(this),
                        isEnabled: this.isPasteEnabled.bind(this)
                    }]
                }, {
                    name: "content",
                    actions: [{
                        name: "copy_all_content",
                        title: elementor.translate("copy_all_content"),
                        callback: this.copy.bind(this),
                        isEnabled: e
                    }, {
                        name: "delete_all_content",
                        title: elementor.translate("delete_all_content"),
                        callback: elementor.clearPage.bind(elementor),
                        isEnabled: e
                    }]
                }]
            }
        }, {
            key: "copy", value: function () {
                elementor.getPreviewView().copy()
            }
        }, {
            key: "paste", value: function () {
                elementor.getPreviewView().paste(this.getOption("at"))
            }
        }, {
            key: "isPasteEnabled", value: function () {
                return elementorCommon.storage.get("transfer")
            }
        }, {
            key: "onAddSectionButtonClick", value: function () {
                this.showSelectPresets()
            }
        }, {
            key: "onAddTemplateButtonClick", value: function () {
                elementor.templates.startModal(this.getTemplatesModalOptions())
            }
        }, {
            key: "onRender", value: function () {
                this.$el.html5Droppable({
                    axis: ["vertical"],
                    groups: ["elementor-element"],
                    placeholder: !1,
                    currentElementClass: "elementor-html5dnd-current-element",
                    hasDraggingOnChildClass: "elementor-dragging-on-child",
                    onDropping: this.onDropping.bind(this)
                })
            }
        }, {
            key: "onPresetSelected", value: function (e) {
                this.closeSelectPresets();
                var t = e.currentTarget.dataset.structure, n = elementor.presetsFactory.getParsedStructure(t), i = [],
                    o = void 0;
                for (o = 0; o < n.columnsCount; o++) i.push({
                    id: elementor.helpers.getUniqueID(),
                    elType: "column",
                    settings: {},
                    elements: []
                });
                elementor.channels.data.trigger("element:before:add", {elType: "section"});
                var r = this.addSection({elements: i}, {edit: !1});
                r.setStructure(t), r.getEditModel().trigger("request:edit"), elementor.channels.data.trigger("element:after:add")
            }
        }, {
            key: "onDropping", value: function () {
                elementor.channels.data.trigger("section:before:drop"), this.addSection().addElementFromPanel(), elementor.channels.data.trigger("section:after:drop")
            }
        }]), t
    }();
    t.default = o
}, function (e, t, n) {
    "use strict";
    var i, o = n(2);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.sliders = ".elementor-slider", e.colors = ".elementor-shadow-color-picker", e
        }, initSliders: function () {
            var e = this, t = this.getControlValue();
            this.ui.sliders.each(function (n, i) {
                var o = jQuery(i).next(".elementor-slider-input").find("input"), r = noUiSlider.create(i, {
                    start: [t[i.dataset.input]],
                    step: 1,
                    range: {min: +o.attr("min"), max: +o.attr("max")},
                    format: {
                        to: function (e) {
                            return +e.toFixed(1)
                        }, from: function (e) {
                            return +e
                        }
                    }
                });
                r.on("slide", function (t) {
                    var n = r.target.dataset.input;
                    o.val(t[0]), e.setValue(n, t[0])
                })
            })
        }, initColors: function () {
            var e = this;
            elementor.helpers.wpColorPicker(this.ui.colors, {
                change: function () {
                    var t = jQuery(this), n = t.data("setting");
                    e.setValue(n, t.wpColorPicker("color"))
                }, clear: function () {
                    e.setValue(this.dataset.setting, "")
                }
            })
        }, onInputChange: function (e) {
            var t = e.currentTarget.dataset.setting;
            this.ui.sliders.filter('[data-input="' + t + '"]')[0].noUiSlider.set(this.getControlValue(t))
        }, onReady: function () {
            this.initSliders(), this.initColors()
        }, onBeforeDestroy: function () {
            this.ui.colors.each(function () {
                var e = jQuery(this);
                e.wpColorPicker("instance") && e.wpColorPicker("close")
            }), this.$el.remove()
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(0);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.inputs = '[type="radio"]', e
        }, events: function () {
            return _.extend(o.prototype.events.apply(this, arguments), {
                "mousedown label": "onMouseDownLabel",
                "click @ui.inputs": "onClickInput",
                "change @ui.inputs": "onBaseInputChange"
            })
        }, applySavedValue: function () {
            var e = this.getControlValue();
            e && this.ui.inputs.filter('[value="' + e + '"]').prop("checked", !0)
        }, onMouseDownLabel: function (e) {
            var t = this.$(e.currentTarget), n = this.$("#" + t.attr("for"));
            n.data("checked", n.prop("checked"))
        }, onClickInput: function (e) {
            if (this.model.get("toggle")) {
                var t = this.$(e.currentTarget);
                t.data("checked") && t.prop("checked", !1).trigger("change")
            }
        }
    }, {
        onPasteStyle: function (e, t) {
            return "" === t || void 0 !== e.options[t]
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = n(2).extend({
        getCurrentRange: function () {
            return this.getUnitRange(this.getControlValue("unit"))
        }, getUnitRange: function (e) {
            var t = this.model.get("range");
            return !(!t || !t[e]) && t[e]
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(0);
    i = Marionette.CompositeView.extend({
        template: Marionette.TemplateCache.get("#tmpl-elementor-repeater-row"),
        className: "elementor-repeater-fields",
        ui: {
            duplicateButton: ".elementor-repeater-tool-duplicate",
            editButton: ".elementor-repeater-tool-edit",
            removeButton: ".elementor-repeater-tool-remove",
            itemTitle: ".elementor-repeater-row-item-title"
        },
        behaviors: {HandleInnerTabs: {behaviorClass: n(12)}},
        triggers: {
            "click @ui.removeButton": "click:remove",
            "click @ui.duplicateButton": "click:duplicate",
            "click @ui.itemTitle": "click:edit"
        },
        modelEvents: {change: "onModelChange"},
        templateHelpers: function () {
            return {itemIndex: this.getOption("itemIndex"), itemActions: this.getOption("itemActions")}
        },
        childViewContainer: ".elementor-repeater-row-controls",
        getChildView: function (e) {
            var t = e.get("type");
            return elementor.getControlView(t)
        },
        childViewOptions: function () {
            return {elementSettingsModel: this.model}
        },
        updateIndex: function (e) {
            this.itemIndex = e
        },
        setTitle: function () {
            var e = this.getOption("titleField"), t = "";
            if (e) {
                var n = {};
                this.children.each(function (e) {
                    e instanceof o && (n[e.model.get("name")] = e.getControlValue())
                }), t = Marionette.TemplateCache.prototype.compileTemplate(e)(this.model.parseDynamicSettings())
            }
            t || (t = elementor.translate("Item #%s", [this.getOption("itemIndex")])), this.ui.itemTitle.html(t)
        },
        initialize: function (e) {
            this.itemIndex = 0, this.collection = new Backbone.Collection(_.values(elementor.mergeControlsSettings(e.controlFields)))
        },
        onRender: function () {
            this.setTitle()
        },
        onModelChange: function () {
            this.getOption("titleField") && this.setTitle()
        },
        onChildviewResponsiveSwitcherClick: function (e, t) {
            "desktop" === t && elementor.getPanelView().getCurrentPageView().$el.toggleClass("elementor-responsive-switchers-open")
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, r = n(127);
    (i = Backbone.Model.extend({
        defaults: {id: "", elType: "", isInner: !1, settings: {}, defaultEditSettings: {}},
        remoteRender: !1,
        _htmlCache: null,
        _jqueryXhr: null,
        renderOnLeave: !1,
        initialize: function (e) {
            var t = this.get("elType"), i = this.get("elements");
            if (void 0 !== i) {
                var o = n(34);
                this.set("elements", new o(i))
            }
            "widget" === t && (this.remoteRender = !0, this.setHtmlCache(e.htmlCache || "")), delete e.htmlCache, this.renderRemoteServer = _.throttle(this.renderRemoteServer, 1e3), this.initSettings(), this.initEditSettings(), this.on({
                destroy: this.onDestroy,
                "editor:close": this.onCloseEditor
            })
        },
        initSettings: function () {
            var e = this.get("elType"), t = this.get("settings"),
                n = {column: r}[e] || elementorModules.editor.elements.models.BaseSettings;
            jQuery.isEmptyObject(t) && (t = elementorCommon.helpers.cloneObject(t)), "widget" === e && (t.widgetType = this.get("widgetType")), t.elType = e, t.isInner = this.get("isInner"), t = new n(t, {controls: elementor.getElementControls(this)}), this.set("settings", t), elementorFrontend.config.elements.data[this.cid] = t
        },
        initEditSettings: function () {
            var e = new Backbone.Model(this.get("defaultEditSettings"));
            this.set("editSettings", e), elementorFrontend.config.elements.editSettings[this.cid] = e
        },
        setSetting: function (e, t) {
            var n = this.get("settings");
            if ("object" !== (void 0 === e ? "undefined" : o(e))) {
                var i = e.split("."), r = 3 === i.length;
                e = i[0], r && (n = n.get(e).models[i[1]], e = i[2])
            }
            n.setExternalChange(e, t)
        },
        getSetting: function (e) {
            var t = e.split("."), n = 3 === t.length, i = this.get("settings");
            e = t[0];
            var o = i.get(e);
            return void 0 === o ? "" : (n && (o = o.models[t[1]].get(t[2])), o)
        },
        setHtmlCache: function (e) {
            this._htmlCache = e
        },
        getHtmlCache: function () {
            return this._htmlCache
        },
        getDefaultTitle: function () {
            return elementor.getElementData(this).title
        },
        getTitle: function () {
            var e = this.getSetting("_title");
            return e || (e = this.getDefaultTitle()), e
        },
        getIcon: function () {
            return elementor.getElementData(this).icon
        },
        createRemoteRenderRequest: function () {
            var e = this.toJSON();
            return elementorCommon.ajax.addRequest("render_widget", {
                unique_id: this.cid,
                data: {data: e},
                success: this.onRemoteGetHtml.bind(this)
            }, !0).jqXhr
        },
        renderRemoteServer: function () {
            this.remoteRender && (this.renderOnLeave = !1, this.trigger("before:remote:render"), this.isRemoteRequestActive() && this._jqueryXhr.abort(), this._jqueryXhr = this.createRemoteRenderRequest())
        },
        isRemoteRequestActive: function () {
            return this._jqueryXhr && 4 !== this._jqueryXhr.readyState
        },
        onRemoteGetHtml: function (e) {
            this.setHtmlCache(e.render), this.trigger("remote:render")
        },
        clone: function () {
            var e = new this.constructor(elementorCommon.helpers.cloneObject(this.attributes));
            e.set("id", elementor.helpers.getUniqueID()), e.setHtmlCache(this.getHtmlCache());
            var t = this.get("elements");
            return _.isEmpty(t) || e.set("elements", t.clone()), e
        },
        toJSON: function (e) {
            e = e || {};
            var t = Backbone.Model.prototype.toJSON.call(this);
            return _.each(t, function (n, i) {
                n && n.toJSON && (t[i] = n.toJSON(e))
            }), e.copyHtmlCache ? t.htmlCache = this.getHtmlCache() : delete t.htmlCache, e.remove && e.remove.forEach(function (e) {
                return delete t[e]
            }), t
        },
        onCloseEditor: function () {
            this.renderOnLeave && this.renderRemoteServer()
        },
        onDestroy: function () {
            var e = this.get("settings"), t = this.get("elements");
            void 0 !== t && _.each(_.clone(t.models), function (e) {
                e.destroy()
            }), e.destroy()
        }
    })).prototype.sync = i.prototype.fetch = i.prototype.save = _.noop, e.exports = i
}, function (e, t, n) {
    "use strict";
    var i = n(33), o = Backbone.Collection.extend({
        add: function (e, t, n) {
            if (!(t && t.silent || n)) throw"Call Error: Adding model to element collection is allowed only by the dedicated addChildModel() method.";
            return Backbone.Collection.prototype.add.call(this, e, t)
        }, model: function (e, t) {
            var n = Backbone.Model;
            return e.elType && (n = elementor.hooks.applyFilters("element/model", i, e)), new n(e, t)
        }, clone: function () {
            var e = Backbone.Collection.prototype.clone.apply(this, arguments), t = new o;
            return e.forEach(function (e) {
                t.add(e.clone(), null, !0)
            }), t
        }
    });
    o.prototype.sync = o.prototype.fetch = o.prototype.save = _.noop, e.exports = o
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        template: "#tmpl-elementor-panel-global",
        id: "elementor-panel-global",
        initialize: function () {
            elementor.getPanelView().getCurrentPageView().search.reset()
        },
        onDestroy: function () {
            var e = elementor.getPanelView();
            "elements" === e.getCurrentPageName() && setTimeout(function () {
                var t = e.getCurrentPageView();
                t.search.currentView || t.showView("search")
            })
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        template: "#tmpl-elementor-element-library-element",
        className: "elementor-element-wrapper",
        ui: {element: ".elementor-element"},
        onRender: function () {
            var e = this;
            elementor.userCan("design") && this.ui.element.html5Draggable({
                onDragStart: function () {
                    elementor.channels.panelElements.reply("element:selected", e).trigger("element:drag:start")
                }, onDragEnd: function () {
                    elementor.channels.panelElements.trigger("element:drag:end")
                }, groups: ["elementor-element"]
            })
        }
    })
}, function (e, t, n) {
    "use strict";
    var i;
    i = Backbone.Model.extend({
        defaults: {
            title: "",
            categories: [],
            keywords: [],
            icon: "",
            elType: "widget",
            widgetType: ""
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(37);
    i = Backbone.Collection.extend({model: o}), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(40);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.systemSchemes = ".elementor-panel-scheme-color-system-scheme", e
        }, events: function () {
            var e = o.prototype.events.apply(this, arguments);
            return e["click @ui.systemSchemes"] = "onSystemSchemeClick", e
        }, getType: function () {
            return "color"
        }, onSystemSchemeClick: function (e) {
            var t = jQuery(e.currentTarget).data("schemeName"),
                n = elementor.config.system_schemes[this.getType()][t].items;
            this.changeChildrenUIValues(n)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = {color: n(153), typography: n(154)};
    i = Marionette.CompositeView.extend({
        id: function () {
            return "elementor-panel-scheme-" + this.getType()
        }, className: function () {
            return "elementor-panel-scheme elementor-panel-scheme-" + this.getUIType()
        }, childViewContainer: ".elementor-panel-scheme-items", getTemplate: function () {
            return Marionette.TemplateCache.get("#tmpl-elementor-panel-schemes-" + this.getType())
        }, getChildView: function () {
            return o[this.getUIType()]
        }, getUIType: function () {
            return this.getType()
        }, ui: function () {
            return {
                saveButton: ".elementor-panel-scheme-save .elementor-button",
                discardButton: ".elementor-panel-scheme-discard .elementor-button",
                resetButton: ".elementor-panel-scheme-reset .elementor-button"
            }
        }, events: function () {
            return {
                "click @ui.saveButton": "saveScheme",
                "click @ui.discardButton": "discardScheme",
                "click @ui.resetButton": "setDefaultScheme"
            }
        }, initialize: function () {
            this.model = new Backbone.Model, this.resetScheme()
        }, getType: function () {
        }, getScheme: function () {
            return elementor.schemes.getScheme(this.getType())
        }, changeChildrenUIValues: function (e) {
            var t = this;
            _.each(e, function (e, n) {
                var i = t.collection.findWhere({key: n});
                t.children.findByModelCid(i.cid).changeUIValue(e)
            })
        }, discardScheme: function () {
            elementor.schemes.resetSchemes(this.getType()), this.onSchemeChange(), this.ui.saveButton.prop("disabled", !0), this._renderChildren()
        }, setSchemeValue: function (e, t) {
            elementor.schemes.setSchemeValue(this.getType(), e, t), this.onSchemeChange()
        }, saveScheme: function () {
            elementor.schemes.saveScheme(this.getType()), this.ui.saveButton.prop("disabled", !0), this.resetScheme(), this._renderChildren()
        }, setDefaultScheme: function () {
            var e = elementor.config.default_schemes[this.getType()].items;
            this.changeChildrenUIValues(e)
        }, resetItems: function () {
            this.model.set("items", this.getScheme().items)
        }, resetCollection: function () {
            var e = this, t = e.model.get("items");
            e.collection = new Backbone.Collection, _.each(t, function (t, n) {
                t.type = e.getType(), t.key = n, e.collection.add(t)
            })
        }, resetScheme: function () {
            this.resetItems(), this.resetCollection()
        }, onSchemeChange: function () {
            elementor.schemes.printSchemesStyle()
        }, onChildviewValueChange: function (e, t) {
            this.ui.saveButton.removeProp("disabled"), this.setSchemeValue(e.model.get("key"), t)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.ItemView.extend({
        getTemplate: function () {
            return Marionette.TemplateCache.get("#tmpl-elementor-panel-scheme-" + this.getUIType() + "-item")
        }, className: function () {
            return "elementor-panel-scheme-item"
        }
    }), e.exports = i
}, , function (e, t, n) {
    n(44), n(45), e.exports = n(46)
}, function (e, t, n) {
    "use strict";
    !function (e) {
        e.fn.elementorSerializeObject = function () {
            var t = this.serializeArray(), n = {};
            return e.each(t, function () {
                !function e(t, n, i) {
                    var o = /^[^\[\]]+\[]/.test(n), r = /^[^\[\]]+\[[^\[\]]+]/.test(n), s = n.replace(/\[.*/, "");
                    if (o) t[s] || (t[s] = []); else {
                        if (!r) return void(t.push ? t.push(i) : t[s] = i);
                        t[s] || (t[s] = {})
                    }
                    var l = n.match(/\[[^\[\]]*]/g);
                    return l[0] = l[0].replace(/\[|]/g, ""), e(t[s], l.join(""), i)
                }(n, this.name, this.value)
            }), n
        }
    }(jQuery)
}, function (e, t, n) {
    "use strict";
    !function (e) {
        var t = function (e) {
            try {
                return e.originalEvent.dataTransfer.setData("test", "test"), e.originalEvent.dataTransfer.clearData("test"), !0
            } catch (e) {
                return !1
            }
        }, n = {
            html5Draggable: function (n) {
                var i = this, o = {}, r = {}, s = {element: "", groups: null, onDragStart: null, onDragEnd: null},
                    l = function (t) {
                        e.isFunction(o.onDragEnd) && o.onDragEnd.call(r.$element, t, i)
                    }, a = function (n) {
                        var s = {groups: o.groups || []};
                        t(n) && n.originalEvent.dataTransfer.setData(JSON.stringify(s), !0), e.isFunction(o.onDragStart) && o.onDragStart.call(r.$element, n, i)
                    };
                this.destroy = function () {
                    r.$element.off("dragstart", a), r.$element.removeAttr("draggable")
                }, e.extend(!0, o, s, n), r.$element = e(o.element), r.$element.attr("draggable", !0), r.$element.on("dragstart", a).on("dragend", l)
            }, html5Droppable: function (n) {
                var i, o, r = this, s = {}, l = {}, a = {
                    element: "",
                    items: ">",
                    horizontalSensitivity: "10%",
                    axis: ["vertical", "horizontal"],
                    placeholder: !0,
                    currentElementClass: "html5dnd-current-element",
                    placeholderClass: "html5dnd-placeholder",
                    hasDraggingOnChildClass: "html5dnd-has-dragging-on-child",
                    groups: null,
                    isDroppingAllowed: null,
                    onDragEnter: null,
                    onDragging: null,
                    onDropping: null,
                    onDragLeave: null
                }, c = function () {
                    return -1 !== s.axis.indexOf("vertical")
                }, u = function (e, t) {
                    var n;
                    return -1 !== s.axis.indexOf("horizontal") && (c() ? !!(n = s.horizontalSensitivity.match(/\d+/)) && (n = n[0], /%$/.test(s.horizontalSensitivity) && (n = t / n), e > t - n ? "right" : e < n && "left") : e > t / 2 ? "right" : "left")
                }, d = function (t) {
                    var n = e(i), r = n.outerHeight() - l.$placeholder.outerHeight(), s = n.outerWidth();
                    if (t = t.originalEvent, !(o = u(t.offsetX, s))) if (c()) {
                        var a = i.getBoundingClientRect();
                        o = t.clientY > a.top + r / 2 ? "bottom" : "top"
                    } else o = null
                }, m = function () {
                    if (s.placeholder) {
                        var e = "top" === o ? "prependTo" : "appendTo";
                        l.$placeholder[e](i)
                    }
                }, h = function (n) {
                    var l, a, c;
                    return !(s.groups && t(n) && (l = n.originalEvent.dataTransfer.types, c = !1, (l = Array.prototype.slice.apply(l)).forEach(function (e) {
                        try {
                            if (!(a = JSON.parse(e)).groups.slice) return;
                            s.groups.forEach(function (e) {
                                if (-1 !== a.groups.indexOf(e)) return c = !0, !1
                            })
                        } catch (e) {
                        }
                    }), !c) || e.isFunction(s.isDroppingAllowed) && !s.isDroppingAllowed.call(i, o, n, r))
                }, p = function (t) {
                    t.stopPropagation(), i || (i = this, l.$element.parents().each(function () {
                        var t = e(this).data("html5Droppable");
                        t && t.doDragLeave()
                    }), d(t), h(t) && (m(), l.$element.addClass(s.hasDraggingOnChildClass), e(i).addClass(s.currentElementClass), e.isFunction(s.onDragEnter) && s.onDragEnter.call(i, o, t, r)))
                }, g = function (t) {
                    t.stopPropagation(), i || p.call(this, t);
                    var n = o;
                    d(t), h(t) && (t.preventDefault(), n !== o && m(), e.isFunction(s.onDragging) && s.onDragging.call(this, o, t, r))
                }, f = function (t) {
                    var n = this.getBoundingClientRect();
                    ("dragleave" !== t.type || t.clientX < n.left || t.clientX >= n.right || t.clientY < n.top || t.clientY >= n.bottom) && (e(i).removeClass(s.currentElementClass), r.doDragLeave())
                }, v = function (t) {
                    d(t), h(t) && (t.preventDefault(), e.isFunction(s.onDropping) && s.onDropping.call(this, o, t, r))
                };
                this.doDragLeave = function () {
                    s.placeholder && l.$placeholder.remove(), l.$element.removeClass(s.hasDraggingOnChildClass), e.isFunction(s.onDragLeave) && s.onDragLeave.call(i, event, r), i = o = null
                }, this.destroy = function () {
                    l.$element.off("dragenter", s.items, p).off("dragover", s.items, g).off("drop", s.items, v).off("dragleave drop", s.items, f)
                }, e.extend(s, a, n), l.$element = e(s.element), l.$placeholder = e("<div>", {class: s.placeholderClass}), l.$element.on("dragenter", s.items, p).on("dragover", s.items, g).on("drop", s.items, v).on("dragleave drop", s.items, f)
            }
        };
        e.each(n, function (t, n) {
            e.fn[t] = function (i) {
                return i = i || {}, this.each(function () {
                    var o = e.data(this, t);
                    o instanceof n ? "destroy" === i && (o.destroy(), e.removeData(this, t)) : (i.element = this, e.data(this, t, new n(i)))
                }), this
            }
        })
    }(jQuery)
}, function (e, t, n) {
    "use strict";
    var i = a(n(47)), o = a(n(48)), r = a(n(53)), s = a(n(1)), l = a(n(56));

    function a(e) {
        return e && e.__esModule ? e : {default: e}
    }

    var c = Marionette.Application.extend({
        loaded: !1,
        previewLoadedOnce: !1,
        helpers: n(61),
        imagesManager: n(62),
        debug: n(63),
        schemes: n(64),
        presetsFactory: n(65),
        templates: n(66),
        ajax: elementorCommon.ajax,
        conditions: n(81),
        history: n(82),
        channels: {
            editor: Backbone.Radio.channel("ELEMENTOR:editor"),
            data: Backbone.Radio.channel("ELEMENTOR:data"),
            panelElements: Backbone.Radio.channel("ELEMENTOR:panelElements"),
            dataEditMode: Backbone.Radio.channel("ELEMENTOR:editmode"),
            deviceMode: Backbone.Radio.channel("ELEMENTOR:deviceMode"),
            templates: Backbone.Radio.channel("ELEMENTOR:templates")
        },
        modules: {
            get Module() {
                return elementorCommon.helpers.deprecatedMethod("elementor.modules.Module", "2.3.0", "elementorModules.Module"), elementorModules.Module
            },
            components: {
                templateLibrary: {
                    views: {
                        get BaseModalLayout() {
                            return elementorCommon.helpers.deprecatedMethod("elementor.modules.components.templateLibrary.views.BaseModalLayout", "2.4.0", "elementorModules.common.views.modal.Layout"), elementorModules.common.views.modal.Layout
                        }
                    }
                }, saver: {behaviors: {FooterSaver: n(102)}}
            },
            controls: {
                Animation: n(4),
                Base: n(3),
                BaseData: n(0),
                BaseMultiple: n(2),
                Box_shadow: n(29),
                Button: n(103),
                Choose: n(30),
                Code: n(104),
                Color: n(105),
                Date_time: l.default,
                Dimensions: n(106),
                Font: n(107),
                Gallery: n(108),
                Hidden: n(109),
                Hover_animation: n(4),
                Icon: n(110),
                Image_dimensions: n(111),
                Media: n(112),
                Number: n(113),
                Order: n(115),
                Popover_toggle: n(116),
                Repeater: n(117),
                RepeaterRow: n(32),
                Section: n(118),
                Select: n(119),
                Select2: n(4),
                Slider: n(120),
                Structure: n(121),
                Switcher: n(122),
                Tab: n(123),
                Text_shadow: n(29),
                Url: n(124),
                Wp_widget: n(125),
                Wysiwyg: n(126)
            },
            elements: {
                models: {
                    get BaseSettings() {
                        return elementorCommon.helpers.deprecatedMethod("elementor.modules.elements.models.BaseSettings", "2.4.0", "elementorModules.editor.elements.models.BaseSettings"), elementorModules.editor.elements.models.BaseSettings
                    }, Element: n(33)
                }, views: {Widget: n(128)}
            },
            layouts: {panel: {pages: {elements: {views: {Global: n(35), Elements: n(132)}}, menu: {Menu: n(133)}}}},
            views: {
                get ControlsStack() {
                    return elementorCommon.helpers.deprecatedMethod("elementor.modules.views.ControlsStack", "2.4.0", "elementorModules.editor.views.ControlsStack"), elementorModules.editor.views.ControlsStack
                }
            }
        },
        backgroundClickListeners: {
            popover: {
                element: ".elementor-controls-popover",
                ignore: ".elementor-control-popover-toggle-toggle, .elementor-control-popover-toggle-toggle-label, .select2-container"
            },
            tagsList: {element: ".elementor-tags-list", ignore: ".elementor-control-dynamic-switcher"},
            panelFooterSubMenus: {
                element: ".elementor-panel-footer-tool",
                ignore: ".elementor-panel-footer-tool.elementor-toggle-state, #elementor-panel-saver-button-publish-label",
                callback: function (e) {
                    e.removeClass("elementor-open")
                }
            }
        },
        userCan: function (e) {
            return -1 === this.config.user.restrictions.indexOf(e)
        },
        _defaultDeviceMode: "desktop",
        addControlView: function (e, t) {
            this.modules.controls[elementorCommon.helpers.firstLetterUppercase(e)] = t
        },
        checkEnvCompatibility: function () {
            return s.default.firefox || s.default.webkit
        },
        getElementData: function (e) {
            var t = e.get("elType");
            if ("widget" === t) {
                var n = e.get("widgetType");
                return !!this.config.widgets[n] && (this.config.widgets[n].commonMerged || (jQuery.extend(this.config.widgets[n].controls, this.config.widgets.common.controls), this.config.widgets[n].commonMerged = !0), this.config.widgets[n])
            }
            if (!this.config.elements[t]) return !1;
            var i = elementorCommon.helpers.cloneObject(this.config.elements[t]);
            return "section" === t && e.get("isInner") && (i.title = this.translate("inner_section")), i
        },
        getElementControls: function (e) {
            var t = this.getElementData(e);
            if (!t) return !1;
            var n = e.get("isInner"), i = {};
            return _.each(t.controls, function (e, t) {
                n && e.hide_in_inner || !n && e.hide_in_top || (i[t] = e)
            }), i
        },
        mergeControlsSettings: function (e) {
            var t = this;
            return _.each(e, function (n, i) {
                e[i] = jQuery.extend(!0, {}, t.config.controls[n.type], n)
            }), e
        },
        getControlView: function (e) {
            var t = elementorCommon.helpers.firstLetterUppercase(e), n = this.modules.controls[t];
            if (!n) {
                var i = -1 !== this.config.controls[e].features.indexOf("ui");
                n = this.modules.controls[i ? "Base" : "BaseData"]
            }
            return n
        },
        getPanelView: function () {
            return this.panel.currentView
        },
        getPreviewView: function () {
            return this.sections.currentView
        },
        initComponents: function () {
            var e = n(13), t = n(136), i = n(138), o = n(142), s = n(143);
            this.hooks = new e, this.saver = new o, this.settings = new i, this.dynamicTags = new t, this.templates.init(), this.initDialogsManager(), this.notifications = new s, this.initHotKeys(), this.hotkeysScreen = new r.default
        },
        initDialogsManager: function () {
            this.dialogsManager = elementorCommon.dialogsManager
        },
        initElements: function () {
            var e = n(34), t = this.config.data;
            this.elements && (t = this.elements.toJSON()), this.elements = new e(t), this.elementsModel = new Backbone.Model({elements: this.elements})
        },
        initPreview: function () {
            var e = jQuery;
            this.$previewWrapper = e("#elementor-preview"), this.$previewResponsiveWrapper = e("#elementor-preview-responsive-wrapper");
            this.$preview || (this.$preview = e("<iframe>", {
                id: "elementor-preview-iframe",
                src: this.config.document.urls.preview,
                allowfullscreen: 1
            }), this.$previewResponsiveWrapper.append(this.$preview)), this.$preview.on("load", this.onPreviewLoaded.bind(this))
        },
        initFrontend: function () {
            var e = this.$preview[0].contentWindow;
            window.elementorFrontend = e.elementorFrontend, e.elementor = this, elementorFrontend.init(), this.trigger("frontend:init")
        },
        initClearPageDialog: function () {
            var e, t = this;
            t.getClearPageDialog = function () {
                return e || (e = elementorCommon.dialogsManager.createWidget("confirm", {
                    id: "elementor-clear-page-dialog",
                    headerMessage: elementor.translate("clear_page"),
                    message: elementor.translate("dialog_confirm_clear_page"),
                    position: {my: "center center", at: "center center"},
                    strings: {confirm: elementor.translate("delete"), cancel: elementor.translate("cancel")},
                    onConfirm: function () {
                        t.elements.reset()
                    }
                }))
            }
        },
        initHotKeys: function () {
            var e = 67, t = 68, n = 73, i = 76, o = 77, r = 80, l = 83, a = 86, c = 46, u = 27, d = jQuery, m = {},
                h = elementorCommon.hotKeys;
            m[e] = {
                copyElement: {
                    isWorthHandling: function (e) {
                        if (!h.isControlEvent(e)) return !1;
                        if (!("editor" === elementor.getPanelView().getCurrentPageName())) return !1;
                        var t = elementorFrontend.elements.window, n = getSelection() + t.getSelection();
                        return !n && s.default.firefox && (n = [window, t].some(function (e) {
                            var t = e.document.activeElement;
                            if (t && -1 !== ["INPUT", "TEXTAREA"].indexOf(t.tagName)) {
                                var n;
                                "INPUT" === t.tagName && (n = t.type, t.type = "text");
                                var i = t.value.substring(t.selectionStart, t.selectionEnd);
                                return t.type = n, !!i
                            }
                        })), !n
                    }, handle: function () {
                        elementor.getPanelView().getCurrentPageView().getOption("editedElementView").copy()
                    }
                }
            }, m[t] = {
                duplicateElement: {
                    isWorthHandling: function (e) {
                        return h.isControlEvent(e)
                    }, handle: function () {
                        var e = elementor.getPanelView();
                        "editor" === e.getCurrentPageName() && e.getCurrentPageView().getOption("editedElementView").duplicate()
                    }
                }
            }, m[n] = {
                navigator: {
                    isWorthHandling: function (e) {
                        return h.isControlEvent(e) && "edit" === elementor.channels.dataEditMode.request("activeMode")
                    }, handle: function () {
                        elementor.navigator.storage.visible ? elementor.navigator.close() : elementor.navigator.open()
                    }
                }
            }, m[i] = {
                showTemplateLibrary: {
                    isWorthHandling: function (e) {
                        return h.isControlEvent(e) && e.shiftKey
                    }, handle: function () {
                        elementor.templates.startModal()
                    }
                }
            }, m[o] = {
                changeDeviceMode: {
                    devices: ["desktop", "tablet", "mobile"], isWorthHandling: function (e) {
                        return h.isControlEvent(e) && e.shiftKey
                    }, handle: function () {
                        var e = elementor.channels.deviceMode.request("currentMode"), t = this.devices.indexOf(e);
                        ++t >= this.devices.length && (t = 0), elementor.changeDeviceMode(this.devices[t])
                    }
                }
            }, m[r] = {
                changeEditMode: {
                    isWorthHandling: function (e) {
                        return h.isControlEvent(e)
                    }, handle: function () {
                        elementor.getPanelView().modeSwitcher.currentView.toggleMode()
                    }
                }
            }, m[l] = {
                saveEditor: {
                    isWorthHandling: function (e) {
                        return h.isControlEvent(e)
                    }, handle: function () {
                        elementor.saver.saveDraft()
                    }
                }
            }, m[a] = {
                pasteElement: {
                    isWorthHandling: function (e) {
                        return !!h.isControlEvent(e) && (-1 !== ["BODY", "IFRAME"].indexOf(document.activeElement.tagName) && "BODY" === elementorFrontend.elements.window.document.activeElement.tagName)
                    }, handle: function (e) {
                        var t = elementor.channels.editor.request("contextMenu:targetView");
                        if (!t) {
                            var n = elementor.getPanelView();
                            "editor" === n.getCurrentPageName() && (t = n.getCurrentPageView().getOption("editedElementView"))
                        }
                        e.shiftKey ? t && t.pasteStyle && elementorCommon.storage.get("transfer") && t.pasteStyle() : (t || (t = elementor.getPreviewView()), t.isPasteEnabled() && t.paste())
                    }
                }
            }, m[c] = {
                deleteElement: {
                    isWorthHandling: function (e) {
                        if (!("editor" === elementor.getPanelView().getCurrentPageName())) return !1;
                        var t = d(e.target);
                        return !t.is(":input, .elementor-input") && !t.closest('[contenteditable="true"]').length
                    }, handle: function () {
                        elementor.getPanelView().getCurrentPageView().getOption("editedElementView").removeElement()
                    }
                }
            }, m[u] = {
                quitEditor: {
                    isWorthHandling: function () {
                        return !jQuery(".dialog-widget:visible").length
                    }, handle: function () {
                        elementor.getPanelView().setPage("menu")
                    }
                }
            }, _.each(m, function (e, t) {
                _.each(e, function (e, n) {
                    h.addHotKeyHandler(t, n, e)
                })
            })
        },
        initPanel: function () {
            this.addRegions({panel: n(144)}), this.trigger("panel:init")
        },
        initNavigator: function () {
            this.addRegions({navigator: {el: "#elementor-navigator", regionClass: o.default}})
        },
        setAjax: function () {
            elementorCommon.ajax.addRequestConstant("editor_post_id", this.config.document.id), elementorCommon.ajax.on("request:unhandledError", function (e) {
                elementor.notifications.showToast({message: elementor.createAjaxErrorMessage(e)})
            })
        },
        createAjaxErrorMessage: function (e) {
            var t = void 0;
            return 4 === e.readyState ? (t = this.translate("server_error"), 200 !== e.status && (t += " (" + e.status + " " + e.statusText + ")")) : t = 0 === e.readyState ? this.translate("server_connection_lost") : this.translate("unknown_error"), t + "."
        },
        preventClicksInsideEditor: function () {
            this.$previewContents.on("submit", function (e) {
                e.preventDefault()
            }), this.$previewContents.on("click", function (e) {
                var t = jQuery(e.target), n = elementor.channels.dataEditMode.request("activeMode"),
                    i = !!t.closest("#elementor, .pen-menu").length, o = this.contains(t[0]);
                if ((!i || "edit" !== n) && o && (t.closest("a:not(.elementor-clickable)").length && e.preventDefault(), !i)) {
                    var r = elementor.getPanelView();
                    "elements" !== r.getCurrentPageName() && r.setPage("elements")
                }
            })
        },
        addBackgroundClickArea: function (e) {
            e.addEventListener("click", this.onBackgroundClick.bind(this), !0)
        },
        addBackgroundClickListener: function (e, t) {
            this.backgroundClickListeners[e] = t
        },
        removeBackgroundClickListener: function (e) {
            delete this.backgroundClickListeners[e]
        },
        showFatalErrorDialog: function (e) {
            var t = {
                id: "elementor-fatal-error-dialog",
                headerMessage: "",
                message: "",
                position: {my: "center center", at: "center center"},
                strings: {confirm: this.translate("learn_more"), cancel: this.translate("go_back")},
                onConfirm: null,
                onCancel: function () {
                    parent.history.go(-1)
                },
                hide: {onBackgroundClick: !1, onButtonClick: !1}
            };
            e = jQuery.extend(!0, t, e), elementorCommon.dialogsManager.createWidget("confirm", e).show()
        },
        showFlexBoxAttentionDialog: function () {
            var e = this, t = new elementorModules.editor.utils.Introduction({
                introductionKey: "flexbox",
                dialogType: "confirm",
                dialogOptions: {
                    id: "elementor-flexbox-attention-dialog",
                    headerMessage: this.translate("flexbox_attention_header"),
                    message: this.translate("flexbox_attention_message"),
                    position: {my: "center center", at: "center center"},
                    strings: {confirm: this.translate("learn_more"), cancel: this.translate("got_it")},
                    hide: {onButtonClick: !1},
                    onCancel: function () {
                        t.setViewed(), t.getDialog().hide()
                    },
                    onConfirm: function () {
                        return open(e.config.help_flexbox_bc_url, "_blank")
                    }
                }
            });
            t.show()
        },
        checkPageStatus: function () {
            elementor.config.current_revision_id !== elementor.config.document.id && this.notifications.showToast({
                message: this.translate("working_on_draft_notification"),
                buttons: [{
                    name: "view_revisions",
                    text: elementor.translate("view_all_revisions"),
                    callback: function () {
                        var e = elementor.getPanelView();
                        e.setPage("historyPage"), e.getCurrentPageView().activateTab("revisions")
                    }
                }]
            })
        },
        openLibraryOnStart: function () {
            "#library" === location.hash && (elementor.templates.startModal(), location.hash = "")
        },
        enterPreviewMode: function (e) {
            var t = elementorFrontend.elements.$body;
            e && (t = t.add(elementorCommon.elements.$body)), t.removeClass("elementor-editor-active").addClass("elementor-editor-preview"), this.$previewElementorEl.removeClass("elementor-edit-area-active").addClass("elementor-edit-area-preview"), e && (this.$previewWrapper.css(elementorCommon.config.isRTL ? "right" : "left", ""), this.panel.$el.css("width", ""))
        },
        exitPreviewMode: function () {
            elementorFrontend.elements.$body.add(elementorCommon.elements.$body).removeClass("elementor-editor-preview").addClass("elementor-editor-active"), this.$previewElementorEl.removeClass("elementor-edit-area-preview").addClass("elementor-edit-area-active")
        },
        changeEditMode: function (e) {
            var t = elementor.channels.dataEditMode, n = t.request("activeMode");
            t.reply("activeMode", e), e !== n && t.trigger("switch", e)
        },
        reloadPreview: function () {
            jQuery("#elementor-preview-loading").show(), this.$preview[0].contentWindow.location.reload(!0)
        },
        clearPage: function () {
            this.getClearPageDialog().show()
        },
        changeDeviceMode: function (e) {
            var t = this.channels.deviceMode.request("currentMode");
            t !== e && (elementorCommon.elements.$body.removeClass("elementor-device-" + t).addClass("elementor-device-" + e), this.channels.deviceMode.reply("previousMode", t).reply("currentMode", e).trigger("change"))
        },
        enqueueTypographyFonts: function () {
            var e = this, t = this.schemes.getScheme("typography");
            e.helpers.resetEnqueuedFontsCache(), _.each(t.items, function (t) {
                e.helpers.enqueueFont(t.value.font_family)
            })
        },
        translate: function (e, t, n) {
            return n || (n = this.config.i18n), elementorCommon.translate(e, null, t, n)
        },
        logSite: function () {
            var e = "", t = "";
            if (s.default.firefox) {
                e += "%c" + [" ;;;;;;;;;;;;;;; ", ";;;  ;;       ;;;", ";;;  ;;;;;;;;;;;;", ";;;  ;;;;;;;;;;;;", ";;;  ;;       ;;;", ";;;  ;;;;;;;;;;;;", ";;;  ;;;;;;;;;;;;", ";;;  ;;       ;;;", " ;;;;;;;;;;;;;;; "].join("\n") + "\n", t = "color: #C42961"
            } else e += "%c00", t = 'font-size: 22px; background-image: url("' + elementorCommon.config.urls.assets + 'images/logo-icon.png"); color: transparent; background-repeat: no-repeat';
            setTimeout(console.log.bind(console, e, t)), e = "%cLove using Elementor? Join our growing community of Elementor developers: %chttps://github.com/elementor/elementor", setTimeout(console.log.bind(console, e, "color: #9B0A46", ""))
        },
        requestWidgetsConfig: function () {
            var e = this, t = {};
            jQuery.each(this.config.widgets, function (e, n) {
                n.controls && (t[e] = !0)
            }), elementorCommon.ajax.addRequest("get_widgets_config", {
                data: {exclude: t}, success: function (t) {
                    jQuery.each(t, function (t, n) {
                        var i = e.config.widgets[t];
                        i.controls = n.controls, i.tabs_controls = n.tabs_controls
                    }), e.loaded && e.schemes.printSchemesStyle(), elementorCommon.elements.$body.addClass("elementor-controls-ready")
                }
            })
        },
        onStart: function () {
            NProgress.start(), NProgress.inc(.2), this.config = ElementorConfig, Backbone.Radio.DEBUG = !1, Backbone.Radio.tuneIn("ELEMENTOR"), this.initComponents(), this.checkEnvCompatibility() || this.onEnvNotCompatible(), this.setAjax(), this.requestWidgetsConfig(), this.channels.dataEditMode.reply("activeMode", "edit"), this.listenTo(this.channels.dataEditMode, "switch", this.onEditModeSwitched), this.initClearPageDialog(), this.addBackgroundClickArea(document), elementorCommon.elements.$window.trigger("elementor:init"), this.initPreview(), this.logSite()
        },
        onPreviewLoaded: function () {
            if (NProgress.done(), this.$preview[0].contentWindow.elementorFrontend) if (this.$previewContents = this.$preview.contents(), this.$previewElementorEl = this.$previewContents.find("#elementor"), this.$previewElementorEl.length) {
                this.initFrontend(), this.initElements();
                var e = new Marionette.Region({el: this.$previewElementorEl[0]});
                this.schemes.init(), this.schemes.printSchemesStyle(), this.preventClicksInsideEditor(), this.addBackgroundClickArea(elementorFrontend.elements.window.document), this.previewLoadedOnce ? this.getPanelView().setPage("elements", null, {autoFocusSearch: !1}) : this.onFirstPreviewLoaded(), this.initNavigator(), this.addRegions({sections: e});
                var t = n(160);
                this.sections.show(new t({model: this.elementsModel})), this.$previewContents.children().addClass("elementor-html");
                var i = elementorFrontend.elements.$body;
                i.addClass("elementor-editor-active"), elementor.userCan("design") || i.addClass("elementor-editor-content-only"), this.changeDeviceMode(this._defaultDeviceMode), jQuery("#elementor-loading, #elementor-preview-loading").fadeOut(600), _.defer(function () {
                    elementorFrontend.elements.window.jQuery.holdReady(!1)
                }), this.enqueueTypographyFonts(), this.onEditModeSwitched(), elementorCommon.hotKeys.bindListener(elementorFrontend.elements.$window), this.trigger("preview:loaded"), this.loaded = !0
            } else this.onPreviewElNotFound(); else this.onPreviewLoadingError()
        },
        onFirstPreviewLoaded: function () {
            this.initPanel(), this.heartbeat = new i.default, this.checkPageStatus(), this.openLibraryOnStart();
            var e = this.config.document.version && this.helpers.compareVersions(this.config.document.version, "2.5.0", "<");
            !this.config.user.introduction.flexbox && e && this.showFlexBoxAttentionDialog(), this.previewLoadedOnce = !0
        },
        onEditModeSwitched: function () {
            var e = this.channels.dataEditMode.request("activeMode");
            "edit" === e ? this.exitPreviewMode() : this.enterPreviewMode("preview" === e)
        },
        onEnvNotCompatible: function () {
            this.showFatalErrorDialog({
                headerMessage: this.translate("device_incompatible_header"),
                message: this.translate("device_incompatible_message"),
                strings: {confirm: elementor.translate("proceed_anyway")},
                hide: {onButtonClick: !0},
                onConfirm: function () {
                    this.hide()
                }
            })
        },
        onPreviewLoadingError: function () {
            this.showFatalErrorDialog({
                headerMessage: this.translate("preview_not_loading_header"),
                message: this.translate("preview_not_loading_message") + '<br><a href="' + this.config.document.urls.preview + '" target="_blank">Preview Debug</a>',
                onConfirm: function () {
                    open(elementor.config.help_preview_error_url, "_blank")
                }
            })
        },
        onPreviewElNotFound: function () {
            var e = this.$preview[0].contentWindow.elementorPreviewErrorArgs;
            e || (e = {
                headerMessage: this.translate("preview_el_not_found_header"),
                message: this.translate("preview_el_not_found_message"),
                confirmURL: elementor.config.help_the_content_url
            }), e.onConfirm = function () {
                open(e.confirmURL, "_blank")
            }, this.showFatalErrorDialog(e)
        },
        onBackgroundClick: function (e) {
            jQuery.each(this.backgroundClickListeners, function () {
                var t = jQuery(e.target);
                if (t[0].control && (t = t.add(t[0].control)), !this.ignore || !t.closest(this.ignore).length) {
                    var n = t.closest(this.element), i = jQuery(this.element).not(n);
                    this.callback ? this.callback(i) : i.hide()
                }
            })
        }
    });
    window.elementor = new c, -1 === location.href.search("ELEMENTOR_TESTS=1") && elementor.start(), e.exports = elementor
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = function () {
        function e() {
            var t = this;
            !function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e);
            var n = void 0;
            this.getModal = function () {
                return n || (n = t.initModal()), n
            }, jQuery(document).on({
                "heartbeat-send": function (e, t) {
                    t.elementor_post_lock = {post_ID: elementor.config.document.id}
                }, "heartbeat-tick": function (e, n) {
                    n.locked_user ? (elementor.saver.isEditorChanged() && elementor.saver.saveEditor({status: "autosave"}), t.showLockMessage(n.locked_user)) : t.getModal().hide(), elementorCommon.ajax.addRequestConstant("_nonce", n.elementorNonce)
                }, "heartbeat-tick.wp-refresh-nonces": function (e, t) {
                    var n = t["elementor-refresh-nonces"];
                    n && (n.heartbeatNonce && elementorCommon.ajax.addRequestConstant("_nonce", n.elementorNonce), n.heartbeatNonce && (window.heartbeatSettings.nonce = n.heartbeatNonce))
                }
            }), elementor.config.locked_user && this.showLockMessage(elementor.config.locked_user)
        }

        return i(e, [{
            key: "initModal", value: function () {
                var e = elementorCommon.dialogsManager.createWidget("lightbox", {headerMessage: elementor.translate("take_over")});
                return e.addButton({
                    name: "go_back", text: elementor.translate("go_back"), callback: function () {
                        parent.history.go(-1)
                    }
                }), e.addButton({
                    name: "take_over", text: elementor.translate("take_over"), callback: function () {
                        wp.heartbeat.enqueue("elementor_force_post_lock", !0), wp.heartbeat.connectNow()
                    }
                }), e
            }
        }, {
            key: "showLockMessage", value: function (e) {
                this.getModal().setMessage(elementor.translate("dialog_user_taken_over", [e])).show()
            }
        }]), e
    }();
    t.default = o
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }(), o = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(n(49));
    var r = n(21), s = function (e) {
        function t(e) {
            !function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t);
            var n = function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
            return n.isDocked = !1, n.opened = !1, n.ensurePosition = n.ensurePosition.bind(n), n.listenTo(elementor.channels.dataEditMode, "switch", n.onEditModeSwitched), n.storage.visible && n.open(), n
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, r), i(t, [{
            key: "getStorageKey", value: function () {
                return "navigator"
            }
        }, {
            key: "getDefaultStorage", value: function () {
                return {visible: !1, size: {width: "", height: "", top: "", bottom: "", right: "", left: ""}}
            }
        }, {
            key: "getLayout", value: function () {
                return this.currentView
            }
        }, {
            key: "getDraggableOptions", value: function () {
                return {
                    iframeFix: !0,
                    handle: "#elementor-navigator__header",
                    drag: this.onDrag.bind(this),
                    stop: this.onDragStop.bind(this)
                }
            }
        }, {
            key: "getResizableOptions", value: function () {
                var e = this;
                return {
                    handles: "all",
                    containment: "document",
                    minWidth: 150,
                    maxWidth: 500,
                    minHeight: 240,
                    start: function () {
                        elementor.$previewWrapper.addClass("ui-resizable-resizing")
                    },
                    stop: function () {
                        elementor.$previewWrapper.removeClass("ui-resizable-resizing"), e.isDocked ? (e.storage.size.width = elementor.helpers.getElementInlineStyle(e.$el, ["width"]).width, elementorCommon.storage.set("navigator", e.storage)) : e.saveSize()
                    }
                }
            }
        }, {
            key: "beforeFirstOpen", value: function () {
                this.show(new o.default), this.$el.draggable(this.getDraggableOptions()), this.$el.resizable(this.getResizableOptions())
            }
        }, {
            key: "open", value: function (e) {
                this.opened || (this.beforeFirstOpen(), this.opened = !0), this.$el.show(), this.storage.docked ? (this.dock(), this.setDockedSize()) : this.setSize(), e && e.trigger("request:edit"), this.saveStorage("visible", !0), this.ensurePosition(), elementorCommon.elements.$window.on("resize", this.ensurePosition)
            }
        }, {
            key: "close", value: function (e) {
                this.$el.hide(), this.isDocked && this.undock(!0), e || this.saveStorage("visible", !1), elementorCommon.elements.$window.off("resize", this.ensurePosition)
            }
        }, {
            key: "isOpen", value: function () {
                return this.$el.is(":visible")
            }
        }, {
            key: "dock", value: function () {
                elementorCommon.elements.$body.addClass("elementor-navigator-docked");
                var e = elementorCommon.config.isRTL ? "left" : "right", t = this.getResizableOptions();
                this.$el.css({
                    height: "",
                    top: "",
                    bottom: "",
                    left: "",
                    right: ""
                }), elementor.$previewWrapper.css(e, this.storage.size.width), this.$el.resizable("destroy"), t.handles = elementorCommon.config.isRTL ? "e" : "w", t.resize = function (t, n) {
                    elementor.$previewWrapper.css(e, n.size.width)
                }, this.$el.resizable(t), this.isDocked = !0, this.saveStorage("docked", !0)
            }
        }, {
            key: "undock", value: function (e) {
                elementorCommon.elements.$body.removeClass("elementor-navigator-docked"), elementor.$previewWrapper.css(elementorCommon.config.isRTL ? "left" : "right", ""), this.setSize(), this.$el.resizable("destroy"), this.$el.resizable(this.getResizableOptions()), this.isDocked = !1, e || this.saveStorage("docked", !1)
            }
        }, {
            key: "setSize", value: function () {
                this.storage.size && this.$el.css(this.storage.size)
            }
        }, {
            key: "setDockedSize", value: function () {
                this.$el.css("width", this.storage.size.width)
            }
        }, {
            key: "ensurePosition", value: function () {
                if (!this.isDocked) {
                    var e = this.$el.offset();
                    e.left > innerWidth && this.$el.css({
                        left: "",
                        right: ""
                    }), e.top > innerHeight && this.$el.css({top: "", bottom: ""})
                }
            }
        }, {
            key: "onDrag", value: function (e, t) {
                if (this.isDocked) if (t.position.left === t.originalPosition.left) {
                    if (t.position.top !== t.originalPosition.top) return !1
                } else this.undock(); else {
                    0 > t.position.top && (t.position.top = 0);
                    var n = 0 > t.position.left, i = t.position.left + this.el.offsetWidth > innerWidth;
                    elementorCommon.config.isRTL ? i && (t.position.left = innerWidth - this.el.offsetWidth) : n && (t.position.left = 0), elementorCommon.elements.$body.toggleClass("elementor-navigator--dock-hint", elementorCommon.config.isRTL ? n : i)
                }
            }
        }, {
            key: "onDragStop", value: function (e, t) {
                if (!this.isDocked) {
                    this.saveSize();
                    var n = t.position.left + this.el.offsetWidth;
                    (0 > t.position.left || n > innerWidth) && this.dock(), elementorCommon.elements.$body.removeClass("elementor-navigator--dock-hint")
                }
            }
        }, {
            key: "onEditModeSwitched", value: function (e) {
                "edit" === e && this.storage.visible ? this.open() : this.close(!0)
            }
        }]), t
    }();
    t.default = s
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }(), o = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(n(50));
    var r = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.LayoutView), i(t, [{
            key: "getTemplate", value: function () {
                return "#tmpl-elementor-navigator"
            }
        }, {
            key: "id", value: function () {
                return "elementor-navigator__inner"
            }
        }, {
            key: "ui", value: function () {
                return {toggleAll: "#elementor-navigator__toggle-all", close: "#elementor-navigator__close"}
            }
        }, {
            key: "events", value: function () {
                return {"click @ui.toggleAll": "toggleAll", "click @ui.close": "onCloseClick"}
            }
        }, {
            key: "regions", value: function () {
                return {elements: "#elementor-navigator__elements"}
            }
        }, {
            key: "toggleAll", value: function () {
                var e = "expand" === this.ui.toggleAll.data("elementor-action"), t = ["eicon-collapse", "eicon-expand"];
                this.ui.toggleAll.data("elementor-action", e ? "collapse" : "expand").removeClass(t[+e]).addClass(t[+!e]), this.elements.currentView.recursiveChildInvoke("toggleList", e)
            }
        }, {
            key: "activateElementsMouseInteraction", value: function () {
                this.elements.currentView.recursiveChildInvoke("activateMouseInteraction")
            }
        }, {
            key: "deactivateElementsMouseInteraction", value: function () {
                this.elements.currentView.recursiveChildInvoke("deactivateMouseInteraction")
            }
        }, {
            key: "onShow", value: function () {
                this.elements.show(new o.default({model: elementor.elementsModel}))
            }
        }, {
            key: "onCloseClick", value: function () {
                elementor.navigator.close()
            }
        }]), t
    }();
    t.default = r
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }(), o = s(n(51)), r = s(n(52));

    function s(e) {
        return e && e.__esModule ? e : {default: e}
    }

    var l = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.CompositeView), i(t, [{
            key: "getTemplate", value: function () {
                return "#tmpl-elementor-navigator__elements"
            }
        }, {
            key: "ui", value: function () {
                return {
                    item: "> .elementor-navigator__item",
                    title: "> .elementor-navigator__item .elementor-navigator__element__title__text",
                    toggle: "> .elementor-navigator__item > .elementor-navigator__element__toggle",
                    toggleList: "> .elementor-navigator__item > .elementor-navigator__element__list-toggle",
                    elements: "> .elementor-navigator__elements"
                }
            }
        }, {
            key: "events", value: function () {
                return {
                    contextmenu: "onContextMenu",
                    "click @ui.item": "onItemClick",
                    "click @ui.toggle": "onToggleClick",
                    "click @ui.toggleList": "onToggleListClick",
                    "dblclick @ui.title": "onTitleDoubleClick",
                    "keydown @ui.title": "onTitleKeyDown",
                    "paste @ui.title": "onTitlePaste",
                    "sortstart @ui.elements": "onSortStart",
                    "sortover @ui.elements": "onSortOver",
                    "sortout @ui.elements": "onSortOut",
                    "sortstop @ui.elements": "onSortStop",
                    "sortupdate @ui.elements": "onSortUpdate",
                    "sortreceive @ui.elements": "onSortReceive"
                }
            }
        }, {
            key: "getEmptyView", value: function () {
                return this.isRoot() ? r.default : this.hasChildren() ? o.default : null
            }
        }, {
            key: "childViewOptions", value: function () {
                return {indent: this.getIndent() + 10}
            }
        }, {
            key: "className", value: function () {
                var e = this.model.get("elType"), t = "elementor-navigator__element";
                return e && (t += " elementor-navigator__element-" + e), this.hasChildren() && (t += " elementor-navigator__element--has-children"), t
            }
        }, {
            key: "attributes", value: function () {
                return {"data-model-cid": this.model.cid}
            }
        }, {
            key: "templateHelpers", value: function () {
                var e = {};
                return this.isRoot() || (e.title = this.model.getTitle(), e.icon = "section" === this.model.get("elType") ? "" : this.model.getIcon()), e
            }
        }, {
            key: "initialize", value: function () {
                this.collection = this.model.get("elements"), this.childViewContainer = ".elementor-navigator__elements", this.listenTo(this.model, "request:edit", this.onEditRequest).listenTo(this.model, "change", this.onModelChange).listenTo(this.model.get("settings"), "change", this.onModelSettingsChange)
            }
        }, {
            key: "getIndent", value: function () {
                return this.getOption("indent") || 0
            }
        }, {
            key: "isRoot", value: function () {
                return !this.model.get("elType")
            }
        }, {
            key: "hasChildren", value: function () {
                return "widget" !== this.model.get("elType")
            }
        }, {
            key: "toggleList", value: function (e, t) {
                if (this.hasChildren() && !this.isRoot() && this.ui.item.hasClass("elementor-active") !== e) {
                    this.ui.item.toggleClass("elementor-active", e);
                    var n = "slideToggle";
                    void 0 !== e && (n = "slide" + (e ? "Down" : "Up")), this.ui.elements[n](300, t)
                }
            }
        }, {
            key: "toggleHiddenClass", value: function () {
                this.$el.toggleClass("elementor-navigator__element--hidden", !!this.model.get("hidden"))
            }
        }, {
            key: "recursiveChildInvoke", value: function (e) {
                for (var t = this, n = arguments, i = arguments.length, o = Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++) o[r - 1] = arguments[r];
                this[e].apply(this, o), this.children.each(function (e) {
                    e instanceof t.constructor && e.recursiveChildInvoke.apply(e, n)
                })
            }
        }, {
            key: "recursiveParentInvoke", value: function (e) {
                for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
                this._parent instanceof this.constructor && (this._parent[e].apply(this._parent, n), this._parent.recursiveParentInvoke.apply(this._parent, arguments))
            }
        }, {
            key: "recursiveChildAgreement", value: function (e) {
                for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
                if (!this[e].apply(this, n)) return !1;
                var o = !0, r = !0, s = !1, l = void 0;
                try {
                    for (var a, c = Object.values(this.children._views)[Symbol.iterator](); !(r = (a = c.next()).done); r = !0) {
                        var u = a.value;
                        if (u instanceof this.constructor && !u.recursiveChildAgreement.apply(u, arguments)) {
                            o = !1;
                            break
                        }
                    }
                } catch (e) {
                    s = !0, l = e
                } finally {
                    try {
                        !r && c.return && c.return()
                    } finally {
                        if (s) throw l
                    }
                }
                return o
            }
        }, {
            key: "activateMouseInteraction", value: function () {
                this.$el.on({mouseenter: this.onMouseEnter.bind(this), mouseleave: this.onMouseLeave.bind(this)})
            }
        }, {
            key: "deactivateMouseInteraction", value: function () {
                this.$el.off("mouseenter mouseleave")
            }
        }, {
            key: "dragShouldBeIgnored", value: function (e) {
                var t = elementor.helpers.getElementChildType(this.model.get("elType"));
                return "section" === e.get("elType") && !e.get("isInner") || (!t || -1 === t.indexOf(e.get("elType")))
            }
        }, {
            key: "addEditingClass", value: function () {
                this.ui.item.addClass("elementor-editing")
            }
        }, {
            key: "removeEditingClass", value: function () {
                this.ui.item.removeClass("elementor-editing")
            }
        }, {
            key: "enterTitleEditing", value: function () {
                this.ui.title.attr("contenteditable", !0).focus(), document.execCommand("selectAll"), elementor.addBackgroundClickListener("navigator", {
                    ignore: this.ui.title,
                    callback: this.exitTitleEditing.bind(this)
                })
            }
        }, {
            key: "exitTitleEditing", value: function () {
                this.ui.title.attr("contenteditable", !1);
                var e = this.model.get("settings"), t = e.get("_title"), n = this.ui.title.text().trim();
                t || e.unset("_title", {silent: !0}), e.set("_title", n), elementor.removeBackgroundClickListener("navigator")
            }
        }, {
            key: "activateSortable", value: function () {
                elementor.userCan("design") && this.ui.elements.sortable({
                    items: "> .elementor-navigator__element",
                    placeholder: "ui-sortable-placeholder",
                    axis: "y",
                    forcePlaceholderSize: !0,
                    connectWith: ".elementor-navigator__element-" + this.model.get("elType") + " " + this.ui.elements.selector,
                    cancel: '[contenteditable="true"]'
                })
            }
        }, {
            key: "onRender", value: function () {
                this.activateSortable(), this.ui.item.css("padding-" + (elementorCommon.config.isRTL ? "right" : "left"), this.getIndent()), this.toggleHiddenClass()
            }
        }, {
            key: "onModelChange", value: function () {
                void 0 !== this.model.changed.hidden && this.toggleHiddenClass()
            }
        }, {
            key: "onModelSettingsChange", value: function (e) {
                void 0 !== e.changed._title && this.ui.title.text(this.model.getTitle())
            }
        }, {
            key: "onItemClick", value: function () {
                this.model.trigger("request:edit", {scrollIntoView: !0})
            }
        }, {
            key: "onToggleClick", value: function (e) {
                e.stopPropagation(), this.model.trigger("request:toggleVisibility")
            }
        }, {
            key: "onTitleDoubleClick", value: function () {
                this.enterTitleEditing()
            }
        }, {
            key: "onTitleKeyDown", value: function (e) {
                13 === e.which && (e.preventDefault(), this.exitTitleEditing())
            }
        }, {
            key: "onTitlePaste", value: function (e) {
                e.preventDefault(), document.execCommand("insertHTML", !1, e.originalEvent.clipboardData.getData("text/plain"))
            }
        }, {
            key: "onToggleListClick", value: function (e) {
                e.stopPropagation(), this.toggleList()
            }
        }, {
            key: "onSortStart", value: function (e, t) {
                this.model.trigger("request:sort:start", e, t), jQuery(t.item).children(".elementor-navigator__item").trigger("click"), elementor.navigator.getLayout().activateElementsMouseInteraction()
            }
        }, {
            key: "onSortStop", value: function () {
                elementor.navigator.getLayout().deactivateElementsMouseInteraction()
            }
        }, {
            key: "onSortOver", value: function (e) {
                e.stopPropagation(), this.$el.addClass("elementor-dragging-on-child")
            }
        }, {
            key: "onSortOut", value: function (e) {
                e.stopPropagation(), this.$el.removeClass("elementor-dragging-on-child")
            }
        }, {
            key: "onSortUpdate", value: function (e, t) {
                e.stopPropagation(), this.ui.elements.is(t.item.parent()) && this.model.trigger("request:sort:update", t)
            }
        }, {
            key: "onSortReceive", value: function (e, t) {
                this.model.trigger("request:sort:receive", e, t)
            }
        }, {
            key: "onMouseEnter", value: function (e) {
                var t = this;
                e.stopPropagation(), this.recursiveChildAgreement("dragShouldBeIgnored", elementor.channels.data.request("dragging:model")) || (this.autoExpandTimeout = setTimeout(function () {
                    t.toggleList(!0, function () {
                        t.ui.elements.sortable("refreshPositions")
                    })
                }, 500))
            }
        }, {
            key: "onMouseLeave", value: function (e) {
                e.stopPropagation(), clearTimeout(this.autoExpandTimeout)
            }
        }, {
            key: "onContextMenu", value: function (e) {
                this.model.trigger("request:contextmenu", e)
            }
        }, {
            key: "onEditRequest", value: function () {
                this.recursiveParentInvoke("toggleList", !0), elementor.navigator.getLayout().elements.currentView.recursiveChildInvoke("removeEditingClass"), this.addEditingClass(), elementor.helpers.scrollToView(this.$el, 400, elementor.navigator.getLayout().elements.$el)
            }
        }]), t
    }();
    t.default = l
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.ItemView), i(t, [{
            key: "getTemplate", value: function () {
                return "#tmpl-elementor-navigator__elements--empty"
            }
        }, {
            key: "className", value: function () {
                return "elementor-empty-view"
            }
        }, {
            key: "onRendr", value: function () {
                this.$el.css("padding-" + (elementorCommon.config.isRTL ? "right" : "left"), this.getOption("indent"))
            }
        }]), t
    }();
    t.default = o
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.ItemView), i(t, [{
            key: "getTemplate", value: function () {
                return "#tmpl-elementor-navigator__root--empty"
            }
        }, {
            key: "className", value: function () {
                return "elementor-nerd-box"
            }
        }]), t
    }();
    t.default = o
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }(), o = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(n(54));
    var r = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, elementorModules.Module), i(t, [{
            key: "onInit", value: function () {
                this.layout = new o.default, this.addShortcut()
            }
        }, {
            key: "addShortcut", value: function () {
                var e = this;
                elementorCommon.hotKeys.addHotKeyHandler(191, "hotkeys", {
                    isWorthHandling: function (e) {
                        return elementorCommon.hotKeys.isControlEvent(e)
                    }, handle: function () {
                        return e.layout.showModal()
                    }
                })
            }
        }]), t
    }();
    t.default = r
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }(), o = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(n(55));
    var r = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, elementorModules.common.views.modal.Layout), i(t, [{
            key: "getModalOptions", value: function () {
                return {id: "elementor-hotkeys__modal"}
            }
        }, {
            key: "getLogoOptions", value: function () {
                return {title: elementor.translate("keyboard_shortcuts")}
            }
        }, {
            key: "initialize", value: function () {
                for (var e, n = arguments.length, i = Array(n), o = 0; o < n; o++) i[o] = arguments[o];
                (e = function e(t, n, i) {
                    null === t && (t = Function.prototype);
                    var o = Object.getOwnPropertyDescriptor(t, n);
                    if (void 0 === o) {
                        var r = Object.getPrototypeOf(t);
                        return null === r ? void 0 : e(r, n, i)
                    }
                    if ("value" in o) return o.value;
                    var s = o.get;
                    return void 0 !== s ? s.call(i) : void 0
                }(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "initialize", this)).call.apply(e, [this].concat(i)), this.showLogo(), this.showContentView()
            }
        }, {
            key: "showContentView", value: function () {
                this.modalContent.show(new o.default)
            }
        }]), t
    }();
    t.default = r
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }(), o = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(n(1));
    var r = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.LayoutView), i(t, [{
            key: "id", value: function () {
                return "elementor-hotkeys"
            }
        }, {
            key: "templateHelpers", value: function () {
                return {environment: o.default}
            }
        }, {
            key: "getTemplate", value: function () {
                return "#tmpl-elementor-hotkeys"
            }
        }]), t
    }();
    t.default = r
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = n(0), r = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, o), i(t, [{
            key: "onReady", value: function () {
                var e = _.extend({enableTime: !0, minuteIncrement: 1}, this.model.get("picker_options"));
                this.ui.input.flatpickr(e)
            }
        }, {
            key: "onBeforeDestroy", value: function () {
                this.ui.input.flatpickr().destroy()
            }
        }]), t
    }();
    t.default = r
}, function (e, t, n) {
    "use strict";
    var i = n(58);
    e.exports = Marionette.Behavior.extend({
        tagView: null,
        listenerAttached: !1,
        ui: {tagArea: ".elementor-control-tag-area", dynamicSwitcher: ".elementor-control-dynamic-switcher"},
        events: {"click @ui.dynamicSwitcher": "onDynamicSwitcherClick"},
        initialize: function () {
            this.listenerAttached || (this.listenTo(this.view.options.elementSettingsModel, "change:external:__dynamic__", this.onAfterExternalChange), this.listenerAttached = !0)
        },
        renderTools: function () {
            if (!this.getOption("dynamicSettings").default) {
                var e = jQuery(Marionette.Renderer.render("#tmpl-elementor-control-dynamic-switcher"));
                if (this.view.model.get("label_block")) {
                    this.ui.controlTitle.after(e);
                    var t = e.next(".elementor-control-responsive-switchers");
                    t.length && t.after(e)
                } else this.ui.controlTitle.before(e);
                this.ui.dynamicSwitcher = this.$el.find(this.ui.dynamicSwitcher.selector)
            }
        },
        toggleDynamicClass: function () {
            this.$el.toggleClass("elementor-control-dynamic-value", this.isDynamicMode())
        },
        isDynamicMode: function () {
            var e = this.view.elementSettingsModel.get("__dynamic__");
            return !(!e || !e[this.view.model.get("name")])
        },
        createTagsList: function () {
            var e = _.groupBy(this.getOption("tags"), "group"), t = elementor.dynamicTags.getConfig("groups"),
                n = this.ui.tagsList = jQuery("<div>", {class: "elementor-tags-list"}),
                i = jQuery("<div>", {class: "elementor-tags-list__inner"});
            n.append(i), jQuery.each(t, function (t) {
                var n = e[t];
                if (n) {
                    var o = jQuery("<div>", {class: "elementor-tags-list__group-title"}).text(this.title);
                    i.append(o), n.forEach(function (e) {
                        var t = jQuery("<div>", {class: "elementor-tags-list__item"});
                        t.text(e.title).attr("data-tag-name", e.name), i.append(t)
                    })
                }
            }), i.on("click", ".elementor-tags-list__item", this.onTagsListItemClick.bind(this)), elementorCommon.elements.$body.append(n)
        },
        getTagsList: function () {
            return this.ui.tagsList || this.createTagsList(), this.ui.tagsList
        },
        toggleTagsList: function () {
            var e = this.getTagsList();
            if (e.is(":visible")) e.hide(); else {
                var t = elementorCommon.config.isRTL ? "left" : "right";
                e.show().position({my: t + " top", at: t + " bottom+5", of: this.ui.dynamicSwitcher})
            }
        },
        setTagView: function (e, t, n) {
            this.tagView && this.tagView.destroy();
            var o = this.tagView = new i({
                id: e,
                name: t,
                settings: n,
                controlName: this.view.model.get("name"),
                dynamicSettings: this.getOption("dynamicSettings")
            });
            o.render(), this.ui.tagArea.after(o.el), this.listenTo(o.model, "change", this.onTagViewModelChange.bind(this)).listenTo(o, "remove", this.onTagViewRemove.bind(this))
        },
        setDefaultTagView: function () {
            var e = elementor.dynamicTags.tagTextToTagData(this.getDynamicValue());
            this.setTagView(e.id, e.name, e.settings)
        },
        tagViewToTagText: function () {
            var e = this.tagView;
            return elementor.dynamicTags.tagDataToTagText(e.getOption("id"), e.getOption("name"), e.model)
        },
        getDynamicValue: function () {
            return this.view.elementSettingsModel.get("__dynamic__")[this.view.model.get("name")]
        },
        getDynamicControlSettings: function () {
            return {control: {name: "__dynamic__", label: this.view.model.get("label")}}
        },
        setDynamicValue: function (e) {
            var t = this.view.model.get("name"), n = this.view.elementSettingsModel.get("__dynamic__") || {};
            (n = elementorCommon.helpers.cloneObject(n))[t] = e, this.view.elementSettingsModel.set("__dynamic__", n, this.getDynamicControlSettings(t)), this.toggleDynamicClass()
        },
        destroyTagView: function () {
            this.tagView && (this.tagView.destroy(), this.tagView = null)
        },
        onRender: function () {
            this.$el.addClass("elementor-control-dynamic"), this.renderTools(), this.toggleDynamicClass(), this.isDynamicMode() && this.setDefaultTagView()
        },
        onDynamicSwitcherClick: function () {
            this.toggleTagsList()
        },
        onTagsListItemClick: function (e) {
            var t = jQuery(e.currentTarget);
            this.setTagView(elementor.helpers.getUniqueID(), t.data("tagName"), {}), this.setDynamicValue(this.tagViewToTagText()), this.toggleTagsList(), this.tagView.getTagConfig().settings_required && this.tagView.showSettingsPopup()
        },
        onTagViewModelChange: function () {
            this.setDynamicValue(this.tagViewToTagText())
        },
        onTagViewRemove: function () {
            var e = this.view.model.get("name"), t = this.view.elementSettingsModel.get("__dynamic__");
            delete(t = elementorCommon.helpers.cloneObject(t))[e], Object.keys(t).length ? this.view.elementSettingsModel.set("__dynamic__", t, this.getDynamicControlSettings(e)) : this.view.elementSettingsModel.unset("__dynamic__", this.getDynamicControlSettings(e)), this.toggleDynamicClass()
        },
        onAfterExternalChange: function () {
            this.destroyTagView(), this.isDynamicMode() && this.setDefaultTagView(), this.toggleDynamicClass()
        },
        onDestroy: function () {
            this.destroyTagView()
        }
    })
}, function (e, t, n) {
    "use strict";
    var i = n(59);
    e.exports = Marionette.ItemView.extend({
        className: "elementor-dynamic-cover elementor-input-style",
        tagControlsStack: null,
        templateHelpers: function () {
            var e = {};
            return this.model && (e.controls = this.model.options.controls), e
        },
        ui: {remove: ".elementor-dynamic-cover__remove"},
        events: function () {
            var e = {"click @ui.remove": "onRemoveClick"};
            return this.hasSettings() && (e.click = "onClick"), e
        },
        getTemplate: function () {
            var e = this.getTagConfig(), t = Marionette.TemplateCache.get("#tmpl-elementor-control-dynamic-cover"),
                n = Marionette.Renderer.render(t, {
                    hasSettings: this.hasSettings(),
                    isRemovable: !this.getOption("dynamicSettings").default,
                    title: e.title,
                    content: e.panel_template
                });
            return Marionette.TemplateCache.prototype.compileTemplate(n.trim())
        },
        getTagConfig: function () {
            return elementor.dynamicTags.getConfig("tags." + this.getOption("name"))
        },
        initSettingsPopup: function () {
            var e = {
                className: "elementor-tag-settings-popup",
                position: {my: "left top+5", at: "left bottom", of: this.$el, autoRefresh: !0}
            }, t = elementorCommon.dialogsManager.createWidget("buttons", e);
            this.getSettingsPopup = function () {
                return t
            }
        },
        hasSettings: function () {
            return !!Object.values(this.getTagConfig().controls).length
        },
        showSettingsPopup: function () {
            this.tagControlsStack || this.initTagControlsStack();
            var e = this.getSettingsPopup();
            e.isVisible() || e.show()
        },
        initTagControlsStack: function () {
            this.tagControlsStack = new i({
                model: this.model,
                controls: this.model.controls,
                name: this.options.name,
                controlName: this.options.controlName,
                el: this.getSettingsPopup().getElements("message")[0]
            }), this.tagControlsStack.render()
        },
        initModel: function () {
            this.model = new elementorModules.editor.elements.models.BaseSettings(this.getOption("settings"), {controls: this.getTagConfig().controls})
        },
        initialize: function () {
            this.hasSettings() && (this.initModel(), this.initSettingsPopup(), this.listenTo(this.model, "change", this.render))
        },
        onClick: function () {
            this.showSettingsPopup()
        },
        onRemoveClick: function (e) {
            e.stopPropagation(), this.destroy(), this.trigger("remove")
        },
        onDestroy: function () {
            this.hasSettings() && this.getSettingsPopup().destroy()
        }
    })
}, function (e, t, n) {
    "use strict";
    var i = n(60);
    e.exports = elementorModules.editor.views.ControlsStack.extend({
        activeTab: "content",
        template: _.noop,
        emptyView: i,
        isEmpty: function () {
            return this.collection.length < 2
        },
        getNamespaceArray: function () {
            var e = elementor.getPanelView().getCurrentPageView(), t = e.getNamespaceArray();
            return t.push(e.activeSection), t.push(this.getOption("controlName")), t.push(this.getOption("name")), t
        },
        onRenderTemplate: function () {
            this.activateFirstSection()
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        className: "elementor-tag-controls-stack-empty",
        template: "#tmpl-elementor-tag-controls-stack-empty"
    })
}, function (e, t, n) {
    "use strict";
    var i, o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    };
    i = {
        _enqueuedFonts: [],
        elementsHierarchy: {section: {column: {widget: null, section: null}}},
        enqueueFont: function (e) {
            if (-1 === this._enqueuedFonts.indexOf(e)) {
                var t, n = elementor.config.controls.font.options[e], i = {
                    ru_RU: "cyrillic",
                    uk: "cyrillic",
                    bg_BG: "cyrillic",
                    vi: "vietnamese",
                    el: "greek",
                    he_IL: "hebrew"
                };
                switch (n) {
                    case"googlefonts":
                        t = "https://fonts.googleapis.com/css?family=" + e + ":100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic", i[elementor.config.locale] && (t += "&subset=" + i[elementor.config.locale]);
                        break;
                    case"earlyaccess":
                        t = "https://fonts.googleapis.com/earlyaccess/" + e.replace(/\s+/g, "").toLowerCase() + ".css"
                }
                _.isEmpty(t) || elementor.$previewContents.find("link:last").after('<link href="' + t + '" rel="stylesheet" type="text/css">'), this._enqueuedFonts.push(e), elementor.channels.editor.trigger("font:insertion", n, e)
            }
        },
        resetEnqueuedFontsCache: function () {
            this._enqueuedFonts = []
        },
        getElementChildType: function (e, t) {
            if (t || (t = this.elementsHierarchy), void 0 !== t[e]) return jQuery.isPlainObject(t[e]) ? Object.keys(t[e]) : null;
            for (var n in t) if (t.hasOwnProperty(n) && jQuery.isPlainObject(t[n])) {
                var i = this.getElementChildType(e, t[n]);
                if (i) return i
            }
            return null
        },
        getUniqueID: function () {
            return Math.random().toString(16).substr(2, 7)
        },
        stringReplaceAll: function (e, t) {
            var n = new RegExp(Object.keys(t).join("|"), "gi");
            return e.replace(n, function (e) {
                return t[e]
            })
        },
        isActiveControl: function (e, t) {
            var n, i;
            if (_.isFunction(e.get) ? (n = e.get("condition"), i = e.get("conditions")) : (n = e.condition, i = e.conditions), i) return elementor.conditions.check(i, t);
            if (_.isEmpty(n)) return !0;
            var r = _.filter(n, function (e, n) {
                var i, r = n.match(/([a-z_0-9]+)(?:\[([a-z_]+)])?(!?)$/i), s = r[1], l = r[2], a = !!r[3], c = t[s];
                return t.__dynamic__ && t.__dynamic__[s] && (c = t.__dynamic__[s]), void 0 === c || (l && "object" === (void 0 === c ? "undefined" : o(c)) && (c = c[l]), i = _.isArray(e) && !_.isEmpty(e) ? _.contains(e, c) : _.isArray(c) && !_.isEmpty(c) ? _.contains(c, e) : _.isEqual(e, c), a ? i : !i)
            });
            return _.isEmpty(r)
        },
        cloneObject: function (e) {
            return elementorCommon.helpers.deprecatedMethod("elementor.helpers.cloneObject", "2.3.0", "elementorCommon.helpers.cloneObject"), elementorCommon.helpers.cloneObject(e)
        },
        firstLetterUppercase: function (e) {
            return elementorCommon.helpers.deprecatedMethod("elementor.helpers.firstLetterUppercase", "2.3.0", "elementorCommon.helpers.firstLetterUppercase"), elementorCommon.helpers.firstLetterUppercase(e)
        },
        disableElementEvents: function (e) {
            e.each(function () {
                var e = this.style.pointerEvents;
                "none" !== e && jQuery(this).data("backup-pointer-events", e).css("pointer-events", "none")
            })
        },
        enableElementEvents: function (e) {
            e.each(function () {
                var e = jQuery(this), t = e.data("backup-pointer-events");
                void 0 !== t && e.removeData("backup-pointer-events").css("pointer-events", t)
            })
        },
        getColorPickerPaletteIndex: function (e) {
            return ["7", "8", "1", "5", "2", "3", "6", "4"].indexOf(e)
        },
        wpColorPicker: function (e, t) {
            var n = this, i = elementor.schemes.getScheme("color-picker"), o = _.sortBy(i.items, function (e) {
                return n.getColorPickerPaletteIndex(e.key)
            }), r = {width: window.innerWidth >= 1440 ? 271 : 251, palettes: _.pluck(o, "value")};
            return t && _.extend(r, t), e.wpColorPicker(r)
        },
        isInViewport: function (e, t) {
            var n = e.getBoundingClientRect();
            return t = t || document.documentElement, n.top >= 0 && n.left >= 0 && n.bottom <= (window.innerHeight || t.clientHeight) && n.right <= (window.innerWidth || t.clientWidth)
        },
        scrollToView: function (e, t, n) {
            void 0 === t && (t = 500);
            var i = n, o = elementorFrontend.elements.$window;
            n || (n = o, i = elementor.$previewContents.find("html, body")), setTimeout(function () {
                var t = n.height(), r = n.scrollTop(), s = n === o ? e.offset().top : e[0].offsetTop, l = s - r;
                if (!(l > 0 && l < t)) {
                    var a = s - t / 2;
                    i.stop(!0).animate({scrollTop: a}, 1e3)
                }
            }, t)
        },
        getElementInlineStyle: function (e, t) {
            var n = {}, i = e[0].style;
            return t.forEach(function (e) {
                n[e] = void 0 !== i[e] ? i[e] : ""
            }), n
        },
        cssWithBackup: function (e, t, n) {
            var i = this.getElementInlineStyle(e, Object.keys(n));
            e.data("css-backup-" + t, i).css(n)
        },
        recoverCSSBackup: function (e, t) {
            var n = "css-backup-" + t;
            e.css(e.data(n)), e.removeData(n)
        },
        elementSizeToUnit: function (e, t, n) {
            var i = elementorFrontend.elements.window;
            switch (n) {
                case"%":
                    t /= e.offsetParent().width() / 100;
                    break;
                case"vw":
                    t /= i.innerWidth / 100;
                    break;
                case"vh":
                    t /= i.innerHeight / 100
            }
            return Math.round(1e3 * t) / 1e3
        },
        compareVersions: function (e, t, n) {
            var i = function (e) {
                return (e += "").replace(/[^\d.]+/, ".-1.")
            };
            if ((e = i(e)) === (t = i(t))) return !n || /^={2,3}$/.test(n);
            for (var o = e.split(".").map(Number), r = t.split(".").map(Number), s = Math.max(o.length, r.length), l = 0; l < s; l++) {
                var a = o[l] || 0, c = r[l] || 0;
                if (a !== c) return elementor.conditions.compare(a, c, n)
            }
        }
    }, e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = function () {
        var e = this, t = {}, n = [], i = function (e) {
            var t, n = e.size;
            if ("custom" === n) {
                var i = e.dimension;
                if (!i.width && !i.height) return "full";
                t = "custom_" + i.width + "x" + i.height
            } else t = n;
            return t
        }, o = {};
        e.updateOnReceiveImage = function () {
            var e = elementor.getPanelView().getCurrentPageView().getOption("editedElementView");
            e.$el.addClass("elementor-loading"), o[e.cid] = e, elementor.channels.editor.once("imagesManager:detailsReceived", function () {
                _.isEmpty(o) || _(o).each(function (e) {
                    e.render(), e.$el.removeClass("elementor-loading")
                }), o = {}
            })
        }, e.getImageUrl = function (t) {
            e.registerItem(t);
            var n = e.getItem(t);
            if (!n) {
                if ("custom" === t.size) return void(elementor.getPanelView() && "editor" === elementor.getPanelView().getCurrentPageName() && t.model && e.updateOnReceiveImage());
                n = t.url
            }
            return n
        }, e.getItem = function (e) {
            var n = i(e), o = e.id;
            return !!n && (!(!t[o] || !t[o][n]) && t[o][n])
        }, e.registerItem = function (t) {
            "" !== t.id && (e.getItem(t) || (n.push(t), e.debounceGetRemoteItems()))
        }, e.getRemoteItems = function () {
            var e, o, r = [];
            if (0 !== Object.keys(n).length) {
                for (o in n) {
                    e = n[o];
                    var s = i(e), l = e.id, a = !t[l] || 0 === Object.keys(t[l]).length;
                    r.push({id: l, size: s, is_first_time: a})
                }
                elementorCommon.ajax.send("get_images_details", {
                    data: {items: r}, success: function (e) {
                        var i, o;
                        for (i in e) for (o in t[i] || (t[i] = {}), e[i]) t[i][o] = e[i][o];
                        n = [], elementor.channels.editor.trigger("imagesManager:detailsReceived", e)
                    }
                })
            }
        }, e.debounceGetRemoteItems = _.debounce(e.getRemoteItems, 300)
    }, e.exports = new i
}, function (e, t, n) {
    "use strict";
    e.exports = new function () {
        var e = this, t = [], n = {}, i = {}, o = function (t) {
            var i = t.originalEvent, o = i.error;
            if (o) {
                var r = !1, s = n.urlsToWatch;
                jQuery.each(s, function () {
                    if (-1 !== o.stack.indexOf(this)) return r = !0, !1
                }), r && e.addError({
                    type: o.name,
                    message: o.message,
                    url: i.filename,
                    line: i.lineno,
                    column: i.colno
                })
            }
        };
        this.addURLToWatch = function (e) {
            n.urlsToWatch.push(e)
        }, this.addCustomError = function (e, t, n) {
            var i = {
                type: e.name,
                message: e.message,
                url: e.fileName || e.sourceURL,
                line: e.lineNumber || e.line,
                column: e.columnNumber || e.column,
                customFields: {category: t || "general", tag: n}
            };
            if (!i.url) {
                var o = e.stack.match(/\n {4}at (.*?(?=:(\d+):(\d+)))/);
                o && (i.url = o[1], i.line = o[2], i.column = o[3])
            }
            this.addError(i)
        }, this.addError = function (n) {
            var i = {
                type: "Error",
                timestamp: Math.floor((new Date).getTime() / 1e3),
                message: null,
                url: null,
                line: null,
                column: null,
                customFields: {}
            };
            t.push(jQuery.extend(!0, i, n)), e.sendErrors()
        }, this.sendErrors = function () {
            i.$window.off("error", o), jQuery.ajax({
                url: elementorCommon.config.ajax.url,
                method: "POST",
                data: {action: "elementor_js_log", _nonce: elementorCommon.ajax.getSettings("nonce"), data: t},
                success: function () {
                    t = [], i.$window.on("error", o)
                }
            })
        }, n = {
            debounceDelay: 500,
            urlsToWatch: ["elementor/assets"]
        }, i.$window = jQuery(window), i.$window.on("error", o), e.sendErrors = _.debounce(e.sendErrors, n.debounceDelay)
    }
}, function (e, t, n) {
    "use strict";
    var i, o = n(22), r = n(10);
    i = function () {
        var e = this, t = new o, n = {}, i = ".elementor-widget-", s = {}, l = function (n) {
            var o = e.getWidgetSchemeControls(n);
            _.each(o, function (s) {
                !function (n, o, s) {
                    r.addControlStyleRules(t, n, o, function (t) {
                        return e.getSchemeValue(t.scheme.type, t.scheme.value, t.scheme.key).value
                    }, ["{{WRAPPER}}"], [i + s])
                }(s, o, n.widget_type)
            })
        };
        this.init = function () {
            return s.$style = jQuery("<style>", {id: "elementor-style-scheme"}), s.$previewHead = elementor.$previewContents.find("head"), s.$previewHead.append(s.$style), n = elementorCommon.helpers.cloneObject(elementor.config.schemes.items), e
        }, this.getWidgetSchemeControls = function (e) {
            return _.filter(e.controls, function (e) {
                return _.isObject(e.scheme)
            })
        }, this.getSchemes = function () {
            return n
        }, this.getEnabledSchemesTypes = function () {
            return elementor.config.schemes.enabled_schemes
        }, this.getScheme = function (e) {
            return n[e]
        }, this.getSchemeValue = function (t, n, i) {
            if (this.getEnabledSchemesTypes().indexOf(t) < 0) return !1;
            var o = e.getScheme(t).items[n];
            if (i && _.isObject(o)) {
                var r = elementorCommon.helpers.cloneObject(o);
                return r.value = o.value[i], r
            }
            return o
        }, this.printSchemesStyle = function () {
            t.empty(), _.each(elementor.config.widgets, function (e) {
                l(e)
            }), s.$style.text(t)
        }, this.resetSchemes = function (e) {
            n[e] = elementorCommon.helpers.cloneObject(elementor.config.schemes.items[e])
        }, this.saveScheme = function (e) {
            elementor.config.schemes.items[e].items = elementorCommon.helpers.cloneObject(n[e].items);
            var t = {};
            _.each(n[e].items, function (e, n) {
                t[n] = e.value
            }), NProgress.start(), elementorCommon.ajax.addRequest("apply_scheme", {
                data: {
                    scheme_name: e,
                    data: JSON.stringify(t)
                }, success: function () {
                    NProgress.done()
                }
            })
        }, this.setSchemeValue = function (e, t, i) {
            n[e].items[t].value = i
        }
    }, e.exports = new i
}, function (e, t, n) {
    "use strict";
    var i;
    i = {
        getPresetsDictionary: function () {
            return {11: 100 / 9, 12: 12.5, 14: 100 / 7, 16: 100 / 6, 33: 100 / 3, 66: 2 / 3 * 100, 83: 5 / 6 * 100}
        }, getAbsolutePresetValues: function (e) {
            var t = elementorCommon.helpers.cloneObject(e), n = this.getPresetsDictionary();
            return _.each(t, function (e, i) {
                n[e] && (t[i] = n[e])
            }), t
        }, getPresets: function (e, t) {
            var n = elementorCommon.helpers.cloneObject(elementor.config.elements.section.presets);
            return e && (n = n[e]), t && (n = n[t]), n
        }, getPresetByStructure: function (e) {
            var t = this.getParsedStructure(e);
            return this.getPresets(t.columnsCount, t.presetIndex)
        }, getParsedStructure: function (e) {
            return {columnsCount: (e += "").slice(0, -1), presetIndex: e.substr(-1)}
        }, getPresetSVG: function (e, t, n, i) {
            t = t || 100, n = n || 50, i = i || 2;
            var o = this.getAbsolutePresetValues(e), r = this._generatePresetSVGPath(o, t, n, i);
            return this._createSVGPreset(r, t, n)
        }, _createSVGPreset: function (e, t, n) {
            var i = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            i.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), i.setAttribute("viewBox", "0 0 " + t + " " + n);
            var o = document.createElementNS("http://www.w3.org/2000/svg", "path");
            return o.setAttribute("d", e), i.appendChild(o), i
        }, _generatePresetSVGPath: function (e, t, n, i) {
            for (var o = t - i * (e.length - 1), r = 0, s = "", l = 0; l < e.length; l++) {
                l && (s += " ");
                var a = e[l] / 100 * o;
                s += "M" + +(r += a).toFixed(4) + ",0", s += "V" + n, s += "H" + +(r - a).toFixed(4), s += "V0Z", r += i
            }
            return s
        }
    }, e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, r = n(67), s = n(79);
    i = function () {
        var e = this, t = {}, n = void 0, i = void 0, l = void 0, a = void 0, c = void 0, u = {}, d = {}, m = {},
            h = {};
        this.init = function () {
            !function () {
                var t = {
                    saveDialog: {description: elementor.translate("save_your_template_description")},
                    ajaxParams: {
                        success: function (t) {
                            e.getTemplatesCollection().add(t), e.setScreen("local")
                        }, error: function (t) {
                            e.showErrorDialog(t)
                        }
                    }
                };
                _.each(["page", "section", elementor.config.document.type], function (n) {
                    var i = jQuery.extend(!0, {}, t, {saveDialog: {title: elementor.translate("save_your_template", [elementor.translate(n)])}});
                    e.registerTemplateType(n, i)
                })
            }(), d = [{
                name: "blocks",
                source: "remote",
                title: elementor.translate("blocks"),
                type: "block"
            }, {
                name: "pages",
                source: "remote",
                title: elementor.translate("pages"),
                type: "page"
            }, {
                name: "my-templates",
                source: "local",
                title: elementor.translate("my_templates")
            }], h = {
                text: {
                    callback: function (e) {
                        return e = e.toLowerCase(), this.get("title").toLowerCase().indexOf(e) >= 0 || _.any(this.get("tags"), function (t) {
                            return t.toLowerCase().indexOf(e) >= 0
                        })
                    }
                }, type: {}, subtype: {}, favorite: {}
            }, e.setDefaultScreen("pages"), elementor.addBackgroundClickListener("libraryToggleMore", {element: ".elementor-template-library-template-more"})
        }, this.getTemplateTypes = function (e) {
            return e ? t[e] : t
        }, this.getScreens = function () {
            return d
        }, this.registerTemplateType = function (e, n) {
            t[e] = n
        }, this.deleteTemplate = function (t, n) {
            var i = e.getDeleteDialog();
            i.onConfirm = function () {
                n.onConfirm && n.onConfirm(), elementorCommon.ajax.addRequest("delete_template", {
                    data: {
                        source: t.get("source"),
                        template_id: t.get("template_id")
                    }, success: function (e) {
                        a.remove(t, {silent: !0}), n.onSuccess && n.onSuccess(e)
                    }
                })
            }, i.show()
        }, this.importTemplate = function (t, n) {
            n = n || {}, l.showLoadingView(), e.requestTemplateContent(t.get("source"), t.get("template_id"), {
                data: {page_settings: n.withPageSettings},
                success: function (i) {
                    e.closeModal(), elementor.channels.data.trigger("template:before:insert", t), elementor.getPreviewView().addChildModel(i.content, m.importOptions || {}), elementor.channels.data.trigger("template:after:insert", t), n.withPageSettings && elementor.settings.page.model.setExternalChange(i.page_settings)
                },
                error: function (t) {
                    e.showErrorDialog(t)
                },
                complete: function () {
                    l.hideLoadingView()
                }
            })
        }, this.saveTemplate = function (e, n) {
            var i = t[e];
            _.extend(n, {
                source: "local",
                type: e
            }), i.prepareSavedData && (n = i.prepareSavedData(n)), n.content = JSON.stringify(n.content);
            var o = {data: n};
            i.ajaxParams && _.extend(o, i.ajaxParams), elementorCommon.ajax.addRequest("save_template", o)
        }, this.requestTemplateContent = function (e, t, n) {
            var i = {unique_id: t, data: {source: e, edit_mode: !0, display: !0, template_id: t}};
            return n && jQuery.extend(!0, i, n), elementorCommon.ajax.addRequest("get_template_data", i)
        }, this.markAsFavorite = function (e, t) {
            var n = {data: {source: e.get("source"), template_id: e.get("template_id"), favorite: t}};
            return elementorCommon.ajax.addRequest("mark_template_as_favorite", n)
        }, this.getDeleteDialog = function () {
            return n || (n = elementorCommon.dialogsManager.createWidget("confirm", {
                id: "elementor-template-library-delete-dialog",
                headerMessage: elementor.translate("delete_template"),
                message: elementor.translate("delete_template_confirm"),
                strings: {confirm: elementor.translate("delete")}
            })), n
        }, this.getErrorDialog = function () {
            return i || (i = elementorCommon.dialogsManager.createWidget("alert", {
                id: "elementor-template-library-error-dialog",
                headerMessage: elementor.translate("an_error_occurred")
            })), i
        }, this.getLayout = function () {
            return l
        }, this.getTemplatesCollection = function () {
            return a
        }, this.getConfig = function (e) {
            return e ? u[e] ? u[e] : {} : u
        }, this.requestLibraryData = function (e) {
            if (!a || e.forceUpdate) {
                e.onBeforeUpdate && e.onBeforeUpdate();
                var t = {
                    data: {}, success: function (t) {
                        a = new s(t.templates), t.config && (u = t.config), e.onUpdate && e.onUpdate()
                    }
                };
                e.forceSync && (t.data.sync = !0), elementorCommon.ajax.addRequest("get_library_data", t)
            } else e.onUpdate && e.onUpdate()
        }, this.startModal = function (t) {
            l || (l = new r({pages: d})), l.showModal(), e.requestLibraryData({
                onBeforeUpdate: l.showLoadingView.bind(l),
                onUpdate: function () {
                    var n = elementor.config.document.remoteLibrary, i = Object.create(m);
                    m = jQuery.extend({
                        filters: {
                            source: "remote",
                            type: n.type,
                            subtype: "page" === n.type ? null : n.category
                        }, onReady: e.showTemplates
                    }, t), _.isEqual(Object.getPrototypeOf(i), m) && "elementor-template-library-templates" === l.modalContent.currentView.id || (l.hideLoadingView(), jQuery.each(m.filters, function (t, n) {
                        e.setFilter(t, n, !0)
                    }), m.onReady())
                }
            })
        }, this.closeModal = function () {
            l.hideModal()
        }, this.getFilter = function (e) {
            return elementor.channels.templates.request("filter:" + e)
        }, this.setFilter = function (e, t, n) {
            elementor.channels.templates.reply("filter:" + e, t), n || elementor.channels.templates.trigger("filter:change")
        }, this.getFilterTerms = function (e) {
            return e ? h[e] : h
        }, this.setDefaultScreen = function (e) {
            c = _.findWhere(d, {name: e})
        }, this.setScreen = function (t, n, i) {
            elementor.channels.templates.stopReplying(), e.setFilter("source", t, !0), n && e.setFilter("type", n, !0), i || e.showTemplates()
        }, this.showDefaultScreen = function () {
            this.setScreen(c.source, c.type)
        }, this.showTemplates = function () {
            var n = e.getFilter("source"), i = a.filter(function (e) {
                if (n !== e.get("source")) return !1;
                var i = t[e.get("type")];
                return !i || !1 !== i.showInLibrary
            });
            l.showTemplatesView(new s(i))
        }, this.showErrorDialog = function (t) {
            if ("object" === (void 0 === t ? "undefined" : o(t))) {
                var n = "";
                _.each(t, function (e) {
                    n += "<div>" + e.message + ".</div>"
                }), t = n
            } else t ? t += "." : t = "<i>&#60;The error message is empty&#62;</i>";
            e.getErrorDialog().setMessage(elementor.translate("templates_request_error") + '<div id="elementor-template-library-error-info">' + t + "</div>").show()
        }
    }, e.exports = new i
}, function (e, t, n) {
    "use strict";
    var i = n(68), o = n(69), r = n(70), s = n(71), l = n(72), a = n(76), c = n(77), u = n(78);
    e.exports = elementorModules.common.views.modal.Layout.extend({
        getModalOptions: function () {
            return {id: "elementor-template-library-modal"}
        }, getLogoOptions: function () {
            return {
                title: elementor.translate("library"), click: function () {
                    elementor.templates.showDefaultScreen()
                }
            }
        }, getTemplateActionButton: function (e) {
            var t = "#tmpl-elementor-template-library-" + (e.isPro ? "get-pro-button" : "insert-button");
            t = elementor.hooks.applyFilters("elementor/editor/template-library/template/action-button", t, e);
            var n = Marionette.TemplateCache.get(t);
            return Marionette.Renderer.render(n)
        }, setHeaderDefaultParts: function () {
            var e = this.getHeaderView();
            e.tools.show(new i), e.menuArea.show(new o), this.showLogo()
        }, showTemplatesView: function (e) {
            this.modalContent.show(new l({collection: e})), this.setHeaderDefaultParts()
        }, showImportView: function () {
            this.getHeaderView().menuArea.reset(), this.modalContent.show(new c)
        }, showSaveTemplateView: function (e) {
            this.getHeaderView().menuArea.reset(), this.modalContent.show(new a({model: e}))
        }, showPreviewView: function (e) {
            this.modalContent.show(new u({url: e.get("url")}));
            var t = this.getHeaderView();
            t.menuArea.reset(), t.tools.show(new r({model: e})), t.logoArea.show(new s)
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        template: "#tmpl-elementor-template-library-header-actions",
        id: "elementor-template-library-header-actions",
        ui: {
            import: "#elementor-template-library-header-import i",
            sync: "#elementor-template-library-header-sync i",
            save: "#elementor-template-library-header-save i"
        },
        events: {"click @ui.import": "onImportClick", "click @ui.sync": "onSyncClick", "click @ui.save": "onSaveClick"},
        onImportClick: function () {
            elementor.templates.getLayout().showImportView()
        },
        onSyncClick: function () {
            var e = this;
            e.ui.sync.addClass("eicon-animation-spin"), elementor.templates.requestLibraryData({
                onUpdate: function () {
                    e.ui.sync.removeClass("eicon-animation-spin"), elementor.templates.setScreen(elementor.templates.getFilter("source"), elementor.templates.getFilter("type"))
                }, forceUpdate: !0, forceSync: !0
            })
        },
        onSaveClick: function () {
            elementor.templates.getLayout().showSaveTemplateView()
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        options: {activeClass: "elementor-active"},
        template: "#tmpl-elementor-template-library-header-menu",
        id: "elementor-template-library-header-menu",
        ui: {menuItems: ".elementor-template-library-menu-item"},
        events: {"click @ui.menuItems": "onMenuItemClick"},
        templateHelpers: function () {
            return {screens: elementor.templates.getScreens()}
        },
        $activeItem: null,
        activateMenuItem: function (e) {
            var t = this.getOption("activeClass");
            this.$activeItem !== e && (this.$activeItem && this.$activeItem.removeClass(t), e.addClass(t), this.$activeItem = e)
        },
        onRender: function () {
            var e = elementor.templates.getFilter("source"),
                t = this.ui.menuItems.filter('[data-template-source="' + e + '"]');
            "remote" === e && (t = t.filter('[data-template-type="' + elementor.templates.getFilter("type") + '"]')), this.activateMenuItem(t)
        },
        onMenuItemClick: function (e) {
            var t = e.currentTarget, n = t.dataset;
            this.activateMenuItem(jQuery(t)), elementor.templates.setScreen(t.dataset.templateSource, n.templateType)
        }
    })
}, function (e, t, n) {
    "use strict";
    var i = n(23);
    e.exports = Marionette.ItemView.extend({
        template: "#tmpl-elementor-template-library-header-preview",
        id: "elementor-template-library-header-preview",
        behaviors: {insertTemplate: {behaviorClass: i}}
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        template: "#tmpl-elementor-template-library-header-back",
        id: "elementor-template-library-header-preview-back",
        events: {click: "onClick"},
        onClick: function () {
            elementor.templates.showTemplates()
        }
    })
}, function (e, t, n) {
    "use strict";
    var i, o = n(73), r = n(74);
    i = Marionette.CompositeView.extend({
        template: "#tmpl-elementor-template-library-templates",
        id: "elementor-template-library-templates",
        childViewContainer: "#elementor-template-library-templates-container",
        reorderOnSort: !0,
        emptyView: function () {
            return new (n(75))
        },
        ui: {
            textFilter: "#elementor-template-library-filter-text",
            selectFilter: ".elementor-template-library-filter-select",
            myFavoritesFilter: "#elementor-template-library-filter-my-favorites",
            orderInputs: ".elementor-template-library-order-input",
            orderLabels: "label.elementor-template-library-order-label"
        },
        events: {
            "input @ui.textFilter": "onTextFilterInput",
            "change @ui.selectFilter": "onSelectFilterChange",
            "change @ui.myFavoritesFilter": "onMyFavoritesFilterChange",
            "mousedown @ui.orderLabels": "onOrderLabelsClick"
        },
        comparators: {
            title: function (e) {
                return e.get("title").toLowerCase()
            }, popularityIndex: function (e) {
                var t = e.get("popularityIndex");
                return t || (t = e.get("date")), -t
            }, trendIndex: function (e) {
                var t = e.get("trendIndex");
                return t || (t = e.get("date")), -t
            }
        },
        getChildView: function (e) {
            return "remote" === e.get("source") ? r : o
        },
        initialize: function () {
            this.listenTo(elementor.channels.templates, "filter:change", this._renderChildren)
        },
        filter: function (e) {
            var t = elementor.templates.getFilterTerms(), n = !0;
            return jQuery.each(t, function (t) {
                var i = elementor.templates.getFilter(t);
                if (i) {
                    if (this.callback) {
                        var o = this.callback.call(e, i);
                        return o || (n = !1), o
                    }
                    var r = i === e.get(t);
                    return r || (n = !1), r
                }
            }), n
        },
        order: function (e, t) {
            var n = this.comparators[e] || e;
            t && (n = this.reverseOrder(n)), this.collection.comparator = n, this.collection.sort()
        },
        reverseOrder: function (e) {
            if ("function" != typeof e) {
                var t = e;
                e = function (e) {
                    return e.get(t)
                }
            }
            return function (t, n) {
                var i = e(t), o = e(n);
                return void 0 === i ? -1 : void 0 === o ? 1 : i < o ? 1 : i > o ? -1 : 0
            }
        },
        addSourceData: function () {
            var e = this.children.isEmpty();
            this.$el.attr("data-template-source", e ? "empty" : elementor.templates.getFilter("source"))
        },
        setFiltersUI: function () {
            this.$(this.ui.selectFilter).select2({
                placeholder: elementor.translate("category"),
                allowClear: !0,
                width: 150
            })
        },
        setMasonrySkin: function () {
            var e = new elementorModules.utils.Masonry({
                container: this.$childViewContainer,
                items: this.$childViewContainer.children()
            });
            this.$childViewContainer.imagesLoaded(e.run.bind(e))
        },
        toggleFilterClass: function () {
            this.$el.toggleClass("elementor-templates-filter-active", !(!elementor.templates.getFilter("text") && !elementor.templates.getFilter("favorite")))
        },
        onRenderCollection: function () {
            this.addSourceData(), this.toggleFilterClass(), "remote" === elementor.templates.getFilter("source") && "page" !== elementor.templates.getFilter("type") && (this.setFiltersUI(), this.setMasonrySkin())
        },
        onBeforeRenderEmpty: function () {
            this.addSourceData()
        },
        onTextFilterInput: function () {
            elementor.templates.setFilter("text", this.ui.textFilter.val())
        },
        onSelectFilterChange: function (e) {
            var t = jQuery(e.currentTarget), n = t.data("elementor-filter");
            elementor.templates.setFilter(n, t.val())
        },
        onMyFavoritesFilterChange: function () {
            elementor.templates.setFilter("favorite", this.ui.myFavoritesFilter[0].checked)
        },
        onOrderLabelsClick: function (e) {
            var t, n = jQuery(e.currentTarget.control);
            n[0].checked || (t = "asc" !== n.data("default-ordering-direction")), n.toggleClass("elementor-template-library-order-reverse", t), this.order(n.val(), n.hasClass("elementor-template-library-order-reverse"))
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(24);
    i = o.extend({
        template: "#tmpl-elementor-template-library-template-local", ui: function () {
            return _.extend(o.prototype.ui.apply(this, arguments), {
                deleteButton: ".elementor-template-library-template-delete",
                morePopup: ".elementor-template-library-template-more",
                toggleMore: ".elementor-template-library-template-more-toggle",
                toggleMoreIcon: ".elementor-template-library-template-more-toggle i"
            })
        }, events: function () {
            return _.extend(o.prototype.events.apply(this, arguments), {
                "click @ui.deleteButton": "onDeleteButtonClick",
                "click @ui.toggleMore": "onToggleMoreClick"
            })
        }, onDeleteButtonClick: function () {
            var e = this.ui.toggleMoreIcon;
            elementor.templates.deleteTemplate(this.model, {
                onConfirm: function () {
                    e.removeClass("eicon-ellipsis-h").addClass("fa fa-circle-o-notch fa-spin")
                }, onSuccess: function () {
                    elementor.templates.showTemplates()
                }
            })
        }, onToggleMoreClick: function () {
            this.ui.morePopup.show()
        }, onPreviewButtonClick: function () {
            open(this.model.get("url"), "_blank")
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(24);
    i = o.extend({
        template: "#tmpl-elementor-template-library-template-remote", ui: function () {
            return jQuery.extend(o.prototype.ui.apply(this, arguments), {favoriteCheckbox: ".elementor-template-library-template-favorite-input"})
        }, events: function () {
            return jQuery.extend(o.prototype.events.apply(this, arguments), {"change @ui.favoriteCheckbox": "onFavoriteCheckboxChange"})
        }, onPreviewButtonClick: function () {
            elementor.templates.getLayout().showPreviewView(this.model)
        }, onFavoriteCheckboxChange: function () {
            var e = this.ui.favoriteCheckbox[0].checked;
            this.model.set("favorite", e), elementor.templates.markAsFavorite(this.model, e), !e && elementor.templates.getFilter("favorite") && elementor.channels.templates.trigger("filter:change")
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.ItemView.extend({
        id: "elementor-template-library-templates-empty",
        template: "#tmpl-elementor-template-library-templates-empty",
        ui: {title: ".elementor-template-library-blank-title", message: ".elementor-template-library-blank-message"},
        modesStrings: {
            empty: {
                title: elementor.translate("templates_empty_title"),
                message: elementor.translate("templates_empty_message")
            },
            noResults: {
                title: elementor.translate("templates_no_results_title"),
                message: elementor.translate("templates_no_results_message")
            },
            noFavorites: {
                title: elementor.translate("templates_no_favorites_title"),
                message: elementor.translate("templates_no_favorites_message")
            }
        },
        getCurrentMode: function () {
            return elementor.templates.getFilter("text") ? "noResults" : elementor.templates.getFilter("favorite") ? "noFavorites" : "empty"
        },
        onRender: function () {
            var e = this.modesStrings[this.getCurrentMode()];
            this.ui.title.html(e.title), this.ui.message.html(e.message)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.ItemView.extend({
        id: "elementor-template-library-save-template",
        template: "#tmpl-elementor-template-library-save-template",
        ui: {
            form: "#elementor-template-library-save-template-form",
            submitButton: "#elementor-template-library-save-template-submit"
        },
        events: {"submit @ui.form": "onFormSubmit"},
        getSaveType: function () {
            return this.model ? this.model.get("elType") : elementor.config.document.library && elementor.config.document.library.save_as_same_type ? elementor.config.document.type : "page"
        },
        templateHelpers: function () {
            var e = this.getSaveType();
            return elementor.templates.getTemplateTypes(e).saveDialog
        },
        onFormSubmit: function (e) {
            e.preventDefault();
            var t = this.ui.form.elementorSerializeObject(), n = this.getSaveType(), i = {remove: ["default"]};
            t.content = this.model ? [this.model.toJSON(i)] : elementor.elements.toJSON(i), this.ui.submitButton.addClass("elementor-button-state"), elementor.templates.saveTemplate(n, t)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.ItemView.extend({
        template: "#tmpl-elementor-template-library-import",
        id: "elementor-template-library-import",
        ui: {
            uploadForm: "#elementor-template-library-import-form",
            fileInput: "#elementor-template-library-import-form-input"
        },
        events: {"change @ui.fileInput": "onFileInputChange"},
        droppedFiles: null,
        submitForm: function () {
            var e = this, t = void 0;
            this.droppedFiles ? (t = this.droppedFiles[0], this.droppedFiles = null) : (t = this.ui.fileInput[0].files[0], this.ui.uploadForm[0].reset());
            var n = new FileReader;
            n.onload = function (n) {
                return e.importTemplate(t.name, n.target.result.replace(/^[^,]+,/, ""))
            }, n.readAsDataURL(t)
        },
        importTemplate: function (e, t) {
            var n = elementor.templates.getLayout(), i = {
                data: {fileName: e, fileData: t}, success: function (e) {
                    elementor.templates.getTemplatesCollection().add(e), elementor.templates.setScreen("local")
                }, error: function (e) {
                    elementor.templates.showErrorDialog(e), n.showImportView()
                }, complete: function () {
                    n.hideLoadingView()
                }
            };
            elementorCommon.ajax.addRequest("import_template", i), n.showLoadingView()
        },
        onRender: function () {
            this.ui.uploadForm.on({
                "drag dragstart dragend dragover dragenter dragleave drop": this.onFormActions.bind(this),
                dragenter: this.onFormDragEnter.bind(this),
                "dragleave drop": this.onFormDragLeave.bind(this),
                drop: this.onFormDrop.bind(this)
            })
        },
        onFormActions: function (e) {
            e.preventDefault(), e.stopPropagation()
        },
        onFormDragEnter: function () {
            this.ui.uploadForm.addClass("elementor-drag-over")
        },
        onFormDragLeave: function (e) {
            jQuery(e.relatedTarget).closest(this.ui.uploadForm).length || this.ui.uploadForm.removeClass("elementor-drag-over")
        },
        onFormDrop: function (e) {
            this.droppedFiles = e.originalEvent.dataTransfer.files, this.submitForm()
        },
        onFileInputChange: function () {
            this.submitForm()
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.ItemView.extend({
        template: "#tmpl-elementor-template-library-preview",
        id: "elementor-template-library-preview",
        ui: {iframe: "> iframe"},
        onRender: function () {
            this.ui.iframe.attr("src", this.getOption("url"))
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(80);
    i = Backbone.Collection.extend({model: o}), e.exports = i
}, function (e, t, n) {
    "use strict";
    e.exports = Backbone.Model.extend({
        defaults: {
            template_id: 0,
            title: "",
            source: "",
            type: "",
            subtype: "",
            author: "",
            thumbnail: "",
            url: "",
            export_link: "",
            tags: []
        }
    })
}, function (e, t, n) {
    "use strict";
    var i;
    i = function () {
        var e = this;
        this.compare = function (e, t, n) {
            switch (n) {
                case"==":
                    return e == t;
                case"!=":
                    return e != t;
                case"!==":
                    return e !== t;
                case"in":
                    return -1 !== t.indexOf(e);
                case"!in":
                    return -1 === t.indexOf(e);
                case"contains":
                    return -1 !== e.indexOf(t);
                case"!contains":
                    return -1 === e.indexOf(t);
                case"<":
                    return e < t;
                case"<=":
                    return e <= t;
                case">":
                    return e > t;
                case">=":
                    return e >= t;
                default:
                    return e === t
            }
        }, this.check = function (t, n) {
            var i = "or" === t.relation, o = !i;
            return jQuery.each(t.terms, function () {
                var t;
                if (this.terms) t = e.check(this, n); else {
                    var r = this.name.match(/(\w+)(?:\[(\w+)])?/), s = n[r[1]];
                    r[2] && (s = s[r[2]]), t = e.compare(s, this.value, this.operator)
                }
                return i ? (t && (o = !0), !t) : t ? void 0 : o = !1
            }), o
        }
    }, e.exports = new i
}, function (e, t, n) {
    "use strict";
    var i, o = n(83);
    i = function () {
        var e = this, t = function () {
            elementor.getPanelView().addPage("historyPage", {view: o, title: elementor.translate("history")})
        };
        jQuery(window).on("elementor:init", function () {
            elementor.on("preview:loaded", t), e.history = n(90), e.revisions = n(99), e.revisions.init()
        })
    }, e.exports = new i
}, function (e, t, n) {
    "use strict";
    var i = s(n(84)), o = s(n(85)), r = s(n(87));

    function s(e) {
        return e && e.__esModule ? e : {default: e}
    }

    var l = n(25);
    e.exports = Marionette.LayoutView.extend({
        template: "#tmpl-elementor-panel-history-page",
        regions: {content: "#elementor-panel-history-content"},
        ui: {tabs: ".elementor-panel-navigation-tab"},
        events: {"click @ui.tabs": "onTabClick"},
        regionViews: {},
        currentTab: null,
        initialize: function () {
            this.initRegionViews()
        },
        initRegionViews: function () {
            var e = elementor.history.history.getItems();
            this.regionViews = {
                history: {
                    view: function () {
                        return l
                    }, options: {collection: e}
                }, revisions: {
                    view: function () {
                        var e = elementor.history.revisions.getItems();
                        return e ? 1 === e.length && "current" === e.models[0].get("type") ? r.default : o.default : i.default
                    }
                }
            }
        },
        activateTab: function (e) {
            this.ui.tabs.removeClass("elementor-active").filter('[data-view="' + e + '"]').addClass("elementor-active"), this.showView(e)
        },
        getCurrentTab: function () {
            return this.currentTab
        },
        showView: function (e) {
            var t = this.regionViews[e], n = t.options || {}, i = t.view();
            this.currentTab && this.currentTab.constructor === i || (this.currentTab = new i(n), this.content.show(this.currentTab))
        },
        onRender: function () {
            this.showView("history")
        },
        onTabClick: function (e) {
            this.activateTab(e.currentTarget.dataset.view)
        },
        onDestroy: function () {
            elementor.getPanelView().getFooterView().ui.history.removeClass("elementor-open")
        }
    })
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.ItemView), i(t, [{
            key: "getTemplate", value: function () {
                return "#tmpl-elementor-panel-revisions-loading"
            }
        }, {
            key: "id", value: function () {
                return "elementor-panel-revisions-loading"
            }
        }, {
            key: "onRender", value: function () {
                elementor.history.revisions.requestRevisions(function () {
                    setTimeout(function () {
                        return elementor.getPanelView().getCurrentPageView().activateTab("revisions")
                    })
                })
            }
        }]), t
    }();
    t.default = o
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.CompositeView.extend({
        id: "elementor-panel-revisions",
        template: "#tmpl-elementor-panel-revisions",
        childView: n(86),
        childViewContainer: "#elementor-revisions-list",
        ui: {
            discard: ".elementor-panel-scheme-discard .elementor-button",
            apply: ".elementor-panel-scheme-save .elementor-button"
        },
        events: {"click @ui.discard": "onDiscardClick", "click @ui.apply": "onApplyClick"},
        isRevisionApplied: !1,
        jqueryXhr: null,
        currentPreviewId: null,
        currentPreviewItem: null,
        initialize: function () {
            this.collection = elementor.history.revisions.getItems(), this.listenTo(elementor.channels.editor, "saved", this.onEditorSaved), this.currentPreviewId = elementor.config.current_revision_id
        },
        getRevisionViewData: function (e) {
            var t = this;
            this.jqueryXhr = elementor.history.revisions.getRevisionDataAsync(e.model.get("id"), {
                success: function (n) {
                    elementor.history.revisions.setEditorData(n.elements), elementor.settings.page.model.set(n.settings), t.setRevisionsButtonsActive(!0), t.jqueryXhr = null, e.$el.removeClass("elementor-revision-item-loading"), t.enterReviewMode()
                }, error: function (n) {
                    e.$el.removeClass("elementor-revision-item-loading"), "abort" !== t.jqueryXhr.statusText && (t.currentPreviewItem = null, t.currentPreviewId = null, alert(n))
                }
            })
        },
        setRevisionsButtonsActive: function (e) {
            this.ui.apply.add(this.ui.discard).prop("disabled", !e)
        },
        deleteRevision: function (e) {
            var t = this;
            e.$el.addClass("elementor-revision-item-loading"), elementor.history.revisions.deleteRevision(e.model, {
                success: function () {
                    e.model.get("id") === t.currentPreviewId && t.onDiscardClick(), t.currentPreviewId = null
                }, error: function () {
                    e.$el.removeClass("elementor-revision-item-loading"), alert("An error occurred")
                }
            })
        },
        enterReviewMode: function () {
            elementor.changeEditMode("review")
        },
        exitReviewMode: function () {
            elementor.changeEditMode("edit")
        },
        navigate: function (e) {
            var t = this.collection.indexOf(this.currentPreviewItem.model), n = e ? t - 1 : t + 1;
            n < 0 && (n = this.collection.length - 1), n >= this.collection.length && (n = 0), this.children.findByIndex(n).ui.detailsArea.trigger("click")
        },
        onEditorSaved: function () {
            this.exitReviewMode(), this.setRevisionsButtonsActive(!1), this.currentPreviewId = elementor.config.current_revision_id
        },
        onApplyClick: function () {
            elementor.saver.setFlagEditorChange(!0), elementor.saver.saveAutoSave(), this.isRevisionApplied = !0, this.currentPreviewId = null, elementor.history.history.getItems().reset()
        },
        onDiscardClick: function () {
            elementor.history.revisions.setEditorData(elementor.config.data), elementor.saver.setFlagEditorChange(this.isRevisionApplied), this.isRevisionApplied = !1, this.setRevisionsButtonsActive(!1), this.currentPreviewId = null, this.exitReviewMode(), this.currentPreviewItem && this.currentPreviewItem.$el.removeClass("elementor-revision-current-preview")
        },
        onDestroy: function () {
            this.currentPreviewId && this.currentPreviewId !== elementor.config.current_revision_id && this.onDiscardClick()
        },
        onRenderCollection: function () {
            if (this.currentPreviewId) {
                var e = this.collection.findWhere({id: this.currentPreviewId});
                e && (this.currentPreviewItem = this.children.findByModelCid(e.cid), this.currentPreviewItem.$el.addClass("elementor-revision-current-preview"))
            }
        },
        onChildviewDetailsAreaClick: function (e) {
            var t = this, n = e.model.get("id");
            n !== t.currentPreviewId && (this.jqueryXhr && this.jqueryXhr.abort(), t.currentPreviewItem && t.currentPreviewItem.$el.removeClass("elementor-revision-current-preview"), e.$el.addClass("elementor-revision-current-preview elementor-revision-item-loading"), elementor.saver.isEditorChanged() && null === t.currentPreviewId ? elementor.saver.saveEditor({
                status: "autosave",
                onSuccess: function () {
                    t.getRevisionViewData(e)
                }
            }) : t.getRevisionViewData(e), t.currentPreviewItem = e, t.currentPreviewId = n)
        },
        onChildviewDeleteClick: function (e) {
            var t = this, n = e.model.get("type");
            elementorCommon.dialogsManager.createWidget("confirm", {
                message: elementor.translate("dialog_confirm_delete", [n]),
                headerMessage: elementor.translate("delete_element", [n]),
                strings: {confirm: elementor.translate("delete"), cancel: elementor.translate("cancel")},
                defaultOption: "confirm",
                onConfirm: function () {
                    t.deleteRevision(e)
                }
            }).show()
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        template: "#tmpl-elementor-panel-revisions-revision-item",
        className: "elementor-revision-item",
        ui: {detailsArea: ".elementor-revision-item__details", deleteButton: ".elementor-revision-item__tools-delete"},
        triggers: {"click @ui.detailsArea": "detailsArea:click", "click @ui.deleteButton": "delete:click"}
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        template: "#tmpl-elementor-panel-revisions-no-revisions",
        id: "elementor-panel-revisions-no-revisions",
        className: "elementor-nerd-box"
    })
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.ItemView), i(t, [{
            key: "getTemplate", value: function () {
                return "#tmpl-elementor-panel-history-item"
            }
        }, {
            key: "className", value: function () {
                return "elementor-history-item elementor-history-item-" + this.model.get("status")
            }
        }, {
            key: "triggers", value: function () {
                return {click: "click"}
            }
        }]), t
    }();
    t.default = o
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.ItemView), i(t, [{
            key: "getTemplate", value: function () {
                return "#tmpl-elementor-panel-history-no-items"
            }
        }, {
            key: "id", value: function () {
                return "elementor-panel-history-no-items"
            }
        }, {
            key: "onDestroy", value: function () {
                this._parent.$el.removeClass("elementor-empty")
            }
        }]), t
    }();
    t.default = o
}, function (e, t, n) {
    "use strict";
    var i = r(n(91)), o = r(n(25));

    function r(e) {
        return e && e.__esModule ? e : {default: e}
    }

    var s = n(92), l = n(93);
    e.exports = new function () {
        var e = this, t = null, n = new Backbone.Collection([], {model: i.default}), r = !1, a = !0, c = {
            add: elementor.translate("added"),
            remove: elementor.translate("removed"),
            change: elementor.translate("edited"),
            move: elementor.translate("moved"),
            paste_style: elementor.translate("style_pasted"),
            reset_style: elementor.translate("style_reset")
        }, u = function (e) {
            return e.ElementHistory = {behaviorClass: s}, e.CollectionHistory = {behaviorClass: l}, e
        }, d = function (e) {
            return e.CollectionHistory = {behaviorClass: l}, e
        }, m = function (t) {
            var i = n.find(function (e) {
                return "not_applied" === e.get("status")
            }), o = n.indexOf(i), r = t ? o - 1 : o + 1;
            !t && !i || r < 0 || r >= n.length || e.doItem(r)
        }, h = function () {
            var e = elementor.getPanelView();
            if ("historyPage" === e.getCurrentPageName()) {
                var t = e.getCurrentPageView().getCurrentTab();
                t instanceof o.default && t.updateCurrentItem()
            }
        }, p = function () {
            if (n.length >= 2) {
                var e = n.at(n.length - 2);
                r = "not_applied" === e.get("status")
            }
        };
        this.setActive = function (e) {
            a = e
        }, this.getActive = function () {
            return a
        }, this.getItems = function () {
            return n
        }, this.startItem = function (e) {
            t = this.addItem(e)
        }, this.endItem = function () {
            t = null
        }, this.isItemStarted = function () {
            return null !== t
        }, this.addItem = function (o) {
            if (this.getActive()) {
                for (n.length || n.add({
                    status: "not_applied",
                    title: elementor.translate("editing_started"),
                    subTitle: "",
                    action: "",
                    editing_started: !0
                }); n.length && "applied" === n.first().get("status");) n.shift();
                var r = t || (new Date).getTime(), s = n.findWhere({id: r});
                s || (s = new i.default({
                    id: r, title: o.title, subTitle: o.subTitle, action: function (e) {
                        return c[e.type] ? c[e.type] : e.type
                    }(o), type: o.type, elementType: o.elementType
                }), e.startItemTitle = "", e.startItemAction = "");
                var l = 0;
                return "column" === o.elementType && "remove" === o.type && "column" === s.get("elementType") && (l = 1), s.get("items").add(o, {at: l}), n.add(s, {at: 0}), h(), r
            }
        }, this.doItem = function (t) {
            this.setActive(!1);
            var i = n.at(t);
            "not_applied" === i.get("status") ? this.undoItem(t) : this.redoItem(t), this.setActive(!0);
            var o, s = elementor.getPanelView(), l = s.getCurrentPageView();
            if ("editor" === s.getCurrentPageName()) l.getOption("editedElementView").isDestroyed ? s.setPage("historyPage") : o = l.getOption("editedElementView"); else if (i instanceof Backbone.Model && i.get("items").length) {
                var a = i.get("items").first().get("history");
                a && a.behavior.view.model && (o = e.findView(a.behavior.view.model.get("id")))
            }
            h(), o && !elementor.helpers.isInViewport(o.$el[0], elementor.$previewContents.find("html")[0]) && elementor.helpers.scrollToView(o.$el), i.get("editing_started") && (r || elementor.saver.setFlagEditorChange(!1))
        }, this.undoItem = function (e) {
            for (var t, i = 0; i < e; i++) "not_applied" === (t = n.at(i)).get("status") && (t.get("items").each(function (e) {
                var t = e.get("history");
                t && t.behavior.restore(e)
            }), t.set("status", "applied"))
        }, this.redoItem = function (e) {
            for (var t = n.length - 1; t >= e; t--) {
                var i = n.at(t);
                if ("applied" === i.get("status")) {
                    var o = _.toArray(i.get("items").models).reverse();
                    _(o).each(function (e) {
                        var t = e.get("history");
                        t && t.behavior.restore(e, !0)
                    }), i.set("status", "not_applied")
                }
            }
        }, this.getModelLabel = function (e) {
            return e instanceof Backbone.Model || (e = new Backbone.Model(e)), elementor.getElementData(e).title
        }, this.findView = function (e, t) {
            var n = this, i = !1;
            return t || (t = elementor.getPreviewView().children), _.each(t._views, function (t) {
                if (!i) {
                    var o = t.getEditModel ? t.getEditModel() : t.model;
                    e === o.get("id") ? i = t : t.children && t.children.length && (i = n.findView(e, t.children))
                }
            }), i
        }, this.startMovingItem = function (t) {
            elementor.history.history.startItem({
                type: "move",
                title: e.getModelLabel(t),
                elementType: t.elType || t.get("elType")
            })
        }, this.startInsertTemplate = function (e) {
            elementor.history.history.startItem({
                type: "add",
                title: elementor.translate("template"),
                subTitle: e.get("title"),
                elementType: "template"
            })
        }, this.startDropElement = function () {
            var t = elementor.channels.panelElements.request("element:selected");
            elementor.history.history.startItem({
                type: "add",
                title: e.getModelLabel(t.model),
                elementType: t.model.get("widgetType") || t.model.get("elType")
            })
        }, this.startAddElement = function (t) {
            elementor.history.history.startItem({type: "add", title: e.getModelLabel(t), elementType: t.elType})
        }, this.startPasteStyle = function (t) {
            elementor.history.history.startItem({
                type: "paste_style",
                title: e.getModelLabel(t),
                elementType: t.get("elType")
            })
        }, this.startResetStyle = function (t) {
            elementor.history.history.startItem({
                type: "reset_style",
                title: e.getModelLabel(t),
                elementType: t.get("elType")
            })
        }, this.startRemoveElement = function (t) {
            elementor.history.history.startItem({
                type: "remove",
                title: e.getModelLabel(t),
                elementType: t.get("elType")
            })
        }, function () {
            elementorCommon.hotKeys.addHotKeyHandler(72, "showHistoryPage", {
                isWorthHandling: function (e) {
                    return elementorCommon.hotKeys.isControlEvent(e) && e.shiftKey
                }, handle: function () {
                    elementor.getPanelView().setPage("historyPage")
                }
            });
            var e = function (e) {
                return n.length && elementorCommon.hotKeys.isControlEvent(e) && !jQuery(e.target).is("input, textarea, [contenteditable=true]")
            };
            elementorCommon.hotKeys.addHotKeyHandler(89, "historyNavigationRedo", {
                isWorthHandling: e,
                handle: function () {
                    m(!0)
                }
            }), elementorCommon.hotKeys.addHotKeyHandler(90, "historyNavigation", {
                isWorthHandling: e,
                handle: function (e) {
                    m(e.shiftKey)
                }
            })
        }(), elementor.hooks.addFilter("elements/base/behaviors", u), elementor.hooks.addFilter("elements/base-section-container/behaviors", d), elementor.channels.data.on("drag:before:update", e.startMovingItem).on("drag:after:update", e.endItem).on("element:before:add", e.startAddElement).on("element:after:add", e.endItem).on("element:before:remove", e.startRemoveElement).on("element:after:remove", e.endItem).on("element:before:paste:style", e.startPasteStyle).on("element:after:paste:style", e.endItem).on("element:before:reset:style", e.startResetStyle).on("element:after:reset:style", e.endItem).on("section:before:drop", e.startDropElement).on("section:after:drop", e.endItem).on("template:before:insert", e.startInsertTemplate).on("template:after:insert", e.endItem), elementor.channels.editor.on("saved", p)
    }
}, function (e, t, n) {
    "use strict";
    e.exports = Backbone.Model.extend({
        defaults: {
            id: 0,
            type: "",
            elementType: "",
            status: "not_applied",
            title: "",
            subTitle: "",
            action: "",
            history: {}
        }, initialize: function () {
            this.set("items", new Backbone.Collection)
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.Behavior.extend({
        oldValues: [], listenerAttached: !1, initialize: function () {
            this.lazySaveTextHistory = _.debounce(this.saveTextHistory.bind(this), 800)
        }, onBeforeRender: function () {
            this.listenerAttached || (this.listenTo(this.view.getEditModel().get("settings"), "change", this.saveHistory), this.listenerAttached = !0)
        }, saveTextHistory: function (e, t, n) {
            var i, o = {}, r = e.get(n.name);
            i = r instanceof Backbone.Collection ? r.toJSON() : r, o[n.name] = {old: this.oldValues[n.name], new: i};
            var s = {
                type: "change",
                elementType: "control",
                title: elementor.history.history.getModelLabel(e),
                subTitle: n.label,
                history: {behavior: this, changed: o, model: this.view.getEditModel().toJSON()}
            };
            elementor.history.history.addItem(s), delete this.oldValues[n.name]
        }, saveHistory: function (e, t) {
            if (elementor.history.history.getActive()) {
                var n = Object.keys(e.changed), i = e.controls[n[0]];
                if (!i && t && t.control && (i = t.control), n.length && i) {
                    if (1 === n.length) return _.isUndefined(this.oldValues[i.name]) && (this.oldValues[i.name] = e.previous(i.name)), void(elementor.history.history.isItemStarted() ? this.saveTextHistory(e, n, i) : this.lazySaveTextHistory(e, n, i));
                    var o = {};
                    _.each(n, function (t) {
                        o[t] = {old: e.previous(t), new: e.get(t)}
                    });
                    var r = {
                        type: "change",
                        elementType: "control",
                        title: elementor.history.history.getModelLabel(e),
                        history: {behavior: this, changed: o, model: this.view.getEditModel().toJSON()}
                    };
                    1 === n.length && (r.subTitle = i.label), elementor.history.history.addItem(r)
                }
            }
        }, restore: function (e, t) {
            var n = e.get("history"), i = n.model.id, o = elementor.history.history.findView(i);
            if (o) {
                var r = (o.getEditModel ? o.getEditModel() : o.model).get("settings"),
                    s = o.getBehavior("ElementHistory");
                s.stopListening(r, "change", this.saveHistory);
                var l = {};
                _.each(n.changed, function (e, n) {
                    l[n] = t ? e.new : e.old
                }), r.setExternalChange(l), e.set("status", t ? "not_applied" : "applied"), s.listenTo(r, "change", this.saveHistory)
            }
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.Behavior.extend({
        listenerAttached: !1, onBeforeRender: function () {
            this.view.collection && !this.listenerAttached && (this.view.collection.on("update", this.saveCollectionHistory, this).on("reset", this.onDeleteAllContent, this), this.listenerAttached = !0)
        }, onDeleteAllContent: function (e, t) {
            if (elementor.history.history.getActive()) {
                var n = [];
                _.each(t.previousModels, function (e) {
                    n.push(e.toJSON({copyHtmlCache: !0}))
                });
                var i = {
                    type: "remove",
                    elementType: "section",
                    title: elementor.translate("all_content"),
                    history: {behavior: this, collection: t.previousModels, event: t, models: n}
                };
                elementor.history.history.addItem(i)
            }
        }, saveCollectionHistory: function (e, t) {
            if (elementor.history.history.getActive()) {
                var n, i, o, r;
                t.add ? (o = (i = t.changes.added)[0], r = "add") : (o = (i = t.changes.removed)[0], r = "remove");
                var s = elementor.history.history.getModelLabel(o);
                if (s) {
                    var l = [];
                    _.each(i, function (e) {
                        l.push(e.toJSON({copyHtmlCache: !0}))
                    }), n = {
                        type: r,
                        elementType: o.get("elType"),
                        elementID: o.get("id"),
                        title: s,
                        history: {behavior: this, collection: e, event: t, models: l}
                    }, elementor.history.history.addItem(n)
                }
            }
        }, add: function (e, t, n) {
            "section" === e[0].elType && _.each(e, function (e) {
                e.allowEmpty = !0
            }), t.$el.hasClass("elementor-inner") && t.$el[0].ownerDocument !== elementor.$previewContents[0] && (t = elementor.getPreviewView()), t.addChildModel(e, {
                at: n,
                silent: 0
            })
        }, remove: function (e, t) {
            t.remove(e, {silent: 0})
        }, restore: function (e, t) {
            var i, o = e.get("type"), r = e.get("history"), s = !1, l = n(7);
            if (r.behavior.view instanceof l) {
                var a = r.behavior.view.model.get("id"), c = elementor.history.history.findView(a);
                c && (i = c.getBehavior("CollectionHistory"))
            }
            switch (i || (i = r.behavior), i.view.collection.off("update", i.saveCollectionHistory), o) {
                case"add":
                    t ? this.add(r.models, i.view, r.event.index) : this.remove(r.models, i.view.collection), s = !0;
                    break;
                case"remove":
                    t ? this.remove(r.models, i.view.collection) : this.add(r.models, i.view, r.event.index), s = !0
            }
            return i.view.collection.on("update", i.saveCollectionHistory, r.behavior), s
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = elementorModules.Module.extend({
        getDefaultSettings: function () {
            return {
                actions: {},
                classes: {
                    list: "elementor-context-menu-list",
                    group: "elementor-context-menu-list__group",
                    groupPrefix: "elementor-context-menu-list__group-",
                    item: "elementor-context-menu-list__item",
                    itemTypePrefix: "elementor-context-menu-list__item-",
                    itemTitle: "elementor-context-menu-list__item__title",
                    itemShortcut: "elementor-context-menu-list__item__shortcut",
                    iconShortcut: "elementor-context-menu-list__item__icon",
                    itemDisabled: "elementor-context-menu-list__item--disabled",
                    divider: "elementor-context-menu-list__divider",
                    hidden: "elementor-hidden"
                }
            }
        }, buildActionItem: function (e) {
            var t = this, n = t.getSettings("classes"),
                i = jQuery("<div>", {class: n.item + " " + n.itemTypePrefix + e.name}),
                o = jQuery("<div>", {class: n.itemTitle}).text(e.title), r = jQuery("<div>", {class: n.iconShortcut});
            if (e.icon && r.html(jQuery("<i>", {class: e.icon})), i.append(r, o), e.shortcut) {
                var s = jQuery("<div>", {class: n.itemShortcut}).html(e.shortcut);
                i.append(s)
            }
            return e.callback && i.on("click", function () {
                t.runAction(e)
            }), e.$item = i, i
        }, buildActionsList: function () {
            var e = this, t = e.getSettings("classes"), n = e.getSettings("groups"),
                i = jQuery("<div>", {class: t.list});
            return n.forEach(function (n) {
                var o = jQuery("<div>", {class: t.group + " " + t.groupPrefix + n.name});
                n.actions.forEach(function (t) {
                    o.append(e.buildActionItem(t))
                }), i.append(o), n.$item = o
            }), i
        }, toggleGroupVisibility: function (e, t) {
            e.$item.toggleClass(this.getSettings("classes.hidden"), !t)
        }, toggleActionVisibility: function (e, t) {
            e.$item.toggleClass(this.getSettings("classes.hidden"), !t)
        }, toggleActionUsability: function (e, t) {
            e.$item.toggleClass(this.getSettings("classes.itemDisabled"), !t)
        }, isActionEnabled: function (e) {
            return !(!e.callback && !e.groups) && (!e.isEnabled || e.isEnabled())
        }, runAction: function (e) {
            this.isActionEnabled(e) && (e.callback(), this.getModal().hide())
        }, initModal: function () {
            var e;
            this.getModal = function () {
                return e || (e = elementorCommon.dialogsManager.createWidget("simple", {
                    className: "elementor-context-menu",
                    message: this.buildActionsList(),
                    iframe: elementor.$preview,
                    effects: {hide: "hide", show: "show"},
                    hide: {onOutsideContextMenu: !0},
                    position: {my: (elementorCommon.config.isRTL ? "right" : "left") + " top", collision: "fit"}
                })), e
            }
        }, show: function (e) {
            var t = this, n = t.getModal();
            n.setSettings("position", {of: e}), t.getSettings("groups").forEach(function (e) {
                var n = !1 !== e.isVisible;
                t.toggleGroupVisibility(e, n), n && e.actions.forEach(function (e) {
                    var n = !1 !== e.isVisible;
                    t.toggleActionVisibility(e, n), n && t.toggleActionUsability(e, t.isActionEnabled(e))
                })
            }), n.show()
        }, destroy: function () {
            this.getModal().destroy()
        }, onInit: function () {
            this.initModal()
        }
    })
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }(), o = function e(t, n, i) {
        null === t && (t = Function.prototype);
        var o = Object.getOwnPropertyDescriptor(t, n);
        if (void 0 === o) {
            var r = Object.getPrototypeOf(t);
            return null === r ? void 0 : e(r, n, i)
        }
        if ("value" in o) return o.value;
        var s = o.get;
        return void 0 !== s ? s.call(i) : void 0
    }, r = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(n(28));
    var s = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, r.default), i(t, [{
            key: "className", value: function () {
                return o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "className", this).call(this) + " elementor-add-section-inline"
            }
        }, {
            key: "fadeToDeath", value: function () {
                var e = this;
                e.$el.slideUp(function () {
                    e.destroy()
                })
            }
        }, {
            key: "paste", value: function () {
                o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "paste", this).call(this), this.destroy()
            }
        }, {
            key: "onCloseButtonClick", value: function () {
                this.fadeToDeath()
            }
        }, {
            key: "onPresetSelected", value: function (e) {
                o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "onPresetSelected", this).call(this, e), this.destroy()
            }
        }, {
            key: "onAddTemplateButtonClick", value: function () {
                o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "onAddTemplateButtonClick", this).call(this), this.destroy()
            }
        }, {
            key: "onDropping", value: function () {
                o(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "onDropping", this).call(this), this.destroy()
            }
        }]), t
    }();
    t.default = s
}, function (e, t, n) {
    "use strict";
    var i, o = n(7), r = n(97);
    i = o.extend({
        template: Marionette.TemplateCache.get("#tmpl-elementor-column-content"),
        emptyView: r,
        childViewContainer: "> .elementor-column-wrap > .elementor-widget-wrap",
        toggleEditTools: !0,
        behaviors: function () {
            var e = o.prototype.behaviors.apply(this, arguments);
            return _.extend(e, {
                Sortable: {behaviorClass: n(11), elChildType: "widget"},
                Resizable: {behaviorClass: n(98)}
            }), elementor.hooks.applyFilters("elements/column/behaviors", e, this)
        },
        className: function () {
            return o.prototype.className.apply(this, arguments) + " elementor-column elementor-" + (this.isInner() ? "inner" : "top") + "-column"
        },
        tagName: function () {
            return this.model.getSetting("html_tag") || "div"
        },
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.columnInner = "> .elementor-column-wrap", e.percentsTooltip = "> .elementor-element-overlay .elementor-column-percents-tooltip", e
        },
        initialize: function () {
            o.prototype.initialize.apply(this, arguments), this.addControlValidator("_inline_size", this.onEditorInlineSizeInputChange)
        },
        getContextMenuGroups: function () {
            var e = o.prototype.getContextMenuGroups.apply(this, arguments),
                t = e.indexOf(_.findWhere(e, {name: "general"}));
            return e.splice(t + 1, 0, {
                name: "addNew",
                actions: [{
                    name: "addNew",
                    icon: "eicon-plus",
                    title: elementor.translate("new_column"),
                    callback: this.addNewColumn.bind(this)
                }]
            }), e
        },
        isDroppingAllowed: function () {
            var e = elementor.channels.panelElements.request("element:selected");
            if (!e) return !1;
            var t = e.model.get("elType");
            return "section" === t ? !this.isInner() : "widget" === t
        },
        getPercentsForDisplay: function () {
            return (+this.model.getSetting("_inline_size") || this.getPercentSize()).toFixed(1) + "%"
        },
        changeSizeUI: function () {
            var e = this, t = e.model.getSetting("_column_size");
            e.$el.attr("data-col", t), _.defer(function () {
                e.ui.percentsTooltip && e.ui.percentsTooltip.text(e.getPercentsForDisplay())
            })
        },
        getPercentSize: function (e) {
            return e || (e = this.el.getBoundingClientRect().width), +(e / this.$el.parent().width() * 100).toFixed(3)
        },
        getSortableOptions: function () {
            return {connectWith: ".elementor-widget-wrap", items: "> .elementor-element"}
        },
        changeChildContainerClasses: function () {
            this.collection.isEmpty() ? this.ui.columnInner.removeClass("elementor-element-populated").addClass("elementor-element-empty") : this.ui.columnInner.removeClass("elementor-element-empty").addClass("elementor-element-populated")
        },
        addNewColumn: function () {
            this.trigger("request:add:new")
        },
        onCollectionChanged: function () {
            o.prototype.onCollectionChanged.apply(this, arguments), this.changeChildContainerClasses()
        },
        onRender: function () {
            var e = this;
            o.prototype.onRender.apply(e, arguments), e.changeChildContainerClasses(), e.changeSizeUI(), e.$el.html5Droppable({
                items: " > .elementor-column-wrap > .elementor-widget-wrap > .elementor-element, >.elementor-column-wrap > .elementor-widget-wrap > .elementor-empty-view > .elementor-first-add",
                axis: ["vertical"],
                groups: ["elementor-element"],
                isDroppingAllowed: e.isDroppingAllowed.bind(e),
                currentElementClass: "elementor-html5dnd-current-element",
                placeholderClass: "elementor-sortable-placeholder elementor-widget-placeholder",
                hasDraggingOnChildClass: "elementor-dragging-on-child",
                onDropping: function (t, n) {
                    n.stopPropagation(), elementor.getPreviewView().onPanelElementDragEnd();
                    var i = jQuery(this).index();
                    "bottom" === t && i++, e.addElementFromPanel({at: i})
                }
            })
        },
        onSettingsChanged: function (e) {
            o.prototype.onSettingsChanged.apply(this, arguments);
            var t = e.changedAttributes();
            ("_column_size" in t || "_inline_size" in t) && this.changeSizeUI()
        },
        onEditorInlineSizeInputChange: function (e, t) {
            var n = [], i = this.model.getSetting("_column_size");
            if (100 === i) return n.push("Could not resize one column"), n;
            t || (t = i);
            try {
                this._parent.resizeChild(this, +t, +e)
            } catch (e) {
                e.message === this._parent.errors.columnWidthTooLarge && n.push(e.message)
            }
            return n
        },
        onAddButtonClick: function (e) {
            e.stopPropagation(), this.addNewColumn()
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        template: "#tmpl-elementor-empty-preview",
        className: "elementor-empty-view",
        events: {click: "onClickAdd"},
        behaviors: function () {
            return {contextMenu: {behaviorClass: n(8), groups: this.getContextMenuGroups()}}
        },
        getContextMenuGroups: function () {
            return [{
                name: "general",
                actions: [{
                    name: "paste",
                    title: elementor.translate("paste"),
                    callback: this.paste.bind(this),
                    isEnabled: this.isPasteEnabled.bind(this)
                }]
            }]
        },
        paste: function () {
            var e = this, t = 0;
            elementorCommon.storage.get("transfer").elements.forEach(function (n) {
                e._parent.addChildElement(n, {at: t, clone: !0}), t++
            })
        },
        isPasteEnabled: function () {
            var e = elementorCommon.storage.get("transfer");
            return !!e && ("section" === e.elementsType ? e.elements[0].isInner && !this._parent.isInner() : "widget" === e.elementsType)
        },
        onClickAdd: function () {
            elementor.getPanelView().setPage("elements")
        }
    })
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.Behavior.extend({
        defaults: {handles: elementorCommon.config.isRTL ? "w" : "e"},
        events: {resizestart: "onResizeStart", resizestop: "onResizeStop", resize: "onResize"},
        initialize: function () {
            Marionette.Behavior.prototype.initialize.apply(this, arguments), this.listenTo(elementor.channels.dataEditMode, "switch", this.onEditModeSwitched)
        },
        active: function () {
            if (elementor.userCan("design")) {
                this.deactivate();
                var e = _.clone(this.options);
                delete e.behaviorClass;
                var t = this.getChildViewContainer(), n = _.extend({}, e);
                t.resizable(n)
            }
        },
        deactivate: function () {
            this.getChildViewContainer().resizable("instance") && this.getChildViewContainer().resizable("destroy")
        },
        onEditModeSwitched: function (e) {
            "edit" === e ? this.active() : this.deactivate()
        },
        onRender: function () {
            var e = this;
            _.defer(function () {
                e.onEditModeSwitched(elementor.channels.dataEditMode.request("activeMode"))
            })
        },
        onDestroy: function () {
            this.deactivate()
        },
        onResizeStart: function (e) {
            e.stopPropagation(), this.view.$el.data("originalWidth", this.view.el.getBoundingClientRect().width), this.view.triggerMethod("request:resize:start", e)
        },
        onResizeStop: function (e) {
            e.stopPropagation(), this.view.triggerMethod("request:resize:stop")
        },
        onResize: function (e, t) {
            e.stopPropagation(), this.view.triggerMethod("request:resize", t, e)
        },
        getChildViewContainer: function () {
            return this.$el
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(100);
    i = function () {
        var e = this, t = void 0, n = function (n) {
            n.latest_revisions && e.addRevisions(n.latest_revisions), e.requestRevisions(function () {
                if (n.revisions_ids) {
                    var e = t.filter(function (e) {
                        return -1 !== n.revisions_ids.indexOf(e.get("id"))
                    });
                    t.reset(e)
                }
            })
        };
        this.getItems = function () {
            return t
        }, this.requestRevisions = function (e) {
            var n = this;
            t ? e(t) : elementorCommon.ajax.addRequest("get_revisions", {
                success: function (i) {
                    (t = new o(i)).on("update", n.onRevisionsUpdate.bind(n)), e(t)
                }
            })
        }, this.setEditorData = function (e) {
            var t = elementor.getRegion("sections").currentView.collection;
            elementor.history.history.setActive(!1), t.reset(e), elementor.history.history.setActive(!0)
        }, this.getRevisionDataAsync = function (e, t) {
            return _.extend(t, {data: {id: e}}), elementorCommon.ajax.addRequest("get_revision_data", t)
        }, this.addRevisions = function (e) {
            this.requestRevisions(function () {
                e.forEach(function (e) {
                    var n = t.findWhere({id: e.id});
                    n && t.remove(n, {silent: !0}), t.add(e, {silent: !0})
                }), t.trigger("update")
            })
        }, this.deleteRevision = function (e, t) {
            var n = {
                data: {id: e.get("id")}, success: function () {
                    t.success && t.success(), e.destroy()
                }
            };
            t.error && (n.error = t.error), elementorCommon.ajax.addRequest("delete_revision", n)
        }, this.init = function () {
            elementor.channels.editor.on("saved", n), function () {
                var e = {
                    isWorthHandling: function () {
                        var e = elementor.getPanelView();
                        if ("historyPage" !== e.getCurrentPageName()) return !1;
                        var t = e.getCurrentPageView().getCurrentTab();
                        return t.currentPreviewId && t.currentPreviewItem && t.children.length > 1
                    }, handle: function (e) {
                        elementor.getPanelView().getCurrentPageView().getCurrentTab().navigate(38 === e.which)
                    }
                };
                elementorCommon.hotKeys.addHotKeyHandler(38, "revisionNavigation", e), elementorCommon.hotKeys.addHotKeyHandler(40, "revisionNavigation", e)
            }()
        }, this.onRevisionsUpdate = function () {
            var e = elementor.getPanelView();
            "historyPage" === e.getCurrentPageName() && e.getCurrentPageView().activateTab("revisions")
        }
    }, e.exports = new i
}, function (e, t, n) {
    "use strict";
    var i = n(101);
    e.exports = Backbone.Collection.extend({
        model: i, comparator: function (e) {
            return -e.get("timestamp")
        }
    })
}, function (e, t, n) {
    "use strict";
    var i;
    (i = Backbone.Model.extend()).prototype.sync = function () {
        return null
    }, e.exports = i
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.Behavior.extend({
        previewWindow: null, ui: function () {
            return {
                buttonPreview: "#elementor-panel-footer-saver-preview",
                buttonPublish: "#elementor-panel-saver-button-publish",
                buttonSaveOptions: "#elementor-panel-saver-button-save-options",
                buttonPublishLabel: "#elementor-panel-saver-button-publish-label",
                menuSaveDraft: "#elementor-panel-footer-sub-menu-item-save-draft",
                lastEditedWrapper: ".elementor-last-edited-wrapper"
            }
        }, events: function () {
            return {
                "click @ui.buttonPreview": "onClickButtonPreview",
                "click @ui.buttonPublish": "onClickButtonPublish",
                "click @ui.menuSaveDraft": "onClickMenuSaveDraft"
            }
        }, initialize: function () {
            elementor.saver.on("before:save", this.onBeforeSave.bind(this)).on("after:save", this.onAfterSave.bind(this)).on("after:saveError", this.onAfterSaveError.bind(this)).on("page:status:change", this.onPageStatusChange), elementor.settings.page.model.on("change", this.onPageSettingsChange.bind(this)), elementor.channels.editor.on("status:change", this.activateSaveButtons.bind(this))
        }, activateSaveButtons: function (e) {
            e = e || "draft" === elementor.settings.page.model.get("post_status"), this.ui.buttonPublish.add(this.ui.menuSaveDraft).toggleClass("elementor-disabled", !e), this.ui.buttonSaveOptions.toggleClass("elementor-disabled", !e)
        }, onRender: function () {
            this.setMenuItems(elementor.settings.page.model.get("post_status")), this.addTooltip()
        }, onPageSettingsChange: function (e) {
            var t = e.changed;
            _.isUndefined(t.post_status) || (this.setMenuItems(t.post_status), this.refreshWpPreview(), "page_settings" === elementor.getPanelView().getCurrentPageName() && elementor.getPanelView().getCurrentPageView().render())
        }, onPageStatusChange: function (e) {
            "publish" === e && elementor.notifications.showToast({
                message: elementor.config.document.panel.messages.publish_notification,
                buttons: [{
                    name: "view_page", text: elementor.translate("have_a_look"), callback: function () {
                        open(elementor.config.document.urls.permalink)
                    }
                }]
            })
        }, onBeforeSave: function (e) {
            NProgress.start(), "autosave" === e.status ? this.ui.lastEditedWrapper.addClass("elementor-state-active") : this.ui.buttonPublish.addClass("elementor-button-state")
        }, onAfterSave: function (e) {
            NProgress.done(), this.ui.buttonPublish.removeClass("elementor-button-state"), this.ui.lastEditedWrapper.removeClass("elementor-state-active"), this.refreshWpPreview(), this.setLastEdited(e)
        }, setLastEdited: function (e) {
            this.ui.lastEditedWrapper.removeClass("elementor-button-state").find(".elementor-last-edited").html(e.config.document.last_edited)
        }, onAfterSaveError: function () {
            NProgress.done(), this.ui.buttonPublish.removeClass("elementor-button-state")
        }, onClickButtonPreview: function () {
            this.previewWindow = open(elementor.config.document.urls.wp_preview, "wp-preview-" + elementor.config.document.id), elementor.saver.isEditorChanged() && (elementor.saver.isSaving && (elementor.saver.isSaving = !1), elementor.saver.doAutoSave())
        }, onClickButtonPublish: function () {
            this.ui.buttonPublish.hasClass("elementor-disabled") || elementor.saver.defaultSave()
        }, onClickMenuSaveDraft: function () {
            elementor.saver.saveDraft()
        }, setMenuItems: function (e) {
            var t = "publish";
            switch (e) {
                case"publish":
                case"private":
                    t = "update", elementor.config.current_revision_id !== elementor.config.document.id && this.activateSaveButtons(!0);
                    break;
                case"draft":
                    elementor.config.current_user_can_publish || (t = "submit"), this.activateSaveButtons(!0);
                    break;
                case"pending":
                case void 0:
                    elementor.config.current_user_can_publish || (t = "update")
            }
            this.ui.buttonPublishLabel.html(elementor.translate(t))
        }, addTooltip: function () {
            this.$el.find(".tooltip-target").tipsy({
                gravity: "s", title: function () {
                    return this.getAttribute("data-tooltip")
                }
            })
        }, refreshWpPreview: function () {
            if (this.previewWindow) try {
                this.previewWindow.location.href = elementor.config.document.urls.wp_preview
            } catch (e) {
            }
        }
    })
}, function (e, t, n) {
    "use strict";
    var i = n(3);
    e.exports = i.extend({
        ui: function () {
            var e = i.prototype.ui.apply(this, arguments);
            return e.button = "button", e
        }, events: {"click @ui.button": "onButtonClick"}, onButtonClick: function () {
            var e = this.model.get("event");
            elementor.channels.editor.trigger(e, this)
        }
    })
}, function (e, t, n) {
    "use strict";
    var i, o = n(0);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.editor = ".elementor-code-editor", e
        }, onReady: function () {
            var e = this;
            if ("undefined" != typeof ace) {
                var t = ace.require("ace/ext/language_tools");
                if (e.editor = ace.edit(this.ui.editor[0]), jQuery(e.editor.container).addClass("elementor-input-style elementor-code-editor"), e.editor.setOptions({
                        mode: "ace/mode/" + e.model.attributes.language,
                        minLines: 10,
                        maxLines: 1 / 0,
                        showGutter: !0,
                        useWorker: !0,
                        enableBasicAutocompletion: !0,
                        enableLiveAutocompletion: !0
                    }), e.editor.getSession().setUseWrapMode(!0), elementor.panel.$el.on("resize.aceEditor", e.onResize.bind(this)), "css" === e.model.attributes.language) {
                    t.addCompleter({
                        getCompletions: function (e, t, n, i, o) {
                            var r = [], s = t.getTokenAt(n.row, n.column);
                            0 < i.length && "selector".match(i) && "constant" === s.type && (r = [{
                                name: "selector",
                                value: "selector",
                                score: 1,
                                meta: "Elementor"
                            }]), o(null, r)
                        }
                    })
                }
                if (e.editor.setValue(e.getControlValue(), -1), e.editor.on("change", function () {
                        e.setValue(e.editor.getValue())
                    }), "html" === e.model.attributes.language) {
                    var n = e.editor.getSession();
                    n.on("changeAnnotation", function () {
                        for (var e = n.getAnnotations() || [], t = e.length, i = e.length; i--;) /doctype first\. Expected/.test(e[i].text) && e.splice(i, 1);
                        t > e.length && n.setAnnotations(e)
                    })
                }
            }
        }, onResize: function () {
            this.editor.resize()
        }, onDestroy: function () {
            elementor.panel.$el.off("resize.aceEditor")
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(0);
    i = o.extend({
        applySavedValue: function () {
            o.prototype.applySavedValue.apply(this, arguments);
            var e = this, t = e.getControlValue();
            e.ui.input.wpColorPicker("instance") ? (e.ui.input.wpColorPicker("color", t), t || e.ui.input.data("a8cIris")._change()) : elementor.helpers.wpColorPicker(e.ui.input, {
                change: function () {
                    e.setValue(e.ui.input.wpColorPicker("color"))
                }, clear: function () {
                    e.setValue("")
                }
            })
        }, onBeforeDestroy: function () {
            this.ui.input.wpColorPicker("instance") && this.ui.input.wpColorPicker("close"), this.$el.remove()
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(31);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.controls = ".elementor-control-dimension > input:enabled", e.link = "button.elementor-link-dimensions", e
        }, events: function () {
            return _.extend(o.prototype.events.apply(this, arguments), {"click @ui.link": "onLinkDimensionsClicked"})
        }, defaultDimensionValue: 0, initialize: function () {
            o.prototype.initialize.apply(this, arguments), this.model.set("allowed_dimensions", this.filterDimensions(this.model.get("allowed_dimensions")))
        }, getPossibleDimensions: function () {
            return ["top", "right", "bottom", "left"]
        }, filterDimensions: function (e) {
            e = e || "all";
            var t = this.getPossibleDimensions();
            return "all" === e ? t : (_.isArray(e) || ("horizontal" === e ? e = ["right", "left"] : "vertical" === e && (e = ["top", "bottom"])), e)
        }, onReady: function () {
            var e = this, t = e.getControlValue();
            e.isLinkedDimensions() || (e.ui.link.addClass("unlinked"), e.ui.controls.each(function (n, i) {
                var o = t[i.dataset.setting];
                _.isEmpty(o) && (o = e.defaultDimensionValue), e.$(i).val(o)
            })), e.fillEmptyDimensions()
        }, updateDimensionsValue: function () {
            var e = {}, t = this.getPossibleDimensions(), n = this.ui.controls, i = this.defaultDimensionValue;
            t.forEach(function (t) {
                var o = n.filter('[data-setting="' + t + '"]');
                e[t] = o.length ? o.val() : i
            }), this.setValue(e)
        }, fillEmptyDimensions: function () {
            var e = this.getPossibleDimensions(), t = this.model.get("allowed_dimensions"), n = this.ui.controls,
                i = this.defaultDimensionValue;
            this.isLinkedDimensions() || e.forEach(function (e) {
                var o = n.filter('[data-setting="' + e + '"]');
                -1 !== _.indexOf(t, e) && o.length && _.isEmpty(o.val()) && o.val(i)
            })
        }, updateDimensions: function () {
            this.fillEmptyDimensions(), this.updateDimensionsValue()
        }, resetDimensions: function () {
            this.ui.controls.val(""), this.updateDimensionsValue()
        }, onInputChange: function (e) {
            var t = e.target.dataset.setting;
            if ("unit" === t && this.resetDimensions(), _.contains(this.getPossibleDimensions(), t)) {
                if (this.isLinkedDimensions()) {
                    var n = this.$(e.target);
                    this.ui.controls.val(n.val())
                }
                this.updateDimensions()
            }
        }, onLinkDimensionsClicked: function (e) {
            e.preventDefault(), e.stopPropagation(), this.ui.link.toggleClass("unlinked"), this.setValue("isLinked", !this.ui.link.hasClass("unlinked")), this.isLinkedDimensions() && this.ui.controls.val(this.ui.controls.eq(0).val()), this.updateDimensions()
        }, isLinkedDimensions: function () {
            return this.getControlValue("isLinked")
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i = n(4);
    e.exports = i.extend({
        _enqueuedFonts: [], $previewContainer: null, enqueueFont: function (e) {
            if (-1 === this._enqueuedFonts.indexOf(e)) {
                var t = void 0;
                switch (elementor.config.controls.font.options[e]) {
                    case"googlefonts":
                        t = "https://fonts.googleapis.com/css?family=" + e + "&text=" + e;
                        break;
                    case"earlyaccess":
                        t = "https://fonts.googleapis.com/earlyaccess/" + e.replace(/\s+/g, "").toLowerCase() + ".css"
                }
                _.isEmpty(t) || jQuery("head").find("link:last").after('<link href="' + t + '" rel="stylesheet" type="text/css">'), this._enqueuedFonts.push(e)
            }
        }, getSelect2Options: function () {
            return {
                dir: elementorCommon.config.isRTL ? "rtl" : "ltr",
                templateSelection: this.fontPreviewTemplate,
                templateResult: this.fontPreviewTemplate
            }
        }, onReady: function () {
            var e = this;
            this.ui.select.select2(this.getSelect2Options()), this.ui.select.on("select2:open", function () {
                e.$previewContainer = jQuery('.select2-results__options[role="tree"]:visible'), setTimeout(function () {
                    e.enqueueFontsInView()
                }, 100), jQuery("input.select2-search__field:visible").on("keyup", function () {
                    e.typeStopDetection.action.apply(e)
                }), e.$previewContainer.on("scroll", function () {
                    e.scrollStopDetection.onScroll.apply(e)
                })
            })
        }, typeStopDetection: {
            idle: 350, timeOut: null, action: function () {
                var e = this, t = this.typeStopDetection;
                clearTimeout(t.timeOut), t.timeOut = setTimeout(function () {
                    e.enqueueFontsInView()
                }, t.idle)
            }
        }, scrollStopDetection: {
            idle: 350, timeOut: null, onScroll: function () {
                var e = this, t = this.scrollStopDetection;
                clearTimeout(t.timeOut), t.timeOut = setTimeout(function () {
                    e.enqueueFontsInView()
                }, t.idle)
            }
        }, enqueueFontsInView: function () {
            var e = this, t = this.$previewContainer.offset().top, n = t + this.$previewContainer.innerHeight(), i = [];
            this.$previewContainer.children().find("li:visible").each(function (e, o) {
                var r = jQuery(o), s = r.offset();
                s && s.top > t && s.top < n && i.push(r)
            }), i.forEach(function (t) {
                var n = jQuery(t).find("span").html();
                e.enqueueFont(n)
            })
        }, fontPreviewTemplate: function (e) {
            return e.id ? jQuery("<span>", {text: e.text, css: {"font-family": e.element.value.toString()}}) : e.text
        }, templateHelpers: function () {
            var e = i.prototype.templateHelpers.apply(this, arguments), t = this.model.get("options");
            return e.getFontsByGroups = function (e) {
                var n = {};
                return _.each(t, function (t, i) {
                    (_.isArray(e) && _.contains(e, t) || t === e) && (n[i] = i)
                }), n
            }, e
        }
    })
}, function (e, t, n) {
    "use strict";
    var i, o = n(0);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.addImages = ".elementor-control-gallery-add", e.clearGallery = ".elementor-control-gallery-clear", e.galleryThumbnails = ".elementor-control-gallery-thumbnails", e.status = ".elementor-control-gallery-status-title", e
        }, events: function () {
            return _.extend(o.prototype.events.apply(this, arguments), {
                "click @ui.addImages": "onAddImagesClick",
                "click @ui.clearGallery": "onClearGalleryClick",
                "click @ui.galleryThumbnails": "onGalleryThumbnailsClick"
            })
        }, onReady: function () {
            this.initRemoveDialog()
        }, applySavedValue: function () {
            var e = this.getControlValue().length, t = !!e;
            this.$el.toggleClass("elementor-gallery-has-images", t).toggleClass("elementor-gallery-empty", !t);
            var n = this.ui.galleryThumbnails;
            n.empty(), this.ui.status.text(elementor.translate(t ? "gallery_images_selected" : "gallery_no_images_selected", [e])), t && this.getControlValue().forEach(function (e) {
                var t = jQuery("<div>", {class: "elementor-control-gallery-thumbnail"});
                t.css("background-image", "url(" + e.url + ")"), n.append(t)
            })
        }, hasImages: function () {
            return !!this.getControlValue().length
        }, openFrame: function (e) {
            this.initFrame(e), this.frame.open()
        }, initFrame: function (e) {
            var t = {
                frame: "post",
                multiple: !0,
                state: {create: "gallery", add: "gallery-library", edit: "gallery-edit"}[e],
                button: {text: elementor.translate("insert_media")}
            };
            this.hasImages() && (t.selection = this.fetchSelection()), this.frame = wp.media(t), this.frame.on({
                update: this.select,
                "menu:render:default": this.menuRender,
                "content:render:browse": this.gallerySettings
            }, this)
        }, menuRender: function (e) {
            e.unset("insert"), e.unset("featured-image")
        }, gallerySettings: function (e) {
            e.sidebar.on("ready", function () {
                e.sidebar.unset("gallery")
            })
        }, fetchSelection: function () {
            var e = wp.media.query({
                orderby: "post__in",
                order: "ASC",
                type: "image",
                perPage: -1,
                post__in: _.pluck(this.getControlValue(), "id")
            });
            return new wp.media.model.Selection(e.models, {props: e.props.toJSON(), multiple: !0})
        }, select: function (e) {
            var t = [];
            e.each(function (e) {
                t.push({id: e.get("id"), url: e.get("url")})
            }), this.setValue(t), this.applySavedValue()
        }, onBeforeDestroy: function () {
            this.frame && this.frame.off(), this.$el.remove()
        }, resetGallery: function () {
            this.setValue(""), this.applySavedValue()
        }, initRemoveDialog: function () {
            var e;
            this.getRemoveDialog = function () {
                return e || (e = elementorCommon.dialogsManager.createWidget("confirm", {
                    message: elementor.translate("dialog_confirm_gallery_delete"),
                    headerMessage: elementor.translate("delete_gallery"),
                    strings: {confirm: elementor.translate("delete"), cancel: elementor.translate("cancel")},
                    defaultOption: "confirm",
                    onConfirm: this.resetGallery.bind(this)
                })), e
            }
        }, onAddImagesClick: function () {
            this.openFrame(this.hasImages() ? "add" : "create")
        }, onClearGalleryClick: function () {
            this.getRemoveDialog().show()
        }, onGalleryThumbnailsClick: function () {
            this.openFrame("edit")
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(n(0));
    e.exports = i.default.extend({}, {
        onPasteStyle: function () {
            return !1
        }
    })
}, function (e, t, n) {
    "use strict";
    var i, o = n(4);
    i = o.extend({
        initialize: function () {
            o.prototype.initialize.apply(this, arguments), this.filterIcons()
        }, filterIcons: function () {
            var e = this.model.get("options"), t = this.model.get("include"), n = this.model.get("exclude");
            if (t) {
                var i = {};
                return _.each(t, function (t) {
                    i[t] = e[t]
                }), void this.model.set("options", i)
            }
            n && _.each(n, function (t) {
                delete e[t]
            })
        }, iconsList: function (e) {
            return e.id ? jQuery('<span><i class="' + e.id + '"></i> ' + e.text + "</span>") : e.text
        }, getSelect2Options: function () {
            return {
                allowClear: !0,
                templateResult: this.iconsList.bind(this),
                templateSelection: this.iconsList.bind(this)
            }
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = n(2).extend({
        ui: function () {
            return {
                inputWidth: 'input[data-setting="width"]',
                inputHeight: 'input[data-setting="height"]',
                btnApply: "button.elementor-image-dimensions-apply-button"
            }
        }, events: function () {
            return {
                "click @ui.btnApply": "onApplyClicked",
                "keyup @ui.inputWidth": "onDimensionKeyUp",
                "keyup @ui.inputHeight": "onDimensionKeyUp"
            }
        }, onDimensionKeyUp: function (e) {
            13 === e.keyCode && this.onApplyClicked(e)
        }, onApplyClicked: function (e) {
            e.preventDefault(), this.setValue({width: this.ui.inputWidth.val(), height: this.ui.inputHeight.val()})
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(2);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.controlMedia = ".elementor-control-media", e.mediaImage = ".elementor-control-media-image", e.mediaVideo = ".elementor-control-media-video", e.frameOpeners = ".elementor-control-preview-area", e.deleteButton = ".elementor-control-media-delete", e
        }, events: function () {
            return _.extend(o.prototype.events.apply(this, arguments), {
                "click @ui.frameOpeners": "openFrame",
                "click @ui.deleteButton": "deleteImage"
            })
        }, getMediaType: function () {
            return this.model.get("media_type")
        }, applySavedValue: function () {
            var e = this.getControlValue("url"), t = this.getMediaType();
            "image" === t ? this.ui.mediaImage.css("background-image", e ? "url(" + e + ")" : "") : "video" === t && this.ui.mediaVideo.attr("src", e), this.ui.controlMedia.toggleClass("elementor-media-empty", !e)
        }, openFrame: function () {
            this.frame || this.initFrame(), this.frame.open()
        }, deleteImage: function (e) {
            e.stopPropagation(), this.setValue({url: "", id: ""}), this.applySavedValue()
        }, initFrame: function () {
            wp.media.view.settings.post.id = elementor.config.document.id, this.frame = wp.media({
                button: {text: elementor.translate("insert_media")},
                states: [new wp.media.controller.Library({
                    title: elementor.translate("insert_media"),
                    library: wp.media.query({type: this.getMediaType()}),
                    multiple: !1,
                    date: !1
                })]
            }), this.frame.on("insert select", this.select.bind(this))
        }, select: function () {
            this.trigger("before:select");
            var e = this.frame.state().get("selection").first().toJSON();
            e.url && (this.setValue({url: e.url, id: e.id}), this.applySavedValue()), this.trigger("after:select")
        }, onBeforeDestroy: function () {
            this.$el.remove()
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(0), r = n(114);
    i = o.extend({
        registerValidators: function () {
            o.prototype.registerValidators.apply(this, arguments);
            var e = {}, t = this.model;
            ["min", "max"].forEach(function (n) {
                var i = t.get(n);
                _.isFinite(i) && (e[n] = i)
            }), jQuery.isEmptyObject(e) || this.addValidator(new r({validationTerms: e}))
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i = n(9);
    e.exports = i.extend({
        validationMethod: function (e) {
            var t = this.getSettings("validationTerms"), n = [];
            return _.isFinite(e) && (void 0 !== t.min && e < t.min && n.push("Value is less than minimum"), void 0 !== t.max && e > t.max && n.push("Value is greater than maximum")), n
        }
    })
}, function (e, t, n) {
    "use strict";
    var i, o = n(2);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.reverseOrderLabel = ".elementor-control-order-label", e
        }, changeLabelTitle: function () {
            var e = this.getControlValue("reverse_order");
            this.ui.reverseOrderLabel.attr("title", elementor.translate(e ? "asc" : "desc"))
        }, onRender: function () {
            o.prototype.onRender.apply(this, arguments), this.changeLabelTitle()
        }, onInputChange: function () {
            this.changeLabelTitle()
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(30);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.popoverToggle = ".elementor-control-popover-toggle-toggle", e
        }, events: function () {
            return _.extend(o.prototype.events.apply(this, arguments), {"click @ui.popoverToggle": "onPopoverToggleClick"})
        }, onPopoverToggleClick: function () {
            this.$el.next(".elementor-controls-popover").toggle()
        }
    }, {
        onPasteStyle: function (e, t) {
            return !t || t === e.return_value
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(0), r = n(32);
    i = o.extend({
        ui: {btnAddRow: ".elementor-repeater-add", fieldContainer: ".elementor-repeater-fields-wrapper"},
        events: function () {
            return {
                "click @ui.btnAddRow": "onButtonAddRowClick",
                "sortstart @ui.fieldContainer": "onSortStart",
                "sortupdate @ui.fieldContainer": "onSortUpdate",
                "sortstop @ui.fieldContainer": "onSortStop"
            }
        },
        childView: r,
        childViewContainer: ".elementor-repeater-fields-wrapper",
        templateHelpers: function () {
            return {
                itemActions: this.model.get("item_actions"),
                data: _.extend({}, this.model.toJSON(), {controlValue: []})
            }
        },
        childViewOptions: function () {
            return {
                controlFields: this.model.get("fields"),
                titleField: this.model.get("title_field"),
                itemActions: this.model.get("item_actions")
            }
        },
        createItemModel: function (e, t, n) {
            return (t = t || {}).controls = n.model.get("fields"), e._id || (e._id = elementor.helpers.getUniqueID()), new elementorModules.editor.elements.models.BaseSettings(e, t)
        },
        fillCollection: function () {
            var e = this.model.get("name");
            this.collection = this.elementSettingsModel.get(e), this.collection instanceof Backbone.Collection || (this.collection = new Backbone.Collection(this.collection, {model: _.partial(this.createItemModel, _, _, this)}), this.elementSettingsModel.set(e, this.collection, {silent: !0}), this.listenTo(this.collection, "change", this.onRowControlChange), this.listenTo(this.collection, "update", this.onRowUpdate, this))
        },
        initialize: function () {
            o.prototype.initialize.apply(this, arguments), this.fillCollection(), this.listenTo(this.collection, "change", this.onRowControlChange), this.listenTo(this.collection, "update", this.onRowUpdate, this)
        },
        addRow: function (e, t) {
            var n = elementor.helpers.getUniqueID();
            return e instanceof Backbone.Model ? e.set("_id", n) : e._id = n, this.collection.add(e, t)
        },
        editRow: function (e) {
            if (this.currentEditableChild) {
                var t = this.currentEditableChild.getChildViewContainer(this.currentEditableChild);
                t.removeClass("editable"), t.find(".elementor-wp-editor").each(function () {
                    tinymce.get(this.id).fire("hide")
                })
            }
            this.currentEditableChild !== e ? (e.getChildViewContainer(e).addClass("editable"), this.currentEditableChild = e, this.updateActiveRow()) : delete this.currentEditableChild
        },
        toggleMinRowsClass: function () {
            this.model.get("prevent_empty") && this.$el.toggleClass("elementor-repeater-has-minimum-rows", 1 >= this.collection.length)
        },
        updateActiveRow: function () {
            var e = 1;
            this.currentEditableChild && (e = this.currentEditableChild.itemIndex), this.setEditSetting("activeItemIndex", e)
        },
        updateChildIndexes: function () {
            var e = this.collection;
            this.children.each(function (t) {
                t.updateIndex(e.indexOf(t.model) + 1), t.setTitle()
            })
        },
        onRender: function () {
            o.prototype.onRender.apply(this, arguments), this.model.get("item_actions").sort && this.ui.fieldContainer.sortable({
                axis: "y",
                handle: ".elementor-repeater-row-tools"
            }), this.toggleMinRowsClass()
        },
        onSortStart: function (e, t) {
            t.item.data("oldIndex", t.item.index())
        },
        onSortStop: function (e, t) {
            var n = this;
            if (-1 !== t.item.index()) {
                var i = n.children.findByIndex(t.item.index()), o = i.children._views;
                jQuery.each(o, function () {
                    if ("wysiwyg" === this.model.get("type")) return i.render(), delete n.currentEditableChild, !1
                })
            }
        },
        onSortUpdate: function (e, t) {
            var n = t.item.data("oldIndex"), i = this.collection.at(n), o = t.item.index();
            this.collection.remove(i), this.addRow(i, {at: o})
        },
        onAddChild: function () {
            this.updateChildIndexes(), this.updateActiveRow()
        },
        onRowUpdate: function (e, t) {
            var n = this.elementSettingsModel, i = e.clone(), o = this.model.get("name");
            t.add ? i.remove(t.changes.added[0]) : i.add(t.changes.removed[0], {at: t.index}), n.changed = {}, n.changed[o] = e, n._previousAttributes = {}, n._previousAttributes[o] = i.toJSON(), n.trigger("change", n, n._pending), delete n.changed, delete n._previousAttributes, this.toggleMinRowsClass()
        },
        onRowControlChange: function (e) {
            if (Object.keys(e.changed).length) {
                var t = e.collection.toJSON(), n = e.collection.findIndex(e), i = this._parent.model.get("settings"),
                    o = this.model.get("name");
                t[n] = e._previousAttributes, i.changed = {}, i.changed[o] = e.collection, i._previousAttributes = {}, i._previousAttributes[o] = t, i.trigger("change", i), delete i.changed, delete i._previousAttributes
            }
        },
        onButtonAddRowClick: function () {
            var e = {};
            _.each(this.model.get("fields"), function (t) {
                e[t.name] = t.default
            });
            var t = this.addRow(e), n = this.children.findByModel(t);
            this.editRow(n)
        },
        onChildviewClickRemove: function (e) {
            e.model.destroy(), e === this.currentEditableChild && delete this.currentEditableChild, this.updateChildIndexes(), this.updateActiveRow()
        },
        onChildviewClickDuplicate: function (e) {
            var t = this.createItemModel(e.model.toJSON(), {}, this);
            this.addRow(t, {at: e.itemIndex})
        },
        onChildviewClickEdit: function (e) {
            this.editRow(e)
        },
        onAfterExternalChange: function () {
            this.fillCollection(), o.prototype.onAfterExternalChange.apply(this, arguments)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(3);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.heading = ".elementor-panel-heading", e
        }, triggers: {click: "control:section:clicked"}
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(0);
    i = o.extend({}, {
        onPasteStyle: function (e, t) {
            return e.groups ? e.groups.some(function (e) {
                return i.onPasteStyle(e, t)
            }) : void 0 !== e.options[t]
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(31);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.slider = ".elementor-slider", e
        }, templateHelpers: function () {
            var e = o.prototype.templateHelpers.apply(this, arguments);
            return e.isMultiple = this.isMultiple(), e
        }, isMultiple: function () {
            var e = this.getControlValue("sizes");
            return !jQuery.isEmptyObject(e)
        }, initSlider: function () {
            this.destroySlider();
            var e = this.isMultiple(), t = elementorCommon.helpers.cloneObject(this.getCurrentRange()), n = t.step,
                i = this.getSize();
            e ? i = Object.values(i) : (i = [i], this.ui.input.attr(t)), delete t.step;
            var o = void 0, r = this;
            e && (o = [], i.forEach(function () {
                return o.push({
                    to: function (e) {
                        return e + r.getControlValue("unit")
                    }
                })
            })), noUiSlider.create(this.ui.slider[0], {
                start: i,
                range: t,
                step: n,
                tooltips: o,
                connect: e,
                format: {
                    to: function (e) {
                        return Math.round(1e3 * e) / 1e3
                    }, from: function (e) {
                        return +e
                    }
                }
            }).on("slide", this.onSlideChange.bind(this))
        }, applySavedValue: function () {
            o.prototype.applySavedValue.apply(this, arguments), this.ui.slider[0].noUiSlider && this.ui.slider[0].noUiSlider.set(this.getSize())
        }, getSize: function () {
            return this.getControlValue(this.isMultiple() ? "sizes" : "size")
        }, resetSize: function () {
            this.isMultiple() ? this.setValue("sizes", {}) : this.setValue("size", ""), this.initSlider()
        }, destroySlider: function () {
            this.ui.slider[0].noUiSlider && this.ui.slider[0].noUiSlider.destroy()
        }, onReady: function () {
            this.isMultiple() && this.$el.addClass("elementor-control-type-slider--multiple elementor-control-type-slider--handles-" + this.model.get("handles")), this.initSlider()
        }, onSlideChange: function (e, t) {
            if (this.isMultiple()) {
                var n = elementorCommon.helpers.cloneObject(this.getSize());
                n[Object.keys(n)[t]] = e[t], this.setValue("sizes", n)
            } else this.setValue("size", e[0]), this.ui.input.val(e[0])
        }, onInputChange: function (e) {
            var t = e.currentTarget.dataset.setting;
            "size" === t ? this.ui.slider[0].noUiSlider.set(this.getSize()) : "unit" === t && this.resetSize()
        }, onBeforeDestroy: function () {
            this.destroySlider(), this.$el.remove()
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(0);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.resetStructure = ".elementor-control-structure-reset", e
        }, events: function () {
            return _.extend(o.prototype.events.apply(this, arguments), {"click @ui.resetStructure": "onResetStructureClick"})
        }, templateHelpers: function () {
            var e = o.prototype.templateHelpers.apply(this, arguments);
            return e.getMorePresets = this.getMorePresets.bind(this), e
        }, getCurrentEditedSection: function () {
            return elementor.getPanelView().getCurrentPageView().getOption("editedElementView")
        }, getMorePresets: function () {
            var e = elementor.presetsFactory.getParsedStructure(this.getControlValue());
            return elementor.presetsFactory.getPresets(e.columnsCount)
        }, onInputChange: function () {
            this.getCurrentEditedSection().redefineLayout(), this.render()
        }, onResetStructureClick: function () {
            this.getCurrentEditedSection().resetColumnsCustomSize()
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i = n(0);
    e.exports = i.extend({
        setInputValue: function (e, t) {
            this.$(e).prop("checked", this.model.get("return_value") === t)
        }
    }, {
        onPasteStyle: function (e, t) {
            return !t || t === e.return_value
        }
    })
}, function (e, t, n) {
    "use strict";
    var i;
    i = n(3).extend({triggers: {click: {event: "control:tab:clicked", stopPropagation: !1}}}), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i = n(2);
    e.exports = i.extend({
        onReady: function () {
            var e, t, n = this, i = elementorCommon.config.isRTL ? "right" : "left";
            this.ui.input.autocomplete({
                source: function (i, o) {
                    if (n.options.model.attributes.autocomplete) if (e !== i.term) {
                        if (/^https?:/.test(i.term) || -1 !== i.term.indexOf(".")) return o();
                        n.ui.input.prev().show(), jQuery.post(window.ajaxurl, {
                            editor: "elementor",
                            action: "wp-link-ajax",
                            page: 1,
                            search: i.term,
                            _ajax_linking_nonce: jQuery("#_ajax_linking_nonce").val()
                        }, function (e) {
                            t = e, o(e)
                        }, "json").always(function () {
                            n.ui.input.prev().hide()
                        }), e = i.term
                    } else o(t)
                }, focus: function (e) {
                    e.preventDefault()
                }, select: function (e, t) {
                    return n.ui.input.val(t.item.permalink), n.setValue("url", t.item.permalink), !1
                }, open: function (e) {
                    jQuery(e.target).data("uiAutocomplete").menu.activeMenu.addClass("elementor-autocomplete-menu")
                }, minLength: 2, position: {my: i + " top+2", at: i + " bottom"}
            }).autocomplete("instance")._renderItem = function (e, t) {
                var n = window.wpLinkL10n ? window.wpLinkL10n.noTitle : "", i = t.title ? t.title : n;
                return jQuery('<li role="option" id="mce-wp-autocomplete-' + t.ID + '">').append("<span>" + i + '</span>&nbsp;<span class="elementor-autocomplete-item-info">' + t.info + "</span>").appendTo(e)
            }
        }, onBeforeDestroy: function () {
            this.ui.input.data("autocomplete") && this.ui.input.autocomplete("destroy"), this.$el.remove()
        }
    })
}, function (e, t, n) {
    "use strict";
    var i, o = n(0);
    i = o.extend({
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return e.form = "form", e.loading = ".wp-widget-form-loading", e
        }, events: function () {
            return {"keyup @ui.form :input": "onFormChanged", "change @ui.form :input": "onFormChanged"}
        }, onFormChanged: function () {
            var e = "widget-" + this.model.get("id_base"), t = this.ui.form.elementorSerializeObject()[e].REPLACE_TO_ID;
            this.setValue(t)
        }, onReady: function () {
            var e = this;
            elementorCommon.ajax.addRequest("editor_get_wp_widget_form", {
                data: {
                    id: e.model.cid,
                    widget_type: e.model.get("widget"),
                    data: e.elementSettingsModel.toJSON()
                }, success: function (t) {
                    if (e.ui.form.html(t), wp.textWidgets) {
                        e.ui.form.addClass("open");
                        var n = new jQuery.Event("widget-added");
                        wp.textWidgets.handleWidgetAdded(n, e.ui.form), wp.mediaWidgets.handleWidgetAdded(n, e.ui.form), wp.customHtmlWidgets && wp.customHtmlWidgets.handleWidgetAdded(n, e.ui.form)
                    }
                    elementor.hooks.doAction("panel/widgets/" + e.model.get("widget") + "/controls/wp_widget/loaded", e)
                }
            })
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(0);
    i = o.extend({
        editor: null,
        ui: function () {
            var e = o.prototype.ui.apply(this, arguments);
            return jQuery.extend(e, {inputWrapper: ".elementor-control-input-wrapper"}), e
        },
        events: function () {
            return _.extend(o.prototype.events.apply(this, arguments), {"keyup textarea.elementor-wp-editor": "onBaseInputChange"})
        },
        buttons: {
            addToBasic: {underline: "italic"},
            addToAdvanced: {},
            moveToAdvanced: {
                blockquote: "removeformat",
                alignleft: "blockquote",
                aligncenter: "alignleft",
                alignright: "aligncenter"
            },
            moveToBasic: {},
            removeFromBasic: ["unlink", "wp_more"],
            removeFromAdvanced: []
        },
        initialize: function () {
            o.prototype.initialize.apply(this, arguments);
            var e = this;
            if (e.editorID = "elementorwpeditor" + e.cid, _.defer(function () {
                    quicktags({
                        buttons: "strong,em,del,link,img,close",
                        id: e.editorID
                    }), elementor.config.rich_editing_enabled && switchEditors.go(e.editorID, "tmce"), delete QTags.instances[0]
                }), elementor.config.rich_editing_enabled) {
                var t = {
                    id: e.editorID, selector: "#" + e.editorID, setup: function (t) {
                        e.editor = t
                    }
                };
                tinyMCEPreInit.mceInit[e.editorID] = _.extend(_.clone(tinyMCEPreInit.mceInit.elementorwpeditor), t), elementor.config.tinymceHasCustomConfig || e.rearrangeButtons()
            } else e.$el.addClass("elementor-rich-editing-disabled")
        },
        applySavedValue: function () {
            if (this.editor) {
                var e = this.getControlValue();
                this.editor.setContent(e), jQuery("#" + this.editorID).val(e)
            }
        },
        saveEditor: function () {
            this.editor.save(), this.setValue(this.editor.getContent())
        },
        moveButtons: function (e, t, n) {
            n || (n = t, t = null), _.each(e, function (e, i) {
                var o = n.indexOf(e);
                if (t) {
                    var r = t.indexOf(i);
                    if (-1 === r) throw new ReferenceError("Trying to move non-existing button `" + i + "`");
                    t.splice(r, 1)
                }
                if (-1 === o) throw new ReferenceError("Trying to move button after non-existing button `" + e + "`");
                n.splice(o + 1, 0, i)
            })
        },
        rearrangeButtons: function () {
            var e = tinyMCEPreInit.mceInit[this.editorID], t = e.toolbar1.split(","), n = e.toolbar2.split(",");
            t = _.difference(t, this.buttons.removeFromBasic), n = _.difference(n, this.buttons.removeFromAdvanced), this.moveButtons(this.buttons.moveToBasic, n, t), this.moveButtons(this.buttons.moveToAdvanced, t, n), this.moveButtons(this.buttons.addToBasic, t), this.moveButtons(this.buttons.addToAdvanced, n), e.toolbar1 = t.join(","), e.toolbar2 = n.join(",")
        },
        onReady: function () {
            var e = this,
                t = jQuery(elementor.config.wp_editor.replace(/elementorwpeditor/g, e.editorID).replace("%%EDITORCONTENT%%", e.getControlValue()));
            e.ui.inputWrapper.html(t), setTimeout(function () {
                e.editor.on("keyup change undo redo SetContent", e.saveEditor.bind(e))
            }, 100)
        },
        onBeforeDestroy: function () {
            delete QTags.instances[this.editorID], elementor.config.rich_editing_enabled && (tinymce.EditorManager.execCommand("mceRemoveEditor", !0, this.editorID), delete tinyMCEPreInit.mceInit[this.editorID], delete tinyMCEPreInit.qtInit[this.editorID])
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    e.exports = elementorModules.editor.elements.models.BaseSettings.extend({defaults: {_column_size: 100}})
}, function (e, t, n) {
    "use strict";
    var i = r(n(129)), o = r(n(130));

    function r(e) {
        return e && e.__esModule ? e : {default: e}
    }

    var s, l = n(7);
    s = l.extend({
        _templateType: null, toggleEditTools: !0, getTemplate: function () {
            var e = this.getEditModel();
            return "remote" !== this.getTemplateType() ? Marionette.TemplateCache.get("#tmpl-elementor-" + e.get("widgetType") + "-content") : _.template("")
        }, className: function () {
            return l.prototype.className.apply(this, arguments) + " elementor-widget " + elementor.getElementData(this.getEditModel()).html_wrapper_class
        }, events: function () {
            var e = l.prototype.events.apply(this, arguments);
            return e.click = "onClickEdit", e
        }, behaviors: function () {
            var e = l.prototype.behaviors.apply(this, arguments);
            return _.extend(e, {
                InlineEditing: {behaviorClass: n(131), inlineEditingClass: "elementor-inline-editing"},
                Draggable: {behaviorClass: i.default},
                Resizable: {behaviorClass: o.default}
            }), elementor.hooks.applyFilters("elements/widget/behaviors", e, this)
        }, initialize: function () {
            l.prototype.initialize.apply(this, arguments);
            var e = this.getEditModel();
            e.on({
                "before:remote:render": this.onModelBeforeRemoteRender.bind(this),
                "remote:render": this.onModelRemoteRender.bind(this)
            }), "remote" !== this.getTemplateType() || this.getEditModel().getHtmlCache() || e.renderRemoteServer();
            var t = this.onRender;
            this.render = _.throttle(this.render, 300), this.onRender = function () {
                _.defer(t.bind(this))
            }
        }, getContextMenuGroups: function () {
            var e = l.prototype.getContextMenuGroups.apply(this, arguments),
                t = e.indexOf(_.findWhere(e, {name: "transfer"}));
            return e.splice(t + 1, 0, {
                name: "save",
                actions: [{
                    name: "save",
                    title: elementor.translate("save_as_global"),
                    shortcut: jQuery("<i>", {class: "eicon-pro-icon"})
                }]
            }), e
        }, render: function () {
            if (this.model.isRemoteRequestActive()) return this.handleEmptyWidget(), void this.$el.addClass("elementor-element");
            Marionette.CompositeView.prototype.render.apply(this, arguments)
        }, handleEmptyWidget: function () {
            this.$el.addClass("elementor-widget-empty").append('<i class="elementor-widget-empty-icon ' + this.getEditModel().getIcon() + '"></i>')
        }, getTemplateType: function () {
            if (null === this._templateType) {
                var e = this.getEditModel(), t = jQuery("#tmpl-elementor-" + e.get("widgetType") + "-content");
                this._templateType = t.length ? "js" : "remote"
            }
            return this._templateType
        }, getHTMLContent: function (e) {
            return this.getEditModel().getHtmlCache() || e
        }, attachElContent: function (e) {
            var t = this, n = t.getHTMLContent(e);
            return _.defer(function () {
                elementorFrontend.elements.window.jQuery(t.el).html(n), t.bindUIElements()
            }), this
        }, addInlineEditingAttributes: function (e, t) {
            this.addRenderAttribute(e, {
                class: "elementor-inline-editing",
                "data-elementor-setting-key": e
            }), t && this.addRenderAttribute(e, {"data-elementor-inline-editing-toolbar": t})
        }, getRepeaterSettingKey: function (e, t, n) {
            return [t, n, e].join(".")
        }, onModelBeforeRemoteRender: function () {
            this.$el.addClass("elementor-loading")
        }, onBeforeDestroy: function () {
            elementor.$previewContents.find("#elementor-style-" + this.model.cid).remove()
        }, onModelRemoteRender: function () {
            this.isDestroyed || (this.$el.removeClass("elementor-loading"), this.render())
        }, onRender: function () {
            var e = this;
            l.prototype.onRender.apply(e, arguments);
            var t = e.getEditModel(), n = t.getSetting("_skin") || "default";
            e.$el.attr("data-widget_type", t.get("widgetType") + "." + n).removeClass("elementor-widget-empty").children(".elementor-widget-empty-icon").remove(), e.$el.imagesLoaded().always(function () {
                setTimeout(function () {
                    1 > e.$el.children(".elementor-widget-container").outerHeight() && e.handleEmptyWidget()
                }, 200)
            })
        }, onClickEdit: function () {
            this.model.trigger("request:edit")
        }
    }), e.exports = s
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.Behavior), i(t, [{
            key: "events", value: function () {
                return {dragstart: "onDragStart", dragstop: "onDragStop"}
            }
        }, {
            key: "initialize", value: function () {
                var e = this;
                (function e(t, n, i) {
                    null === t && (t = Function.prototype);
                    var o = Object.getOwnPropertyDescriptor(t, n);
                    if (void 0 === o) {
                        var r = Object.getPrototypeOf(t);
                        return null === r ? void 0 : e(r, n, i)
                    }
                    if ("value" in o) return o.value;
                    var s = o.get;
                    return void 0 !== s ? s.call(i) : void 0
                })(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "initialize", this).call(this), this.listenTo(elementor.channels.dataEditMode, "switch", this.toggle);
                var n = this.view, i = n.onSettingsChanged;
                n.onSettingsChanged = function () {
                    for (var t, o = arguments.length, r = Array(o), s = 0; s < o; s++) r[s] = arguments[s];
                    i.call.apply(i, [n].concat(r)), (t = e.onSettingsChanged).call.apply(t, [e].concat(r))
                }
            }
        }, {
            key: "activate", value: function () {
                this.$el.draggable({addClasses: !1})
            }
        }, {
            key: "deactivate", value: function () {
                this.$el.draggable("instance") && this.$el.draggable("destroy")
            }
        }, {
            key: "toggle", value: function () {
                var e = "edit" === elementor.channels.dataEditMode.request("activeMode"),
                    t = this.view.getEditModel().getSetting("_position");
                this.deactivate(), e && t && elementor.userCan("design") && this.activate()
            }
        }, {
            key: "onRender", value: function () {
                var e = this;
                _.defer(function () {
                    return e.toggle()
                })
            }
        }, {
            key: "onDestroy", value: function () {
                this.deactivate()
            }
        }, {
            key: "onDragStart", value: function (e) {
                e.stopPropagation(), this.view.model.trigger("request:edit")
            }
        }, {
            key: "onDragStop", value: function (e, t) {
                var n = this;
                e.stopPropagation();
                var i = elementorFrontend.getCurrentDeviceMode(), o = "desktop" === i ? "" : "_" + i,
                    r = this.view.getEditModel(), s = r.getSetting("_offset_orientation_h"),
                    l = r.getSetting("_offset_orientation_v"), a = {}, c = t.position.left, u = t.position.top,
                    d = "_offset_x", m = "_offset_y", h = this.$el.offsetParent().width(), p = this.$el.outerWidth(!0);
                "end" === s && (c = h - c - p, d = "_offset_x_end");
                var g = r.getSetting(d + o).unit;
                c = elementor.helpers.elementSizeToUnit(this.$el, c, g);
                var f = this.$el.offsetParent().height(), v = this.$el.outerHeight(!0);
                "end" === l && (u = f - u - v, m = "_offset_y_end");
                var y = r.getSetting(m + o).unit;
                u = elementor.helpers.elementSizeToUnit(this.$el, u, y), a[d + o] = {size: c, unit: g}, a[m + o] = {
                    size: u,
                    unit: y
                }, r.get("settings").setExternalChange(a), setTimeout(function () {
                    n.$el.css({top: "", left: "", right: "", bottom: "", width: "", height: ""})
                }, 250)
            }
        }, {
            key: "onSettingsChanged", value: function (e) {
                e.changed && (e = e.changed), void 0 !== e._position && this.toggle()
            }
        }]), t
    }();
    t.default = o
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.Behavior), i(t, [{
            key: "events", value: function () {
                return {resizestart: "onResizeStart", resizestop: "onResizeStop", resize: "onResize"}
            }
        }, {
            key: "initialize", value: function () {
                var e = this;
                (function e(t, n, i) {
                    null === t && (t = Function.prototype);
                    var o = Object.getOwnPropertyDescriptor(t, n);
                    if (void 0 === o) {
                        var r = Object.getPrototypeOf(t);
                        return null === r ? void 0 : e(r, n, i)
                    }
                    if ("value" in o) return o.value;
                    var s = o.get;
                    return void 0 !== s ? s.call(i) : void 0
                })(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "initialize", this).call(this), this.listenTo(elementor.channels.dataEditMode, "switch", this.toggle);
                var n = this.view, i = n.onSettingsChanged;
                n.onSettingsChanged = function () {
                    for (var t, o = arguments.length, r = Array(o), s = 0; s < o; s++) r[s] = arguments[s];
                    i.call.apply(i, [n].concat(r)), (t = e.onSettingsChanged).call.apply(t, [e].concat(r))
                }
            }
        }, {
            key: "activate", value: function () {
                this.$el.resizable({handles: "e, w"})
            }
        }, {
            key: "deactivate", value: function () {
                this.$el.resizable("instance") && this.$el.resizable("destroy")
            }
        }, {
            key: "toggle", value: function () {
                var e = this.view.getEditModel(), t = "edit" === elementor.channels.dataEditMode.request("activeMode"),
                    n = e.getSetting("_position"), i = "initial" === e.getSetting("_element_width");
                this.deactivate(), t && (n || i) && elementor.userCan("design") && this.activate()
            }
        }, {
            key: "onRender", value: function () {
                var e = this;
                _.defer(function () {
                    return e.toggle()
                })
            }
        }, {
            key: "onDestroy", value: function () {
                this.deactivate()
            }
        }, {
            key: "onResizeStart", value: function (e) {
                e.stopPropagation(), this.view.model.trigger("request:edit")
            }
        }, {
            key: "onResizeStop", value: function (e, t) {
                e.stopPropagation();
                var n = elementorFrontend.getCurrentDeviceMode(), i = "desktop" === n ? "" : "_" + n,
                    o = this.view.getEditModel(), r = o.getSetting("_element_custom_width" + i).unit,
                    s = elementor.helpers.elementSizeToUnit(this.$el, t.size.width, r), l = {};
                l["_element_width" + i] = "initial", l["_element_custom_width" + i] = {
                    unit: r,
                    size: s
                }, o.get("settings").setExternalChange(l), this.$el.css({width: "", height: ""})
            }
        }, {
            key: "onResize", value: function (e) {
                e.stopPropagation()
            }
        }, {
            key: "onSettingsChanged", value: function (e) {
                e.changed && (e = e.changed), void 0 === e._position && void 0 === e._element_width || this.toggle()
            }
        }]), t
    }();
    t.default = o
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.Behavior.extend({
        editing: !1, $currentEditingArea: null, ui: function () {
            return {inlineEditingArea: "." + this.getOption("inlineEditingClass")}
        }, events: function () {
            return {
                "click @ui.inlineEditingArea": "onInlineEditingClick",
                "input @ui.inlineEditingArea": "onInlineEditingUpdate"
            }
        }, initialize: function () {
            this.onInlineEditingBlur = this.onInlineEditingBlur.bind(this)
        }, getEditingSettingKey: function () {
            return this.$currentEditingArea.data().elementorSettingKey
        }, startEditing: function (e) {
            if (!this.editing && "edit" === elementor.channels.dataEditMode.request("activeMode") && !this.view.model.isRemoteRequestActive()) {
                var t = e.data().elementorSettingKey, n = t, i = t.split("."), o = 3 === i.length,
                    r = this.view.getEditModel().get("settings");
                o && (r = r.get(i[0]).models[i[1]], n = i[2]);
                var s = r.get("__dynamic__");
                if (!(s && s[n])) {
                    this.$currentEditingArea = e;
                    var l = this.$currentEditingArea.data().elementorInlineEditingToolbar,
                        a = "advanced" === l ? "advanced" : "basic", c = this.view.getEditModel(),
                        u = elementor.config.inlineEditing, d = c.getSetting(this.getEditingSettingKey());
                    "advanced" === a && (d = wp.editor.autop(d)), this.$currentEditingArea.html(d);
                    var m = elementorFrontend.elements.window.ElementorInlineEditor;
                    this.editing = !0, this.view.allowRender = !1, this.view.model.setHtmlCache(""), this.editor = new m({
                        linksInNewWindow: !0,
                        stay: !1,
                        editor: this.$currentEditingArea[0],
                        mode: a,
                        list: "none" === l ? [] : u.toolbar[l || "basic"],
                        cleanAttrs: ["id", "class", "name"],
                        placeholder: elementor.translate("type_here") + "...",
                        toolbarIconsPrefix: "eicon-editor-",
                        toolbarIconsDictionary: {
                            externalLink: {className: "eicon-editor-external-link"},
                            list: {className: "eicon-editor-list-ul"},
                            insertOrderedList: {className: "eicon-editor-list-ol"},
                            insertUnorderedList: {className: "eicon-editor-list-ul"},
                            createlink: {className: "eicon-editor-link"},
                            unlink: {className: "eicon-editor-unlink"},
                            blockquote: {className: "eicon-editor-quote"},
                            p: {className: "eicon-editor-paragraph"},
                            pre: {className: "eicon-editor-code"}
                        }
                    }), jQuery(this.editor._menu).children().on("mousedown", function (e) {
                        e.preventDefault()
                    }), this.$currentEditingArea.on("blur", this.onInlineEditingBlur), elementorCommon.elements.$body.on("mousedown", this.onInlineEditingBlur)
                }
            }
        }, stopEditing: function () {
            this.editing = !1, this.$currentEditingArea.off("blur", this.onInlineEditingBlur), elementorCommon.elements.$body.off("mousedown", this.onInlineEditingBlur), this.editor.destroy(), this.view.allowRender = !0, "advanced" === this.$currentEditingArea.data().elementorInlineEditingToolbar && this.view.getEditModel().renderRemoteServer()
        }, onInlineEditingClick: function (e) {
            var t = this, n = jQuery(e.currentTarget);
            setTimeout(function () {
                t.startEditing(n)
            }, 30)
        }, onInlineEditingBlur: function (e) {
            var t = this;
            "mousedown" !== e.type ? setTimeout(function () {
                var e = elementorFrontend.elements.window.getSelection();
                jQuery(e.focusNode).closest(".pen-input-wrapper").length || t.stopEditing()
            }, 20) : this.stopEditing()
        }, onInlineEditingUpdate: function () {
            this.view.getEditModel().setSetting(this.getEditingSettingKey(), this.editor.getContent())
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.CollectionView.extend({
        childView: n(36), id: "elementor-panel-elements", initialize: function () {
            this.listenTo(elementor.channels.panelElements, "filter:change", this.onFilterChanged)
        }, filter: function (e) {
            var t = elementor.channels.panelElements.request("filter:value");
            return !t || (-1 !== e.get("title").toLowerCase().indexOf(t.toLowerCase()) || _.any(e.get("keywords"), function (e) {
                return -1 !== e.toLowerCase().indexOf(t.toLowerCase())
            }))
        }, onFilterChanged: function () {
            elementor.channels.panelElements.request("filter:value") || this.onFilterEmpty(), this._renderChildren(), this.triggerMethod("children:render")
        }, onFilterEmpty: function () {
            elementor.getPanelView().getCurrentPageView().showView("categories")
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(134);
    i = Marionette.CompositeView.extend({
        id: "elementor-panel-page-menu",
        template: "#tmpl-elementor-panel-menu",
        childView: o,
        childViewContainer: "#elementor-panel-page-menu-content",
        initialize: function () {
            this.collection = i.getGroups()
        },
        getArrowClass: function () {
            return "eicon-arrow-" + (elementorCommon.config.isRTL ? "right" : "left")
        },
        onRender: function () {
            elementor.getPanelView().getHeaderView().ui.menuIcon.removeClass("eicon-menu-bar").addClass(this.getArrowClass())
        },
        onDestroy: function () {
            elementor.getPanelView().getHeaderView().ui.menuIcon.removeClass(this.getArrowClass()).addClass("eicon-menu-bar")
        }
    }, {
        groups: null, initGroups: function () {
            var e = [], t = {
                name: "go_to",
                title: elementor.translate("go_to"),
                items: [{
                    name: "view-page",
                    icon: "fa fa-eye",
                    title: elementor.translate("view_page"),
                    type: "link",
                    link: elementor.config.document.urls.permalink
                }, {
                    name: "exit-to-dashboard",
                    icon: "fa fa-wordpress",
                    title: elementor.translate("exit_to_dashboard"),
                    type: "link",
                    link: elementor.config.document.urls.exit_to_dashboard
                }]
            };
            elementor.config.user.is_administrator && (t.items.unshift({
                name: "finder",
                icon: "fa fa-search",
                title: elementorCommon.translate("finder", "finder"),
                callback: function () {
                    return elementorCommon.finder.getLayout().showModal()
                }
            }), e = [{
                name: "style",
                title: elementor.translate("global_style"),
                items: [{
                    name: "global-colors",
                    icon: "fa fa-paint-brush",
                    title: elementor.translate("global_colors"),
                    type: "page",
                    pageName: "colorScheme"
                }, {
                    name: "global-fonts",
                    icon: "fa fa-font",
                    title: elementor.translate("global_fonts"),
                    type: "page",
                    pageName: "typographyScheme"
                }, {
                    name: "color-picker",
                    icon: "fa fa-eyedropper",
                    title: elementor.translate("color_picker"),
                    type: "page",
                    pageName: "colorPickerScheme"
                }]
            }, {
                name: "settings",
                title: elementor.translate("settings"),
                items: [{
                    name: "elementor-settings",
                    icon: "fa fa-external-link",
                    title: elementor.translate("elementor_settings"),
                    type: "link",
                    link: elementor.config.settings_page_link,
                    newTab: !0
                }, {
                    name: "about-elementor",
                    icon: "fa fa-info-circle",
                    title: elementor.translate("about_elementor"),
                    type: "link",
                    link: elementor.config.elementor_site,
                    newTab: !0
                }]
            }]), e.push(t), this.groups = new Backbone.Collection(e)
        }, getGroups: function () {
            return this.groups || this.initGroups(), this.groups
        }, addItem: function (e, t, n) {
            var i = this.getGroups().findWhere({name: t});
            if (i) {
                var o, r = i.get("items");
                n && (o = _.findWhere(r, {name: n})), o ? r.splice(r.indexOf(o), 0, e) : r.push(e)
            }
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i = n(135);
    e.exports = Marionette.CompositeView.extend({
        template: "#tmpl-elementor-panel-menu-group",
        className: "elementor-panel-menu-group",
        childView: i,
        childViewContainer: ".elementor-panel-menu-items",
        initialize: function () {
            this.collection = new Backbone.Collection(this.model.get("items"))
        },
        onChildviewClick: function (e) {
            switch (e.model.get("type")) {
                case"page":
                    var t = e.model.get("pageName"), n = e.model.get("title");
                    elementor.getPanelView().setPage(t, n);
                    break;
                default:
                    var i = e.model.get("callback");
                    _.isFunction(i) && i.call(e)
            }
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        template: "#tmpl-elementor-panel-menu-item", className: function () {
            return "elementor-panel-menu-item elementor-panel-menu-item-" + this.model.get("name")
        }, triggers: {click: {event: "click", preventDefault: !1}}
    })
}, function (e, t, n) {
    "use strict";
    e.exports = elementorModules.Module.extend({
        CACHE_KEY_NOT_FOUND_ERROR: "Cache key not found",
        tags: {Base: n(137)},
        cache: {},
        cacheRequests: {},
        cacheCallbacks: [],
        addCacheRequest: function (e) {
            this.cacheRequests[this.createCacheKey(e)] = !0
        },
        createCacheKey: function (e) {
            return btoa(e.getOption("name")) + "-" + btoa(encodeURIComponent(JSON.stringify(e.model)))
        },
        loadTagDataFromCache: function (e) {
            var t = this.createCacheKey(e);
            if (void 0 !== this.cache[t]) return this.cache[t];
            this.cacheRequests[t] || this.addCacheRequest(e)
        },
        loadCacheRequests: function () {
            var e = this.cache, t = this.cacheRequests, n = this.cacheCallbacks;
            this.cacheRequests = {}, this.cacheCallbacks = [], elementorCommon.ajax.addRequest("render_tags", {
                data: {
                    post_id: elementor.config.document.id,
                    tags: Object.keys(t)
                }, success: function (t) {
                    jQuery.extend(e, t), n.forEach(function (e) {
                        e()
                    })
                }
            })
        },
        refreshCacheFromServer: function (e) {
            this.cacheCallbacks.push(e), this.loadCacheRequests()
        },
        getConfig: function (e) {
            return this.getItems(elementor.config.dynamicTags, e)
        },
        parseTagsText: function (e, t, n) {
            var i = this;
            return "object" === t.returnType ? i.parseTagText(e, t, n) : e.replace(/\[elementor-tag[^\]]+]/g, function (e) {
                return i.parseTagText(e, t, n)
            })
        },
        parseTagText: function (e, t, n) {
            var i = this.tagTextToTagData(e);
            return i ? n(i.id, i.name, i.settings) : "object" === t.returnType ? {} : ""
        },
        tagTextToTagData: function (e) {
            var t = e.match(/id="(.*?(?="))"/), n = e.match(/name="(.*?(?="))"/), i = e.match(/settings="(.*?(?="]))/);
            return !!(t && n && i) && {id: t[1], name: n[1], settings: JSON.parse(decodeURIComponent(i[1]))}
        },
        createTag: function (e, t, n) {
            var i = this.getConfig("tags." + t);
            if (i) return new (this.tags[t] || this.tags.Base)({
                id: e,
                name: t,
                model: new elementorModules.editor.elements.models.BaseSettings(n, {controls: i.controls})
            })
        },
        getTagDataContent: function (e, t, n) {
            var i = this.createTag(e, t, n);
            if (i) return i.getContent()
        },
        tagDataToTagText: function (e, t, n) {
            return '[elementor-tag id="' + e + '" name="' + t + '" settings="' + (n = encodeURIComponent(JSON.stringify(n && n.toJSON({remove: ["default"]}) || {}))) + '"]'
        },
        cleanCache: function () {
            this.cache = {}
        },
        onInit: function () {
            this.loadCacheRequests = _.debounce(this.loadCacheRequests, 300)
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        hasTemplate: !0, tagName: "span", className: function () {
            return "elementor-tag"
        }, getTemplate: function () {
            return !!this.hasTemplate && Marionette.TemplateCache.get("#tmpl-elementor-tag-" + this.getOption("name") + "-content")
        }, initialize: function () {
            try {
                this.getTemplate()
            } catch (e) {
                this.hasTemplate = !1
            }
        }, getConfig: function (e) {
            var t = elementor.dynamicTags.getConfig("tags." + this.getOption("name"));
            return e ? t[e] : t
        }, getContent: function () {
            var e, t = this.getConfig("content_type");
            if (!this.hasTemplate && void 0 === (e = elementor.dynamicTags.loadTagDataFromCache(this))) throw new Error(elementor.dynamicTags.CACHE_KEY_NOT_FOUND_ERROR);
            if ("ui" === t) {
                if (this.render(), this.hasTemplate) return this.el.outerHTML;
                this.getConfig("wrapped_tag") && (e = jQuery(e).html()), this.$el.html(e)
            }
            return e
        }, onRender: function () {
            this.el.id = "elementor-tag-" + this.getOption("id")
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = elementorModules.Module.extend({
        modules: {base: n(14), general: n(139), page: n(140)},
        panelPages: {base: n(141)},
        onInit: function () {
            this.initSettings()
        },
        initSettings: function () {
            var e = this;
            _.each(elementor.config.settings, function (t, n) {
                var i = e.modules[n] || e.modules.base;
                e[n] = new i(t)
            })
        }
    })
}, function (e, t, n) {
    "use strict";
    var i = n(14);
    e.exports = i.extend({
        changeCallbacks: {
            elementor_page_title_selector: function (e) {
                var t = e || "h1.entry-title";
                (elementor.settings.page.model.controls.hide_title.selectors = {})[t] = "display: none", elementor.settings.page.updateStylesheet()
            }
        }
    })
}, function (e, t, n) {
    "use strict";
    var i = n(14);
    e.exports = i.extend({
        save: function () {
        }, changeCallbacks: {
            post_title: function (e) {
                elementorFrontend.elements.$document.find(elementor.config.page_title_selector).text(e)
            }, template: function () {
                elementor.saver.saveAutoSave({
                    onSuccess: function () {
                        elementor.reloadPreview(), elementor.once("preview:loaded", function () {
                            elementor.getPanelView().setPage("page_settings")
                        })
                    }
                })
            }
        }, onModelChange: function () {
            elementor.saver.setFlagEditorChange(!0), i.prototype.onModelChange.apply(this, arguments)
        }, getDataToSave: function (e) {
            return e.id = elementor.config.document.id, e
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = elementorModules.editor.views.ControlsStack.extend({
        id: function () {
            return "elementor-panel-" + this.getOption("name") + "-settings"
        }, getTemplate: function () {
            return "#tmpl-elementor-panel-" + this.getOption("name") + "-settings"
        }, childViewContainer: function () {
            return "#elementor-panel-" + this.getOption("name") + "-settings-controls"
        }, childViewOptions: function () {
            return {elementSettingsModel: this.model}
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = elementorModules.Module.extend({
        autoSaveTimer: null,
        autosaveInterval: 1e3 * elementor.config.autosave_interval,
        isSaving: !1,
        isChangedDuringSave: !1,
        __construct: function () {
            this.setWorkSaver()
        },
        startTimer: function (e) {
            clearTimeout(this.autoSaveTimer), e && (this.autoSaveTimer = setTimeout(_.bind(this.doAutoSave, this), this.autosaveInterval))
        },
        saveDraft: function () {
            var e = elementor.settings.page.model.get("post_status");
            if (elementor.saver.isEditorChanged() || "draft" === e) switch (e) {
                case"publish":
                case"private":
                    this.doAutoSave();
                    break;
                default:
                    this.update()
            }
        },
        doAutoSave: function () {
            "edit" === elementor.channels.dataEditMode.request("activeMode") && this.saveAutoSave()
        },
        saveAutoSave: function (e) {
            this.isEditorChanged() && (e = _.extend({status: "autosave"}, e), this.saveEditor(e))
        },
        savePending: function (e) {
            e = _.extend({status: "pending"}, e), this.saveEditor(e)
        },
        discard: function () {
            var e = this;
            elementorCommon.ajax.addRequest("discard_changes", {
                success: function () {
                    e.setFlagEditorChange(!1), location.href = elementor.config.document.urls.exit_to_dashboard
                }
            })
        },
        update: function (e) {
            e = _.extend({status: elementor.settings.page.model.get("post_status")}, e), this.saveEditor(e)
        },
        publish: function (e) {
            e = _.extend({status: "publish"}, e), this.saveEditor(e)
        },
        setFlagEditorChange: function (e) {
            e && this.isSaving && (this.isChangedDuringSave = !0), this.startTimer(e), elementor.channels.editor.reply("status", e).trigger("status:change", e)
        },
        isEditorChanged: function () {
            return !0 === elementor.channels.editor.request("status")
        },
        setWorkSaver: function () {
            var e = this;
            elementorCommon.elements.$window.on("beforeunload", function () {
                if (e.isEditorChanged()) return elementor.translate("before_unload_alert")
            })
        },
        defaultSave: function () {
            switch (elementor.settings.page.model.get("post_status")) {
                case"publish":
                case"future":
                case"private":
                    this.update();
                    break;
                case"draft":
                    elementor.config.current_user_can_publish ? this.publish() : this.savePending();
                    break;
                case"pending":
                case void 0:
                    elementor.config.current_user_can_publish ? this.publish() : this.update()
            }
        },
        saveEditor: function (e) {
            if (!this.isSaving) {
                e = _.extend({status: "draft", onSuccess: null}, e);
                var t = this,
                    n = elementor.elements.toJSON({remove: ["default", "editSettings", "defaultEditSettings"]}),
                    i = elementor.settings.page.model.toJSON({remove: ["default"]}),
                    o = elementor.settings.page.model.get("post_status"), r = o !== e.status;
                t.trigger("before:save", e).trigger("before:save:" + e.status, e), t.isSaving = !0, t.isChangedDuringSave = !1, i.post_status = e.status, elementorCommon.ajax.addRequest("save_builder", {
                    data: {
                        status: e.status,
                        elements: n,
                        settings: i
                    }, success: function (i) {
                        t.afterAjax(), "autosave" !== e.status && (r && elementor.settings.page.model.set("post_status", e.status), t.isChangedDuringSave || t.setFlagEditorChange(!1)), i.config && jQuery.extend(!0, elementor.config, i.config), elementor.config.data = n, elementor.channels.editor.trigger("saved", i), t.trigger("after:save", i).trigger("after:save:" + e.status, i), r && t.trigger("page:status:change", e.status, o), _.isFunction(e.onSuccess) && e.onSuccess.call(this, i)
                    }, error: function (n) {
                        var i;
                        t.afterAjax(), t.trigger("after:saveError", n).trigger("after:saveError:" + e.status, n), _.isString(n) ? i = n : n.statusText ? (i = elementor.createAjaxErrorMessage(n), 0 === n.readyState && (i += " " + elementor.translate("saving_disabled"))) : n[0] && n[0].code && (i = elementor.translate("server_error") + " " + n[0].code), elementor.notifications.showToast({message: i})
                    }
                }), this.trigger("save", e)
            }
        },
        afterAjax: function () {
            this.isSaving = !1
        }
    })
}, function (e, t, n) {
    "use strict";
    e.exports = elementorModules.Module.extend({
        initToast: function () {
            var e = elementorCommon.dialogsManager.createWidget("buttons", {
                id: "elementor-toast",
                position: {
                    my: "center bottom",
                    at: "center bottom-10",
                    of: "#elementor-panel-content-wrapper",
                    autoRefresh: !0
                },
                hide: {onClick: !0, auto: !0, autoDelay: 1e4},
                effects: {
                    show: function () {
                        var t = e.getElements("widget");
                        t.show(), e.refreshPosition();
                        var n = parseInt(t.css("top"), 10);
                        t.hide().css("top", n + 100), t.animate({
                            opacity: "show",
                            height: "show",
                            paddingBottom: "show",
                            paddingTop: "show",
                            top: n
                        }, {easing: "linear", duration: 300})
                    }, hide: function () {
                        var t = e.getElements("widget"), n = parseInt(t.css("top"), 10);
                        t.animate({
                            opacity: "hide",
                            height: "hide",
                            paddingBottom: "hide",
                            paddingTop: "hide",
                            top: n + 100
                        }, {easing: "linear", duration: 300})
                    }
                },
                button: {tag: "div"}
            });
            this.getToast = function () {
                return e
            }
        }, showToast: function (e) {
            var t = this.getToast();
            t.setMessage(e.message), t.getElements("buttonsWrapper").empty(), e.buttons && e.buttons.forEach(function (e) {
                t.addButton(e)
            }), t.show()
        }, onInit: function () {
            this.initToast()
        }
    })
}, function (e, t, n) {
    "use strict";
    var i = n(21);
    e.exports = i.extend({
        el: "#elementor-panel", getStorageKey: function () {
            return "panel"
        }, getDefaultStorage: function () {
            return {size: {width: ""}}
        }, constructor: function () {
            i.prototype.constructor.apply(this, arguments);
            var e = n(145);
            this.show(new e), this.resizable(), this.setSize(), this.listenTo(elementor.channels.dataEditMode, "switch", this.onEditModeSwitched)
        }, setSize: function () {
            var e = this.storage.size.width, t = elementorCommon.config.isRTL ? "right" : "left";
            this.$el.css("width", e), elementor.$previewWrapper.css(t, e)
        }, resizable: function () {
            var e = this, t = elementorCommon.config.isRTL ? "right" : "left";
            e.$el.resizable({
                handles: elementorCommon.config.isRTL ? "w" : "e",
                minWidth: 200,
                maxWidth: 680,
                start: function () {
                    elementor.$previewWrapper.addClass("ui-resizable-resizing")
                },
                stop: function () {
                    elementor.$previewWrapper.removeClass("ui-resizable-resizing"), elementor.getPanelView().updateScrollbar(), e.saveSize()
                },
                resize: function (e, n) {
                    elementor.$previewWrapper.css(t, n.size.width)
                }
            })
        }, onEditModeSwitched: function (e) {
            "edit" === e && this.setSize()
        }
    })
}, function (e, t, n) {
    "use strict";
    var i, o = n(146);
    i = Marionette.LayoutView.extend({
        template: "#tmpl-elementor-panel",
        id: "elementor-panel-inner",
        regions: {
            content: "#elementor-panel-content-wrapper",
            header: "#elementor-panel-header-wrapper",
            footer: "#elementor-panel-footer",
            modeSwitcher: "#elementor-mode-switcher"
        },
        pages: {},
        childEvents: {
            "click:add": function () {
                this.setPage("elements")
            }, "editor:destroy": function () {
                this.setPage("elements", null, {autoFocusSearch: !1})
            }
        },
        currentPageName: null,
        currentPageView: null,
        perfectScrollbar: null,
        initialize: function () {
            this.initPages()
        },
        buildPages: function () {
            var e = {
                    elements: {
                        view: n(147),
                        title: '<img src="' + elementorCommon.config.urls.assets + 'images/logo-panel.svg">'
                    },
                    editor: {view: n(152)},
                    menu: {
                        view: elementor.modules.layouts.panel.pages.menu.Menu,
                        title: '<img src="' + elementorCommon.config.urls.assets + 'images/logo-panel.svg">'
                    },
                    colorScheme: {view: n(39)},
                    typographyScheme: {view: n(155)},
                    colorPickerScheme: {view: n(156)}
                }, t = Object.keys(elementor.schemes.getSchemes()),
                i = _.difference(t, elementor.schemes.getEnabledSchemesTypes());
            return _.each(i, function (t) {
                var i = elementor.schemes.getScheme(t);
                e[t + "Scheme"].view = n(157).extend({disabledTitle: i.disabled_title})
            }), e
        },
        initPages: function () {
            var e;
            this.getPages = function (t) {
                return e || (e = this.buildPages()), t ? e[t] : e
            }, this.addPage = function (t, n) {
                e || (e = this.buildPages()), e[t] = n
            }
        },
        getHeaderView: function () {
            return this.getChildView("header")
        },
        getFooterView: function () {
            return this.getChildView("footer")
        },
        getCurrentPageName: function () {
            return this.currentPageName
        },
        getCurrentPageView: function () {
            return this.currentPageView
        },
        setPage: function (e, t, n) {
            var i = this.getPages();
            "elements" !== e || elementor.userCan("design") || i.page_settings && (e = "page_settings");
            var o = i[e];
            if (!o) throw new ReferenceError("Elementor panel doesn't have page named '" + e + "'");
            o.options && (n = _.extend(o.options, n));
            var r = o.view;
            o.getView && (r = o.getView()), this.currentPageName = e, this.currentPageView = new r(n), this.showChildView("content", this.currentPageView), this.getHeaderView().setTitle(t || o.title), this.trigger("set:page", this.currentPageView).trigger("set:page:" + e, this.currentPageView)
        },
        openEditor: function (e, t) {
            this.setPage("editor", elementor.translate("edit_element", [elementor.getElementData(e).title]), {
                model: e,
                controls: elementor.getElementControls(e),
                editedElementView: t
            });
            var n = "panel/open_editor/" + e.get("elType");
            elementor.hooks.doAction(n, this, e, t), elementor.hooks.doAction(n + "/" + e.get("widgetType"), this, e, t)
        },
        onBeforeShow: function () {
            var e = n(158), t = n(159);
            this.showChildView("modeSwitcher", new o), this.showChildView("header", new t), this.showChildView("footer", new e), this.updateScrollbar = _.throttle(this.updateScrollbar, 100), this.getRegion("content").on("before:show", this.onEditorBeforeShow.bind(this)).on("empty", this.onEditorEmpty.bind(this)).on("show", this.updateScrollbar.bind(this)), this.setPage("elements")
        },
        onEditorBeforeShow: function () {
            _.defer(this.updateScrollbar.bind(this))
        },
        onEditorEmpty: function () {
            this.updateScrollbar()
        },
        updateScrollbar: function () {
            this.perfectScrollbar ? this.perfectScrollbar.update() : this.perfectScrollbar = new PerfectScrollbar(this.content.el, {suppressScrollX: !0})
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.ItemView.extend({
        template: "#tmpl-elementor-mode-switcher-content",
        id: "elementor-mode-switcher-inner",
        ui: {
            previewButton: "#elementor-mode-switcher-preview-input",
            previewLabel: "#elementor-mode-switcher-preview",
            previewLabelA11y: "#elementor-mode-switcher-preview .elementor-screen-only"
        },
        events: {"change @ui.previewButton": "onPreviewButtonChange"},
        initialize: function () {
            this.listenTo(elementor.channels.dataEditMode, "switch", this.onEditModeChanged)
        },
        getCurrentMode: function () {
            return this.ui.previewButton.is(":checked") ? "preview" : "edit"
        },
        setMode: function (e) {
            this.ui.previewButton.prop("checked", "preview" === e).trigger("change")
        },
        toggleMode: function () {
            this.setMode(this.ui.previewButton.prop("checked") ? "edit" : "preview")
        },
        onRender: function () {
            this.onEditModeChanged()
        },
        onPreviewButtonChange: function () {
            elementor.changeEditMode(this.getCurrentMode())
        },
        onEditModeChanged: function () {
            var e = elementor.channels.dataEditMode.request("activeMode"),
                t = elementor.translate("preview" === e ? "back_to_editor" : "preview");
            this.ui.previewLabel.attr("title", t), this.ui.previewLabelA11y.text(t)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(148), r = n(38), s = n(149), l = elementor.modules.layouts.panel.pages.elements.views.Elements,
        a = n(151), c = n(35);
    i = Marionette.LayoutView.extend({
        template: "#tmpl-elementor-panel-elements",
        id: "elementor-panel-page-elements",
        options: {autoFocusSearch: !0},
        regions: {elements: "#elementor-panel-elements-wrapper", search: "#elementor-panel-elements-search-area"},
        ui: {tabs: ".elementor-panel-navigation-tab"},
        events: {"click @ui.tabs": "onTabClick"},
        regionViews: {},
        elementsCollection: null,
        categoriesCollection: null,
        initialize: function () {
            this.listenTo(elementor.channels.panelElements, "element:selected", this.destroy), this.initElementsCollection(), this.initCategoriesCollection(), this.initRegionViews()
        },
        initRegionViews: function () {
            var e = {
                elements: {region: this.elements, view: l, options: {collection: this.elementsCollection}},
                categories: {region: this.elements, view: s, options: {collection: this.categoriesCollection}},
                search: {region: this.search, view: a},
                global: {region: this.elements, view: c}
            };
            this.regionViews = elementor.hooks.applyFilters("panel/elements/regionViews", e)
        },
        initElementsCollection: function () {
            var e = new r, t = elementor.config.elements.section;
            e.add({
                title: elementor.translate("inner_section"),
                elType: "section",
                categories: ["basic"],
                keywords: ["row", "columns", "nested"],
                icon: t.icon
            }), _.each(elementor.config.widgets, function (t) {
                elementor.config.document.panel.widgets_settings[t.widget_type] && (t = _.extend(t, elementor.config.document.panel.widgets_settings[t.widget_type])), t.show_in_panel && e.add({
                    title: t.title,
                    elType: t.elType,
                    categories: t.categories,
                    keywords: t.keywords,
                    icon: t.icon,
                    widgetType: t.widget_type,
                    custom: t.custom
                })
            }), this.elementsCollection = e
        },
        initCategoriesCollection: function () {
            var e = {};
            this.elementsCollection.each(function (t) {
                _.each(t.get("categories"), function (n) {
                    e[n] || (e[n] = []), e[n].push(t)
                })
            });
            var t = new o;
            _.each(elementor.config.document.panel.elements_categories, function (n, i) {
                e[i] && (void 0 === n.active && (n.active = !0), void 0 === n.icon && (n.icon = "font"), t.add({
                    name: i,
                    title: n.title,
                    icon: n.icon,
                    defaultActive: n.active,
                    items: e[i]
                }))
            }), this.categoriesCollection = t
        },
        activateTab: function (e) {
            this.ui.tabs.removeClass("elementor-active").filter('[data-view="' + e + '"]').addClass("elementor-active"), this.showView(e)
        },
        showView: function (e) {
            var t = this.regionViews[e], n = t.options || {};
            t.region.show(new t.view(n))
        },
        clearSearchInput: function () {
            this.getChildView("search").clearInput()
        },
        changeFilter: function (e) {
            elementor.channels.panelElements.reply("filter:value", e).trigger("filter:change")
        },
        clearFilters: function () {
            this.changeFilter(null), this.clearSearchInput()
        },
        focusSearch: function () {
            elementor.userCan("design") && this.search && this.search.currentView.ui.input.focus()
        },
        onChildviewChildrenRender: function () {
            elementor.getPanelView().updateScrollbar()
        },
        onChildviewSearchChangeInput: function (e) {
            this.changeFilter(e.ui.input.val(), "search")
        },
        onDestroy: function () {
            elementor.channels.panelElements.reply("filter:value", null)
        },
        onShow: function () {
            this.showView("categories"), this.showView("search"), this.options.autoFocusSearch && setTimeout(this.focusSearch.bind(this))
        },
        onTabClick: function (e) {
            this.activateTab(e.currentTarget.dataset.view)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(37);
    i = Backbone.Collection.extend({model: o}), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(150);
    i = Marionette.CompositeView.extend({
        template: "#tmpl-elementor-panel-categories",
        childView: o,
        childViewContainer: "#elementor-panel-categories",
        id: "elementor-panel-elements-categories",
        initialize: function () {
            this.listenTo(elementor.channels.panelElements, "filter:change", this.onPanelElementsFilterChange)
        },
        onPanelElementsFilterChange: function () {
            elementor.channels.panelElements.request("filter:value") && elementor.getPanelView().getCurrentPageView().showView("elements")
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(38);
    i = Marionette.CompositeView.extend({
        template: "#tmpl-elementor-panel-elements-category",
        className: "elementor-panel-category",
        ui: {title: ".elementor-panel-category-title", items: ".elementor-panel-category-items"},
        events: {"click @ui.title": "onTitleClick"},
        id: function () {
            return "elementor-panel-category-" + this.model.get("name")
        },
        childView: n(36),
        childViewContainer: ".elementor-panel-category-items",
        initialize: function () {
            this.collection = new o(this.model.get("items"))
        },
        onRender: function () {
            var e = elementor.channels.panelElements.request("category:" + this.model.get("name") + ":active");
            void 0 === e && (e = this.model.get("defaultActive")), e && (this.$el.addClass("elementor-active"), this.ui.items.show())
        },
        onTitleClick: function () {
            var e = this.ui.items, t = this.$el.hasClass("elementor-active"), n = t ? "slideUp" : "slideDown";
            elementor.channels.panelElements.reply("category:" + this.model.get("name") + ":active", !t), this.$el.toggleClass("elementor-active", !t), e[n](300, function () {
                elementor.getPanelView().updateScrollbar()
            })
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.ItemView.extend({
        template: "#tmpl-elementor-panel-element-search",
        id: "elementor-panel-elements-search-wrapper",
        ui: {input: "input"},
        events: {"input @ui.input": "onInputChanged"},
        clearInput: function () {
            this.ui.input.val("")
        },
        onInputChanged: function (e) {
            27 === e.keyCode && this.clearInput(), this.triggerMethod("search:change:input")
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = elementorModules.editor.views.ControlsStack;
    i = o.extend({
        template: Marionette.TemplateCache.get("#tmpl-editor-content"),
        id: "elementor-panel-page-editor",
        childViewContainer: "#elementor-controls",
        childViewOptions: function () {
            return {
                elementSettingsModel: this.model.get("settings"),
                elementEditSettings: this.model.get("editSettings")
            }
        },
        getNamespaceArray: function () {
            var e = elementorModules.editor.views.ControlsStack.prototype.getNamespaceArray(),
                t = this.getOption("editedElementView").getEditModel(), n = t.get("elType");
            return e.push(n), "widget" === n && e.push(t.get("widgetType")), e
        },
        initialize: function () {
            o.prototype.initialize.apply(this, arguments);
            var e = this.model.get("editSettings").get("panel");
            e && (this.activeTab = e.activeTab, this.activeSection = e.activeSection)
        },
        activateSection: function () {
            o.prototype.activateSection.apply(this, arguments), this.model.get("editSettings").set("panel", {
                activeTab: this.activeTab,
                activeSection: this.activeSection
            })
        },
        openActiveSection: function () {
            o.prototype.openActiveSection.apply(this, arguments), elementor.channels.editor.trigger("section:activated", this.activeSection, this)
        },
        isVisibleSectionControl: function (e) {
            return o.prototype.isVisibleSectionControl.apply(this, arguments) && elementor.helpers.isActiveControl(e, this.model.get("settings").attributes)
        },
        scrollToEditedElement: function () {
            elementor.helpers.scrollToView(this.getOption("editedElementView").$el)
        },
        onDestroy: function () {
            var e = this.getOption("editedElementView");
            e && e.$el.removeClass("elementor-element-editable"), this.model.trigger("editor:close"), this.triggerMethod("editor:destroy")
        },
        onRender: function () {
            var e = this.getOption("editedElementView");
            e && e.$el.addClass("elementor-element-editable")
        },
        onDeviceModeChange: function () {
            o.prototype.onDeviceModeChange.apply(this, arguments), this.scrollToEditedElement()
        },
        onChildviewSettingsChange: function (e) {
            var t = this.getOption("editedElementView"), n = t.model.get("elType");
            "widget" === n && (n = t.model.get("widgetType")), elementor.channels.editor.trigger("change", e, t).trigger("change:" + n, e, t).trigger("change:" + n + ":" + e.model.get("name"), e, t)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = n(41).extend({
        getUIType: function () {
            return "color"
        }, ui: {input: ".elementor-panel-scheme-color-value"}, changeUIValue: function (e) {
            this.ui.input.wpColorPicker("color", e)
        }, onBeforeDestroy: function () {
            this.ui.input.wpColorPicker("instance") && this.ui.input.wpColorPicker("close")
        }, onRender: function () {
            var e = this;
            elementor.helpers.wpColorPicker(e.ui.input, {
                change: function (t, n) {
                    e.triggerMethod("value:change", n.color.toString())
                }
            })
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i, o = n(41);
    i = o.extend({
        getUIType: function () {
            return "typography"
        },
        className: function () {
            return o.prototype.className.apply(this, arguments) + " elementor-panel-box"
        },
        ui: {
            heading: ".elementor-panel-heading",
            allFields: ".elementor-panel-scheme-typography-item-field",
            inputFields: "input.elementor-panel-scheme-typography-item-field",
            selectFields: "select.elementor-panel-scheme-typography-item-field",
            selectFamilyFields: 'select.elementor-panel-scheme-typography-item-field[name="font_family"]'
        },
        events: {
            "input @ui.inputFields": "onFieldChange",
            "change @ui.selectFields": "onFieldChange",
            "click @ui.heading": "toggleVisibility"
        },
        onRender: function () {
            var e = this;
            this.ui.inputFields.add(this.ui.selectFields).each(function () {
                var t = jQuery(this), n = t.attr("name"), i = e.model.get("value")[n];
                t.val(i)
            }), this.ui.selectFamilyFields.select2({dir: elementorCommon.config.isRTL ? "rtl" : "ltr"})
        },
        toggleVisibility: function () {
            this.$el.toggleClass("elementor-open")
        },
        changeUIValue: function (e) {
            this.ui.allFields.each(function () {
                var t = jQuery(this), n = t.attr("name"), i = e[n];
                t.val(i).trigger("change")
            })
        },
        onFieldChange: function (e) {
            var t = this.$(e.currentTarget),
                n = elementor.schemes.getSchemeValue("typography", this.model.get("key")).value, i = t.attr("name");
            n[i] = t.val(), "font_family" !== i || _.isEmpty(n[i]) || elementor.helpers.enqueueFont(n[i]), this.triggerMethod("value:change", n)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = n(40).extend({
        getType: function () {
            return "typography"
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = n(39).extend({
        getType: function () {
            return "color-picker"
        }, getUIType: function () {
            return "color"
        }, onSchemeChange: function () {
        }, getViewComparator: function () {
            return this.orderView
        }, orderView: function (e) {
            return elementor.helpers.getColorPickerPaletteIndex(e.get("key"))
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.ItemView.extend({
        template: "#tmpl-elementor-panel-schemes-disabled",
        id: "elementor-panel-schemes-disabled",
        className: "elementor-nerd-box",
        disabledTitle: "",
        templateHelpers: function () {
            return {disabledTitle: this.disabledTitle}
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    e.exports = Marionette.ItemView.extend({
        template: "#tmpl-elementor-panel-footer-content",
        tagName: "nav",
        id: "elementor-panel-footer-tools",
        possibleRotateModes: ["portrait", "landscape"],
        ui: {
            menuButtons: ".elementor-panel-footer-tool",
            settings: "#elementor-panel-footer-settings",
            deviceModeIcon: "#elementor-panel-footer-responsive > i",
            deviceModeButtons: "#elementor-panel-footer-responsive .elementor-panel-footer-sub-menu-item",
            saveTemplate: "#elementor-panel-footer-sub-menu-item-save-template",
            history: "#elementor-panel-footer-history",
            navigator: "#elementor-panel-footer-navigator"
        },
        events: {
            "click @ui.menuButtons": "onMenuButtonsClick",
            "click @ui.settings": "onSettingsClick",
            "click @ui.deviceModeButtons": "onResponsiveButtonsClick",
            "click @ui.saveTemplate": "onSaveTemplateClick",
            "click @ui.history": "onHistoryClick",
            "click @ui.navigator": "onNavigatorClick"
        },
        behaviors: function () {
            var e = {saver: {behaviorClass: elementor.modules.components.saver.behaviors.FooterSaver}};
            return elementor.hooks.applyFilters("panel/footer/behaviors", e, this)
        },
        initialize: function () {
            this.listenTo(elementor.channels.deviceMode, "change", this.onDeviceModeChange)
        },
        getDeviceModeButton: function (e) {
            return this.ui.deviceModeButtons.filter('[data-device-mode="' + e + '"]')
        },
        addSubMenuItem: function (e, t) {
            var n = jQuery("<div>", {
                    id: "elementor-panel-footer-sub-menu-item-" + t.name,
                    class: "elementor-panel-footer-sub-menu-item"
                }), i = jQuery("<i>", {class: "elementor-icon " + t.icon, "aria-hidden": !0}),
                o = jQuery("<div>", {class: "elementor-title"}).text(t.title);
            if (n.append(i, o), t.description) {
                var r = jQuery("<div>", {class: "elementor-description"}).text(t.description);
                n.append(r)
            }
            t.callback && n.on("click", t.callback);
            var s = this.ui.menuButtons.filter("#elementor-panel-footer-" + e);
            if (t.before) {
                var l = s.find("#elementor-panel-footer-sub-menu-item-" + t.before);
                if (l.length) return n.insertBefore(l)
            }
            var a = s.find(".elementor-panel-footer-sub-menu");
            return n.appendTo(a)
        },
        showSettingsPage: function () {
            var e = this, t = elementor.getPanelView();
            "page_settings" !== t.getCurrentPageName() && (this.ui.settings.addClass("elementor-open"), t.setPage("page_settings"), t.getCurrentPageView().on("destroy", function () {
                e.ui.settings.removeClass("elementor-open")
            }))
        },
        onMenuButtonsClick: function (e) {
            var t = jQuery(e.currentTarget);
            if (t.hasClass("elementor-toggle-state") && !jQuery(e.target).closest(".elementor-panel-footer-sub-menu-item").length) {
                var n = t.hasClass("elementor-open");
                this.ui.menuButtons.not(".elementor-leave-open").removeClass("elementor-open"), n || t.addClass("elementor-open")
            }
        },
        onSettingsClick: function () {
            this.showSettingsPage()
        },
        onDeviceModeChange: function () {
            var e = elementor.channels.deviceMode.request("previousMode"),
                t = elementor.channels.deviceMode.request("currentMode");
            this.getDeviceModeButton(e).removeClass("active"), this.getDeviceModeButton(t).addClass("active"), this.ui.deviceModeIcon.removeClass("eicon-device-" + e).addClass("eicon-device-" + t)
        },
        onResponsiveButtonsClick: function (e) {
            var t = this.$(e.currentTarget).data("device-mode");
            elementor.changeDeviceMode(t)
        },
        onSaveTemplateClick: function () {
            elementor.templates.startModal({
                onReady: function () {
                    elementor.templates.getLayout().showSaveTemplateView()
                }
            })
        },
        onHistoryClick: function () {
            "historyPage" !== elementor.getPanelView().getCurrentPageName() && elementor.getPanelView().setPage("historyPage")
        },
        onNavigatorClick: function () {
            elementor.navigator.isOpen() ? elementor.navigator.close() : elementor.navigator.open()
        }
    })
}, function (e, t, n) {
    "use strict";
    var i;
    i = Marionette.ItemView.extend({
        template: "#tmpl-elementor-panel-header",
        id: "elementor-panel-header",
        ui: {
            menuButton: "#elementor-panel-header-menu-button",
            menuIcon: "#elementor-panel-header-menu-button i",
            title: "#elementor-panel-header-title",
            addButton: "#elementor-panel-header-add-button"
        },
        events: {"click @ui.addButton": "onClickAdd", "click @ui.menuButton": "onClickMenu"},
        setTitle: function (e) {
            this.ui.title.html(e)
        },
        onClickAdd: function () {
            elementor.getPanelView().setPage("elements")
        },
        onClickMenu: function () {
            var e = "menu" === elementor.getPanelView().getCurrentPageName() ? "elements" : "menu";
            elementor.getPanelView().setPage(e)
        }
    }), e.exports = i
}, function (e, t, n) {
    "use strict";
    var i = r(n(161)), o = r(n(162));

    function r(e) {
        return e && e.__esModule ? e : {default: e}
    }

    var s, l = n(163);
    s = l.extend({
        template: Marionette.TemplateCache.get("#tmpl-elementor-preview"),
        className: "elementor-inner",
        childViewContainer: ".elementor-section-wrap",
        behaviors: function () {
            var e = l.prototype.behaviors.apply(this, arguments),
                t = {contextMenu: {behaviorClass: n(8), groups: this.getContextMenuGroups()}};
            return elementor.config.user.introduction.rightClick || elementor.config.user.introduction[2] || (t.introduction = {behaviorClass: o.default}), jQuery.extend(e, t)
        },
        getContextMenuGroups: function () {
            var e = function () {
                return elementor.elements.length > 0
            };
            return [{
                name: "paste",
                actions: [{
                    name: "paste",
                    title: elementor.translate("paste"),
                    callback: this.paste.bind(this),
                    isEnabled: this.isPasteEnabled.bind(this)
                }]
            }, {
                name: "content",
                actions: [{
                    name: "copy_all_content",
                    title: elementor.translate("copy_all_content"),
                    callback: this.copy.bind(this),
                    isEnabled: e
                }, {
                    name: "delete_all_content",
                    title: elementor.translate("delete_all_content"),
                    callback: elementor.clearPage.bind(elementor),
                    isEnabled: e
                }]
            }]
        },
        copy: function () {
            elementorCommon.storage.set("transfer", {
                type: "copy",
                elementsType: "section",
                elements: elementor.elements.toJSON({copyHtmlCache: !0})
            })
        },
        paste: function (e) {
            var t, n = this, i = elementorCommon.storage.get("transfer"), o = void 0 !== e ? e : this.collection.length;
            elementor.channels.data.trigger("element:before:add", i.elements[0]), "section" === i.elementsType ? i.elements.forEach(function (e) {
                n.addChildElement(e, {at: o, edit: !1, clone: !0}), o++
            }) : "column" === i.elementsType ? ((t = n.addChildElement({allowEmpty: !0}, {at: e})).model.unset("allowEmpty"), o = 0, i.elements.forEach(function (e) {
                t.addChildElement(e, {at: o, clone: !0}), o++
            }), t.redefineLayout()) : (t = n.addChildElement(null, {at: e}), o = 0, i.elements.forEach(function (e) {
                t.addChildElement(e, {at: o, clone: !0}), o++
            })), elementor.channels.data.trigger("element:after:add", i.elements[0])
        },
        isPasteEnabled: function () {
            return elementorCommon.storage.get("transfer")
        },
        onRender: function () {
            if (elementor.userCan("design")) {
                var e = new i.default;
                e.render(), this.$el.append(e.$el)
            }
        }
    }), e.exports = s
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }(), o = function (e) {
        return e && e.__esModule ? e : {default: e}
    }(n(28));
    var r = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, o.default), i(t, [{
            key: "onCloseButtonClick", value: function () {
                this.closeSelectPresets()
            }
        }, {
            key: "id", get: function () {
                return "elementor-add-new-section"
            }
        }]), t
    }();
    t.default = r
}, function (e, t, n) {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = function () {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }

        return function (t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }();
    var o = function (e) {
        function t() {
            return function (e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, t), function (e, t) {
                if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return !t || "object" != typeof t && "function" != typeof t ? e : t
            }(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }

        return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }(t, Marionette.Behavior), i(t, [{
            key: "ui", value: function () {
                return {editButton: ".elementor-editor-element-edit"}
            }
        }, {
            key: "events", value: function () {
                return {"click @ui.editButton": "show"}
            }
        }, {
            key: "initialize", value: function () {
                this.initIntroduction()
            }
        }, {
            key: "initIntroduction", value: function () {
                var e = void 0;
                this.getIntroduction = function () {
                    return e || (e = new elementorModules.editor.utils.Introduction({
                        introductionKey: "rightClick",
                        dialogOptions: {
                            className: "elementor-right-click-introduction",
                            headerMessage: elementor.translate("meet_right_click_header"),
                            message: elementor.translate("meet_right_click_message"),
                            iframe: elementor.$preview,
                            position: {my: "center top+5", at: "center bottom", collision: "fit"}
                        },
                        onDialogInitCallback: function (t) {
                            t.addButton({
                                name: "learn-more",
                                text: elementor.translate("learn_more"),
                                tag: "div",
                                callback: function () {
                                    open(elementor.config.help_right_click_url, "_blank")
                                }
                            }), t.addButton({
                                name: "ok", text: elementor.translate("got_it"), callback: function () {
                                    return e.setViewed()
                                }
                            }), t.getElements("ok").addClass("elementor-button elementor-button-success")
                        }
                    })), e
                }
            }
        }, {
            key: "show", value: function (e) {
                this.getIntroduction().show(e.currentTarget)
            }
        }]), t
    }();
    t.default = o
}, function (e, t, n) {
    "use strict";
    var i, o = n(27), r = n(26);
    i = r.extend({
        childView: o, behaviors: function () {
            var e = {Sortable: {behaviorClass: n(11), elChildType: "section"}};
            return elementor.hooks.applyFilters("elements/base-section-container/behaviors", e, this)
        }, getSortableOptions: function () {
            return {
                handle: "> .elementor-element-overlay .elementor-editor-element-edit",
                items: "> .elementor-section"
            }
        }, getChildType: function () {
            return ["section"]
        }, initialize: function () {
            r.prototype.initialize.apply(this, arguments), this.listenTo(this.collection, "add remove reset", this.onCollectionChanged).listenTo(elementor.channels.panelElements, "element:drag:start", this.onPanelElementDragStart).listenTo(elementor.channels.panelElements, "element:drag:end", this.onPanelElementDragEnd)
        }, onCollectionChanged: function () {
            elementor.saver.setFlagEditorChange(!0)
        }, onPanelElementDragStart: function () {
            this.$el.find(".elementor-background-video-embed").hide(), elementor.helpers.disableElementEvents(this.$el.find("iframe"))
        }, onPanelElementDragEnd: function () {
            this.$el.find(".elementor-background-video-embed").show(), elementor.helpers.enableElementEvents(this.$el.find("iframe"))
        }
    }), e.exports = i
}]);