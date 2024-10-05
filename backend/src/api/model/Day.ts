// Description: Represents a day in the calendar with a series of events
interface Day {
  date: Date;  // day this represents, time does not matter
  events: Event[];  // list of events in this day
}