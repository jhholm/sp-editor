import { useEffect, useState } from 'react';
import { Label, Pivot, PivotItem } from '@fluentui/react';

import './popup.css';
import { initializeIcons } from '@fluentui/react';
import Actions from './Components/Actions';
import ContextInfoPropertiesList, { ICtxInfoProperty } from './Components/ContextInfoPropertiesList';
import QuickLinkList from './Components/QuickLinkList';
import LoadTeamsDebug from './Components/LoadTeamsDebug';

initializeIcons();

async function getTenantSettings(ctx: any) {
  const tenantSettings = await fetch(ctx.webAbsoluteUrl + '/_api/SP_TenantSettings_Current', {
    headers: {
      Accept: 'application/json;odata=nometadata',
      'Content-Type': 'application/json',
      'X-ClientService-ClientTag': 'SPEDITOR',
    },
  })
    .then((response) => response.json());
    return tenantSettings;
}

async function getPlo(ctx: any) {
  const plo = await fetch(
    ctx.webAbsoluteUrl +
      "/_api/web/getFileByServerRelativeUrl('" +
      ctx.serverRequestPath +
      "')/listItemAllFields?$select=PageLayoutType,PromotedState,Id",
    {
      method: 'get',
      headers: {
        Accept: 'application/json;odata=nometadata',
        'Content-Type': 'application/json',
        'X-ClientService-ClientTag': 'SPEDITOR',
      },
    }
  ).then((response) => response.json());
  return plo;
}

interface NoContextProps {
  message: string;
}

const NoContext: React.FC<NoContextProps> = ({ message }) => {
  return (
    <Label style={{ marginTop: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{message}</Label>
  );
};

const SPMessage = 'Please browse to SharePoint site';
const TeamsMessage = 'Please browse to Teams';

const PopUp = () => {
  const [tabId, setTabId] = useState<number>();
  const [tabUrl, setTabUrl] = useState<string>('');
  const [ctx, setCtx] = useState<any>(null);
  const [properties, setProperties] = useState<ICtxInfoProperty[]>([]);
  const [appCatalogUrl, setAppCatalogUrl] = useState<string>('');
  const [plo, setPlo] = useState<any>(null);
  const [isTeams, setIsTeams] = useState<any>(null);

  function checkTeamsContext() {
    let tabFrame = document.querySelector("iframe[name='embedded-page-container']") as HTMLIFrameElement | null;
    if (tabFrame) {
      return true;
    } else {
      return false;
    }
  }

  // load initial data
  useEffect(() => {
    browser.tabs.query({ currentWindow: true, active: true }, (tabs: any) => {
      setTabId(tabs[0].id);
      setTabUrl(tabs[0].url);
      browser.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          world: 'MAIN',
          func: () => {
            const cleanSPPageContextInfo = (_spPageContextInfo: any) => {
              //Remove non-clonable objects, this could be done dynamically but for now just hardcoding known ones
              const { tokenProvider, dataSyncClient, ...clonableSPPageContextInfo } = _spPageContextInfo;
              return clonableSPPageContextInfo;
            }
            return (
              cleanSPPageContextInfo((window as any)._spPageContextInfo) ||
              ((window as any).moduleLoaderPromise
                ? (window as any).moduleLoaderPromise.then((e: any) => {
                    (window as any)._spPageContextInfo = e.context._pageContext._legacyPageContext;
                    return cleanSPPageContextInfo((window as any)._spPageContextInfo);
                  })
                : null)
            );
          },
        })
        .then((injectionResults) => {
          if (injectionResults[0].result) {
            var ctx = injectionResults[0].result;
            setCtx(ctx);
            const props: ICtxInfoProperty[] = Object.entries(injectionResults[0].result)
              .map((entry) => {
                const key = entry[0];
                const rawValue = entry[1] === undefined ? 'undefined' : entry[1];
                const value = JSON.stringify(rawValue).replace(/^"|"$/g, '');
                return { property: key, value: value };
              })
              .sort((a, b) => a.property.localeCompare(b.property));

            setProperties(props);
            browser.scripting.executeScript({
                target: { tabId: tabs[0].id },
                world: 'MAIN',
                func: getTenantSettings,
                args: [ctx]
              }).then((r) => {
                if (r[0].result) {
                  setAppCatalogUrl(r[0].result.CorporateCatalogUrl);
                }
              });

            if (ctx.webAbsoluteUrl && ctx.serverRequestPath && ctx.pageListId && ctx.pageItemId > -1) {
              browser.scripting.executeScript({
                  target: { tabId: tabs[0].id },
                  world: 'MAIN',
                  func: getPlo,
                  args: [ctx]
                }).then((r) => {
                  if (r[0].result) {
                    setPlo(r[0].result);
                  }
                });
            }
          }
        });
      browser.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          world: 'MAIN',
          args: [],
          func: checkTeamsContext,
        })
        .then((injectionResults) => {
          if (injectionResults[0].result) {
            setIsTeams(injectionResults[0].result);
          }
        });
    });
  }, []);

  return (
    <Pivot style={{ width: '400px' }}>
      <PivotItem headerText="Quick links">
        {ctx ? (
          <QuickLinkList ctx={ctx} appCatalogUrl={appCatalogUrl} tabUrl={tabUrl} />
        ) : (
          <NoContext message={SPMessage} />
        )}
      </PivotItem>
      <PivotItem headerText="_spPageContextInfo">
        {ctx ? <ContextInfoPropertiesList properties={properties} /> : <NoContext message={SPMessage} />}
      </PivotItem>
      <PivotItem headerText="Actions">
        {plo && tabId ? <Actions ctx={ctx} plo={plo} tabId={tabId} /> : <NoContext message={SPMessage} />}
      </PivotItem>
      <PivotItem headerText="Teams">
        {isTeams && tabId ? <LoadTeamsDebug tabId={tabId} /> : <NoContext message={TeamsMessage} />}
      </PivotItem>
    </Pivot>
  );
};

export default PopUp;
