/**
 Snail JS
 version : 0.9
 note : not support broswer <= IE 8(script async)
 example :
 // snail.js('jquery','mui',function(){
 //     alert('load success');
 // });
 */
window.snail_conf = {
    mode : 'release', /*todo 0 for 线上 ;1 for 开发*/
    js_prefix : '/js/',// app是'js/' web是'/js/'
    js: {
        jquery: 'jquery-1.11.2.min.js',
        fastclick: 'fastclick.min.js',
        cookie: 'cookie.js',
        echarts: 'echarts.min.js',
        fontSize: 'fontSize.js',
        'grid9-lottery': 'grid9-lottery.min.js',
        share: 'share.js',
        selectTab: 'selectTab.js'
    },
    js_release:{
        common: 'common.js',
        common_s: 'common_s.js',
        mui: 'mui.min.js',
        'mui.previewimage': 'mui.previewimage.js',
        'mui.pullToRefresh': 'mui.pullToRefresh.js',
        'mui.zoom': 'mui.zoom.js',
        swiper: 'swiper.min.js',
        promotion_utils : "../promotion/js/promotion_utils.js"
    }
};

//fontSize
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth > 768) {
                clientWidth = 768
            }
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        };
    // Abort if browser does not support addEventListener
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.snail = factory());
})(this, function () { 'use strict';
    var snail = {};
    var scripts = [];
    var finishCallback = null;
    snail.js = function () {
        var args = arguments;
        var frag = document.createDocumentFragment();
        finishCallback = args[args.length - 1] || null;
        for(var i = 0;i < args.length;++i){
            var id = args[i];
            if(typeof id != 'string'){
                continue;
            }
            var url = matchJsPath(id);
            if(!url){
                console.log('snail cannot match url:' + id);
            }
            var scriptObj = document.createElement("script");
            scriptObj.src = url;
            scriptObj.async = false;/*顺序执行*/
            scriptObj.type = "text/javascript";
            scripts.push(scriptObj);
            scriptObj.onreadystatechange = scriptObj.onload = function () {
                 var state = this.readyState;
                 if (!state /*FF chrome safari*/|| /loaded|complete/.test(state)/*ie*/) {
                     this.state = 'loaded';
                     loadFinished(this);
                 }
            };
            frag.appendChild(scriptObj);
        }
        (document.body || document.head).appendChild(frag);
    };

    function matchJsPath(id) {
        var conf = window.snail_conf,_url = null;
        if (conf.mode == 'release') {/*线上*/ /*线上找不到就找开发*/
            _url = conf.js_release[id] || conf.js[id];
        } else {
            _url = conf.js[id];
        }
        return _url ? conf.js_prefix + _url : id;
    }

    function loadFinished(script) {
        var loaded = false;
        for (var name in scripts) {
            if (scripts.hasOwnProperty(name) && scripts[name].state != 'loaded') {
                return false;
            }
            loaded = true;
        }
        if(loaded){
            finishCallback && finishCallback();
        }
    }
    return snail;
});
