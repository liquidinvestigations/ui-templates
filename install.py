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
        ('inject.css', '/opt/web-ui/dist/menu/inject.css'),
        ('inject.js', '/opt/web-ui/dist/menu/inject.js'),
    ],
    'dokuwiki': [
        ('tpl/bootstrap-template/main.php', '/opt/dokuwiki/lib/tpl/bootstrap-template/main.php'),
    ],
    'hoover': [
        # TODO: change so we don't inject in the built version
        ('build/index.html', '/opt/hoover/ui/build/index.html'),
    ],
    "davros": [
        ('app/index.html', '/opt/davros/davros/app/index.html'),
    ],
    "hypothesis": [
        ('templates/layouts/base.html.jinja2', '/opt/hypothesis/h/h/templates/layouts/base.html.jinja2'),
        ('templates/home.html.jinja2', '/opt/hypothesis/h/h/templates/home.html.jinja2'),
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
    pre_copy()
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
            Path(dst).parent.mkdir(exist_ok=True)
            with open(dst, 'w', encoding='latin1') as f:
                f.write(data)
    post_copy()

def pre_copy():
    import zipfile

    subprocess.check_output(["wget", "https://github.com/LotarProject/dokuwiki-template-bootstrap3/zipball/master", "-O", "/tmp/dokuwiki-template.zip"])

    with zipfile.ZipFile("/tmp/dokuwiki-template.zip", "r") as zip:
        folder_name = zip.namelist()[0]
        zip.extractall('/opt/dokuwiki/lib/tpl')
    subprocess.check_output(['mv', '/opt/dokuwiki/lib/tpl/{}'.format(folder_name), '/opt/dokuwiki/lib/tpl/bootstrap-template'])


def post_copy():
    # rebuild davros
    subprocess.check_output(["./node_modules/ember-cli/bin/ember", "build"], cwd="/opt/davros/davros")
    # restart everything
    subprocess.check_output(["supervisorctl", "restart", "all"])

if __name__ == '__main__':
    import sys
    [liquid_protocol, liquid_domain] = sys.argv[1:]
    main(liquid_protocol, liquid_domain)
