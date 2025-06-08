const PREC = {
  COMMENT: -10,
  ASSIGN: -1,
  PIPE: 2,
  LIST: 1,
  OR: 1,
  AND: 2,
  EQUALITY: 3,
  RELATIONAL: 4,
  BITWISE_OR: 5,
  BITWISE_XOR: 6,
  BITWISE_AND: 7,
  SHIFT: 8,
  ADD: 9,
  MULT: 10,
  UNARY: 11,
  POSTFIX: 12,
};

module.exports = grammar({
  name: 'direnv',

  extras: $ => [
    $.comment,
    /\s/
  ],

  supertypes: $ => [
    $.statement,
    $.expression,
    $.primary_expression,
    $.command_name,
    $.literal
  ],

  conflicts: $ => [
    [$.primary_expression, $.array],
    [$.variable_assignment, $.expression],
    [$.variable_name, $.word],
  ],



  word: $ => $.word,

  rules: {
    program: $ => repeat1(choice(
      $.statement,
      $.comment
    )),

    // Statements
    statement: $ => choice(
      prec(3, $.variable_assignment),
      prec(2, $.direnv_command_func),
      prec(2, $.direnv_use_func),
      prec(2, $.direnv_path_func),
      prec(2, $.direnv_expand_path_func),
      prec(2, $.direnv_path_add_func),
      prec(2, $.direnv_layout_func),
      prec(2, $.direnv_func),
      prec(1, $.command),
      prec(1, $.pipeline),
      prec(1, $.list),
      prec(1, $.if_statement),
      prec(1, $.while_statement),
      prec(1, $.for_statement),
      prec(1, $.case_statement),
      prec(1, $.function_definition),
      prec(1, $.compound_statement),
      prec(1, $.declaration_command),
      prec(1, $.unset_command),
      prec(1, $.test_command),
      prec(1, $.negated_command),
      prec(1, $.redirected_statement)
    ),

    // Variable assignment
    variable_assignment: $ => prec.dynamic(10, prec.right(choice(
      seq(
        field('name', alias($.word, $.variable_name)),
        '=',
        field('value', optional(choice($.expression, $.array)))
      ),
      seq(
        field('name', alias($.word, $.variable_name)),
        '+=',
        field('value', choice($.expression, $.array))
      )
    ))),

    // Direnv-specific functions
    command: $ => choice(
      $.simple_command
    ),

    // Command functions (has)
    direnv_command_func: $ => seq(
      'has',
      $.direnv_command
    ),
    direnv_command: $ => choice(
      $.word,
      $.string,
      $.raw_string
    ),

    // Path functions
    direnv_path_func: $ => prec.left(seq(
      choice(
        'dotenv',
        'dotenv_if_exists',
        'env_vars_required',
        'fetchurl',
        'join_args',
        'user_rel_path',
        'on_git_branch',
        'find_up',
        'source_env',
        'source_env_if_exists',
        'source_up',
        'source_up_if_exists',
        'source_url',
        'load_prefix',
        'watch_file',
        'watch_dir',
        'semver_search',
        'strict_env',
        'unstrict_env'
      ),
      repeat($.direnv_path)
    )),
    direnv_path: $ => choice(
      $.word,
      $.string,
      $.raw_string,
      $.variable_expansion,
      $.command_substitution
    ),

    // Expand path function
    direnv_expand_path_func: $ => prec.left(seq(
      'expand_path',
      $.direnv_path,
      optional($.direnv_path)
    )),

    // Path add functions
    direnv_path_add_func: $ => prec.left(seq(
      choice(
        'PATH_add',
        'MANPATH_add',
        'PATH_rm',
        'path_rm',
        'path_add'
      ),
      $.direnv_var,
      repeat($.direnv_path)
    )),
    direnv_var: $ => choice(
      $.word,
      $.string,
      $.variable_expansion
    ),

    // Use functions
    direnv_use_func: $ => prec.left(seq(
      choice(
        'use',
        'use_flake',
        'use_guix',
        'use_julia',
        'use_nix',
        'use_node',
        'use_nodenv',
        'use_rbenv',
        'use_vim',
        'rvm'
      ),
      repeat1($.direnv_use_command)
    )),
    direnv_use_command: $ => choice(
      $.word,
      $.string,
      $.raw_string,
      $.variable_expansion,
      $.command_substitution
    ),

    // Layout functions
    direnv_layout_func: $ => prec.left(seq(
      choice(
        'layout',
        'layout_anaconda',
        'layout_go',
        'layout_julia',
        'layout_node',
        'layout_perl',
        'layout_php',
        'layout_pipenv',
        'layout_pyenv',
        'layout_python',
        'layout_python2',
        'layout_python3',
        'layout_ruby'
      ),
      choice(
        $.direnv_layout_language,
        $.direnv_layout_language_path
      ),
      repeat($.direnv_path)
    )),
    direnv_layout_language: $ => choice(
      'go',
      'node',
      'perl',
      'python3',
      'ruby'
    ),
    direnv_layout_language_path: $ => prec.left(seq(
      'python',
      repeat($.direnv_path)
    )),

    // Other direnv functions
    direnv_func: $ => prec.left(seq(
      choice(
        'direnv_apply_dump',
        'direnv_layout_dir',
        'direnv_load',
        'direnv_version',
        'log_error',
        'log_status'
      ),
      repeat(choice(
        $.word,
        $.string,
        $.raw_string,
        $.variable_expansion,
        $.command_substitution
      ))
    )),

    // Regular shell commands
    simple_command: $ => prec.left(seq(
      $.command_name,
      repeat(choice(
        $.word,
        $.string,
        $.raw_string,
        $.variable_expansion,
        $.command_substitution,
        $.process_substitution,
        $.file_redirect,
        $.heredoc_redirect,
        $.herestring_redirect
      ))
    )),
    command_name: $ => choice(
      $.word,
      $.string,
      $.variable_expansion,
      $.command_substitution
    ),

    // Expressions and literals
    expression: $ => choice(
      $.primary_expression,
      $.unary_expression,
      $.binary_expression,
      $.ternary_expression,
      $.assignment_expression,
      $.update_expression,
      $.parenthesized_expression,
      $.array
    ),
    primary_expression: $ => choice(
      $.word,
      $.string,
      $.raw_string,
      $.ansii_c_string,
      $.number,
      $.variable_expansion,
      $.command_substitution,
      $.process_substitution,
      $.concatenation
    ),
    literal: $ => choice(
      $.word,
      $.string,
      $.raw_string,
      $.ansii_c_string,
      $.number
    ),

    // Strings
    string: $ => seq(
      '"',
      repeat(choice(
        token.immediate(prec(1, /[^"$`\\]+/)),
        $.escape_sequence,
        $.variable_expansion,
        $.command_substitution,
        $.arithmetic_expansion
      )),
      '"'
    ),
    raw_string: $ => seq(
      "'",
      repeat(token.immediate(/[^']+/)),
      "'"
    ),
    ansii_c_string: $ => seq(
      "$'",
      repeat(choice(
        token.immediate(prec(1, /[^'\\]+/)),
        $.escape_sequence
      )),
      "'"
    ),
    escape_sequence: $ => token.immediate(seq(
      '\\',
      choice(
        /[^xu0-7]/,
        /[0-7]{1,3}/,
        /x[0-9a-fA-F]{1,2}/,
        /u[0-9a-fA-F]{4}/,
        /U[0-9a-fA-F]{8}/
      )
    )),

    // Numbers
    number: $ => /\d+/,

    // Words and identifiers
    word: $ => token(prec(1, repeat1(choice(
      noneOf(' \t\r\n"\'\\$`|&;<>(){}[]=#'),
      seq('\\', /./),
    )))),

    // Variable name pattern; only used in specific contexts
    variable_name: $ => token(prec(0, /[a-zA-Z_][a-zA-Z0-9_]*/)),

    // Variable expansions
    variable_expansion: $ => choice(
      seq('$', $.variable_name),
      seq('$', '{', optional('#'), $.variable_name, optional(choice(
        seq(':', choice('-', '=', '?', '+')),
        seq(':', /[0-9]+/, optional(seq(':', /[0-9]+/))),
        seq(choice('#', '##', '%', '%%'), $.word),
        seq('/', choice($.word, /[^\/]+/), '/', optional(choice($.word, 'g')))
      )), '}')
    ),

    // Command substitution
    command_substitution: $ => choice(
      seq('$(', $.program, ')'),
      seq('`', repeat(choice(
        token.immediate(/[^`\\]+/),
        $.escape_sequence
      )), '`')
    ),

    // Process substitution
    process_substitution: $ => seq(
      choice('<(', '>('),
      $.program,
      ')'
    ),

    // Arithmetic expansion
    arithmetic_expansion: $ => seq(
      choice('$((', '$['),
      $.arithmetic_expression,
      choice('))', ']')
    ),
    arithmetic_expression: $ => choice(
      $.number,
      $.variable_name,
      $.binary_expression,
      $.unary_expression,
      $.parenthesized_expression
    ),

    // Arrays
    array: $ => prec(1, seq(
      '(',
      repeat(choice(
        $.word,
        $.string,
        $.raw_string,
        $.variable_expansion,
        $.command_substitution,
        $.arithmetic_expansion
      )),
      ')'
    )),

    // Concatenation
    concatenation: $ => prec(-1, seq(
      choice(
        $.word,
        $.string,
        $.variable_expansion,
        $.command_substitution,
        $.arithmetic_expansion
      ),
      repeat1(choice(
        $.word,
        $.string,
        $.variable_expansion,
        $.command_substitution,
        $.arithmetic_expansion
      ))
    )),

    // Control structures
    if_statement: $ => seq(
      'if',
      $.statement,
      'then',
      repeat($.statement),
      repeat(seq('elif', $.statement, 'then', repeat($.statement))),
      optional(seq('else', repeat($.statement))),
      'fi'
    ),
    while_statement: $ => seq(
      'while',
      $.statement,
      'do',
      repeat($.statement),
      'done'
    ),
    for_statement: $ => seq(
      'for',
      $.variable_name,
      optional(seq('in', repeat1($.word))),
      'do',
      repeat($.statement),
      'done'
    ),
    case_statement: $ => seq(
      'case',
      $.word,
      'in',
      repeat($.case_item),
      'esac'
    ),
    case_item: $ => seq(
      $.word,
      ')',
      repeat($.statement),
      choice(';;', ';&', ';;&')
    ),

    // Function definition
    function_definition: $ => prec(1, choice(
      seq('function', $.word, optional(seq('(', ')')), $.compound_statement),
      seq($.word, '(', ')', $.compound_statement)
    )),
    compound_statement: $ => prec.left(choice(
      seq('{', repeat($.statement), '}'),
      $.subshell,
      $.if_statement,
      $.while_statement,
      $.for_statement,
      $.case_statement
    )),
    subshell: $ => seq(
      '(',
      repeat($.statement),
      ')'
    ),

    // Pipeline and lists
    pipeline: $ => prec.left(PREC.PIPE, seq(
      $.statement,
      repeat1(seq(choice('|', '|&'), $.statement))
    )),
    list: $ => prec.left(PREC.LIST, seq(
      $.statement,
      repeat1(seq(choice('&&', '||', ';', '&'), $.statement))
    )),

    // Binary and unary expressions
    binary_expression: $ => choice(
      prec.left(PREC.OR, seq($.expression, '||', $.expression)),
      prec.left(PREC.AND, seq($.expression, '&&', $.expression)),
      prec.left(PREC.EQUALITY, seq($.expression, choice('==', '!='), $.expression)),
      prec.left(PREC.RELATIONAL, seq($.expression, choice('<', '>', '<=', '>='), $.expression)),
      prec.left(PREC.BITWISE_OR, seq($.expression, '|', $.expression)),
      prec.left(PREC.BITWISE_XOR, seq($.expression, '^', $.expression)),
      prec.left(PREC.BITWISE_AND, seq($.expression, '&', $.expression)),
      prec.left(PREC.SHIFT, seq($.expression, choice('<<', '>>'), $.expression)),
      prec.left(PREC.ADD, seq($.expression, choice('+', '-'), $.expression)),
      prec.left(PREC.MULT, seq($.expression, choice('*', '/', '%'), $.expression))
    ),
    unary_expression: $ => prec(PREC.UNARY, seq(
      choice('!', '++', '--', '+', '-', '~'),
      $.expression
    )),
    ternary_expression: $ => prec.right(seq(
      $.expression,
      '?',
      $.expression,
      ':',
      $.expression
    )),
    assignment_expression: $ => prec.right(PREC.ASSIGN, seq(
      $.expression,
      choice('=', '*=', '/=', '%=', '+=', '-=', '<<=', '>>=', '&=', '^=', '|='),
      $.expression
    )),
    update_expression: $ => prec.left(PREC.POSTFIX, choice(
      seq($.expression, choice('++', '--')),
      seq(choice('++', '--'), $.expression)
    )),
    parenthesized_expression: $ => seq(
      '(',
      $.expression,
      ')'
    ),

    // Other constructs
    declaration_command: $ => prec.left(seq(
      choice('declare', 'typeset', 'export', 'readonly', 'local'),
      repeat(choice(
        seq(optional('-'), $.word),
        $.variable_assignment
      ))
    )),
    unset_command: $ => prec.left(seq(
      'unset',
      repeat(choice('-f', '-v')),
      repeat1($.word)
    )),
    test_command: $ => choice(
      prec.left(seq('test', repeat($.word))),
      prec.left(seq('[', repeat($.word), ']')),
      prec.left(seq('[[', repeat($.word), ']]'))
    ),
    negated_command: $ => prec(3, seq('!', $.statement)),

    // Redirections
    redirected_statement: $ => prec(-1, seq(
      $.statement,
      repeat1(choice(
        $.file_redirect,
        $.heredoc_redirect,
        $.herestring_redirect
      ))
    )),
    file_redirect: $ => seq(
      optional(/[0-9]+/),
      choice('<', '>', '>>', '&>', '&>>', '<&', '>&', '>|'),
      choice($.word, $.variable_expansion, $.command_substitution)
    ),
    heredoc_redirect: $ => seq(
      optional(/[0-9]+/),
      choice('<<', '<<-'),
      $.heredoc_start
    ),
    heredoc_start: $ => $.word,
    herestring_redirect: $ => seq(
      optional(/[0-9]+/),
      '<<<',
      choice($.word, $.string, $.variable_expansion, $.command_substitution)
    ),

    // Comments
    comment: $ => token(prec(PREC.COMMENT, seq('#', /.*/))),
  }
});

function noneOf(chars) {
  const negatedChars = chars.split('').map(char => {
    if (char === ']') return '\\]';
    if (char === '\\') return '\\\\';
    if (char === '^') return '\\^';
    if (char === '-') return '\\-';
    if (char === '[') return '\\[';
    return char;
  }).join('');
  return new RegExp(`[^${negatedChars}]`);
}
