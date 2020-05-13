"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var axios_1 = __importDefault(require("axios"));
var moment_1 = __importDefault(require("moment"));
var DefaultCalDavService = /** @class */ (function () {
    function DefaultCalDavService(username, password, calendarUrl, axios) {
        var _this = this;
        this.getEvent = function (eventUid) { return __awaiter(_this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "" + this.calendarUrl + eventUid;
                        return [4 /*yield*/, this.axios.request({
                                method: 'GET',
                                url: url,
                                auth: {
                                    username: this.username,
                                    password: this.password
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.createUpdateEvent = function (eventData, eventUid) { return __awaiter(_this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "" + this.calendarUrl + eventUid;
                        return [4 /*yield*/, this.axios.request({
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
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.deleteEvent = function (eventUid) { return __awaiter(_this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "" + this.calendarUrl + eventUid;
                        return [4 /*yield*/, this.axios.request({
                                method: 'DELETE',
                                url: url,
                                auth: {
                                    username: this.username,
                                    password: this.password
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.listAllEvents = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.request({
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
                        })];
                    case 1: 
                    // Method for getting all events in calendar
                    // Response status upon successfull request is 207
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.listEventsInTimeRange = function (startDate, endDate) { return __awaiter(_this, void 0, void 0, function () {
            var startDateString, endDateString, endTimeRange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startDateString = moment_1["default"](startDate).utc().format('YYYYMMDD[T]HHmmss[Z]');
                        endDateString = (endDate) ? moment_1["default"](endDate).utc().format('YYYYMMDD[T]HHmmss[Z]') : null;
                        endTimeRange = (endDateString) ? " end=\"" + endDateString + "\"" : '';
                        return [4 /*yield*/, this.axios.request({
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
                                    ("        <c:time-range start=\"" + startDateString + "\"" + endTimeRange + "/>") +
                                    '      </c:comp-filter>' +
                                    '</c:comp-filter>' +
                                    '</c:filter>' +
                                    '</c:calendar-query>',
                                auth: {
                                    username: this.username,
                                    password: this.password
                                }
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.getCtag = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.request({
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
                        })];
                    case 1: 
                    // Method for getting ctag (for checking if anything changed on the calendar)
                    // Response status upon successfull request is 207
                    // Status in xml response must also be checked, it has to be 200 OK
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.getEtags = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.axios.request({
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
                        })];
                    case 1: 
                    // Method for getting etags of events, to check if any specific event has changed
                    // Response status upon successfull request is 207
                    return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.username = username;
        this.password = password;
        this.calendarUrl = calendarUrl;
        this.axios = axios || axios_1["default"].create({});
    }
    return DefaultCalDavService;
}());
exports.DefaultCalDavService = DefaultCalDavService;
