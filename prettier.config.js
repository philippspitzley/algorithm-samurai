// @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: false,
  trailingComma: "all",
  plugins: [
    // "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: [
    "^react$", // React imports first
    "",
    "^@?\\w", // Third-party libraries (e.g., tailwindcss, vite)
    "",
    "^path$", // Node.js core modules
    "",
    "^@/(.*)$", // Aliased imports (e.g., "@/components")
    "",
    "^[./]", // Relative imports
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
  importOrderCaseSensitive: false,
}

export default config
