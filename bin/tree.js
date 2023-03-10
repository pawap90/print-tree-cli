#! /usr/bin/env node

import { readdir } from 'fs/promises'
import { join } from 'path'
import arg from 'arg'
import chalk from 'chalk'

const pastelPalette = [
    '#74ebd5', '#74e3eb',
    '#74c4eb', '#74a6eb',
    '#7488eb', '#7f74eb',
    '#9d74eb', '#bc74eb',
    '#da74eb', '#eb74de',
    '#eb74a1', '#eb7483',
    '#ec8474', '#eca274',
    '#ecc174', '#ecdf74',
    '#daec74', '#bbec74',
    '#9dec74', '#7eec74',
    '#74ec88', '#74eca7',
    '#74ecc6'
];

const eightiesPalette = [
    '#0d0775', '#2e0b88',
    '#5810a1', '#8716bd',
    '#b21cd6', '#d821ec',
    '#f925ff', '#fa34e0',
    '#fb40c7', '#fc5b8f',
    '#fd735c', '#fe892e',
    '#ff9e00'
];

const firePalette = [
    '#fcba46', '#fcb045',
    '#fca544', '#fc9943',
    '#fc8f43', '#fb8542',
    '#fb7841', '#fb6d40',
    '#fb643f',
];

const args = arg({
    // Arguments
    '--help': Boolean,
    '--uppercase': Boolean,
    '--depth': Number,
    '--palette': String,
    '--bold': Boolean,
    '--italic': Boolean,
    '--background': Boolean,
    '--inverse': Boolean,

    // Aliases
    '-h': '--help',
    '-u': '--uppercase',
    '-d': '--depth',
    '-p': '--palette',
    '-b': '--bold',
    '-i': '--italic'
})

if (args['--help']) {
    console.log('');
    console.log('Usage: print-tree [arguments]');
    console.log('Print your current directory tree.');
    console.log('');
    console.log('Arguments');
    console.log('-d, --depth <num>    Max depth to print');
    console.log('-h, --help           Prints this guide');
    console.log('-u, --uppercase      Prints the tree in uppercase');
    console.log('-p, --palette <name> Choose a palette (80s | pastel | fire)');
    console.log('-b, --bold           Make the output bold');
    console.log('-i, --italic         Make the output italic');
    console.log('--background         Use the palette on background');
    console.log('--inverse            Invert background and foreground colors');

    process.exit(0); // Exit without error.
}

const useUppercase = args['--uppercase'];
const maxDepth = args['--depth'] ?? 3;
const palette = args['--palette'];
const bold = args['--bold'];
const italic = args['--italic'];
const background = args['--background'];
const inverse = args['--inverse'];

let styleStack = buildStyleStack();
let auxStyleStack = [];

await printTree('./', 1, false)

/**
 * Recursively print the current directory tree.
 * @param {string} path Path to iterate through
 * @param {number} iteration Iteration index
 * @param {boolean} isLastDirectory True if current path is last
 * @returns 
 */
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

/**
 * Prints the line that will represent a node in the tree.
 * @param {boolean} isDirectory True if the current dirent is a directory (not a file)
 * @param {boolean} isLastDirent True if the current dirent is the last dirent
 * @param {number} iteration Iteration index
 * @param {string} name Dirent name
 * @param {boolean} isLastDirectory True if the current dirent is the last directory
 */
function printDirent(isDirectory, isLastDirent, iteration, name, isLastDirectory) {
    let margin = ''

    if (iteration > 1) {
        const iterationBlankMargin = Array(3 * (iteration - 1)).fill(' ').join('');

        margin += isLastDirectory ? ' ' : '???';
        margin += iterationBlankMargin;
    }

    margin += isLastDirent ? '????????????' : '????????????';
    margin += isDirectory ? '????' : ' ';

    let message = margin + name;
    if (useUppercase)
        message = message.toUpperCase();

    const stylizedMessage = applyStyles(message)
    console.log(stylizedMessage);
}

/**
 * Applies styles to the text.
 * @param {string} text 
 * @returns Stylized text
 */
function applyStyles(text) {
    if (styleStack.length == 0) return text;
    const chalkHex = styleStack.pop();
    const stylizedText = chalkHex(text);

    auxStyleStack.push(chalkHex);

    if (styleStack.length == 0) {
        styleStack = [...auxStyleStack];
        auxStyleStack = [];
    }
    return stylizedText;
}

/**
 * Generates a stack of styles according to the values received in the command's style arguments
 * @returns {ChalkInstance[]}
 */
function buildStyleStack() {
    let auxPalette = []
    switch (palette) {
        case '80s':
            auxPalette = eightiesPalette;
            break;
        case 'pastel':
            auxPalette = pastelPalette;
            break;
        case 'fire':
            auxPalette = firePalette;
            break;
    }

    if (auxPalette.length == 0)
        auxPalette.push('')

    return auxPalette.map(hex => {
        let chalkBuilder = chalk;
        if (hex.length > 0) {
            if (background)
                chalkBuilder = chalk.bgHex(hex);
            else
                chalkBuilder = chalk.hex(hex);
        }

        if (inverse)
            chalkBuilder = chalkBuilder.inverse;

        if (bold)
            chalkBuilder = chalkBuilder.bold;

        if (italic)
            chalkBuilder = chalkBuilder.italic;

        return chalkBuilder;
    });
}