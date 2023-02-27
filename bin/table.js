#! /usr/bin/env node

import { readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';
import { table, getBorderCharacters } from 'table';

await printTable('./')

async function printTable(path) {
    const dirContent = await readdir(path, { withFileTypes: true });
    const rows = [['Name', 'Type', 'Size']];

    for (const dirent of dirContent) {
        const direntStats = await stat(join(path, dirent.name));
        rows.push([
            dirent.name,
            direntStats.isFile() ? '📄' : '📁',
            `${(direntStats.size / 1024).toFixed(2)} kB`
        ]);
    }

    console.log(table(rows, {
        header: { content: 'CONTENT\n' + resolve(path), alignment: 'center' },
        border: getBorderCharacters('norc')
    }));
}
