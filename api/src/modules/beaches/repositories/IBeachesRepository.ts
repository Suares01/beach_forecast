import { UpdateBeachDto } from "../dtos/updateBeach.dto";
import { IBeach } from "../entities/Beach";

export interface FindByName {
  name: string;
}

export interface FindByLatLng {
  lat: number;
  lng: number;
}

/**
 * @description BeachesRepository implementation
 */
export interface IBeachesRepository {
  /**
   * @description register a beach
   * @param data beach data that will be created
   * @returns registered beach
   */
  create(data: IBeach): Promise<IBeach>;

  /**
   * @description find an user beach by name
   * @param userId id of a registered user
   * @param data beach name
   * @returns registered beach or null
   */
  findByName(userId: string, data: FindByName): Promise<IBeach | null>;

  /**
   * @description find a user beach by id
   * @param id beach id
   * @returns registered beach or null
   */
  findById(id: string): Promise<IBeach | null>;

  /**
   * @description find an user beach by latitude and longitude
   * @param userId id of a registered user
   * @param data beach lat (latitude) and lng (longitude)
   * @returns registered beach or null
   */
  findByLatLng(userId: string, data: FindByLatLng): Promise<IBeach | null>;

  /**
   * @description find all user beaches
   * @param userId id of a registered user
   * @returns user beach list
   */
  findAll(userId: string): Promise<IBeach[]>;

  /**
   * @description update a user beach
   * @param id beach id
   * @param data fields to update
   * @returns updated beach
   */
  update(id: string, data: UpdateBeachDto): Promise<IBeach>;

  /**
   * @description delete a user beach
   * @param id beach id
   * @returns deleted beach
   */
  delete(id: string): Promise<IBeach>;

  /**
   * @description delete all user beach
   * @param userId id of a registered user
   * @returns count of deleted beaches
   */
  deleteMany(userId: string): Promise<number>;
}
