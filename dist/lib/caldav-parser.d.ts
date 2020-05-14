export interface CalDavParser {
    parseListOfEvents(responseData: string): Promise<{
        event: string;
        url: string;
    }[]>;
    parseEvent(responseData: string): Promise<string>;
}
export declare class DefaultCalDavParser implements CalDavParser {
    parseListOfEvents: (responseData: string) => Promise<{
        event: string;
        url: string;
    }[]>;
    parseEvent: (responseData: string) => Promise<string>;
}
