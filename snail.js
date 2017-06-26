/**
    Snail JS
    version : 0.9
 */

window.snail_conf = {
    js: {
        jquery: 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js',
        fastclick: 'http://apps.bdimg.com/libs/fastclick/1.0.0/fastclick.js',
        cookie: 'http://apps.bdimg.com/libs/Cookies.js/0.4.0/cookies.min.js'
    }
};

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
        var conf = window.snail_conf, _url = conf.js[id];
        return _url ?  _url : id;
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
