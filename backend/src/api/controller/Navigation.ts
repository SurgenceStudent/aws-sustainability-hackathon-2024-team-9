// Description: Holds functions for navigating between addresses
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
