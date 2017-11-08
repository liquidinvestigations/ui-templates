#!/usr/bin/env python3

from pathlib import Path
import shutil

file_list = [
    'dokuwiki/main.php',
]

SRC = Path(__file__).resolve().parent / 'tpl'
DEST = Path('/opt/dokuwiki/lib/tpl')

def copy(f1, f2):
    shutil.copy(str(f1), str(f2))

def main():
    for name in file_list:
        print('copying', name)
        copy(SRC / name, DEST / name)

if __name__ == '__main__':
    main()
