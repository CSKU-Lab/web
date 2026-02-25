import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/hooks/use-composed-ref.ts",
    "src/hooks/use-unmount.ts",
    "src/components/ui/message-input.tsx",
    "src/components/ui/chat.tsx",
    "src/components/tiptap-ui-primitive/tooltip/tooltip.tsx",
  ]),
]);

export default eslintConfig;
