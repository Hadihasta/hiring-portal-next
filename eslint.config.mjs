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
  // Base Next.js + TypeScript configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**", // ignore auto-generated prisma/wasm code
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // disable unused var warnings
      "@typescript-eslint/no-unused-expressions": "off", // disable unused expression warnings
      "@typescript-eslint/no-explicit-any": "off", // disable "Unexpected any"
      "@typescript-eslint/no-empty-object-type": "off", // disable "{} type" warnings
    },
  },
];

export default eslintConfig;
