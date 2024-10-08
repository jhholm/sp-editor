/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { IProvider, GraphEndpoint } from '@microsoft/mgt-element';
/**
 * AadTokenProvider
 *
 * @interface AadTokenProvider
 */
declare interface AadTokenProvider {
    /**
     * get token with x
     *
     * @param {string} x
     * @memberof AadTokenProvider
     */
    getToken(x: string): Promise<string>;
}
/**
 * contains the contextual services available to a web part
 *
 * @export
 * @interface WebPartContext
 */
declare interface WebPartContext {
    aadTokenProviderFactory: {
        getTokenProvider(): Promise<AadTokenProvider>;
    };
}
/**
 * SharePoint Provider handler
 *
 * @export
 * @class SharePointProvider
 * @extends {IProvider}
 */
export declare class SharePointProvider extends IProvider {
    /**
     * returns _provider
     *
     * @readonly
     * @memberof SharePointProvider
     */
    get provider(): AadTokenProvider;
    /**
     * returns _idToken
     *
     * @readonly
     * @type {boolean}
     * @memberof SharePointProvider
     */
    get isLoggedIn(): boolean;
    /**
     * Name used for analytics
     *
     * @readonly
     * @memberof IProvider
     */
    get name(): string;
    /**
     * privilege level for authentication
     *
     * @type {string[]}
     * @memberof SharePointProvider
     */
    private _scopes;
    get scopes(): string[];
    set scopes(value: string[]);
    /**
     * authority
     *
     * @type {string}
     * @memberof SharePointProvider
     */
    authority: string;
    private _idToken;
    private _provider;
    constructor(context: WebPartContext, baseUrl?: GraphEndpoint);
    /**
     * uses provider to receive access token via SharePoint Provider
     *
     * @returns {Promise<string>}
     * @memberof SharePointProvider
     */
    getAccessToken(): Promise<string>;
    /**
     * update scopes
     *
     * @param {string[]} scopes
     * @memberof SharePointProvider
     */
    updateScopes(scopes: string[]): void;
    private internalLogin;
}
export {};
//# sourceMappingURL=SharePointProvider.d.ts.map