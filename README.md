This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Core module

- zustand
- tailwind
- lingui

### UI library

- radix
- shadcn/ui
- React DnD

## Getting Started

First, run the development server:

- with node v22.15.1 (npm v10.9.2)

```bash
npm i
npm run dev
```

## i18n/lingui

```bash
npm run build-lang
```

# Component Folder Structure Guidelines

To maintain a clear and consistent structure for components in the project, follow these rules:

1. **Shadcn UI Components**  
   Components imported from Shadcn UI must be placed under `@/components/ui/` as `.tsx` files with **lowercase file names**.  
   Example: `@/components/ui/button.tsx`

2. **Custom Shared Components**  
   Custom reusable components must be placed under `@/components/` inside **uppercase-named folders**, and the main component file must be named `index.tsx`.  
   Example: `@/components/Alert/index.tsx`

3. **Page-Specific Components**  
   Components that are not yet confirmed for reuse can be placed under the corresponding folder for your page in `@/app/`.  
   Example: `@/app/list/_components/Form/index.tsx`

4. **Legacy Components**  
   Any components not adhering to the above structure are considered legacy components (handled by Sail but not yet reorganized).

By following these rules, we aim to maintain better code organization and improve overall maintainability.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
