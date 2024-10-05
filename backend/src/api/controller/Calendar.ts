import { Request, Response } from "express";
import { Day } from "../model/Day";

export async function analyzeDay(req: Request, res: Response) {
  const { day } = req.body;
  if (day === undefined) {
    res.status(400).json({ error: "Missing day" });
  }
}

export function printDayView(day: Day) {
  console.log(`Day: ${day.date.toDateString()}`);
  day.events.forEach(event => {
    console.log(`${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}: ${event.name} at ${event.address}`);
  });
}
