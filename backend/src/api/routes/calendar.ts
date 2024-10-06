import express from "express";
import {analyzeDay, printDayView} from "../controller/calendar";

import {sampleDays} from "../../utils/sampleData";
import {createTransportRoutes, optimizeTransportRoutes} from "../controller/Navigation";
import {CalendarEvent} from "../model/CalendarEvent";
import logger from "../../utils/logger";

const calRouter = express.Router();

calRouter.post("/day", analyzeDay);
// print a specific day
// calRouter.post("/print/", printDayView);

calRouter.get("/print/:idx", async (req, res) => {
  if (!(req.params) || !(req.params.idx)) {
    res.status(400).json({error: "Missing day index"});
    return;
  }
  const idx = parseInt(req.params.idx);
  if (idx < 0 || idx >= sampleDays.length) {
    res.status(400).json({error: "invalid sample day"});
    return;
  }
  printDayView(sampleDays[idx]);
  res.status(200).json({message: "printed"});
});

calRouter.post('/analyze', async (req, res) => {
  // analyze a list of days
  console.log(req);
  const {days} = req.body;
  const new_events = []
  if (days === undefined) {
    res.status(400).json({error: "Missing days"});
    return;
  }
  for (let i = 0; i < days.length; i++) {
    // get two events at a time and build all possible transportation events
    const day_options = []
    for (let j = 0; j < days[i].events.length - 1; j++) {
      const from: CalendarEvent = {
        ...days[i].events[j],
        start: new Date(days[i].events[j].start),
        end: new Date(days[i].events[j].end),
      }
      const to: CalendarEvent = {
        ...days[i].events[j + 1],
        start: new Date(days[i].events[j].start),
        end: new Date(days[i].events[j].end),
      }
      day_options.push(await createTransportRoutes(from, to))
    }
    new_events.push(await optimizeTransportRoutes(days[i].events, day_options))
  }
  // atp: new_events is [[day1_options], [day2_options], ...]
  // -> TEvents

  res.status(200).json({payload: new_events, message: "analyzed"});
});

export default calRouter;
