import { Dispatch } from 'redux'
import * as rootActions from '../../../store/home/actions'
import { HomeActions, MessageBarColors } from '../../../store/home/types'
import { shoot } from '../../spshooter/chrome/shoot'
import { QueryBuilderActions } from '../../../store/queryBuilder/types';
import * as actions from "../../../store/queryBuilder/actions";

export async function getLists(dispatch: Dispatch<QueryBuilderActions | HomeActions>, context: any) {
  dispatch(rootActions.setLoading(true));

  browser.scripting.executeScript({
    target: { tabId: browser.devtools.inspectedWindow.tabId },
    world: 'MAIN',
    args: [{
      path: `${context && context.siteAbsoluteUrl ? context.siteAbsoluteUrl : ''}/_api/web/lists?$select=Title,Id`,
      method: "GET",
      headers: JSON.stringify({
        "accept": "application/json"
      }),
      body: ""
    }, browser.runtime.getURL('')],
    func: shoot,
  }).then(injectionResults => {
    if (injectionResults[0].result) {
      const res = injectionResults[0].result
      if (res.success === false) {
        dispatch(rootActions.setAppMessage({
          showMessage: true,
          message: res.errorMessage,
          color: MessageBarColors.danger,
        }))
      }
      dispatch(actions.setLists(res.value))
      dispatch(rootActions.setLoading(false))
    }
  });
}

export async function selectQueryList(dispatch: Dispatch<QueryBuilderActions | HomeActions>, context: any, listId: string) {
  dispatch(rootActions.setLoading(true));
  dispatch(actions.setSelectedList(listId));

  browser.scripting.executeScript({
    target: { tabId: browser.devtools.inspectedWindow.tabId },
    world: 'MAIN',
    args: [{
      path: `${context && context.siteAbsoluteUrl ? context.siteAbsoluteUrl : ''}/_api/web/lists/getById(guid'${listId}')/fields?$select=InternalName,TypeAsString,Title,FieldTypeKind,LookupList,LookupField,Hidden,ReadOnlyField,IsDependentLookup`,
      method: "GET",
      headers: JSON.stringify({
        "accept": "application/json"
      }),
      body: ""
    }, browser.runtime.getURL('')],
    func: shoot,
  }).then(injectionResults => {
    if (injectionResults[0].result) {
      const res = injectionResults[0].result
      if (res.success === false) {
        dispatch(rootActions.setAppMessage({
          showMessage: true,
          message: res.errorMessage,
          color: MessageBarColors.danger,
        }))
      }
      dispatch(actions.setListFields(res.value))
      dispatch(rootActions.setLoading(false))
    }
  });
}

export async function getContextInfo(dispatch: Dispatch<QueryBuilderActions | HomeActions>) {

  dispatch(rootActions.setLoading(true));

  browser.scripting.executeScript({
    target: { tabId: browser.devtools.inspectedWindow.tabId },
    world: 'MAIN',
    func: () => {
      return (window as any)._spPageContextInfo || ((window as any).moduleLoaderPromise ? (window as any).moduleLoaderPromise.then((e: any) => {
        return (window as any)._spPageContextInfo = e.context._pageContext._legacyPageContext;
      }) : null);
    }
  }).then(injectionResults => {
    if (injectionResults[0].result) {
      const res = injectionResults[0].result
      dispatch(actions.setContext(res))
      dispatch(rootActions.setLoading(false))
    } else {
      dispatch(rootActions.setAppMessage({
        showMessage: true,
        message: 'Could not get context info!',
        color: MessageBarColors.danger,
      }))
    }
    dispatch(rootActions.setLoading(false))
  });

}
