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
import shutil

apps = {
    'core-menu': [
        ('index.html', '/opt/web-ui/dist/menu/index.html'),
        ('inject.js', '/opt/web-ui/dist/menu/inject.js'),
    ],
    'dokuwiki': [
        ('tpl/dokuwiki/main.php', '/opt/dokuwiki/lib/tpl/dokuwiki/main.php'),
    ],
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
            Path(dst).parent.mkdir(exist_ok=True)
            with open(dst, 'w', encoding='latin1') as f:
                f.write(data)

if __name__ == '__main__':
    import sys
    [liquid_protocol, liquid_domain] = sys.argv[1:]
    main(liquid_protocol, liquid_domain)
