import {parseStringPromise} from 'xml2js';

export interface CalDavParser {
    parseListOfEvents(responseData: string): Promise<string[]>;
}

export class DefaultCalDavParser implements CalDavParser {
    parseListOfEvents = async(responseData: string): Promise<string[]> => {
        try{
            const events = [];

            const xml = await parseStringPromise(responseData);
            const response = xml['d:multistatus']['d:response'];
            
            for(const obj of response){
                const eventData = obj['d:propstat'][0]['d:prop'][0]['cal:calendar-data'][0];

                if(eventData){
                    events.push(eventData);
                }
            }
            return events;
        } catch (TypeError) {
            return [];
        }
    };
}