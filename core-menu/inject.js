/*
 *  Copyright 2012-2013 (c) Pierre Duquesne <stackp@online.fr>
 *  Licensed under the New BSD License.
 *  https://github.com/stackp/promisejs
 */
(function(a){function b(){this._callbacks=[];}b.prototype.then=function(a,c){var d;if(this._isdone)d=a.apply(c,this.result);else{d=new b();this._callbacks.push(function(){var b=a.apply(c,arguments);if(b&&typeof b.then==='function')b.then(d.done,d);});}return d;};b.prototype.done=function(){this.result=arguments;this._isdone=true;for(var a=0;a<this._callbacks.length;a++)this._callbacks[a].apply(null,arguments);this._callbacks=[];};function c(a){var c=new b();var d=[];if(!a||!a.length){c.done(d);return c;}var e=0;var f=a.length;function g(a){return function(){e+=1;d[a]=Array.prototype.slice.call(arguments);if(e===f)c.done(d);};}for(var h=0;h<f;h++)a[h].then(g(h));return c;}function d(a,c){var e=new b();if(a.length===0)e.done.apply(e,c);else a[0].apply(null,c).then(function(){a.splice(0,1);d(a,arguments).then(function(){e.done.apply(e,arguments);});});return e;}function e(a){var b="";if(typeof a==="string")b=a;else{var c=encodeURIComponent;var d=[];for(var e in a)if(a.hasOwnProperty(e))d.push(c(e)+'='+c(a[e]));b=d.join('&');}return b;}function f(){var a;if(window.XMLHttpRequest)a=new XMLHttpRequest();else if(window.ActiveXObject)try{a=new ActiveXObject("Msxml2.XMLHTTP");}catch(b){a=new ActiveXObject("Microsoft.XMLHTTP");}return a;}function g(a,c,d,g){var h=new b();var j,k;d=d||{};g=g||{};try{j=f();}catch(l){h.done(i.ENOXHR,"");return h;}k=e(d);if(a==='GET'&&k){c+='?'+k;k=null;}j.open(a,c);j.withCredentials = true;var m='application/x-www-form-urlencoded';for(var n in g)if(g.hasOwnProperty(n))if(n.toLowerCase()==='content-type')m=g[n];else j.setRequestHeader(n,g[n]);j.setRequestHeader('Content-type',m);function o(){j.abort();h.done(i.ETIMEOUT,"",j);}var p=i.ajaxTimeout;if(p)var q=setTimeout(o,p);j.onreadystatechange=function(){if(p)clearTimeout(q);if(j.readyState===4){var a=(!j.status||(j.status<200||j.status>=300)&&j.status!==304);h.done(a,j.responseText,j);}};j.send(k);return h;}function h(a){return function(b,c,d){return g(a,b,c,d);};}var i={Promise:b,join:c,chain:d,ajax:g,get:h('GET'),post:h('POST'),put:h('PUT'),del:h('DELETE'),ENOXHR:1,ETIMEOUT:2,ajaxTimeout:0};if(typeof define==='function'&&define.amd)define(function(){return i;});else a.promise=i;})(this);


function li_prepend(html, doc) {
    if (!doc) doc = document;

    var newNode = document.createElement('span');
    newNode.innerHTML = html;
    doc.body.prepend( newNode );
}

function li_template(tpl, data) {
    return tpl.replace(/\{ ?\{ (.*?) \} ?\}/g, function (match, contents) {
        return data[contents];
    });
}

var liURL = '__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__';

/*
 * LI menu script
 */
(function () {

    var subDomain = window.location.hostname
        .replace('__LIQUID_DOMAIN__', '')
        .replace('.', '');

    promise
        .get(liURL + '/api/services/')
        .then(function (error, result) {
            if (error && !result) return;
            renderMenu(JSON.parse(result));
        })

    var menuItems = [
        {
            href: '__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__',
            label: 'Dashboard',
            icon: '',
            cssClass: ('' === subDomain ? 'active' : '')
        },
        {
            service: 'hypothesis',
            label: 'Hypothesis',
            icon: '',
            cssClass: ('hypothesis' === subDomain ? 'active' : '')
        },
        {
            service: 'hoover',
            label: 'Hoover',
            icon: '',
            cssClass: ('hoover' === subDomain ? 'active' : '')
        },
        {
            service: 'dokuwiki',
            label: 'DokuWiki',
            icon: '',
            cssClass: ('dokuwiki' === subDomain ? 'active' : '')
        },
        {
            service: 'davros',
            label: 'Davros',
            icon: '',
            cssClass: ('davros' === subDomain ? 'active' : '')
        },
        {
            service: 'matrix',
            label: 'Matrix',
            icon: '',
            cssClass: ('matrix' === subDomain ? 'active' : '')
        },
        {
            href: '__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__/accounts/logout/?next=/',
            label: 'Logout',
            icon: '',
            cssClass: 'logout',
            hasDivider: true
        }
    ];

    function genMenuItem(item) {
        if (item.href) {
            return li_template(
                '<a href="{{ href }}" target="_parent" class="li-btn {{ cssClass }}">' +
                '<i class="{{ icon }}"></i> {{ label }}</a>', item);
        } else {
            return li_template(
                '<a href="__LIQUID_PROTOCOL__://{{ service }}.__LIQUID_DOMAIN__" ' +
                'target="_parent" class="li-btn {{ cssClass }}"><i class="{{ icon }}"></i> {{ label }}</a>', item);
        }
    }

    li_prepend('<iframe id="liMenu" style="display: none"></iframe>');

    var iframeDoc = document.querySelector('#liMenu').contentDocument;
    iframeDoc.body.className = 'menu-body';

    var stylesheet = li_template(
        '<link rel="stylesheet" href="__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__/menu/inject.css?v={{ version }}">',
        {
            version: 100
        }
    );

    li_prepend(stylesheet);
    li_prepend(stylesheet, iframeDoc);

    function renderMenu(services) {
        var activeServices = services.map(function (t) { return t.name; });

        var menuContainerItems = '';

        for (var i in menuItems) {
            var item = menuItems[i];

            if (
                !item.service || (item.service && -1 < activeServices.indexOf(item.service))
            ) {
                menuContainerItems += genMenuItem(menuItems[i]);
            }
        }

        li_prepend(
            li_template(
                '<div class="li-top-menu">' +
                '<div class="li-brand-container"><a href="__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__" target="_parent"><img class="li-brand" src="__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__/assets/liquid-investigations/img/li_logo.svg"></a></div>' +
                '{{ items }}' +
                '</div>',
                {
                    items: menuContainerItems
                }
            ),
            iframeDoc
        );
    }

    document.body.className += ' li-page li-' + subDomain + '-page';

})();
