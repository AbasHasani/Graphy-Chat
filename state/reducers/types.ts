type id = string | number;

export interface Currents {
  name: string;
  id: id;
  rooms: string[] | [];
}
export interface CurrentsState {
  currents: Currents;
}
// Current room
export interface CurrentRoom {
  room: string;
}
