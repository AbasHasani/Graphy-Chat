import { send } from "node:process";
import { useEffect, useRef, useState } from "react";
import { useSubscription, gql, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";

const MESSAGE_QUERY = gql`
  subscription {
    messages {
      context
      room
      id
      name
    }
  }
`;

const CREATE_MESSAGE_QUERY = gql`
  mutation($name: String!, $room: String!, $context: String!) {
    createMessage(name: $name, room: $room, context: $context)
  }
`;

const Messages = () => {
  const { data, loading, error } = useSubscription(MESSAGE_QUERY);
  const [createMessage, {}] = useMutation(CREATE_MESSAGE_QUERY);
  const [message, messageSet] = useState("");
  const { room } = useSelector((state) => state.currentRoom);
  const { name } = useSelector((state) => state.currents);
  const divRef = useRef<HTMLDivElement>(null);
  const onSend = () => {
    if (!message) return false;
    createMessage({
      variables: {
        name,
        room,
        context: message,
      },
    });
    messageSet("");
  };
  const showMessages = (message: string) => {
    if (message === `${name} has joined the ${room} group`) {
      return `You joined the ${room} group`;
    } else if (message === `${name} has left the ${room} group`) {
      return `You left the ${room} group`;
    } else {
      return message;
    }
  };
  useEffect(() => {
    if (!divRef.current) return;
    const {
      scrollHeight, scrollTop, clientHeight ,
    } = divRef.current;
    const isAtBottom = scrollHeight - scrollTop === clientHeight + 101;
    console.log(scrollHeight - scrollTop, clientHeight + 101);
    isAtBottom
      ? (divRef.current.scrollTop = divRef.current.scrollHeight)
      : null;
  }, [data]);
  if (loading) return <h2>Loading...</h2>;
  if (error)
    return (
      <div>
        <h2>Error :(</h2>
        <pre>{JSON.stringify(error)}</pre>
      </div>
    );
  if (!room)
    return (
      <h2 style={{ fontFamily: "Fira Code" }}>
        You Should join or create a room
      </h2>
    );
  return (
    <>
      <div className="chatkit">
        <div className="chatFeed" style={{ overflowY: "auto" }} ref={divRef}>
          {data.messages
            .filter((message) => message.room === room)
            .map((message, index) => (
              <div
                key={message.id * 4616649658 + index + message}
                className="message"
                style={{
                  justifyContent:
                    message.name === name ? "flex-end" : "flex-start",
                }}
              >
                {message.name !== name && (
                  <p style={{ color: "black" }}>{message.name}</p>
                )}
                <p
                  style={{
                    background:
                      message.name === name
                        ? "rgb(10,200,10)"
                        : "rgb(80,80,80)",
                    padding: "1em 1.5em",
                    borderRadius: "10px",
                  }}
                >
                  {showMessages(message.context)}
                </p>
              </div>
            ))}
        </div>
        <div className="messageSender">
          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => messageSet(e.target.value)}
            onKeyUp={(e) => (e.key === "Enter" ? onSend() : null)}
          />
          <button onClick={onSend}>Send</button>
        </div>
      </div>
      <style jsx>{`
        .chatkit {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
        }
        .chatFeed {
          height: 96vh;
          display: flex;
          flex-direction: column;
        }
        .chatFeed > :first-child {
          margin-top: auto !important;
        }
        .message {
          border-radios: 20px;
          margin: 8px 10px;
          border: none;
          display: flex;
          color: white;
        }
        .messageSender {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        input,
        button {
          padding: 0.7em 0em;
          border: none;
        }
        input {
          width: 90%;
          padding-left: 10px;
          border-top: 1px solid black;
        }
        button {
          width: 10%;
          background: rgb(25, 25, 200);
        }
        button:active {
          background: rgb(25, 25, 100);
        }
      `}</style>
    </>
  );
};

export default Messages;
