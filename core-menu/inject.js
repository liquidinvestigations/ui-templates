(function () {

    var subDomain = window.location.hostname
        .replace('__LIQUID_DOMAIN__', '')
        .replace('.', '');

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
            href: '/accounts/logout/?next=/',
            label: 'Logout',
            icon: '',
            cssClass: 'logout',
            hasDivider: true
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
                '<a href="{{ href }}" target="_parent" class="li-btn {{ cssClass }}">' +
                '<i class="{{ icon }}"></i> {{ label }}</a>', item);
        } else {
            return template(
                '<a href="__LIQUID_PROTOCOL__://{{ service }}.__LIQUID_DOMAIN__" ' +
                'target="_parent" class="li-btn {{ cssClass }}"><i class="{{ icon }}"></i> {{ label }}</a>', item);
        }
    }

    var menuContainerItems = '';

    for (var i in menuItems) {
        menuContainerItems += genMenuItem(menuItems[i]);
    }

    prepend('<iframe id="liMenu" style="display: none"></iframe>');

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
            '<div class="li-brand-container"><a href="__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__" target="_parent"><img class="li-brand" src="__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__/assets/liquid-investigations/img/li_logo.svg"></a></div>' +
            '{{ items }}' +
            '</div>',
            {
                items: menuContainerItems
            }
        ),
        iframeDoc
    );

    document.body.className += ' li-page li-' + subDomain + '-page';

})();
