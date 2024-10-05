import { CalendarEvent } from "../api/model/CalendarEvent";
import { Day } from "../api/model/Day";

const event1: CalendarEvent = {
  name: "Morning Meeting",
  start: new Date('2023-10-01T09:00:00'),
  end: new Date('2023-10-01T10:00:00'),
  address: "Office",
  timeSensitive: true,
  daySensitive: false,
};

const event2: CalendarEvent = {
  name: "Project Discussion",
  start: new Date('2023-10-01T10:45:00'),
  end: new Date('2023-10-01T11:30:00'),
  address: "Conference Room",
  timeSensitive: true,
  daySensitive: false,
};

const event3: CalendarEvent = {
  name: "Lunch Break",
  start: new Date('2023-10-01T12:00:00'),
  end: new Date('2023-10-01T13:00:00'),
  address: "Cafeteria",
  timeSensitive: true,
  daySensitive: false,
};

const event4: CalendarEvent = {
  name: "Client Presentation",
  start: new Date('2023-10-01T13:30:00'),
  end: new Date('2023-10-01T14:30:00'),
  address: "Client Office",
  timeSensitive: true,
  daySensitive: false,
};

const event5: CalendarEvent = {
  name: "Team Sync",
  start: new Date('2023-10-01T15:00:00'),
  end: new Date('2023-10-01T15:45:00'),
  address: "Office",
  timeSensitive: true,
  daySensitive: false,
};

const event6: CalendarEvent = {
  name: "Wrap-up Meeting",
  start: new Date('2023-10-01T16:30:00'),
  end: new Date('2023-10-01T17:00:00'),
  address: "Office",
  timeSensitive: true,
  daySensitive: false,
};

const event7: CalendarEvent = {
  name: "Team Standup",
  start: new Date('2023-10-02T09:00:00'),
  end: new Date('2023-10-02T09:30:00'),
  address: "Office",
  timeSensitive: true,
  daySensitive: false,
};

const event8: CalendarEvent = {
  name: "Client Call",
  start: new Date('2023-10-02T11:00:00'),
  end: new Date('2023-10-02T12:00:00'),
  address: "Office",
  timeSensitive: true,
  daySensitive: false,
};

const event9: CalendarEvent = {
  name: "Code Review",
  start: new Date('2023-10-02T14:00:00'),
  end: new Date('2023-10-02T15:00:00'),
  address: "Office",
  timeSensitive: true,
  daySensitive: false,
};

const event10: CalendarEvent = {
  name: "Design Meeting",
  start: new Date('2023-10-02T15:30:00'),
  end: new Date('2023-10-02T16:30:00'),
  address: "Office",
  timeSensitive: true,
  daySensitive: false,
};

const event11: CalendarEvent = {
  name: "Wrap-up Session",
  start: new Date('2023-10-02T17:00:00'),
  end: new Date('2023-10-02T17:30:00'),
  address: "Office",
  timeSensitive: true,
  daySensitive: false,
};

const event12: CalendarEvent = {
  name: "Workshop",
  start: new Date('2023-10-03T10:00:00'),
  end: new Date('2023-10-03T12:00:00'),
  address: "Office",
  timeSensitive: true,
  daySensitive: false,
};

const event13: CalendarEvent = {
  name: "Networking Event",
  start: new Date('2023-10-03T15:00:00'),
  end: new Date('2023-10-03T17:00:00'),
  address: "Conference Center",
  timeSensitive: true,
  daySensitive: false,
};

const day1: Day = {
  date: new Date('2023-10-01'),
  events: [event1, event2, event3, event4, event5, event6],
};

const day2: Day = {
  date: new Date('2023-10-02'),
  events: [event7, event8, event9, event10, event11],
};

const day3: Day = {
  date: new Date('2023-10-03'),
  events: [event12, event13],
};

export const sampleDays = [day1, day2, day3];