export enum TransportMode {
  Walk="WALKING",
  Bike="BICYCLING",
  Transit="TRANSIT",
  Car="DRIVING",
}

export const TM_TO_GUI = {
  [TransportMode.Walk]: "walk",
  [TransportMode.Car]: "drive",
  [TransportMode.Bike]: "bike",
  [TransportMode.Transit]: "transit",
};