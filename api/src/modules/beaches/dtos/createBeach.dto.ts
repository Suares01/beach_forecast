export interface CreateBeachDto {
  lat: number;
  lng: number;
  name: string;
  position: "S" | "E" | "W" | "N";
  userId: string;
}
