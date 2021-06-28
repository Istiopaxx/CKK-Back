module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "warn",
      2
    ],
    "semi": [
      "error",
      "always"
    ],
    "no-unused-vars": 0,
    "no-use-before-define": 1,
  }
};
