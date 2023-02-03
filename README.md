A simple (and a bit ugly) CLI that displays the structure of the current directory. Created for my Instagram series "Creatubg a Node.js CLI".

![image](https://user-images.githubusercontent.com/2507959/216728044-a2f88c5f-f20d-4706-9bfe-3d77c2e557a9.png)

🎥 **Watch the series:**
1. [Create a CLI with Node.js](https://www.instagram.com/p/CnSCKkBK7eF/)
2. [Handling Arguments](https://www.instagram.com/p/CnmnpxfKW6Q/)
3. [Style the Output](https://www.instagram.com/p/CoKo5deKszh/)

## Dependencies
- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

## Run it

1. Clone the repo:

```sh
git clone https://github.com/pawap90/print-tree-cli
```

2. Install dependencies: Run the following command from the project's root folder:

```sh
cd print-tree-cli

npm install
```

3. Link it to run it locally:

```sh
npm link
```

4. Run it

```sh
print-tree --palette pastel --italic
```

## Usage

```
print-tree --help 

Usage: print-tree [arguments]
Print your current directory tree.

Arguments
-d, --depth <num>    Max depth to print
-h, --help           Prints this guide
-u, --uppercase      Prints the tree in uppercase
-p, --palette <name> Choose a palette (80s | pastel | fire)
-b, --bold           Make the output bold
-i, --italic         Make the output italic
--background         Use the palette on background
--inverse            Invert background and foreground colors
```
