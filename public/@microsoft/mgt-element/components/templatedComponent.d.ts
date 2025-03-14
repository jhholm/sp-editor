/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { PropertyValueMap, PropertyValues, TemplateResult } from 'lit';
import { MgtBaseComponent } from './baseComponent';
import { TemplateContext } from '../utils/TemplateContext';
/**
 * Lookup for rendered component templates and contexts by slot name.
 */
export type RenderedTemplates = Record<string, {
    /**
     * Reference to the data context used to render the slot.
     */
    context: Record<string, unknown>;
    /**
     * Reference to the rendered DOM element corresponding to the slot.
     */
    slot: HTMLElement;
}>;
export interface TemplateRenderedData {
    templateType: string;
    context: Record<string, unknown>;
    element: HTMLElement;
}
export type OrderedHtmlTemplate = HTMLTemplateElement & {
    templateOrder: number;
};
/**
 * An abstract class that defines a templatable web component
 *
 * @export
 * @abstract
 * @class MgtTemplatedComponent
 * @extends {MgtBaseComponent}
 * @deprecated Use MgtTemplatedTaskComponent instead
 *
 * @fires {CustomEvent<MgtElement.TemplateRenderedData>} templateRendered - fires when a template is rendered
 */
export declare abstract class MgtTemplatedComponent extends MgtBaseComponent {
    /**
     * Additional data context to be used in template binding
     * Use this to add event listeners or value converters
     *
     * @type {MgtElement.TemplateContext}
     * @memberof MgtTemplatedComponent
     */
    templateContext: TemplateContext;
    /**
     *
     * Gets or sets the error (if any) of the request
     *
     * @type object
     * @memberof MgtSearchResults
     */
    protected error: object;
    /**
     * Holds all templates defined by developer
     *
     * @protected
     * @memberof MgtTemplatedComponent
     */
    protected templates: Record<string, OrderedHtmlTemplate>;
    private _renderedSlots;
    private _renderedTemplates;
    private _slotNamesAddedDuringRender;
    constructor();
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * * @param _changedProperties Map of changed properties with old values
     */
    protected update(changedProperties: PropertyValueMap<unknown> | Map<PropertyKey, unknown>): void;
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * * @param changedProperties Map of changed properties with old values
     */
    protected updated(changedProperties: PropertyValues): void;
    /**
     * Render a <template> by type and return content to render
     *
     * @param templateType type of template (indicated by the data-type attribute)
     * @param context the data context that should be expanded in template
     * @param slotName the slot name that will be used to host the new rendered template. set to a unique value if multiple templates of this type will be rendered. default is templateType
     */
    protected renderTemplate(templateType: string, context: object, slotName?: string): TemplateResult;
    /**
     * Check if a specific template has been provided.
     *
     * @protected
     * @param {string} templateName
     * @returns {boolean}
     * @memberof MgtTemplatedComponent
     */
    protected hasTemplate(templateName: string): boolean;
    private getTemplates;
    /**
     * Renders an error
     *
     * @returns
     */
    protected renderError(): TemplateResult;
    private removeUnusedSlottedElements;
}
//# sourceMappingURL=templatedComponent.d.ts.map