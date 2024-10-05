// Description: Models a calendar event in a given day

import { TransportMode } from "./TransportMode";

export interface TransportationEvent {
  name: string,  // event name
  mode: TransportMode,
  start: Date,
  end: Date,
  from: string, // starting location
  to: string, // ending location
}