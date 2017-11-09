# ui-templates

Templates and stylesheets for the liquid core app and bundled apps. Each folder contains a separate set of templates and stylesheets. These files override the apps' default layout, stylesheet and everyting.


## Injecting the navigation menu

The navigation menu can be found in the `core-menu` dir.
On each page or template that needs changing, add the following lines directly under `<body>`:

    <div style="height: 50px; position: relative" id="liquid-menu-container"></div>
    <script src="__LIQUID_PROTOCOL__://__LIQUID_DOMAIN__/menu/inject.js"></script>
