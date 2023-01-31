#! /usr/bin/env node

import { readdir } from 'fs/promises'
import { join } from 'path'
import arg from 'arg'

const args = arg({
    // Arguments
    '--help': Boolean,
    '--uppercase': Boolean,
    '--depth': Number,

    // Aliases
    '-h': '--help',
    '-d': '--depth',
    '-u': '--uppercase'
})

if (args['--help']) {
    console.log('Usage: print-tree [arguments]')
    console.log('Print your current directory tree');
    console.log('Arguments');
    console.log('-d, --depth <num> Max depth to print');
    console.log('-h, --help        Prints this guide');
    console.log('-u, --uppercase   Prints the tree in uppercase');

    process.exit(0); // Exit without error.
}

const useUppercase = args['--uppercase'];
const maxDepth = args['--depth'] ?? 3;

await printTree('./', 1, false)

async function printTree(path, iteration, isLastDirectory) {
    if (iteration == maxDepth) return;

    const dirContent = await readdir(path, { withFileTypes: true });

    for (let i = 0; i < dirContent.length; i++) {
        const dirent = dirContent[i];
        const isLast = i == dirContent.length - 1;

        if (dirent.isDirectory()) {
            printDirent(true, isLast, iteration, dirent.name, isLastDirectory);
            await printTree(join(path, dirent.name), iteration + 1, isLast)
        }
        else
            printDirent(false, isLast, iteration, dirent.name, isLastDirectory);
    }
}

function printDirent(isDirectory, isLastDirent, iteration, name, isLastDirectory) {
    let margin = ''

    if (iteration > 1) {
        const iterationBlankMargin = Array(3 * (iteration - 1)).fill(' ').join('');

        margin += isLastDirectory ? ' ' : '|';
        margin += iterationBlankMargin;
    }

    margin += isLastDirent ? '└───' : '├───';
    margin += isDirectory ? '📁' : ' ';

    let message = margin + name;
    if (useUppercase)
        message = message.toUpperCase();

    console.log(message);
}