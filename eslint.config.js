import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // eslint-plugin-react-hooks v7's recommended preset ships two experimental
      // React Compiler rules that false-positive on valid, shipped patterns here:
      //   - react-hooks/refs fires on passing a ref object / framer-motion
      //     MotionValues as props (the useTilt 3D-tilt cards), which is not a
      //     render-time ref read.
      //   - react-hooks/set-state-in-effect fires on legitimate client-only
      //     deferral (BootLoader) and reset-on-dep-change (CommandPalette).
      // The classic, valuable rules (rules-of-hooks, exhaustive-deps) stay on.
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
