import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Moralis from "moralis";
import Web3 from "web3";
import Head from "next/head";
import { contractABI, contractAddress } from "../../contract";

const web3 = new Web3(Web3.givenProvider);

function EventDetails() {
  const { isAuthenticated, logout, user } = useMoralis();
  const router = useRouter();
  const [eventInfo, setEventInfo] = useState("");
  const [mintAmount, setMintAmount] = useState(1);
  const [maxMintAmount, setMaxMintAmount] = useState(0);
  const { id } = router.query;

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
    fetchNFTInfoFromContract();
  }, [isAuthenticated]);

  const fetchNFTInfoFromContract = async () => {
    // interact with smart contract
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const response = await contract.methods.get_event_info(id).call();

      if (response) {
        setEventInfo(response);
        setMaxMintAmount(response.available_tickets);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1);
    }
  };

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  return (
    <div className="min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center ">
      <Head>
        <title>Event Dapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <label
        className="my-4 text-sm font-medium text-black dark:text-gray-500 text-right cursor-pointer text-left"
        onClick={() => router.push("/events")}
      >
        Go to events
      </label>
      <h1 className="text-2xl my-4">Event Details</h1>
      {eventInfo !== "" && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
            <div className="z-1 md:max-w-3xl w-full bg-gray-900/90 filter backdrop-blur-sm py-4 rounded-md px-2 md:px-10 flex flex-col items-center">
              <h1 className="text-white uppercase font-bold text-3xl md:text-4xl bg-gradient-to-br mt-3">
                {eventInfo.title}
              </h1>
              <h3 className="text-sm text-pink-200 tracking-widest">
                {eventInfo.description}
              </h3>

              <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">
                <div className="relative w-full">
                  <div className="font-coiny z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
                    <p>
                      Tickets{" "}
                      <span className="text-brand-pink">
                        {eventInfo.available_tickets}
                      </span>{" "}
                      / {eventInfo.total_tickets}
                    </p>
                  </div>

                  <img
                    src={eventInfo.image}
                    className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-md"
                  />
                </div>

                <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
                  <div className="font-coiny flex items-center justify-between w-full">
                    <button
                      className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                      onClick={incrementMintAmount}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 md:h-8 md:w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>

                    <p className="flex items-center justify-center flex-1 grow text-center font-bold text-brand-pink text-3xl md:text-4xl">
                      {mintAmount}
                    </p>

                    <button
                      className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-gray-300 font-bold rounded-md"
                      onClick={decrementMintAmount}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 md:h-8 md:w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 12H6"
                        />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm text-pink-200 tracking-widest mt-3">
                    Max Ticket to Buy: {eventInfo.available_tickets}
                  </p>

                  <div className="border-t border-b py-4 mt-16 w-full">
                    <div className="w-full text-xl font-coiny flex items-center justify-between text-brand-yellow">
                      <p>Total</p>

                      <div className="flex items-center space-x-3">
                        <p className="text-gray-400">
                          {Number.parseFloat(
                            parseFloat(eventInfo.ticket_price) * mintAmount
                          ).toFixed(2)}{" "}
                          ETH
                        </p>{" "}
                        <span className="text-gray-400">+ GAS</span>
                      </div>
                    </div>
                  </div>

                  {/* Mint Button && Connect Wallet Button */}
                  {isAuthenticated ? (
                    <button
                      className={`border-2 border-white
                      mt-12 w-full px-6 py-3 rounded-md text-2xl text-white mx-4 uppercase`}
                      disabled={true}
                    >
                      Get Ticket
                      <p className="text-xs">coming soon</p>
                    </button>
                  ) : (
                    <button className="font-coiny mt-12 w-full bg-gradient-to-br from-brand-purple to-brand-pink shadow-lg px-6 py-3 rounded-md text-2xl text-white hover:shadow-pink-400/50 mx-4 tracking-wide uppercase">
                      Connect Wallet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
