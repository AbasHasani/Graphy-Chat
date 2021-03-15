import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Currents } from "./types";

const initialState: Currents = {
  name: "",
  id: "",
  rooms: [],
};

const currents = createSlice({
  name: "currents",
  initialState,
  reducers: {
    setInformation(
      state: Currents,
      { payload: { rooms, id, name } }: PayloadAction<Currents>
    ) {
      state.name = name;
      state.id = id;
      state.rooms = rooms;
    },
    addRoom(state, { payload: room }: PayloadAction<string>) {
        state.rooms = [...state.rooms, room]
    },
    removeRoom(state, { payload }: PayloadAction<string>) {
      state.rooms = state.rooms.filter(room => room !== payload)
    }
  },
});
export const { setInformation, addRoom, removeRoom } = currents.actions;

export default currents.reducer;
