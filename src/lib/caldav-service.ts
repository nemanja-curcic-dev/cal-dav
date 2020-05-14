import Axios, {AxiosResponse, AxiosInstance} from 'axios';
import moment from 'moment';


export interface CalDavService {
    getEventByUrl(eventUrl: string): Promise<AxiosResponse>;

    getEventByUid(eventUid: string): Promise<AxiosResponse>;

    createUpdateEvent(eventData: string, eventUid: string): Promise<AxiosResponse>;

    deleteEvent(eventUid: string): Promise<AxiosResponse>;

    listAllEvents(): Promise<AxiosResponse>;

    listEventsInTimeRange(startDate: Date, endDate?: Date): Promise<AxiosResponse>;

    multiGetEvents(eventUrls: string[]): Promise<AxiosResponse>;

    getCtag(): Promise<AxiosResponse>;

    getEtags(): Promise<AxiosResponse>;
}

export class DefaultCalDavService implements CalDavService {

    axios: AxiosInstance;
    username: string;
    password: string;
    calendarUrl: string;

    constructor(username: string, password: string, calendarUrl: string, axios?: AxiosInstance | null){
        this.username = username;
        this.password = password;
        this.calendarUrl = calendarUrl;
        this.axios = axios || Axios.create({});
    }

    getEventByUrl = async(eventUrl: string): Promise<AxiosResponse> => {
        // Method for getting single event
        // Response status upon successfull request is 200
        const url = `${this.calendarUrl}${eventUrl}`;

        return await this.axios.request({
            method: 'GET',
            url: url,
            auth: {
                username: this.username,
                password: this.password
            }
        });
    };

