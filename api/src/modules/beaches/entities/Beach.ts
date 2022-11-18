import { v4 as uuid } from "uuid";

import { CreateBeachDto } from "../dtos/createBeach.dto";

export interface IBeach {
  id: string;
  lat: number;
  lng: number;
  name: string;
  position: "S" | "E" | "W" | "N";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Beach {
  private readonly props: IBeach;

  get id(): string {
    return this.props.id;
  }

  get lat(): number {
    return this.props.lat;
  }

  get lng(): number {
    return this.props.lng;
  }

  get position(): IBeach["position"] {
    return this.props.position;
  }

  get name(): string {
    return this.props.name;
  }

  get userId(): string {
    return this.props.id;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  constructor({ lat, lng, name, position, userId }: CreateBeachDto) {
    this.props = {
      id: uuid(),
      lat,
      lng,
      name,
      position,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
