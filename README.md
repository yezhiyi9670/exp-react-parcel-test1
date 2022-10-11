# Parcel + React Example Project

It's my exercise project on using React with Parcel.

## How to run & build

This is a Parcel based project, written using VSCode.

To init, run

```plain
$ npm update
```

To open development server, run

```plain
$ npm run start
```

by default it will be opened on port `3310` (in your browser input `http://localhost:3310`). To change this, see `package.json`.

To build distributables for production, delete everything in `dist/`, then run

```plain
$ npm run build
```

the files will be found in `dist/`. Just keep in mind that they cannot be executed locally, using `file:///` URL.

For more info, check [Parcel website](https://parceljs.org/).

## Managing dependencies

- `npm install --save-dev <package>` Install package in the development environment **of this project**.
- `npm uninstall <package>` Removes package **from this project**.
- `npm install --location=global <package>` Installs a package **globally**. For portability, you still need to use `install --save-dev` when a project needs a package, but this procedure won't require Internet connection since files will be copied from global.

So to start a Parcel project in an empty directory, simply use `npm install --save-dev parcel`.

Since we build HTML/CSS/JS for production, no packages will be required in production environment.

## Used file formats and required packages

- HTML `.html`
- Typescript with JSX `.tsx`
- SASS `.scss`, requires `sass` `@parcel/transformer-sass`.

Also, using React in Typescript requires `react` `@types/react` `@types/react-dom`.

## The directory structure

- `.parcel-cache` Cache. Should be excluded from Git.
- `node_modules` The project's npm modules repo. Should be excluded from Git.
- `src` The source code of the project.
- `types` Extra type definitions for TypeScript.
- `package.json` Project and dependecy info.
- `package-lock.json` Extra package info. Should be excluded from Git.
- `tsconfig.json` Configures TypeScript behavior in VSCode.
