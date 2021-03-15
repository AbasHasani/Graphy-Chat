import "../styles/globals.scss";
import { persistedStore, store } from "../state/store";
import { Provider } from "react-redux";
import { createWrapper } from "next-redux-wrapper";
import { PersistGate } from "redux-persist/integration/react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from '@apollo/client/link/ws';
import ws from "ws";
const link = process.browser ?  new WebSocketLink({
  uri: 'ws://chat-graphy.herokuapp.com/',
  options: {
    reconnect: true
  }
}): null;
const client = new ApolloClient({
  link,
  uri: "https://chat-graphy.herokuapp.com/",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate persistor={persistedStore} loading={null}>
          <Component {...pageProps} />;
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
}
const makeStore = () => store;
const wrapper = createWrapper(makeStore);
export default wrapper.withRedux(MyApp);
