import express from "express";
import { Start, getData, getHistoryData } from "../controller/Data.js";

const route = express.Router();

route.get("/start", Start);
route.get("/getData", getData);
route.post("/getHistoryData", getHistoryData);

// route.post('/file/upload',upload.single("file"), uploadFile )

export default route;
