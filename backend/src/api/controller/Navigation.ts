// Description: Holds functions for navigating between addresses

const modelId = "meta.llama3-1-70b-instruct-v1:0";
const travelContext = `
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are a helpful AI assistant helping users schedule their day to use more sustainable forms of transportation when possible. You will receive a list of transporation events of the following structure:
TransportationEvent {
  name: string,  // event name
  mode: TransportMode,
  start: Date,
  end: Date,
  from: string, // starting location
  to: string, // ending location
}.

You will also receive a list of calendar events of the following structure:
CalendarEvent {
  name: string,  // event name
  start: Date,
  end: Date,
  address: string,
  timeSensitive: boolean,
  daySensitive: boolean
}

The CalendarEvents are immutable, they must remain at the exact same start and end date. The only thing you are responsible for is optimizing the user's schedule to now include viable transportation events. 
There is a strict order of priorities to consider when creating these viable schedules.
First and foremost, the schedule must be viable. Specifically, no start or end times must overlap with one of the immutable start or end times in the calendar events. As a user cannot be in two places at once, they must prioritize
their immutable calendar event. 
Secondly, the user will give you an input alongside the the events you are sent indicating their preferences for travel. For example, users may prefer to bus instead of walk due to fatigue. These preferences must be respected when possible.
Thirdly, if based on the above there is more than one possible schedule we can create choose the transportation event walking, then biking, then busing, then car. Prioritize it in that order, IF it is viable based on conditions one (viability)
and two (preferences). Note, that the walk or bike transportation event must not be longer than 40 minutes in duration. Additionally busing time cannot be longer than 2.5 times the car duration. 
<|eot_id|><|start_header_id|>user<|end_header_id|>
The immutable calendar events are:
CALENDAREVENTST

The different transportation events are as follows, note this is organized in form [[transportationEvent1,transportationEvent2, transportationEvent3, transportationEvent4]] you must choose ONE of the four for each sublist. Base it again off the above
specifications, viability, preferences, and sustainability rules (1,2,3) above.

TRANSPORTATIONEVENTS

I need you to output the response in JSON format following the CalendarEvent object fields and types, return a list of these such objects in chronological order:
CalendarEvent {
  name: string,  // event name
  start: Date,
  end: Date,
  address: string,
  timeSensitive: boolean,
  daySensitive: boolean
}

Do not include newlines in your response at the beginning and end. 

Do not return anything other than JSON. Only return JSON. Do not return anything besides pure JSON.

<|eot_id|><|start_header_id|>assistant<|end_header_id|>
`;

import {BedrockRuntimeClient, ConverseCommand, ConverseCommandInput} from "@aws-sdk/client-bedrock-runtime";
import axios from 'axios';
import '../../utils/loadEnv'
import logger from "../../utils/logger";
import {CalendarEvent} from "../model/CalendarEvent";
import {TM_TO_GUI, TransportMode} from "../model/TransportMode";
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import {TransportationEvent} from "../model/TransportationEvent";

const API_KEY = process.env['GMAPS_API_KEY'];

function dateToTimestamp(date: Date): Timestamp {
  const timestamp = new Timestamp();
  logger.debug(`Date: ${date}`);
  const seconds = Math.floor(date.getTime() / 1000);
  const nanos = (date.getTime() % 1000) * 1e6;
  timestamp.setSeconds(seconds);
  timestamp.setNanos(nanos);
  return timestamp;
}

async function getRouteDetails(from: CalendarEvent, to: CalendarEvent, mode: string): Promise<TransportationEvent> {
  try {
    // Make the request to the Google Maps Directions API
    logger.debug(`Getting route details from ${from.address} to ${to.address} by ${mode}`);
    const gmapsReq = {
      params: {
        origin: from.address,
        destination: to.address,
        mode: mode.toLowerCase(),
        key: API_KEY,
        // arrivalTime: dateToTimestamp(to.start),
        // departureTime: 'now'
      }
    }
    logger.debug(`Request: ${JSON.stringify(gmapsReq)}`);

    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', gmapsReq);

    if (response.data.status !== 'OK') {
      throw new Error(`Error fetching route details: ${response.data.status}`);
    }

    // Extract the route details from the response
    const route = response.data.routes[0].legs[0];
    const distance = route.distance.value; // Distance in meters
    const duration = route.duration_in_traffic ? route.duration_in_traffic.value : route.duration.value; // Duration in seconds
    logger.debug(`Route distance: ${distance} meters, duration: ${duration} seconds`)
    const tStartTime = new Date(to.start.getTime() - (duration * 1000));
    return {
      name: `Taking a ${TM_TO_GUI[mode as TransportMode]} from ${from.name} to ${to.name}`,
      mode: mode as TransportMode,
      start: tStartTime,
      end: to.start,
      from: from.address,
      to: to.address
    }
  } catch (error) {
    logger.error('Error getting route details:', error);
    throw error;
  }
}

export async function createTransportRoutes(from: CalendarEvent, to: CalendarEvent) {
  const options = [] // will be mapped to Walk, Bike, Transit, Drive
  try {
    for (const mode of [TransportMode.Walk, TransportMode.Bike, TransportMode.Transit, TransportMode.Car]) {
      options.push(await getRouteDetails(from, to, mode));
    }
    return options;
  } catch (error) {
    logger.error('Error creating transport routes:', error);
    return null;
  }
}

export async function optimizeTransportRoutes(cEv: CalendarEvent[], tEv: any) {

  // @ts-ignore
  const client = new BedrockRuntimeClient({
    region: "us-west-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    },
  });

// Prompt the user for a question
  const newCtx = travelContext.replace("CALENDAREVENTST", JSON.stringify(cEv));

// Include transportation events in the travel context if needed
  const newerCtx = newCtx.replace("TRANSPORTATIONEVENTS", JSON.stringify(tEv));


// The conversation starts with the user's question
  const conversation = [
    {
      role: "user", // User's question first
      content: [{ text: newerCtx }],
    },
  ];

  const inp: any = {
    modelId: modelId,
    messages: conversation,
    inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
  }

  const command = new ConverseCommand(inp);

  const main = async () => {
    try {
      console.log("Travel Context:", newerCtx);
      // @ts-ignore
      const response = await client.send(command);
      // @ts-ignore
      const responseText = response.output.message.content[0].text;
      // logger.debug(responseText)
      if (!responseText) {
        logger.error("No response from model");
        return null;
      }
      // clean the string and convert the JSON list (as string) an array
      const jsonResp = responseText.trim();
      const parsedResp = JSON.parse(jsonResp);
      // logger.debug(parsedResp)
      return parsedResp;
    } catch (err) {
      if (err instanceof SyntaxError) {
        logger.error("Error parsing JSON response:", err);
        return null;
      } else {
        logger.error(`ERROR: Can't invoke '${modelId}'. Reason: ${err}`);
      }
      process.exit(1);
    }
  };
  return await main();
}