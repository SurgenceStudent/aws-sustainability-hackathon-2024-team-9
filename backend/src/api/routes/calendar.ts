import express from "express";
import { analyzeDay, printDayView } from "../controller/calendar";
import { sampleDays } from "../../utils/sampleData";

const calRouter = express.Router();

calRouter.post("/day", analyzeDay);
// print a specific day
// calRouter.post("/print/", printDayView);

calRouter.get("/print/:idx", async (req, res) => {
  if (!(req.params) || !(req.params.idx)) {
    res.status(400).json({ error: "Missing day index" });
    return;
  }
  const idx = parseInt(req.params.idx);
  if (idx < 0 || idx >= sampleDays.length) {
    res.status(400).json({ error: "invalid sample day" });
    return;
  }
  printDayView(sampleDays[idx]);
  res.status(200).json({ message: "printed" });
});

export default calRouter;
