import express from "express";
import {createTransportRoutes} from "../controller/Navigation";
import logger from "../../utils/logger";

const navRouter = express.Router()

// body is { from: CalendarEvent, to: CalendarEvent, mode: TransportMode }
navRouter.post("/", async (req, res) => {
  logger.debug(JSON.stringify(req.body));
  const { from, to } = req.body;
  logger.info(`Navigating from ${from.name} to ${to.name}`);
  const t_events = await createTransportRoutes(from, to);
  res.status(200).json({ t_events, message: "Navigated" });
});

export default navRouter;