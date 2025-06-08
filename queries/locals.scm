; Variable definitions
(variable_assignment
  name: (variable_name) @local.definition.var)

(for_statement
  (variable_name) @local.definition.var)

; Function definitions
(function_definition
  (word) @local.definition.function)

; Variable references
(variable_expansion
  (variable_name) @local.reference)

; Scopes
[
  (function_definition)
  (compound_statement)
  (subshell)
  (if_statement)
  (while_statement)
  (for_statement)
  (case_statement)
] @local.scope
