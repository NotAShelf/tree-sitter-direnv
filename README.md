# tree-sitter-direnv

[Direnv]: https://direnv.net

This is an experimental Tree-sitter grammar for [Direnv] files (`.envrc`). The
goal is to provides syntax highlighting and parsing for Direnv files, including:

- Direnv-specific functions (`has`, `use`, `layout`, etc.)
- Path manipulation functions (`PATH_add`, `source_env`, etc.)
- Shell scripting constructs
- Variable expansions and command substitutions
- Comments and strings

[my Neovim plugin for Direnv]: https://github.com/NotAShelf/direnv.nvim

_without_ using editor-specific syntax files, such as a `syntax.vim`. This
project was designed to be used alongside [my Neovim plugin for Direnv], but
should work fine with any editor that supports Tree-sitter directly. If you are
knowledgable in other editors, feel free to update the documentation for your
own editor below!

## Installation

> [!IMPORTANT]
> tree-sitter-direnv is alpha quality software. While it should work as
> intended, and is very unlikely to destroy anything you are almost guaranteed
> to run into bugs and general annoyances. Testing is welcome and appreciated,
> but please expect bugs and remember to report them accordingly!

### With tree-sitter CLI

```bash
git clone https://github.com/notashelf/tree-sitter-direnv.git
cd tree-sitter-direnv

# You will need the tree-sitter CLI installed.
tree-sitter build
```

## Usage

### With Neovim

Add the following to your Neovim configuration:

```lua
require('nvim-treesitter.configs').setup {
  ensure_installed = { "direnv" },
  highlight = {
    enable = true,
  },
}
```

### With Emacs

> [!NOTE]
> Emacs support is best effort. I use Neovim, and below configuration was
> inferred from online documentation.

```elisp
(add-to-list 'tree-sitter-major-mode-language-alist '(direnv-mode . direnv))
```

## Development

### Building

```bash
tree-sitter build
```

### Testing

```bash
tree-sitter test
```

### Generating the parser

```bash
tree-sitter generate
```

## License

This project is made available under Mozilla Public License (MPL) version 2.0.
See [LICENSE](LICENSE) for more details on the exact conditions. An online copy
is provided [here](https://www.mozilla.org/en-US/MPL/2.0/).
