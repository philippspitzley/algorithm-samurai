// CLI COMMAND TO GENERATE THIS FILE
// npx shiki-codegen \
//   --langs typescript,javascript \
//   --themes catppuccin-mocha,catppuccin-latte \
//   --engine javascript \
//   ./shiki.bundle.ts

/* Generate by @shikijs/codegen */
import { createdBundledHighlighter, createSingletonShorthands } from "@shikijs/core"
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript"
import type {
  DynamicImportLanguageRegistration,
  DynamicImportThemeRegistration,
  HighlighterGeneric,
} from "@shikijs/types"

type BundledLanguage = "typescript" | "ts" | "javascript" | "js"
type BundledTheme = "catppuccin-mocha" | "catppuccin-latte"
type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

const bundledLanguages = {
  typescript: () => import("@shikijs/langs/typescript"),
  ts: () => import("@shikijs/langs/typescript"),
  javascript: () => import("@shikijs/langs/javascript"),
  js: () => import("@shikijs/langs/javascript"),
} as Record<BundledLanguage, DynamicImportLanguageRegistration>

const bundledThemes = {
  "catppuccin-mocha": () => import("@shikijs/themes/catppuccin-mocha"),
  "catppuccin-latte": () => import("@shikijs/themes/catppuccin-latte"),
} as Record<BundledTheme, DynamicImportThemeRegistration>

const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<BundledLanguage, BundledTheme>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRegexEngine(),
})

const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands<BundledLanguage, BundledTheme>(createHighlighter)

export {
  bundledLanguages,
  bundledThemes,
  codeToHast,
  codeToHtml,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  createHighlighter,
  getLastGrammarState,
  getSingletonHighlighter,
}
export type { BundledLanguage, BundledTheme, Highlighter }
