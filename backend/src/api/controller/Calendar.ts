import { Request, Response } from "express";
import { Day } from "../model/Day";
import { CalendarEvent } from "../model/CalendarEvent";
import { TM_TO_VERB, TransportMode } from "../model/TransportMode";
import { TransportationEvent } from "../model/TransportationEvent";
import logger from "../../utils/logger";

export async function analyzeDay(req: Request, res: Response) {
  const { day } = req.body;
  if (day === undefined) {
    res.status(400).json({ error: "Missing day" });
  }
}

export function printDayView(day: Day) {
  let dayInfo = `Day: ${day.date.toDateString()}`
  day.events.forEach(event => {
    if ("from" in event) {
      dayInfo = `${dayInfo}\n${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}: ${event.name} at ${event.from}`;
    } else {
      dayInfo = `${dayInfo}\n${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}: ${event.name} at ${event.address}`;
    }
  });
  logger.info(dayInfo);
}

// transforms a day by including a transportation event from 'from' to 'to'
export async function addTransportationEvent(day: Day, from: CalendarEvent, to: CalendarEvent, mode: TransportMode): Promise<Day> {
  const transportationEvent: TransportationEvent = {
    name: `Taking a ${TM_TO_VERB[mode]} ${from.name} to ${to.name}`,
    mode: mode,
    start: from.end,
    end: to.start,
    from: from.address,
    to: to.address,
  };
  day.events.push(transportationEvent);
  return day;
}

