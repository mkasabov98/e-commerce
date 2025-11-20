const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  {
    // Apply Node + CommonJS to ALL JS files
    files: ["**/*.js", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",   // Forces CommonJS
      globals: {
        ...globals.node,
      },
    },
    rules: {},
  },

  // Recommended JS rules
  {
    files: ["**/*.{js,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },

  // TypeScript rules (optional)
  ...tseslint.configs.recommended,
]);