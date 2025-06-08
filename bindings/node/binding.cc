#include <napi.h>

typedef struct TSLanguage TSLanguage;

extern "C" TSLanguage *tree_sitter_direnv();

namespace {

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["name"] = Napi::String::New(env, "direnv");
  auto language = Napi::External<TSLanguage>::New(env, tree_sitter_direnv());
  exports["language"] = language;
  return exports;
}

} // namespace

NODE_API_MODULE(tree_sitter_direnv_binding, Init)
