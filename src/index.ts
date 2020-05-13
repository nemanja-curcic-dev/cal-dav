import * as ICAL from 'ical.js';
import {CalDavService, DefaultCalDavService} from './lib/caldav-service';
import {CalDavParser, DefaultCalDavParser} from './lib/caldav-parser';
import {Attendee} from './lib/types';
import logger from '@coozzy/logger';

export interface CalDavClient {
    getEvent(eventUid: string): Promise<ICAL.Event | undefined>;

    deleteEvent(eventUid: string): Promise<void>;

    listAllEvents(): Promise<ICAL.Event[]>;

    createUpdateEvent(id: string,
        referenceIds: string[],
        title: string,
        description: string,
        location: string,
        startDate: ICAL.TimeJsonData,
        endDate: ICAL.TimeJsonData,
        attendees: Attendee[],
        categories: string[]): Promise<void>;

    listEventsInTimeRange(startDate: Date, endDate?: Date): Promise<ICAL.Event[]>;
}

export class DefaultCalDavClient {
    service: CalDavService;
    parser: CalDavParser;

    constructor(username: string, password: string, calendarUrl: string, service?: CalDavService | null, parser?: CalDavParser | null){
        this.service = service || new DefaultCalDavService(username, password, calendarUrl);
        this.parser = parser || new DefaultCalDavParser();
    }

    getEvent = async(eventUid: string): Promise<ICAL.Event | undefined> => {
        try{
            const response = await this.service.getEvent(eventUid);

            if(response.status === 200) {
                const calData = ICAL.parse(response.data);
                const comp = new ICAL.Component(calData);
                const vevent = comp.getFirstSubcomponent('vevent');
    
                const event = new ICAL.Event(vevent);
                logger.info(`CalDavClient.GetEvent: Successfully got event ${event.uid}. `);
                return event;
            }
        } catch(e) {
            logger.error(`CalDavClient.GetEvent: ${e.message}. `);
        }
    };

    deleteEvent = async(eventUid: string): Promise<void> => {
        try{
            const response = await this.service.deleteEvent(eventUid);

            if(response.status === 204){
                logger.info(`CalDavClient.DeleteEvent: Successfully deleted event ${eventUid}. `);
                return;
            }
        } catch(e) {
            logger.error(`CalDavClient.DeleteEvent: ${e.message}. `);
        }
    };

    listAllEvents = async(): Promise<ICAL.Event[]> => {
        try{
            const response = await this.service.listAllEvents();
            const events = [];
    
            if(response.status === 207) {
                const eventsData = await this.parser.parseListOfEvents(response.data);
    
                if(eventsData.length){
                    for(const eventData of eventsData){
                        const calData = ICAL.parse(eventData);
                        const comp = new ICAL.Component(calData);
                        const vevents = comp.getAllSubcomponents('vevent');
                        events.push(...vevents);
                    }
                }
                logger.info('CalDavClient.ListAllEvents: Successfully listed all events. ');
                return events.map(event => new ICAL.Event(event));
            }
            return [];
        } catch(e) {
            logger.error(`CalDavClient.ListAllEvents: ${e.message}. `);
            return [];
        }
    };

    listEventsInTimeRange = async(startDate: Date, endDate?: Date): Promise<ICAL.Event[]> => {
        try{
            const response = await this.service.listEventsInTimeRange(startDate, endDate);
            const events = [];
    
            if(response.status === 207) {
                const eventsData = await this.parser.parseListOfEvents(response.data);
    
                if(eventsData.length){
                    for(const eventData of eventsData){
                        const calData = ICAL.parse(eventData);
                        const comp = new ICAL.Component(calData);
                        const vevents = comp.getAllSubcomponents('vevent');
                        events.push(...vevents);
                    }
                }
                logger.info(`CalDavClient.ListEventsInTimRange: Successfully listed events in time range ${startDate} - ${endDate ? endDate : ''}. `);
                return events.map(event => new ICAL.Event(event));
            }
            return [];
        } catch(e) {
            logger.error(`CalDavClient.ListEventsInTimRange: ${e.message}. `);
            return [];
        }
    };

    createUpdateEvent = async(id: string, referenceIds: string[], title: string, description: string, location: string, startDate: ICAL.TimeJsonData, endDate: ICAL.TimeJsonData, attendees: Attendee[], categories: string[]): Promise<void> => {
        try{
            // wrap request data in VCALENDAR
            const calendar = new ICAL.Component('vcalendar');
            const event = new ICAL.Event(calendar);

            event.component.addPropertyWithValue('BEGIN', 'VEVENT');
            event.uid = id;
            event.summary = title;
            event.description = description;
            event.location = location;
            event.startDate = new ICAL.Time(startDate);
            event.endDate = new ICAL.Time(endDate);

            if(categories.length){
                const categoriesProperty = new ICAL.Property('categories');
                categoriesProperty.setValues(categories);
                event.component.addProperty(categoriesProperty);
            }

            if(attendees.length){
                this.addAttendees(attendees, event);
            }

            if(referenceIds.length){
                event.component.addPropertyWithValue('referenceids', referenceIds.join(','));
            }

            event.component.addPropertyWithValue('END', 'VEVENT');
            await this.service.createUpdateEvent(event.toString(), id);
            logger.info(`CalDavClient.CreateUpdateEvent: Successfully created event ${id}. `);
        } catch(e){
            logger.error(`CalDavClient.CreateUpdateEvent: ${e.message}. `);
        }
    };

    private addAttendees(attendees: Attendee[], event: ICAL.Event): void {
        for(const attendee of attendees) {
            const attendeeProp = new ICAL.Property('attendee');
            let attendeeValue = '';

            if(attendee.email){
                attendeeValue += `MAILTO=${attendee.email};`;
            }

            if(attendee.displayName){
                attendeeValue += `CN=${attendee.displayName};`;
            }

            if(attendee.status){
                attendeeValue += `PARTSTAT=${attendee.status};`;
            }

            attendeeProp.setValue(attendeeValue);
            event.component.addProperty(attendeeProp);
        }
    }
}