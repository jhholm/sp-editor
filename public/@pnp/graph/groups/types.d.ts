import { Event as IEventType, Group as IGroupType } from "@microsoft/microsoft-graph-types";
import { IDeleteable, IUpdateable, IGetById } from "../decorators.js";
import { _DirectoryObject, _DirectoryObjects } from "../directory-objects/types.js";
export declare enum GroupType {
    /**
     * Office 365 (aka unified group)
     */
    Office365 = 0,
    /**
     * Dynamic membership
     */
    Dynamic = 1,
    /**
     * Security
     */
    Security = 2
}
/**
 * Represents a group entity
 */
export declare class _Group extends _DirectoryObject<IGroupType> {
    /**
     * Add the group to the list of the current user's favorite groups. Supported for only Office 365 groups
     */
    addFavorite(): Promise<void>;
    /**
     * Remove the group from the list of the current user's favorite groups. Supported for only Office 365 groups
     */
    removeFavorite(): Promise<void>;
    /**
     * Reset the unseenCount of all the posts that the current user has not seen since their last visit
     */
    resetUnseenCount(): Promise<void>;
    /**
     * Calling this method will enable the current user to receive email notifications for this group,
     * about new posts, events, and files in that group. Supported for only Office 365 groups
     */
    subscribeByMail(): Promise<void>;
    /**
     * Calling this method will prevent the current user from receiving email notifications for this group
     * about new posts, events, and files in that group. Supported for only Office 365 groups
     */
    unsubscribeByMail(): Promise<void>;
    /**
     * Get the occurrences, exceptions, and single instances of events in a calendar view defined by a time range, from the default calendar of a group
     *
     * @param start Start date and time of the time range
     * @param end End date and time of the time range
     */
    getCalendarView(start: Date, end: Date): Promise<IEventType[]>;
}
export interface IGroup extends _Group, IDeleteable, IUpdateable {
}
export declare const Group: import("../graphqueryable.js").IGraphInvokableFactory<IGroup>;
/**
 * Describes a collection of Group objects
 *
 */
export declare class _Groups extends _DirectoryObjects<IGroupType[]> {
    /**
     * Create a new group as specified in the request body.
     *
     * @param name Name to display in the address book for the group
     * @param mailNickname Mail alias for the group
     * @param groupType Type of group being created
     * @param additionalProperties A plain object collection of additional properties you want to set on the new group
     */
    add(name: string, mailNickname: string, groupType: GroupType, additionalProperties?: Record<string, any>): Promise<IGroupType>;
}
export interface IGroups extends _Groups, IGetById<IGroup> {
}
export declare const Groups: import("../graphqueryable.js").IGraphInvokableFactory<IGroups>;
//# sourceMappingURL=types.d.ts.map