// Description: Models a calendar event in a given day

interface Event {
  name: string,  // event name
  desc?: string, // description
  mode: TransportMode,
  start: Date,
  end: Date,
  address: string,
  timeSensitive: boolean,
  daySensitive: boolean
}