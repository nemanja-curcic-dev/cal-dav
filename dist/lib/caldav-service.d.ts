import { AxiosResponse, AxiosInstance } from 'axios';
export interface CalDavService {
    getEventByUrl(eventUrl: string): Promise<AxiosResponse>;
    getEventByUid(eventUid: string): Promise<AxiosResponse>;
    createUpdateEvent(eventData: string, eventUid: string): Promise<AxiosResponse>;
    deleteEvent(eventUid: string): Promise<AxiosResponse>;
    listAllEvents(): Promise<AxiosResponse>;
    listEventsInTimeRange(startDate: Date, endDate?: Date): Promise<AxiosResponse>;
    getCtag(): Promise<AxiosResponse>;
    getEtags(): Promise<AxiosResponse>;
}
export declare class DefaultCalDavService implements CalDavService {
    axios: AxiosInstance;
    username: string;
    password: string;
    calendarUrl: string;
    constructor(username: string, password: string, calendarUrl: string, axios?: AxiosInstance | null);
    getEventByUrl: (eventUrl: string) => Promise<AxiosResponse<any>>;
    getEventByUid: (eventUid: string) => Promise<AxiosResponse<any>>;
    createUpdateEvent: (eventData: string, eventUid: string) => Promise<AxiosResponse<any>>;
    deleteEvent: (eventUid: string) => Promise<AxiosResponse<any>>;
    listAllEvents: () => Promise<AxiosResponse<any>>;
    listEventsInTimeRange: (startDate: Date, endDate?: Date) => Promise<AxiosResponse<any>>;
    getCtag: () => Promise<AxiosResponse<any>>;
    getEtags: () => Promise<AxiosResponse<any>>;
}
