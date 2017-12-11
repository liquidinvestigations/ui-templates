#!/usr/bin/env python3
"""
Usage: `./install.py http liquid.example.org`

First argument is protocol (`http` or `https`).
Second argument is the domain of the liquid node.

The script copies the templates in the repo to specific destination paths in
the system. The arguments are used to replace URL placeholders in the
templates.
"""

from pathlib import Path
import subprocess
import shutil

apps = {
    'core-menu': [
        ('inject.css', '/opt/ui/web-ui/dist/menu/inject.css'),
        ('inject.js', '/opt/ui/web-ui/dist/menu/inject.js'),
    ],
    'dokuwiki': [
        ('tpl/bootstrap-template/main.php', '/opt/dokuwiki/lib/tpl/bootstrap-template/main.php'),
    ],
    'hoover': [
        # TODO: change so we don't inject in the built version
        ('build/index.html', '/opt/hoover/ui/build/index.html'),
        ('build/doc.html', '/opt/hoover/ui/build/doc.html'),
    ],
    "davros": [
        ('app/index.html', '/opt/davros/davros/app/index.html'),
    ],
    "hypothesis": [
        ('templates/layouts/base.html.jinja2', '/opt/hypothesis/h/h/templates/layouts/base.html.jinja2'),
        ('templates/home.html.jinja2', '/opt/hypothesis/h/h/templates/home.html.jinja2'),
        ('templates/5xx.html.jinja2', '/opt/hypothesis/h/h/templates/5xx.html.jinja2'),
        ('templates/notfound.html.jinja2', '/opt/hypothesis/h/h/templates/notfound.html.jinja2'),
    ],
    "matrix": [
        ('index.html', '/opt/matrix/synapse/lib/python2.7/site-packages/syweb/webclient/index.html'),
    ],
    "core-wizard": [
        ('welcome.html', '/opt/liquid-core/liquid-core/liquidcore/welcome/templates/welcome.html'),
        ('welcome-applying.html', '/opt/liquid-core/liquid-core/liquidcore/welcome/templates/welcome-applying.html')
    ],
    "home": [
        ('homepage.html', '/opt/liquid-core/liquid-core/liquidcore/home/templates/homepage.html'),
    ],
    "registration": [
        ('login.html', '/opt/liquid-core/liquid-core/liquidcore/home/templates/registration/login.html')
    ]
}

SRC = Path(__file__).resolve().parent
DEST = Path()

def main(liquid_protocol, liquid_domain):
    for app_name, file_list in apps.items():
        APP = SRC / app_name
        for (src, dst) in file_list:
            print(dst)
            with (APP / src).open(encoding='latin1') as f:
                data = (
                    f.read()
                    .replace('__LIQUID_PROTOCOL__', liquid_protocol)
                    .replace('__LIQUID_DOMAIN__', liquid_domain)
                )
            Path(dst).parent.mkdir(exist_ok=True, parents=True)
            with open(dst, 'w', encoding='latin1') as f:
                f.write(data)
    post_copy()


def post_copy():
    # rebuild davros
    cwd = "/opt/davros/davros"
    if (Path(cwd) / 'node_modules').exists():
        subprocess.check_output(
            ["./node_modules/ember-cli/bin/ember", "build"],
            cwd=cwd,
        )
    # restart everything
    subprocess.check_output(["supervisorctl", "restart", "all"])

if __name__ == '__main__':
    import sys
    [liquid_protocol, liquid_domain] = sys.argv[1:]
    main(liquid_protocol, liquid_domain)
