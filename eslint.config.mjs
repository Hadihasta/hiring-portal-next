// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ✅ Keep base Next.js + TS rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Custom overrides
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**",   // prisma / wasm
      "src/generated/client/**",
      "src/**/*.wasm.js",   // wasm build files
      "**/*.min.js",        // minified vendor code
      "**/vendor/**",       // vendor bundles
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
];

export default eslintConfig;
