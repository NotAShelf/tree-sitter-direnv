{
  "targets": [
    {
      "target_name": "tree_sitter_direnv_binding",
      "include_dirs": [
        "<!(node -e \"console.log(require('node-addon-api').include)\")",
        "src"
      ],
      "sources": [
        "bindings/node/binding.cc",
        "src/parser.c"
      ],
      "conditions": [
        ["OS!='win'", {
          "cflags_c": [
            "-std=c99"
          ]
        }]
      ],
      "defines": [
        "NAPI_VERSION=6"
      ]
    }
  ]
}
