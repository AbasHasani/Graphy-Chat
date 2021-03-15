import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentRoom } from "./types";
const initialState: CurrentRoom = { room: "" };

const currentRoom = createSlice({
  name: "currentRoom",
  initialState,
  reducers: {
    switchRoom(state: CurrentRoom, { payload }: PayloadAction<string>) {
      state.room = payload;
    },
  },
});
export const { switchRoom } = currentRoom.actions;

export default currentRoom.reducer;
