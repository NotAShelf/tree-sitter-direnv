# tree-sitter-direnv

This is an experimntal Tree-sitter grammar for [direnv](https://direnv.net/)
files (`.envrc`). The goal is to provides syntax highlighting and parsing for
direnv files, including:

- Direnv-specific functions (`has`, `use`, `layout`, etc.)
- Path manipulation functions (`PATH_add`, `source_env`, etc.)
- Shell scripting constructs
- Variable expansions and command substitutions
- Comments and strings

## Installation

> [!WARNING]
> tree-sitter-direnv is alpha quality software. While it _may_ work, the chances
> are you will run into bugs. Testing is welcome and appreciated, but please
> expect bugs.

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

Available under the [MPL2 v2.0](/LICENSE). Please see the license file for more
details.
