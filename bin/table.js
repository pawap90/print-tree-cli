#! /usr/bin/env node

import { readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';
import { table, getBorderCharacters } from 'table';

const basePath = './';
const rows = [['Name', 'Type', 'Size']];
const dirContent = await readdir(basePath, { withFileTypes: true });

for (const dirent of dirContent) {
    const direntStats = await stat(join(basePath, dirent.name));
    rows.push([
        dirent.name,
        direntStats.isFile() ? '📄' : '📁',
        `${(direntStats.size / 1024).toFixed(2)} kB`
    ]);
}

console.log(table(rows, {
    header: { content: 'CONTENT\n' + resolve(basePath), alignment: 'center' },
    border: getBorderCharacters('norc')
}));