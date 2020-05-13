import * as ICAL from 'ical.js';
import { CalDavService } from './lib/caldav-service';
import { CalDavParser } from './lib/caldav-parser';
import { Attendee } from './lib/types';
export interface CalDavClient {
    getEvent(eventUid: string): Promise<ICAL.Event | undefined>;
    deleteEvent(eventUid: string): Promise<void>;
    listAllEvents(): Promise<ICAL.Event[]>;
    createUpdateEvent(id: string, referenceIds: string[], title: string, description: string, location: string, startDate: ICAL.TimeJsonData, endDate: ICAL.TimeJsonData, attendees: Attendee[], categories: string[]): Promise<void>;
    listEventsInTimeRange(startDate: Date, endDate?: Date): Promise<ICAL.Event[]>;
}
export declare class DefaultCalDavClient {
    service: CalDavService;
    parser: CalDavParser;
    constructor(username: string, password: string, calendarUrl: string, service?: CalDavService | null, parser?: CalDavParser | null);
    getEvent: (eventUid: string) => Promise<ICAL.Event | undefined>;
    deleteEvent: (eventUid: string) => Promise<void>;
    listAllEvents: () => Promise<ICAL.Event[]>;
    listEventsInTimeRange: (startDate: Date, endDate?: Date) => Promise<ICAL.Event[]>;
    createUpdateEvent: (id: string, referenceIds: string[], title: string, description: string, location: string, startDate: any, endDate: any, attendees: Attendee[], categories: string[]) => Promise<void>;
}
