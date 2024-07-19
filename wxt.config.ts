import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: "SP Editor",
    description: "Create and update SharePoint Online/SP2013/SP2016/SP2019 css/js files, inject files to web, manage web/list properties, list Webhook", 
    permissions: ["activeTab", "scripting"],
    host_permissions: ["<all_urls>"],
    icons: {
      16: "icons/icon16.png",
      32: "icons/icon32.png",
      48: "icons/icon48.png",
      96: "icons/icon96.png",
      128: "icons/icon128.png"      
    },
    web_accessible_resources: [
      {
        resources: [
          "bundles/system.js",
          "bundles/graph.es5.umd.bundle.js",
          "bundles/logging.es5.umd.bundle.js",
          "bundles/sp.es5.umd.bundle.js",
          "bundles/sp-admin.es5.umd.bundle.js",
          "bundles/queryable.es5.umd.bundle.js",
          "bundles/core.es5.umd.bundle.js",
          "bundles/msaljsclient.es5.umd.bundle.js",
          "bundles/sp-scriptlinks.sppkg",
          "bundles/graph-sdk.es5.umd.bundle.js",
          "bundles/msal.js",
          "bundles/msal-browser.js",
          "index.html"
        ],
        matches: [
          "<all_urls>"
        ]
      }
    ],
  }
});
