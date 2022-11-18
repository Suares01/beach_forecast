import { IBeach } from "../contexts/beaches/context";

type Position = IBeach["position"];

export const handlePosition = (position: Position): string => {
  switch (position) {
    case "N":
      return "North";
    case "E":
      return "East";
    case "W":
      return "West";
    case "S":
      return "South";
  }
};
