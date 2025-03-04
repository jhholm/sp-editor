import { ActionButton, CommandBar, DefaultButton, Dialog, DialogFooter, DialogType, Link, Panel, PanelType, PrimaryButton, Stack, Text, TextField } from '@fluentui/react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { runsearch } from '../chrome/runsearch';
import { deleteSearchQuery, saveSearchQuery, setAllQueries, setOptionsPanel, setSearchQuery, setSearchResults } from '../../../store/search/actions';
import * as rootActions from '../../../store/home/actions';
import { MessageBarColors } from '../../../store/home/types';
import { currentpageallprops } from '../chrome/currentpageallprops';
import { reindexweb } from '../chrome/reindexweb';
import { useEffect, useState } from 'react';
import { ISearchHistory } from '../../../store/search/types';
import { replaceDateTokens } from './searchqueryform';

const SearchCommands = () => {
  const dispatch = useDispatch();

  const { searchQuery, optionsPanel, searchHistory } = useSelector((state: IRootState) => state.search);
  const [showSaveQueryDialog, setShowSaveQueryDialog] = useState(false);
  const [showSearchHistoryPanel, setShowSearchHistoryPanel] = useState(false);
  const [queryName, setQueryName] = useState('');

   useEffect(() => {
     const storedQueries = localStorage.getItem('searchHistory');
     if (storedQueries) {
       const parsedQueries = JSON.parse(storedQueries);
       dispatch(setAllQueries(parsedQueries));
     }
   }, []);
 
  const indexWebOnClick = () => {
    dispatch(rootActions.setLoading(true));
    chrome.scripting
      .executeScript({
        target: { tabId: chrome.devtools.inspectedWindow.tabId },
        world: 'MAIN',
        args: [chrome.runtime.getURL('')],
        func: reindexweb,
      })
      .then((injectionResults) => {
        if (injectionResults[0].result) {
          const res = injectionResults[0].result as any;
          if (res.errorMessage) {
            dispatch(
              rootActions.setAppMessage({
                showMessage: true,
                message: res.errorMessage,
                color: MessageBarColors.danger,
              })
            );
          } else {
            dispatch(
              rootActions.setAppMessage({
                showMessage: true,
                message: 'Reindexing complete',
                color: MessageBarColors.success,
              })
            );
          }
          dispatch(rootActions.setLoading(false));
        }
      });
  };

  return (
    <>
      <CommandBar
        items={[
          {
            key: 'Search',
            onRender: () => (
              <PrimaryButton
                text="Search"
                allowDisabledFocus
                styles={{ root: { marginTop: 6, marginRight: 6 } }}
                onClick={() => {
                  dispatch(rootActions.setLoading(true));

                  const modifiedQuery = { ...searchQuery };
                  modifiedQuery.Querytext = replaceDateTokens(searchQuery.Querytext ?? '');
                  modifiedQuery.QueryTemplate = replaceDateTokens(searchQuery.QueryTemplate ?? '');

                  chrome.scripting
                    .executeScript({
                      target: { tabId: chrome.devtools.inspectedWindow.tabId },
                      world: 'MAIN',
                      args: [modifiedQuery, chrome.runtime.getURL('')],
                      func: runsearch,
                    })
                    .then((injectionResults) => handleInjectionResults(injectionResults, dispatch));
                }}
              />
            ),
          },
          {
            key: 'Options',
            text: 'Options',
            iconProps: { iconName: 'CheckList' },
            onClick: () => {
              dispatch(setOptionsPanel(!optionsPanel));
            },
          },
          {
            key: 'Save',
            text: 'Save query',
            iconProps: { iconName: 'Save' },
            onClick: () => {
              setShowSaveQueryDialog(true);
            },
          },
          {
            key: 'Load',
            text: 'View queries',
            iconProps: { iconName: 'OfflineStorage' },
            onClick: () => {
              setShowSearchHistoryPanel(true);
            },
          },
        ]}
        farItems={[
          {
            key: 'SearchPage',
            text: 'Search Current Page',
            iconProps: { iconName: 'SearchAndApps' },
            onClick: () => {
              dispatch(rootActions.setLoading(true));
              chrome.scripting
                .executeScript({
                  target: { tabId: chrome.devtools.inspectedWindow.tabId },
                  world: 'MAIN',
                  args: [chrome.runtime.getURL('')],
                  func: currentpageallprops,
                })
                .then((injectionResults) => handleInjectionResults(injectionResults, dispatch));
            },
          },
          {
            key: 'IndexWeb',
            text: 'Reindex Current Web',
            iconProps: { iconName: 'SiteScan' },
            onClick: () => indexWebOnClick(),
          },
        ]}
      />
      <Dialog
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Save query',
          closeButtonAriaLabel: 'Close',
        }}
        onDismiss={() => {
          setShowSaveQueryDialog(false);
          setQueryName('');
        }}
        hidden={!showSaveQueryDialog}
      >
        <TextField label="Query name" value={queryName} onChange={(e, newValue) => setQueryName(newValue ?? '')} />
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              const newSearchHistory: ISearchHistory = {
                ...searchQuery,
                queryName: queryName,
              };
              dispatch(saveSearchQuery(newSearchHistory));
              setShowSaveQueryDialog(false);
              setQueryName('');
            }}
            text="Save"
            disabled={!queryName}
          />{' '}
          <DefaultButton
            onClick={() => {
              setShowSaveQueryDialog(false);
              setQueryName('');
            }}
            text="Cancel"
          />
        </DialogFooter>
      </Dialog>
      <Panel
        isOpen={showSearchHistoryPanel}
        onDismiss={() => setShowSearchHistoryPanel(false)}
        type={PanelType.smallFixedFar}
        headerText="Saved Search Queries"
        closeButtonAriaLabel="Close"
        isLightDismiss={true}
        styles={{ content: { paddingLeft: 0, paddingRight: 0 } }}
      >
        <Stack>
          {searchHistory.map((query: ISearchHistory, index) => (
            <Stack horizontal key={index} styles={{ root: { width: '100%' } }}>
              <Stack.Item align="start" grow>
                <ActionButton
                  iconProps={{ iconName: 'SearchBookmark' }}
                  onClick={() => {
                    const { queryName, ...searchQueryWithoutName } = query;
                    dispatch(setSearchQuery(searchQueryWithoutName));
                    setShowSearchHistoryPanel(false);
                  }}
                  text={query.queryName}
                  styles={{ root: { display: 'inline-block', width: '100%', textAlign: 'start' } }}
                />
              </Stack.Item>
              <Stack.Item align="end">
                <ActionButton
                  iconProps={{ iconName: 'Delete' }}
                  onClick={() => {
                    dispatch(deleteSearchQuery(index));
                  }}
                />
              </Stack.Item>
            </Stack>
          ))}
        </Stack>
      </Panel>
    </>
  );

  function handleInjectionResults(injectionResults: any, dispatch: Function) {
    if (injectionResults[0].result) {
      const res = injectionResults[0].result as any;
      if (res.errorMessage) {
        dispatch(
          rootActions.setAppMessage({
            showMessage: true,
            message: res.errorMessage,
            color: MessageBarColors.danger,
          })
        );
        dispatch(setSearchResults([], [], undefined));
      } else {
        var items: any[] = [];
        var groups: any[] = [];
        var uniqueKey = 0;
        var startIndex = 0;
        res.PrimarySearchResults.forEach((item: any) => {
          const temp = Object.keys(item)
            .map((name) => ({
              DocId: item.DocId,
              property: name,
              value: item[name],
            }))
            .sort((a, b) => a.property.toLowerCase().localeCompare(b.property.toLowerCase()));

          const newItems = temp.map((tempItem, i) => ({
            row: i + 1,
            key: uniqueKey++,
            property: tempItem.property,
            value: tempItem.value,
            DocId: tempItem.DocId,
          }));

          items = [...items, ...newItems];

          groups.push({
            key: item.DocId,
            name: item.Title,
            startIndex: startIndex,
            count: Object.keys(item).length,
            level: 0,
            isCollapsed: true,
          });

          startIndex += Object.keys(item).length;
        });

        dispatch(setSearchResults(items, groups, res));
      }
    } else {
      //console.log('Injection failed: ', injectionResults);
    }
    dispatch(rootActions.setLoading(false));
  }
};

export default SearchCommands;