    getEventByUid = async(eventUid: string): Promise<AxiosResponse> => {
        // Method for getting single event
        // Response status upon successfull request is 200
        const url = `${this.calendarUrl}`;

        return await this.axios.request({
            method: 'REPORT',
            url: url,
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Depth': 1
            },
            data: `<C:calendar-query xmlns:C="urn:ietf:params:xml:ns:caldav">
                    <D:prop xmlns:D="DAV:">
                        <D:getetag/>
                        <C:calendar-data/>
                        </D:prop>
                        <C:filter>
                        <C:comp-filter name="VCALENDAR">
                            <C:comp-filter name="VEVENT">
                            <C:prop-filter name="UID">
                                <C:text-match collation="i;octet"
                                >${eventUid}</C:text-match>
                            </C:prop-filter>
                            </C:comp-filter>
                        </C:comp-filter>
                        </C:filter>
                    </C:calendar-query>`,
            auth: {
                username: this.username,
                password: this.password
            }
        });
    };

    createUpdateEvent = async(eventData: string, eventUid: string): Promise<AxiosResponse> => {
        // Method for creating or updating single event
        // Response status upon successfull request 204 - updated or 201 - created
        const url = `${this.calendarUrl}${eventUid}`;

        return await this.axios.request({
            method: 'PUT',
            url: url,
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8'
            },
            data: eventData,
            auth: {
                username: this.username,
                password: this.password
            }
        });
    };

    deleteEvent = async(eventUid: string): Promise<AxiosResponse> => {
        // Method for deleting single event
        // Response status upon successfull request is 204
        const url = `${this.calendarUrl}${eventUid}`;

        return await this.axios.request({
            method: 'DELETE',
            url: url,
            auth: {
                username: this.username,
                password: this.password
            }
        });
    };

    listAllEvents = async(): Promise<AxiosResponse> => {
        // Method for getting all events in calendar
        // Response status upon successfull request is 207
        return await this.axios.request({
            method: 'REPORT',
            url: this.calendarUrl,
            headers: {
                'Depth': 1,
                'Prefer': 'return-minimal',
                'Content-type': 'application/xml; charset=utf-8'
            },
            data: '<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">' +
                    '<d:prop>' +
                        '<d:getetag />' +
                        '<c:calendar-data />' +
                    '</d:prop>' +
                    '<c:filter>' +
                        '<c:comp-filter name="VCALENDAR">' +
                            '<c:comp-filter name="VEVENT" />' +
                        '</c:comp-filter>' +
                    '</c:filter>' +
                  '</c:calendar-query>',
            auth: {
                username: this.username,
                password: this.password
            }
        });
    };

    listEventsInTimeRange = async(startDate: Date, endDate?: Date): Promise<AxiosResponse> => {
        // Method for getting events from calendar in certain time range
        // Response status upon successfull request is 207
        const startDateString = moment(startDate).utc().format('YYYYMMDD[T]HHmmss[Z]');
        const endDateString = (endDate) ? moment(endDate).utc().format('YYYYMMDD[T]HHmmss[Z]') : null;
        const endTimeRange = (endDateString) ? ` end="${endDateString}"` : '';

        return await this.axios.request({
            method: 'REPORT',
            url: this.calendarUrl,
            headers: {
                'Depth': 1,
                'Prefer': 'return-minimal',
                'Content-type': 'application/xml; charset=utf-8'
            },
            data: '<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">' +
                    '<d:prop>' +
                        '<d:getetag />' +
                        '<c:calendar-data />' +
                    '</d:prop>' +
                    '<c:filter>' +
                        '<c:comp-filter name="VCALENDAR">' +
                        '      <c:comp-filter name="VEVENT">' +
                        `        <c:time-range start="${startDateString}"${endTimeRange}/>` +
                        '      </c:comp-filter>' +
                        '</c:comp-filter>' +
                    '</c:filter>' +
                  '</c:calendar-query>',
            auth: {
                username: this.username,
                password: this.password
            }
        });       
    };

    multiGetEvents = async(eventUrls: string[]): Promise<AxiosResponse> => {
        // Method for getting multiple by their url
        // Response status upon successfull request is 207
        return await this.axios.request({
            method: 'REPORT',
            url: this.calendarUrl,
            headers: {
                'Prefer': 'return-minimal',
                'Content-type': 'application/xml; charset=utf-8'
            },
            data: `<C:calendar-multiget xmlns:D="DAV:"
                    xmlns:C="urn:ietf:params:xml:ns:caldav">
                        <D:prop>
                        <D:getetag/>
                        <C:calendar-data/>
                        </D:prop>
                        ${this.multiGetSetRequestUrls(eventUrls)}
                    </C:calendar-multiget>`,
            auth: {
                username: this.username,
                password: this.password
            }
        });       
    };

    getCtag = async(): Promise<AxiosResponse> => {
        // Method for getting ctag (for checking if anything changed on the calendar)
        // Response status upon successfull request is 207
        // Status in xml response must also be checked, it has to be 200 OK
        return await this.axios.request({
            method: 'PROPFIND',
            url: this.calendarUrl,
            headers: {
                'Depth': 0,
                'Prefer': 'return-minimal',
                'Content-type': 'application/xml; charset=utf-8'
            },
            data: '<d:propfind xmlns:d="DAV:" xmlns:cs="http://calendarserver.org/ns/">' +
                      '<d:prop>' +
                          '<d:displayname />' +
                          '<cs:getctag />' +
                      '</d:prop>' +
                  '</d:propfind>',
            auth: {
                username: this.username,
                password: this.password
            }
        });
    };

    getEtags = async(): Promise<AxiosResponse> => {
        // Method for getting etags of events, to check if any specific event has changed
        // Response status upon successfull request is 207
        return await this.axios.request({
            method: 'REPORT',
            url: this.calendarUrl,
            headers: {
                'Depth': 1,
                'Prefer': 'return-minimal',
                'Content-type': 'application/xml; charset=utf-8'
            },
            data: '<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">' +
                    '<d:prop>' +
                        '<d:getetag />' +
                    '</d:prop>' +
                    '<c:filter>' +
                        '<c:comp-filter name="VCALENDAR">' +
                            '<c:comp-filter name="VEVENT" />' +
                    '   </c:comp-filter>' +
                    '</c:filter>' +
                  '</c:calendar-query>',

            auth: {
                username: this.username,
                password: this.password
            }
        });
    };

    private multiGetSetRequestUrls(eventUrls: string[]): string {
        let data = '';

        for(const url of eventUrls){
            data += `<D:href>${url}</D:href>\r\n`;
        }

        return data;
    }
}