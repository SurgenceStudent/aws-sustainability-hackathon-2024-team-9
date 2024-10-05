// Description: Models a calendar event in a given day

interface Event {
  name: string,  // event name
  mode: TransportMode // transport mode
  desc?: string, // description
  start: Date,
  end: Date,
  address: string,
  timeSensitive: boolean,
  daySensitive: boolean
}