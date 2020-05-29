/**
 * Description: Process steps for UI depend on jquery
 * Author: xk魁
 * License: MIT License
 */
/// This an Immediately-Invoked Function Expression（IIFE）
/// 立即执行函数，闭包原理
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module. 注册为一个匿名模块
        /// AMD 异步 加载模块
        define(['jquery'], factory);
    } else if (typeof exports == 'object') {
        // Node / CommonJS (Ndoe CommonJS 加载)
        // CMD 同步 加载模块 Example: let a = require("a.js");
        factory(require('jquery'));
    } else {
        // Browser globals 浏览器全局
        factory(jQuery);
    }
}(function ($) {
    let defaults; // 定义默认配置变量

    // define private variable by Symbol -- ES6
    let elPrivate = Symbol("el");
    let paramsPrivate = Symbol("params");

    // ProcessSteps Class
    class ProcessSteps {
        constructor(el, params) {
            this[paramsPrivate] = params;
            this[elPrivate] = el;

            this.__init();
        }

        __init () {
            let stepList = this[paramsPrivate].stepList;
            let step = this[paramsPrivate].step;
            let htmlTxt = "";
            let that = this;
            $.each(stepList, function (i, item) {
                htmlTxt += that.__getStepHtml(step, i, item.desc, stepList.length);
            })

            $(this[elPrivate]).html(`<ol class="${this.setStepStateClass()}">${htmlTxt}</ol>`);
            /// initialize callback
            this[paramsPrivate].initializeFn && this[paramsPrivate].initializeFn(this);
        }

        __getStepHtml (step, index, text, len) {
            let content = ` <div class="step-line"></div>
            <div class="step-content">
                <span class="step-num">${index}</span>
                <div class="step-text">${text}</div>
            </div>`;

            switch (true) {
                case len == index + 1 && step >= index: 
                    return `<li class="step-active step-end">${content}</li>`;
                // case len = index + 1 && step == index: 
                //     return `<li class="step-active-current step-end">${content}</li>`
                case len == index + 1: 
                    return `<li class="step-end">${content}</li>`;
                case step > index: 
                    return `<li class="step-active">${content}</li>`;
                case step == index: 
                    return `<li class="step-active-current">${content}</li>`;
                default: 
                    return `<li>${content}</li>`;
            }
        }

        setStepStateClass () {
            switch (this[paramsPrivate].stepState) {
                case "failure": return "steps steps-cancel";
                default: return "steps";
            }
        }
    }

    // entend jquery for processSteps
    $.fn.processSteps = function (params) {
        params = $.extend({ }, defaults, params);
        /// 'this' is Jquery instance list;
        return this.each(function () {
            new ProcessSteps(this, params);
        })
    } 

    // 定义默认配置的参数值
    defaults = $.fn.processSteps.prototype.defaults = {
        step: 0,
        el: null,
        stepState: "success", // success、failure
        stepList: [], // { desc: "" }
        initializeFn: null
    }
    
}));