export interface CalDavParser {
    parseListOfEvents(responseData: string): Promise<string[]>;
}
export declare class DefaultCalDavParser implements CalDavParser {
    parseListOfEvents: (responseData: string) => Promise<string[]>;
}
