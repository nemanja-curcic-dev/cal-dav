import * as ICAL from 'ical.js';
import {CalDavService, DefaultCalDavService} from './lib/caldav-service';
import {CalDavParser, DefaultCalDavParser} from './lib/caldav-parser';
import {Attendee} from './lib/types';
import logger from '@coozzy/logger';

export interface CalDavClient {
    getEventByUrl(eventUrl: string): Promise<ICAL.Event | undefined>;

    getEventByUid(eventUid: string): Promise<ICAL.Event | undefined>;

    deleteEvent(eventUid: string): Promise<void>;

    listAllEvents(): Promise<ICAL.Event[]>;

    createEvent(id: string,
        referenceIds: string[],
        title: string,
        description: string,
        location: string,
        startDate: ICAL.TimeJsonData,
        endDate: ICAL.TimeJsonData,
        attendees: Attendee[],
        categories: string[]): Promise<void>;

    updateEvent(event: ICAL.Event, 
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

    getEventByUrl = async(eventUrl: string): Promise<ICAL.Event | undefined> => {
        try{
            const response = await this.service.getEventByUrl(eventUrl);

            if(response.status === 200) {
                const calData = ICAL.parse(response.data);
                const comp = new ICAL.Component(calData);
                const vevent = comp.getFirstSubcomponent('vevent');
    
                const event = new ICAL.Event(vevent);
                event.component.addPropertyWithValue('url', eventUrl);
                logger.info(`CalDavClient.GetEvent: Successfully got event ${event.uid}. `);
                return event;
            }
        } catch(e) {
            logger.error(`CalDavClient.GetEventByUrl: ${e.message}. `);
        }
    };

    getEventByUid = async(eventUid: string): Promise<ICAL.Event | undefined> => {
        try{
            const response = await this.service.getEventByUid(eventUid);
            if(response.status === 207) {
                const parsedData = await this.parser.parseEvent(response.data);
                const calData = ICAL.parse(parsedData.event);
                const comp = new ICAL.Component(calData);
                const vevent = comp.getFirstSubcomponent('vevent');
    
                const event = new ICAL.Event(vevent);
                const urlParts = parsedData.url.split('/');
                event.component.addPropertyWithValue('url', urlParts[urlParts.length - 1]);
                logger.info(`CalDavClient.GetEvent: Successfully got event ${event.uid}. `);
                return event;
            }
        } catch(e) {
            logger.error(`CalDavClient.GetEventByUid: ${e.message}. `);
        }
    };

    deleteEvent = async(eventUrl: string): Promise<void> => {
        try{
            const response = await this.service.deleteEvent(eventUrl);

            if(response.status === 204){
                logger.info(`CalDavClient.DeleteEvent: Successfully deleted event ${eventUrl}. `);
                return;
            }
        } catch(e) {
            logger.error(`CalDavClient.DeleteEvent: ${e.message}. `);
        }
    };

    listAllEvents = async(): Promise<ICAL.Event[]> => {
        try{
            const response = await this.service.listAllEvents();
            let events = [];
    
            if(response.status === 207) {
                const eventsData = await this.parser.parseListOfEvents(response.data);
    
                if(eventsData.length){
                    for(const eventData of eventsData){
                        const calData = ICAL.parse(eventData.event);
                        const comp = new ICAL.Component(calData);
                        const vevents = comp.getAllSubcomponents('vevent');
                        events.push(...vevents);
                    }
                }
                events = events.map(event => new ICAL.Event(event));

                for(let i = 0; i < events.length; i++){
                    /* eslint-disable security/detect-object-injection */
                    const urlParts = eventsData[i].url.split('/');
                    events[i].component.addPropertyWithValue('url', urlParts[urlParts.length - 1]);
                    /* eslint-enable security/detect-object-injection */
                }
                logger.info('CalDavClient.ListAllEvents: Successfully listed all events. ');
                return events;
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
            let events = [];
    
            if(response.status === 207) {
                const eventsData = await this.parser.parseListOfEvents(response.data);
    
                if(eventsData.length){
                    for(const eventData of eventsData){
                        const calData = ICAL.parse(eventData.event);
                        const comp = new ICAL.Component(calData);
                        const vevents = comp.getAllSubcomponents('vevent');
                        events.push(...vevents);
                    }
                }
                events = events.map(event => new ICAL.Event(event));

                for(let i = 0; i < events.length; i++){
                    /* eslint-disable security/detect-object-injection */
                    const urlParts = eventsData[i].url.split('/');
                    events[i].component.addPropertyWithValue('url', urlParts[urlParts.length - 1]);
                    /* eslint-enable security/detect-object-injection */
                }
                logger.info(`CalDavClient.ListEventsInTimRange: Successfully listed events in time range ${startDate} - ${endDate ? endDate : ''}. `);
                return events;
            }
            return [];
        } catch(e) {
            logger.error(`CalDavClient.ListEventsInTimRange: ${e.message}. `);
            return [];
        }
    };

    createEvent = async(eventUrl: string, id: string, referenceIds: string[], title: string, description: string, location: string, startDate: ICAL.TimeJsonData, endDate: ICAL.TimeJsonData, attendees: Attendee[], categories: string[]): Promise<void> => {
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
                for(const category of categories){
                    const categoriesProperty = new ICAL.Property('categories');
                    categoriesProperty.setValue(category);
                    event.component.addProperty(categoriesProperty);
                }
            }

            if(attendees.length){
                this.addAttendees(attendees, event);
            }

            if(referenceIds.length){
                event.component.addPropertyWithValue('referenceids', referenceIds.join(','));
            }

            event.component.addPropertyWithValue('END', 'VEVENT');
            let eventString = event.toString();

            // change ATTENDEE: to ATTENDEE;
            eventString = eventString.replace(/ATTENDEE:/gi, 'ATTENDEE;');

            await this.service.createUpdateEvent(eventString, eventUrl);
            logger.info(`CalDavClient.CreateUpdateEvent: Successfully created event ${id}. `);
        } catch(e){
            logger.error(`CalDavClient.CreateEvent: ${e.message}. `);
        }
    };

