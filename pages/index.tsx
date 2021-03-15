import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Currents, CurrentsState } from "../state/reducers/types";
import { setInformation } from "../state/reducers/currents";
import { v4 as uuidv4 } from "uuid";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/dist/client/router";
import { REMOVE_USER_QUERY } from "../comps/users"
const ADD_USER_QUERY = gql`
  mutation($name: String!, $id: String!, $rooms: [String!]) {
    addUser(name: $name, id: $id, rooms: $rooms) {
      name
      id
      rooms
    }
  }
`;
export default function Home() {
  const [name, setName] = useState<string>("");
  const dispatch = useDispatch();
  const { name: userName, id, rooms } = useSelector((state: CurrentsState) => state.currents);
  const [addUser, {}] = useMutation(ADD_USER_QUERY);
  const [removeUser, { error }] = useMutation(REMOVE_USER_QUERY);
  const router = useRouter();
  const onSubmitHandler = (e) => {
    e.preventDefault();
    if(userName.length > 0) {
      router.push("/chaty")
      return false;
    }
    if(!name) return false;
    const info: Currents = {
      name,
      rooms: [],
      id: uuidv4(),
    };
    dispatch(setInformation(info));
    addUser({
      variables: info,
    });
    router.push("/chaty")
  };
  const logOut = (e) => {
    removeUser({
      variables: {
        id,
      }
    });
    const emptyInfoFild: Currents = {
      name: "",
      id: "",
      rooms: []
    }
    dispatch(setInformation(emptyInfoFild));
  };
  
  if(error) {
    return <pre>
      {JSON.stringify(error)}
    </pre>   
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Chat App</title>
        <link rel="icon" href="/favicon.ico" />
        <meta http-equiv="origin-trial" content="TOKEN_GOES_HERE" />
      </Head>

      <main className={styles.main}>
        { userName ? <h2>Welcome to ChatGraphy {userName}</h2> : <h2>You shoud Sign in</h2> }
        <form onSubmit={onSubmitHandler}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyUp={e=> e.key === "Enter" ?  e.preventDefault() : null}
            disabled={userName ? true : false}
          />
          <br />
          <input type="submit" value={userName ? "Log in" : "Sign in"} />
          <button type="button" disabled={userName ? false : true} onClick={logOut}>
            Log Out
          </button>
        </form>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
