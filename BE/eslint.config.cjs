const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
    {
        files: ["**/*.js", "**/*.cjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: {
                ...globals.node,
            },
        },
        rules: {},
    },

    {
        files: ["**/*.{js,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
    },
    ...tseslint.configs.recommended,
]);
