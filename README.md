# no-evil-eol-newline

[![APM](https://img.shields.io/apm/v/no-evil-eol-newline) ![APM](https://img.shields.io/apm/dm/no-evil-eol-newline?color=e67aa1) ![APM](https://img.shields.io/apm/l/no-evil-eol-newline) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/b1f6c1c4/no-evil-eol-newline)](https://atom.io/packages/no-evil-eol-newline)

> Hide the last 'new line', just like Vim and GitHub.

[:arrow_right: Link to the package on APM on atom.io :arrow_left:](https://atom.io/packages/no-evil-eol-newline)

![Screenshot](screenshot.png)

# Precondition

This package is meant for:

- Vim enthusiastics - mostly previous vim users;
- Unix fundamentalists - who think `\n` marks the termination of one single line, instead of acting as the separator between two lines.

You SHOULD NOT use this package if you think:

- (Either) `\n` at the end of a file is totally heresy;
- (Or) a new line MUST be displayed magnificently to indicate your fidelity of appending `\n` to each file you write.

# Introduction

Suppress display of end-of-file newlines as blank lines.
A temporal fix for [Atom issue 7787](https://github.com/atom/atom/issues/7787).
More precisely,
- If a file ends with a `\n`, then the line number of the 'new line' is hidden (by css), just like what vim does.
- If a file doesn't end with a `\n`, then the line number is shown in a bright color, indicating a missing `\n`.
- Files that use `\r\n` as EOL simply work perfectly.

**Attention:**
This package only deals with how things **appear**: it **never** modify any bit of your file content. Thus, this package:
  - Is compatible with `whitespace`, `editorconfig`, `vim-mode-plus`, and other packages.
  - Works consistently on Linux, macOS, and Windows.
