// Description: Represents a day in the calendar with a series of events

import { CalendarEvent } from "./CalendarEvent";
import { TransportationEvent } from "./TransportationEvent";

export interface Day {
  date: Date;  // day this represents, time does not matter
  events: Array<CalendarEvent | TransportationEvent> // list of events in this day
}