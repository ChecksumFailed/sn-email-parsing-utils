import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import regexp from "eslint-plugin-regexp";
import jsdoc from "eslint-plugin-jsdoc";
import security from "eslint-plugin-security";
import unusedImports from "eslint-plugin-unused-imports";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
});

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    sonarjs.configs.recommended,
    regexp.configs["flat/recommended"],
    jsdoc.configs["flat/recommended"],
    security.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
                gs: "readonly", // ServiceNow global
                global: "readonly", // ServiceNow global
            },
        },
        plugins: {
            "unused-imports": unusedImports,
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                { "vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_" }
            ],
            "eqeqeq": ["error", "always"],
            "curly": ["error", "all"],
            "no-console": "warn",
            "prefer-const": "error",
            "no-var": "error",
            "arrow-body-style": ["error", "as-needed"],
            "object-shorthand": ["error", "always"],

            "jsdoc/require-jsdoc": ["warn", {
                "publicOnly": true,
                "require": {
                    "FunctionDeclaration": true,
                    "MethodDefinition": true,
                    "ClassDeclaration": true,
                    "ArrowFunctionExpression": true,
                    "FunctionExpression": true
                }
            }],
            "jsdoc/require-param-type": "off",
            "jsdoc/require-returns-type": "off",
            "jsdoc/check-tag-names": ["warn", { "definedTags": ["servicenow"] }],

            "sonarjs/cognitive-complexity": ["error", 15],
            "sonarjs/no-duplicate-string": "warn",

            "regexp/no-unused-capturing-group": "error",
            "regexp/prefer-named-capture-group": "warn",

            "@servicenow/sdk-app-plugin/file-extension-in-import": "off",
            "@servicenow/sdk-app-plugin/no-regexp-lookbehind-assertions": "off",
            "@servicenow/sdk-app-plugin/no-async-functions": "off", // Usually broken too
            "@servicenow/sdk-app-plugin/no-promise": "off", // Usually broken too
            "@servicenow/sdk-app-plugin/no-dynamic-import": "off", // Usually broken too

            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "selector": "default",
                    "format": ["camelCase"]
                },
                {
                    "selector": "variable",
                    "format": ["camelCase", "UPPER_CASE"]
                },
                {
                    "selector": "typeLike",
                    "format": ["PascalCase"]
                },
                {
                    "selector": "class",
                    "format": ["PascalCase"]
                },
                {
                    "selector": "interface",
                    "format": ["PascalCase"],
                    "prefix": ["I"]
                },
                {
                    "selector": "parameter",
                    "format": ["camelCase"],
                    "leadingUnderscore": "allow"
                }
            ]
        }
    },
    {
        // Ignore files from .gitignore (handled automatically by default, but let's be explicit if needed)
        ignores: ["dist/", "node_modules/", ".now/", "src/fluent/"]
    }
);
