// Description: Represents a day in the calendar with a series of events

import { CalendarEvent } from "./CalendarEvent";

export interface Day {
  date: Date;  // day this represents, time does not matter
  events: Array<CalendarEvent> // list of events in this day
}