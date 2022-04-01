module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["jsdoc", "prefer-arrow", "unicorn", "import", "react", "@typescript-eslint"],
    rules: {
        "react/prop-types": "off",
    },
};
