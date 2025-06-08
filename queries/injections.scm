; Inject bash/shell syntax for regular commands
((simple_command) @injection.content
 (#set! injection.language "bash"))

; Inject bash syntax in command substitution
((command_substitution) @injection.content
 (#set! injection.language "bash"))

; Inject bash syntax in arithmetic expansion
((arithmetic_expansion) @injection.content
 (#set! injection.language "bash"))
