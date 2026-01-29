import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import promise from "eslint-plugin-promise";

export default [
    {
        ignores: [".next/*", "node_modules/*", "out/*", "build/*", "dist/*"]
    },
    js.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: "./tsconfig.json",
                sourceType: "module",
                ecmaFeatures: { jsx: true }
            },
            globals: {
                React: "readonly",
                process: "readonly",
                window: "readonly",
                document: "readonly",
                console: "readonly",
            }
        },
        plugins: {
            "@typescript-eslint": tseslint,
            react,
            promise,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...tseslint.configs["recommended-requiring-type-checking"].rules,
            ...react.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": 2,
            "@typescript-eslint/explicit-function-return-type": 0,
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_" }
            ],
            "no-case-declarations": 0,
            "react/prop-types": 0,
            "promise/always-return": 0,
            "promise/catch-or-return": 2,
            "promise/no-return-wrap": 2,
            "react/react-in-jsx-scope": 0,
            "react/jsx-uses-react": 0
        },
        settings: {
            react: {
                pragma: "React",
                version: "detect"
            }
        }
    }
];