import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      serverUrl={"https://p4barowdxuba.usemoralis.com:2053/server"}
      appId={"8JYA6WozY1oLK98drF7DgFRVQvtypbXZrLIPpPPp"}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
