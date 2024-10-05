export enum TransportMode {
  Walk,
  Car,
  Bike,
  Bus,
}

export const TM_TO_VERB = {
  [TransportMode.Walk]: "walk",
  [TransportMode.Car]: "drive",
  [TransportMode.Bike]: "bike ride",
  [TransportMode.Bus]: "bus",
};