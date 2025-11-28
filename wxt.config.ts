import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'SP Editor',
    description:
      'Create and update SharePoint Online/SP2013/SP2016/SP2019 css/js files, inject files to web, manage web/list properties, list Webhook',
    permissions: ['activeTab', 'scripting', 'downloads'],
    icons: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      96: 'icons/icon96.png',
      128: 'icons/icon128.png',
    },
  },
});
