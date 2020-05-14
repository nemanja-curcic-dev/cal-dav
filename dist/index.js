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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ICAL = __importStar(require("ical.js"));
var caldav_service_1 = require("./lib/caldav-service");
var caldav_parser_1 = require("./lib/caldav-parser");
var logger_1 = __importDefault(require("@coozzy/logger"));
var DefaultCalDavClient = /** @class */ (function () {
    function DefaultCalDavClient(username, password, calendarUrl, service, parser) {
        var _this = this;
        this.getEvent = function (eventUid) { return __awaiter(_this, void 0, void 0, function () {
            var response, calData, comp, vevent, event_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.service.getEvent(eventUid)];
                    case 1:
                        response = _a.sent();
                        if (response.status === 200) {
                            calData = ICAL.parse(response.data);
                            comp = new ICAL.Component(calData);
                            vevent = comp.getFirstSubcomponent('vevent');
                            event_1 = new ICAL.Event(vevent);
                            logger_1["default"].info("CalDavClient.GetEvent: Successfully got event " + event_1.uid + ". ");
                            return [2 /*return*/, event_1];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        logger_1["default"].error("CalDavClient.GetEvent: " + e_1.message + ". ");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.deleteEvent = function (eventUid) { return __awaiter(_this, void 0, void 0, function () {
            var response, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.service.deleteEvent(eventUid)];
                    case 1:
                        response = _a.sent();
                        if (response.status === 204) {
                            logger_1["default"].info("CalDavClient.DeleteEvent: Successfully deleted event " + eventUid + ". ");
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        logger_1["default"].error("CalDavClient.DeleteEvent: " + e_2.message + ". ");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.listAllEvents = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, events, eventsData, _i, eventsData_1, eventData, calData, comp, vevents, i, urlParts, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.service.listAllEvents()];
                    case 1:
                        response = _a.sent();
                        events = [];
                        if (!(response.status === 207)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.parser.parseListOfEvents(response.data)];
                    case 2:
                        eventsData = _a.sent();
                        if (eventsData.length) {
                            for (_i = 0, eventsData_1 = eventsData; _i < eventsData_1.length; _i++) {
                                eventData = eventsData_1[_i];
                                calData = ICAL.parse(eventData.event);
                                comp = new ICAL.Component(calData);
                                vevents = comp.getAllSubcomponents('vevent');
                                events.push.apply(events, vevents);
                            }
                        }
                        events = events.map(function (event) { return new ICAL.Event(event); });
                        for (i = 0; i < events.length; i++) {
                            urlParts = eventsData[i].url.split('/');
                            events[i].component.addPropertyWithValue('url', urlParts[urlParts.length - 1]);
                            /* eslint-enable security/detect-object-injection */
                        }
                        logger_1["default"].info('CalDavClient.ListAllEvents: Successfully listed all events. ');
                        return [2 /*return*/, events];
                    case 3: return [2 /*return*/, []];
                    case 4:
                        e_3 = _a.sent();
                        logger_1["default"].error("CalDavClient.ListAllEvents: " + e_3.message + ". ");
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.listEventsInTimeRange = function (startDate, endDate) { return __awaiter(_this, void 0, void 0, function () {
            var response, events, eventsData, _i, eventsData_2, eventData, calData, comp, vevents, i, urlParts, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.service.listEventsInTimeRange(startDate, endDate)];
                    case 1:
                        response = _a.sent();
                        events = [];
                        if (!(response.status === 207)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.parser.parseListOfEvents(response.data)];
                    case 2:
                        eventsData = _a.sent();
                        if (eventsData.length) {
                            for (_i = 0, eventsData_2 = eventsData; _i < eventsData_2.length; _i++) {
                                eventData = eventsData_2[_i];
                                calData = ICAL.parse(eventData.event);
                                comp = new ICAL.Component(calData);
                                vevents = comp.getAllSubcomponents('vevent');
                                events.push.apply(events, vevents);
                            }
                        }
                        events = events.map(function (event) { return new ICAL.Event(event); });
                        for (i = 0; i < events.length; i++) {
                            urlParts = eventsData[i].url.split('/');
                            events[i].component.addPropertyWithValue('url', urlParts[urlParts.length - 1]);
                            /* eslint-enable security/detect-object-injection */
                        }
                        logger_1["default"].info("CalDavClient.ListEventsInTimRange: Successfully listed events in time range " + startDate + " - " + (endDate ? endDate : '') + ". ");
                        return [2 /*return*/, events];
                    case 3: return [2 /*return*/, []];
                    case 4:
                        e_4 = _a.sent();
                        logger_1["default"].error("CalDavClient.ListEventsInTimRange: " + e_4.message + ". ");
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.createEvent = function (id, referenceIds, title, description, location, startDate, endDate, attendees, categories) { return __awaiter(_this, void 0, void 0, function () {
            var calendar, event_2, _i, categories_1, category, categoriesProperty, eventString, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        calendar = new ICAL.Component('vcalendar');
                        event_2 = new ICAL.Event(calendar);
                        event_2.component.addPropertyWithValue('BEGIN', 'VEVENT');
                        event_2.uid = id;
                        event_2.summary = title;
                        event_2.description = description;
                        event_2.location = location;
                        event_2.startDate = new ICAL.Time(startDate);
                        event_2.endDate = new ICAL.Time(endDate);
                        if (categories.length) {
                            for (_i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
                                category = categories_1[_i];
                                categoriesProperty = new ICAL.Property('categories');
                                categoriesProperty.setValue(category);
                                event_2.component.addProperty(categoriesProperty);
                            }
                        }
                        if (attendees.length) {
                            this.addAttendees(attendees, event_2);
                        }
                        if (referenceIds.length) {
                            event_2.component.addPropertyWithValue('referenceids', referenceIds.join(','));
                        }
                        event_2.component.addPropertyWithValue('END', 'VEVENT');
                        eventString = event_2.toString();
                        // change ATTENDEE: to ATTENDEE;
                        eventString = eventString.replace(/ATTENDEE:/gi, 'ATTENDEE;');
                        return [4 /*yield*/, this.service.createUpdateEvent(eventString, id)];
                    case 1:
                        _a.sent();
                        logger_1["default"].info("CalDavClient.CreateUpdateEvent: Successfully created event " + id + ". ");
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        logger_1["default"].error("CalDavClient.CreateEvent: " + e_5.message + ". ");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.updateEvent = function (event, referenceIds, title, description, location, startDate, endDate, attendees, categories) { return __awaiter(_this, void 0, void 0, function () {
            var _i, categories_2, category, categoriesProperty, eventString, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        event.summary = title;
                        event.description = description;
                        event.location = location;
                        event.startDate = new ICAL.Time(startDate);
                        event.endDate = new ICAL.Time(endDate);
                        event.component.removeAllProperties('categories');
                        event.component.removeAllProperties('attendee');
                        event.component.removeAllProperties('referenceids');
                        if (categories.length) {
                            for (_i = 0, categories_2 = categories; _i < categories_2.length; _i++) {
                                category = categories_2[_i];
                                categoriesProperty = new ICAL.Property('categories');
                                categoriesProperty.setValue(category);
                                event.component.addProperty(categoriesProperty);
                            }
                        }
                        if (attendees.length) {
                            this.addAttendees(attendees, event);
                        }
                        if (referenceIds.length) {
                            event.component.addPropertyWithValue('referenceids', referenceIds.join(','));
                        }
                        eventString = event.toString();
                        eventString = eventString.replace(/ATTENDEE:/gi, 'ATTENDEE;');
                        return [4 /*yield*/, this.service.createUpdateEvent('BEGIN:VCALENDAR\r\n' + eventString + '\r\nEND:VCALENDAR', event.uid)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_6 = _a.sent();
                        logger_1["default"].error("CalDavClient.UpdateEvent: " + e_6.message + ". ");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.service = service || new caldav_service_1.DefaultCalDavService(username, password, calendarUrl);
        this.parser = parser || new caldav_parser_1.DefaultCalDavParser();
    }
    DefaultCalDavClient.prototype.addAttendees = function (attendees, event) {
        for (var _i = 0, attendees_1 = attendees; _i < attendees_1.length; _i++) {
            var attendee = attendees_1[_i];
            var attendeeValue = '';
            if (attendee.status) {
                attendeeValue += "PARTSTAT=" + attendee.status + ";";
            }
            if (attendee.displayName) {
                attendeeValue += "CN=" + attendee.displayName;
            }
            if (attendee.email) {
                attendeeValue += ":mailto:" + attendee.email;
            }
            event.component.addPropertyWithValue('ATTENDEE', attendeeValue);
        }
    };
    return DefaultCalDavClient;
}());
exports.DefaultCalDavClient = DefaultCalDavClient;
