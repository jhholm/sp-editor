import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { AuthenticationResult, Configuration, EventType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

import store from '../../src/store';
import App from '../../src/App';

export const msalConfig: Configuration = {
  auth: {
    clientId: '20d34c96-396e-4bf0-a008-472ef10a5099',
    authority: 'https://login.microsoftonline.com/common/',
    //  redirectUri: "chrome-extension://nfabmlfkakpniaccknblmcihigllfnne/index.html",
  },
  cache: {
    cacheLocation: 'sessionStorage', // This configures where your cache will be stored
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
    allowRedirectInIframe: true,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    const payload = event.payload as AuthenticationResult;
    msalInstance.setActiveAccount(payload.account);
  }
});

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </Provider>
  );
}
