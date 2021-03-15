import React from "react";
import { useSubscription, gql, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";
import { Currents, CurrentsState } from "../state/reducers/types";
import { setInformation } from "../state/reducers/currents";
import { useRouter } from "next/dist/client/router";
import { switchRoom } from "../state/reducers/currentRoom";
const USERS_QUERY = gql`
  subscription {
    users {
      name
      rooms
      id
    }
  }
`;
export const REMOVE_USER_QUERY = gql`
  mutation($id: String!) {
    removeUser(id: $id) {
      name
      id
      rooms
    }
  }
`;
interface UserType {
  name: string;
  id: string;
  rooms: string[];
}
const Users = () => {
  const { data, loading, error } = useSubscription(USERS_QUERY);
  const [logOut, { data: removedUser }] = useMutation(REMOVE_USER_QUERY);
  const { id, name, rooms }: Currents = useSelector(
    (state: CurrentsState) => state.currents
  );
  const { room } = useSelector((state) => state.currentRoom);
  const dispatch = useDispatch();
  const router = useRouter();
  const logOutUser = () => {
    logOut({ variables: { id } });
    const info: Currents = {
      id: "",
      name: "",
      rooms: [],
    };
    dispatch(switchRoom(""));
    dispatch(setInformation(info));
    router.push("/");
  };

  if (loading) return <h2>Loading...</h2>;
  if (error)
    return (
      <div>
        Error : <br /> <pre>{JSON.stringify(error)}</pre>
      </div>
    );
  return (
    <>
      <div className="users-self" style={{}}>
        <div className="selfUser">
          <p>
            {name} in {room || "No oom "}
          </p>
        </div>
        <div>
          <h4>Group members</h4>
          {data.users
            .filter((user: UserType) => user.rooms.includes(room))
            .map((user) => (
              <div key={user.id}>{user.name}</div>
            ))}
        </div>
        <div className="logOut">
          <button onClick={logOutUser}>Log Out</button>
        </div>
      </div>
      <style jsx>{`
        .users-self {
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-rows: 200px auto 200px;
          border-left: 1px solid rgb(225,225,225);
          padding: 1em;
        }
        .logOut {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .logOut button {
          padding: 0.7em 1em;
          font-family: Fira Code;
          font-weight: normal;
          background: rgb(200,15,60);
          border: none;
          border-radius: 10px;
          color: white;

        }
      `}</style>
    </>
  );
};

export default Users;
