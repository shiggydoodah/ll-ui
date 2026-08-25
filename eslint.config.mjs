import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

const noTailwindVarLonghand = {
  selector: 'Literal[value=/\\[var\\(--/]',
  message:
    'Use Tailwind v4 CSS variable shorthand: bg-(--ui-background) not bg-[var(--ui-background)].',
};

// A form field with no id/name is unidentifiable to the browser: it reports the
// field under DevTools > Issues and skips it for autofill. Controls inside
// `<FieldControl>` are exempt — `Field` injects the id there — and so is
// anything taking a prop spread, whose source supplies it (e.g. the id
// `useFileUpload`'s `getInputProps` returns).
//
// `name.name` matches plain tags (`<Input>`); `name.property.name` matches
// namespaced ones (`<Command.Input>`, which renders a real `<input>`).
const FORM_CONTROL_TAGS = 'input|select|textarea|Input|Select|Textarea|Checkbox|Radio|MetricInput';
const NEEDS_ID_MESSAGE =
  'Give this form control an `id` (or wrap it in `<FieldControl>` inside a `Field` to have one injected). Without an id or name the browser cannot autofill it.';
const withoutIdOutsideField = (nameMatcher) =>
  `JSXOpeningElement[${nameMatcher}=/^(${FORM_CONTROL_TAGS})$/]:not(:has(JSXAttribute[name.name="id"])):not(:has(JSXSpreadAttribute)):not(JSXElement[openingElement.name.name="FieldControl"] JSXOpeningElement)`;

const formControlNeedsId = {
  selector: withoutIdOutsideField('name.name'),
  message: NEEDS_ID_MESSAGE,
};

const namespacedFormControlNeedsId = {
  selector: withoutIdOutsideField('name.property.name'),
  message: NEEDS_ID_MESSAGE,
};

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/routeTree.gen.ts',
      // generated types stub (see .gitignore) — not part of any tsconfig project
      'packages/ui/index.d.ts',
      '**/*.js',
      '**/*.cjs',
      // config files carry no logic; the scripts/*.mjs files do and ARE linted below
      'eslint.config.mjs',
    ],
  },

  // Node scripts (.mjs) — verify/build scripts are real logic, so they get the
  // core correctness rules. No TS parser: they are plain ESM run by node.
  {
    files: ['packages/ui/scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        TextDecoder: 'readonly',
        TextEncoder: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  },

  // TypeScript base — all .ts / .mts / .tsx files.
  {
    files: ['**/*.{ts,mts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'no-restricted-imports': [
        'error',
        {
          patterns: ['react/dist/**', '**/dist/**', '**/build/**'],
        },
      ],
    },
  },

  // React — lab app and UI package
  {
    files: ['apps/ui-lab/**/*.{ts,mts,tsx}', 'packages/ui/**/*.{ts,mts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: '19' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-restricted-syntax': [
        'error',
        noTailwindVarLonghand,
        formControlNeedsId,
        namespacedFormControlNeedsId,
      ],
    },
  },

  // Specs render bare primitives to assert the primitive's own behaviour, so the
  // rendered-page id requirement doesn't apply to them.
  {
    files: ['apps/ui-lab/**/*.test.{ts,mts,tsx}', 'packages/ui/**/*.test.{ts,mts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', noTailwindVarLonghand],
    },
  },

  // Enforce const arrow functions in JSX files
  {
    files: ['apps/ui-lab/**/*.tsx', 'packages/ui/**/*.tsx'],
    rules: {
      'func-style': ['error', 'expression'],
    },
  },

  // Prettier — must be last
  prettierConfig,
];
