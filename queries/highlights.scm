; Direnv-specific function names
[
  "has"
] @function.builtin

[
  "dotenv"
  "dotenv_if_exists"
  "env_vars_required"
  "fetchurl"
  "join_args"
  "user_rel_path"
  "on_git_branch"
  "find_up"
  "source_env"
  "source_env_if_exists"
  "source_up"
  "source_up_if_exists"
  "source_url"
  "load_prefix"
  "watch_file"
  "watch_dir"
  "semver_search"
  "strict_env"
  "unstrict_env"
] @function.builtin

[
  "expand_path"
] @function.builtin

[
  "PATH_add"
  "MANPATH_add"
  "PATH_rm"
  "path_rm"
  "path_add"
] @function.builtin

[
  "use"
  "use_flake"
  "use_guix"
  "use_julia"
  "use_nix"
  "use_node"
  "use_nodenv"
  "use_rbenv"
  "use_vim"
  "rvm"
] @function.builtin

[
  "layout"
  "layout_anaconda"
  "layout_go"
  "layout_julia"
  "layout_node"
  "layout_perl"
  "layout_php"
  "layout_pipenv"
  "layout_pyenv"
  "layout_python"
  "layout_python2"
  "layout_python3"
  "layout_ruby"
] @function.builtin

[
  "direnv_apply_dump"
  "direnv_layout_dir"
  "direnv_load"
  "direnv_version"
  "log_error"
  "log_status"
] @function.builtin

; Language names for layout functions
(direnv_layout_language) @constant

; Commands and paths
(direnv_command) @string.special
(direnv_path) @string.special.path
(direnv_var) @variable

; Regular shell highlighting
(comment) @comment
(string) @string
(raw_string) @string
(number) @number
(variable_name) @variable
(variable_expansion) @variable
(command_substitution) @function.call

; Keywords
[
  "if"
  "then"
  "else"
  "elif"
  "fi"
  "case"
  "in"
  "esac"
  "for"
  "do"
  "done"
  "while"
  "function"
] @keyword

[
  "export"
  "declare"
  "local"
  "readonly"
  "unset"
] @keyword.storage

; Operators
[
  "="
  "+="
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "&&"
  "||"
  "|"
  "&"
  ";"
] @operator

; Punctuation
[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

"$" @punctuation.special
"#" @punctuation.special
"*" @punctuation.special
