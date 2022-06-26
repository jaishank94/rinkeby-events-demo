import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import Moralis from "moralis";
import Web3 from "web3";
import Image from "next/image";
import { contractABI, contractAddress } from "../../contract";
import Head from "next/head";

const web3 = new Web3(Web3.givenProvider);

function Events() {
  const { isAuthenticated, logout, user } = useMoralis();
  const router = useRouter();
  const [eventList, setEventList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
    fetchNFTsForContract();
  }, [isAuthenticated]);

  const fetchNFTsForContract = async () => {
    try {
      setIsLoading(true);
      // interact with smart contract
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const response = await contract.methods.get_events().call();

      let evntList = [];
      if (response.length > 0) {
        for (let nft of response) {
          const nftRes = await contract.methods.get_event_info(nft).call();
          Object.assign(nftRes, { eventId: nft });
          evntList.push(nftRes);
        }
      }
      setEventList(evntList);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("error", err);
    }
  };

  return (
    <div className="h-full w-full">
      <Head>
        <title>Event Dapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-5 my-10 text-left w-full">
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <svg
              className="fill-current h-8 w-8 mr-2"
              width="54"
              height="54"
              viewBox="0 0 54 54"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
            </svg>
            <span className="font-semibold text-xl tracking-tight">
              Event Dapp
            </span>
          </div>
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
            <div className="text-sm lg:flex-grow">
              <a
                className="cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
                onClick={() => router.push("/events")}
              >
                Home
              </a>
              <a
                className="cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
                onClick={() => router.push("/createEvent")}
              >
                Create event
              </a>
            </div>
            <div>
              <button
                onClick={logout}
                className="cursor-pointer inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>

      <div className="px-5 my-10 sm:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex flex-wrap justify-center">
        {!isLoading &&
          eventList.length > 0 &&
          eventList.map((event, key) => {
            return (
              <div
                key={key}
                className="group cursor-pointer transition duration-200 ease-in transform sm:hover:scale-105 hover:z-50 bg-white m-2 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
              >
                <Image
                  layout="responsive"
                  className="rounded-t-lg"
                  src={event.image}
                  alt={event.title}
                  width="180"
                  height="180"
                />
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {event.title}
                    </h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {event.description}
                  </p>
                  <a
                    onClick={() =>
                      router.push("/eventDetails/" + event.eventId)
                    }
                    className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    View Tickets
                    <svg
                      className="ml-2 -mr-1 w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
      </div>
      {!isLoading && eventList.length == 0 && (
        <div className="flex justify-center align-center">
          No event found.{" "}
          <span
            className="cursor-pointer text-blue-500"
            onClick={() => router.push("/createEvent")}
          >
            {" "}
            Create new event
          </span>
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center align-center">Loading...</div>
      )}
    </div>
  );
}

export default Events;
