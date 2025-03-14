import {
  TranslationsSearchAPIResponse,
  TranslationsItemAPIResponse,
  TranslationsAPIResponse,
  TranslationsResponses,
} from './types';

export async function getTranslations(
  siteUrl: string,
  pageId: number,
  pageListId: string
): Promise<TranslationsResponses> {
  const DEFAULTHEADERS = {
    accept: 'application/json;odata=nometadata',
    'content-type': 'application/json;odata=nometadata',
    'X-ClientService-ClientTag': 'SPEDITOR',
  };
  try {
    const translationsAPI: TranslationsAPIResponse = await fetch(
      siteUrl + `/_api/sitepages/pages(${pageId})/translations`,
      {
        method: 'GET',
        headers: DEFAULTHEADERS,
      }
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(
        `Couldn't get translation data from Translations API. Translations are probably not enabled for this site.`
      );
    });

    const itemAPI: TranslationsItemAPIResponse = await fetch(
      siteUrl +
        `/_api/web/lists('${pageListId}')/items(${pageId})?$select=OData__SPTranslatedLanguages,OData__SPIsTranslation,UniqueId`,
      {
        method: 'GET',
        headers: DEFAULTHEADERS,
      }
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(
        `Couldn't get translation data from Items API. Site Pages library might not have translation columns.`
      );
    });

    const searchAPI: TranslationsSearchAPIResponse = await fetch(
      siteUrl +
        `/_api/search/query?querytext='NormUniqueID:${itemAPI.UniqueId}'&selectproperties='SPTranslatedLanguages'`,
      {
        method: 'GET',
        headers: DEFAULTHEADERS,
      }
    ).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Couldn't get translation data from Search API`);
    });
    const languagesFromSearch =
      searchAPI.PrimaryQueryResult.RelevantResults.Table.Rows[0].Cells.filter(
        (c) => c.Key === 'SPTranslatedLanguages'
      )[0]
        ?.Value?.split(/\r?\n/)
        .filter((e) => e) || [];

    return {
      translationsAPI: translationsAPI.Items.map((i) => i.Culture),
      itemAPI: itemAPI.OData__SPTranslatedLanguages || [],
      searchAPI: languagesFromSearch,
    };
  } catch (ex: any) {
    return { translationsAPI: [], itemAPI: [], searchAPI: [], error: ex.message };
  }
}

export async function updateTranslationValues(siteUrl: string, pageId: number) {
  const DEFAULTHEADERS = {
    accept: 'application/json;odata=nometadata',
    'content-type': 'application/json;odata=nometadata',
    'X-ClientService-ClientTag': 'SPEDITOR',
  };

  const ctxInfo = await fetch(siteUrl + '/_api/contextinfo', {
    method: 'POST',
    headers: DEFAULTHEADERS,
  }).then((response) => response.json());
  const requestDigest = ctxInfo.FormDigestValue;

  await fetch(siteUrl + `/_api/sitepages/pages(${pageId})/translations/updateTranslationLanguages`, {
    method: 'POST',
    headers: { 'X-RequestDigest': requestDigest, ...DEFAULTHEADERS },
  }).then((response) => response.json());
  return true;
}
