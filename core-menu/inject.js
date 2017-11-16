(function () {

    var parts = window.location.hostname.split('.');
    var subDomain = '';

    document.body.className += ' li-page';

    if (parts.length > 2) {
        subDomain = parts[0];
        document.body.className += ' li-' + subDomain + '-page';
    }

    var menuItems = [
        {
            href: '__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__',
            label: 'Home',
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
        }
    ];

    function prepend(html, doc) {
        if (!doc) doc = document;

        var newNode = document.createElement('span');
        newNode.innerHTML = html;
        doc.body.prepend( newNode );
    }

    function template(tpl, data) {
        return tpl.replace(/\{\{ (.*?) \}\}/g, function (match, contents) {
            return data[contents];
        });
    }

    function genMenuItem(item) {
        if (item.href) {
            return template(
                '<a href="{{ href }}" target="_parent" class="li-btn {{ cssClass }}">{{ label }}</a>', item);
        } else {
            return template(
                '<a href="__LIQUID_PROTOCOL__://{{ service }}.__LIQUID_DOMAIN__" ' +
                'target="_parent" class="li-btn {{ cssClass }}">{{ label }}</a>', item);
        }
    }

    var menuContainerItems = '';

    for (var i in menuItems) {
        menuContainerItems += genMenuItem(menuItems[i]);
    }

    prepend('<iframe id="liMenu"></iframe>');

    var iframeDoc = document.querySelector('#liMenu').contentDocument;
    iframeDoc.body.className = 'menu-body';

    var stylesheet = template(
        '<link rel="stylesheet" href="__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__/menu/inject.css?v={{ version }}">',
        {
            version: 100
        }
    );

    prepend(stylesheet);
    prepend(stylesheet, iframeDoc);

    prepend(
        template(
            '<div class="li-top-menu">' +
            '<div class="li-brand-container"><img class="li-brand" src="__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__/assets/liquid-investigations/img/li_logo.svg"></div>' +
            '{{ items }}' +
            '</div>',
            {
                items: menuContainerItems
            }
        ),
        iframeDoc
    );

})();