    updateEvent = async(eventUrl: string, event: ICAL.Event, referenceIds: string[], title: string, description: string, location: string, startDate: ICAL.TimeJsonData, endDate: ICAL.TimeJsonData, attendees: Attendee[], categories: string[]): Promise<void> => {
        try{
            event.summary = title;
            event.description = description;
            event.location = location;
            event.startDate = new ICAL.Time(startDate);
            event.endDate = new ICAL.Time(endDate);
            
            event.component.removeAllProperties('categories');
            event.component.removeAllProperties('attendee');
            event.component.removeAllProperties('referenceids');

            if(categories.length){
                for(const category of categories){
                    const categoriesProperty = new ICAL.Property('categories');
                    categoriesProperty.setValue(category);
                    event.component.addProperty(categoriesProperty);
                }
            }
            if(attendees.length){
                this.addAttendees(attendees, event);
            }

            if(referenceIds.length){
                event.component.addPropertyWithValue('referenceids', referenceIds.join(','));
            }

            // change ATTENDEE: to ATTENDEE;
            let eventString = event.toString();
            eventString = eventString.replace(/ATTENDEE:/gi, 'ATTENDEE;');

            await this.service.createUpdateEvent('BEGIN:VCALENDAR\r\n' + eventString + '\r\nEND:VCALENDAR', eventUrl);
        } catch(e) {
            logger.error(`CalDavClient.UpdateEvent: ${e.message}. `);
        }
    };

    private addAttendees(attendees: Attendee[], event: ICAL.Event): void {
        for(const attendee of attendees) {
            let attendeeValue = '';

            if(attendee.status){
                attendeeValue += `PARTSTAT=${attendee.status};`;
            }

            if(attendee.displayName){
                attendeeValue += `CN=${attendee.displayName}`;
            }

            if(attendee.email){
                attendeeValue += `:mailto:${attendee.email}`;
            }
            event.component.addPropertyWithValue('ATTENDEE', attendeeValue);
        }
    }
}