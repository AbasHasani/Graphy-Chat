import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchRoom } from "../state/reducers/currentRoom";
import { useMutation, gql } from "@apollo/client";
import { addRoom, removeRoom as deleteRoom } from "../state/reducers/currents";

const ADD_ROOM_QUERY = gql`
  mutation($room: String!, $id: String!) {
    addRoom(room: $room, id: $id)
  }
`;
const REMOVE_ROOM_QUERY = gql`
  mutation($id: String!, $room: String!) {
    removeRoom(id: $id, room: $room)
  }
`;
const Groups = () => {
  const { rooms: groups, id } = useSelector((state) => state.currents);
  const { room: currentRoom } = useSelector((state) => state.currentRoom);
  const [newGroupName, newGroupNameSet] = useState<string>("");
  const dispatch = useDispatch();
  const [pushNewRoom, {}] = useMutation(ADD_ROOM_QUERY);
  const [removeRoom, {}] = useMutation(REMOVE_ROOM_QUERY);
  const addNewRoom = () => {
    if(!newGroupName) return false;
    dispatch(addRoom(newGroupName));
    pushNewRoom({
      variables: {
        id,
        room: newGroupName,
      },
    });
  };
  const leaveRoom = (room: string, e) => {
    if (currentRoom === room) {
      dispatch(switchRoom(""));
    }
    dispatch(deleteRoom(room));
    removeRoom({
      variables: {
        id,
        room,
      },
    });
    e.stopPropagation();
  };
  return (
    
    <div style={{
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      justifyContent: "space-around",
      alignItems: "center"
    }}>
      <input
        type="text"
        value={newGroupName}
        onChange={(e) => newGroupNameSet(e.target.value)}
        onKeyUp={(e) => (e.key === "Enter" ? addNewRoom() : null)}
        style={{
          width: "15em",
          height: "2em",
          paddingLeft: "1em",
          marginTop: "1em"
        }}
      />
      <h1>Groups</h1>
      <div style={{
        flex: "1"
      }}>
      {groups.map((group, i) => (
        <div
          key={i * 6546161611 + group}
          style={{
            cursor: "pointer",
            margin: "10px 10px",
            fontFamily: "Fira Code",
            fontWeight: "normal",
            background: "rgba(85, 86, 114, 1)",
            padding: "5px 3px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => {
            dispatch(switchRoom(group));
          }}
        >
          {group}
          <button
            style={{
              color: "red",
              background: "rgba(105, 76, 114, 1)",
              borderRadius: "6px",
              padding: "5px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={(e) => leaveRoom(group, e)}
            >
            <small>leave</small>
          </button>
        </div>
      ))}
      </div>
    </div>
    
  );
};

export default Groups;
