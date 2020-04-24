# no-evil-eol-newline

> Hide the last 'new line', just like vim does.

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
  - Is compatible with `whitespace`, `editorconfig`, and other packages.
  - Works consistently on Linux, macOS, and Windows.

# Contributing

Feel free to *write another package from scratch and replace this patch* because this is so poorly-written that really needs rewriting.
