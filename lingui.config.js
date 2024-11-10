module.exports = {
  locales: ['en', 'zh-TW'],
  sourceLocale: 'zh-TW',
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src'],
      exclude: ['**/node_modules/**'],
    },
  ],
  format: 'po',
  orderBy: 'origin',
  compileNamespace: 'ts',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
};
