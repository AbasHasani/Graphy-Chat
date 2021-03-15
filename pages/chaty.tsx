import React, { useState } from "react";
import Meassages from "../comps/messages";
import Users from "../comps/users";
import Groups from "../comps/groups";
const chaty = () => {
  const [isGroupsMenuOpen, setIsGroupsMenuOpen] = useState<boolean>(false);
  const [isUsersMenuOpen, setIsUsersMenuOpen] = useState<boolean>(false);
  return (
    <>
      <section className="chat" style={{}}>
        <button
          style={{ position: "absolute", zIndex: 1000000 }}
          onClick={() => setIsGroupsMenuOpen(!isGroupsMenuOpen)}
        >
          {isGroupsMenuOpen ? "Close" : "Open"}
        </button>
        <button
          style={{ position: "absolute", zIndex: 1000000, right: 0 }}
          onClick={() => setIsUsersMenuOpen(!isUsersMenuOpen)}
        >
          {isUsersMenuOpen ? "Close" : "Open"}
        </button>
        <div className={`groups ${isGroupsMenuOpen ? "groups-open" : ""}`}>
          <Groups />
        </div>
        <div className="messages">
          <Meassages />
        </div>
        <div className={`users ${isUsersMenuOpen ? "users-open" : ""}`}>
          <Users />
        </div>
      </section>
      <style jsx>
        {`
          .chat {
            position: relative;
            width: 100%;
            height: 100vh;
            display: grid;
            grid-template-columns: 400px auto 400px;
          }
          .groups {
            background: rgba(85, 86, 114, 0.86);
            backdrop-filter: blur(2rem);
          }
        `}
      </style>
    </>
  );
};

export default chaty;
