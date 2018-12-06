---
id: babel-cli
title: @babel/cli
sidebar_label: cli
---

Babel comes with a built-in CLI which can be used to compile files from the command line.

In addition, various entry point scripts live in the top-level package at `@babel/cli/bin`. There is a shell-executable utility script, `babel-external-helpers.js`, and the main Babel cli script, `babel.js`.

## Install

While you _can_ install Babel CLI globally on your machine, it's much better
to install it **locally** project by project.

There are two primary reasons for this.

1. Different projects on the same machine can depend on different versions of
     Babel allowing you to update them individually.
2. Not having an implicit dependency on the environment you are working in
     makes your project far more portable and easier to setup.

We can install Babel CLI locally by running:

```sh
npm install --save-dev @babel/core @babel/cli
```

> **Note:** If you do not have a `package.json`, create one before installing. This will ensure proper interaction with the `npx` command.

After that finishes installing, your `package.json` file should include:

```diff
{
  "devDependencies": {
+   "@babel/cli": "^7.0.0",
+   "@babel/core": "^7.0.0"
  }
}
```

## Usage

```sh
babel script.js
```

> **Note:** These instructions use the excellent [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) command to run the locally installed executables. You can drop it inside of an [npm run script](https://docs.npmjs.com/cli/run-script) or you may instead execute with the relative path instead. `./node_modules/.bin/babel`

### Compile Files

Compile the file `script.js` and **output to stdout**.

```sh
npx babel script.js
# output...
```

If you would like to **output to a file** you may use `--out-file` or `-o`.

```sh
npx babel script.js --out-file script-compiled.js
```

To compile a file **every time that you change it**, use the `--watch` or `-w` option:

```sh
npx babel script.js --watch --out-file script-compiled.js
```

### Compile with Source Maps

If you would then like to add a **source map file** you can use
`--source-maps` or `-s`. [Learn more about source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

```sh
npx babel script.js --out-file script-compiled.js --source-maps
```

Or, if you'd rather have **inline source maps**, use `--source-maps inline` instead.

```sh
npx babel script.js --out-file script-compiled.js --source-maps inline
```

### Compile Directories

Compile the entire `src` directory and output it to the `lib` directory by using either `--out-dir` or `-d`. This doesn't overwrite any other files or directories in `lib`.

```sh
npx babel src --out-dir lib
```

Compile the entire `src` directory and output it as a single concatenated file.

```sh
npx babel src --out-file script-compiled.js
```

### Ignore files

Ignore spec and test files

```sh
npx babel src --out-dir lib --ignore "src/**/*.spec.js","src/**/*.test.js"
```

### Copy files

Copy files that will not be compiled

```sh
npx babel src --out-dir lib --copy-files
```

### Piping Files

Pipe a file in via stdin and output it to `script-compiled.js`

```sh
npx babel --out-file script-compiled.js < script.js
```

### Using Plugins

Use the `--plugins` option to specify plugins to use in compilation

```sh
npx babel script.js --out-file script-compiled.js --plugins=@babel/proposal-class-properties,@babel/transform-modules-amd
```

### Using Presets

Use the `--presets` option to specify plugins to use in compilation

```sh
npx babel script.js --out-file script-compiled.js --presets=@babel/preset-env,@babel/flow
```

### Ignoring .babelrc

Ignore the configuration from the project's `.babelrc` file and use the cli options e.g. for a custom build

```sh
npx babel --no-babelrc script.js --out-file script-compiled.js --presets=es2015,react
```

### Advanced Usage

There are many more options available, see [options](options.md), `babel --help` and other sections for more information.

```js
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseArgv;

function _fs() {
  const data = _interopRequireDefault(require("fs"));

  _fs = function () {
    return data;
  };

  return data;
}

function _commander() {
  const data = _interopRequireDefault(require("commander"));

  _commander = function () {
    return data;
  };

  return data;
}

function _core() {
  const data = require("@babel/core");

  _core = function () {
    return data;
  };

  return data;
}

function _uniq() {
  const data = _interopRequireDefault(require("lodash/uniq"));

  _uniq = function () {
    return data;
  };

  return data;
}

function _glob() {
  const data = _interopRequireDefault(require("glob"));

  _glob = function () {
    return data;
  };

  return data;
}

var _package = _interopRequireDefault(require("../../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander().default.option("-f, --filename [filename]", "filename to use when reading from stdin - this will be used in source-maps, errors etc");

_commander().default.option("--presets [list]", "comma-separated list of preset names", collect);

_commander().default.option("--plugins [list]", "comma-separated list of plugin names", collect);

_commander().default.option("--config-file [path]", "Path a to .babelrc file to use");

_commander().default.option("--env-name [name]", "The name of the 'env' to use when loading configs and plugins. " + "Defaults to the value of BABEL_ENV, or else NODE_ENV, or else 'development'.");

_commander().default.option("--root-mode [mode]", "The project-root resolution mode. " + "One of 'root' (the default), 'upward', or 'upward-optional'.");

_commander().default.option("--source-type [script|module]", "");

_commander().default.option("--no-babelrc", "Whether or not to look up .babelrc and .babelignore files");

_commander().default.option("--ignore [list]", "list of glob paths to **not** compile", collect);

_commander().default.option("--only [list]", "list of glob paths to **only** compile", collect);

_commander().default.option("--no-highlight-code", "enable/disable ANSI syntax highlighting of code frames (on by default)");

_commander().default.option("--no-comments", "write comments to generated output (true by default)");

_commander().default.option("--retain-lines", "retain line numbers - will result in really ugly code");

_commander().default.option("--compact [true|false|auto]", "do not include superfluous whitespace characters and line terminators", booleanify);

_commander().default.option("--minified", "save as much bytes when printing [true|false]");

_commander().default.option("--auxiliary-comment-before [string]", "print a comment before any injected non-user code");

_commander().default.option("--auxiliary-comment-after [string]", "print a comment after any injected non-user code");

_commander().default.option("-s, --source-maps [true|false|inline|both]", "", booleanify);

_commander().default.option("--source-map-target [string]", "set `file` on returned source map");

_commander().default.option("--source-file-name [string]", "set `sources[0]` on returned source map");

_commander().default.option("--source-root [filename]", "the root from which all sources are relative");

_commander().default.option("--module-root [filename]", "optional prefix for the AMD module formatter that will be prepend to the filename on module definitions");

_commander().default.option("-M, --module-ids", "insert an explicit id for modules");

_commander().default.option("--module-id [string]", "specify a custom name for module ids");

_commander().default.option("-x, --extensions [extensions]", "List of extensions to compile when a directory has been input [.es6,.js,.es,.jsx,.mjs]", collect);

_commander().default.option("--keep-file-extension", "Preserve the file extensions of the input files");

_commander().default.option("-w, --watch", "Recompile files on changes");

_commander().default.option("--skip-initial-build", "Do not compile files before watching");

_commander().default.option("-o, --out-file [out]", "Compile all input files into a single file");

_commander().default.option("-d, --out-dir [out]", "Compile an input directory of modules into an output directory");

_commander().default.option("--relative", "Compile into an output directory relative to input directory or file. Requires --out-dir [out]");

_commander().default.option("-D, --copy-files", "When compiling a directory copy over non-compilable files");

_commander().default.option("--include-dotfiles", "Include dotfiles when compiling and copying non-compilable files");

_commander().default.option("--verbose", "Log everything");

_commander().default.option("--delete-dir-on-start", "Delete the out directory before compilation");

_commander().default.version(_package.default.version + " (@babel/core " + _core().version + ")");

_commander().default.usage("[options] <files ...>");

function parseArgv(args) {
  _commander().default.parse(args);

  const errors = [];

  let filenames = _commander().default.args.reduce(function (globbed, input) {
    let files = _glob().default.sync(input);

    if (!files.length) files = [input];
    return globbed.concat(files);
  }, []);

  filenames = (0, _uniq().default)(filenames);
  filenames.forEach(function (filename) {
    if (!_fs().default.existsSync(filename)) {
      errors.push(filename + " does not exist");
    }
  });

  if (_commander().default.outDir && !filenames.length) {
    errors.push("--out-dir requires filenames");
  }

  if (_commander().default.outFile && _commander().default.outDir) {
    errors.push("--out-file and --out-dir cannot be used together");
  }

  if (_commander().default.relative && !_commander().default.outDir) {
    errors.push("--relative requires --out-dir usage");
  }

  if (_commander().default.watch) {
    if (!_commander().default.outFile && !_commander().default.outDir) {
      errors.push("--watch requires --out-file or --out-dir");
    }

    if (!filenames.length) {
      errors.push("--watch requires filenames");
    }
  }

  if (_commander().default.skipInitialBuild && !_commander().default.watch) {
    errors.push("--skip-initial-build requires --watch");
  }

  if (_commander().default.deleteDirOnStart && !_commander().default.outDir) {
    errors.push("--delete-dir-on-start requires --out-dir");
  }

  if (!_commander().default.outDir && filenames.length === 0 && typeof _commander().default.filename !== "string" && _commander().default.babelrc !== false) {
    errors.push("stdin compilation requires either -f/--filename [filename] or --no-babelrc");
  }

  if (errors.length) {
    console.error("babel:");
    errors.forEach(function (e) {
      console.error("  " + e);
    });
    process.exit(2);
  }

  const opts = _commander().default.opts();

  const babelOptions = {
    presets: opts.presets,
    plugins: opts.plugins,
    rootMode: opts.rootMode,
    configFile: opts.configFile,
    envName: opts.envName,
    sourceType: opts.sourceType,
    ignore: opts.ignore,
    only: opts.only,
    retainLines: opts.retainLines,
    compact: opts.compact,
    minified: opts.minified,
    auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
    auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
    sourceMaps: opts.sourceMaps,
    sourceFileName: opts.sourceFileName,
    sourceRoot: opts.sourceRoot,
    moduleRoot: opts.moduleRoot,
    moduleIds: opts.moduleIds,
    moduleId: opts.moduleId,
    babelrc: opts.babelrc === true ? undefined : opts.babelrc,
    highlightCode: opts.highlightCode === true ? undefined : opts.highlightCode,
    comments: opts.comments === true ? undefined : opts.comments
  };

  for (const key of Object.keys(babelOptions)) {
    if (babelOptions[key] === undefined) {
      delete babelOptions[key];
    }
  }

  return {
    babelOptions,
    cliOptions: {
      filename: opts.filename,
      filenames,
      extensions: opts.extensions,
      keepFileExtension: opts.keepFileExtension,
      watch: opts.watch,
      skipInitialBuild: opts.skipInitialBuild,
      outFile: opts.outFile,
      outDir: opts.outDir,
      relative: opts.relative,
      copyFiles: opts.copyFiles,
      includeDotfiles: opts.includeDotfiles,
      verbose: opts.verbose,
      deleteDirOnStart: opts.deleteDirOnStart,
      sourceMapTarget: opts.sourceMapTarget
    }
  };
}

function booleanify(val) {
  if (val === "true" || val == 1) {
    return true;
  }

  if (val === "false" || val == 0 || !val) {
    return false;
  }

  return val;
}

function collect(value, previousValue) {
  if (typeof value !== "string") return previousValue;
  const values = value.split(",");
  return previousValue ? previousValue.concat(values) : values;
}
```