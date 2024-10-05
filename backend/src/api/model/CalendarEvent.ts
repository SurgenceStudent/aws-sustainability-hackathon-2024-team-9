// Description: Models a calendar event in a given day

export interface CalendarEvent {
  name: string,  // event name
  start: Date,
  end: Date,
  address: string,
  timeSensitive: boolean,
  daySensitive: boolean
}