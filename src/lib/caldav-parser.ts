import {parseStringPromise} from 'xml2js';

export interface CalDavParser {
    parseListOfEvents(responseData: string): Promise<{event: string; url: string}[]>;

    parseEvent(responseData: string): Promise<{event: string; url: string}>;
}

export class DefaultCalDavParser implements CalDavParser {
    parseListOfEvents = async(responseData: string): Promise<{event: string; url: string}[]> => {
        try{
            const events = [];

            const xml = await parseStringPromise(responseData);
            const response = xml['d:multistatus']['d:response'];
            
            for(const obj of response){
                const eventData = obj['d:propstat'][0]['d:prop'][0]['cal:calendar-data'][0];

                if(eventData){
                    events.push({event: eventData, url: obj['d:href'][0]});
                }
            }
            return events;
        } catch (TypeError) {
            return [];
        }
    };

    parseEvent = async(responseData: string): Promise<{event: string; url: string}> => {
        try{
            const xml = await parseStringPromise(responseData);
            const eventData = xml['d:multistatus']['d:response'][0]['d:propstat'][0]['d:prop'][0]['cal:calendar-data'][0];
            const url = xml['d:multistatus']['d:response'][0]['d:href'][0];
            return {event: eventData, url: url};
        } catch (TypeError) {
            return {event: '', url: ''};
        }
    };
}