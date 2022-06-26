import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import Web3 from "web3";
import { contractABI, contractAddress } from "../../contract";
import Head from "next/head";
const web3 = new Web3(Web3.givenProvider);

function CreateEvent() {
  const { isAuthenticated, logout, user } = useMoralis();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [file, setFile] = useState(null);
  const [isMinting, setIsminting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsminting(true);
    if (ticketCount <= 0 || price <= 0) {
      alert(
        "Please fill all the required fields and the ticket quantity and amount must not be less than or equal to zero "
      );
      setIsminting(false);
      return;
    }

    try {
      // save image to IPFS
      const file1 = new Moralis.File(file.name, file);
      await file1.saveIPFS();
      const file1url = file1.ipfs();

      // generate metadata and save to ipfs
      const metadata = {
        name,
        description,
        image: file1url,
        ticketCount,
        ticketPrice: price,
      };
      const file2 = new Moralis.File(`${name}metadata.json`, {
        base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
      });
      await file2.saveIPFS();
      const metadataurl = file2.ipfs();
      console.log(metadataurl);
      // interact with smart contract
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const response = await contract.methods
        .create_event(
          name,
          description,
          file1url,
          ticketCount,
          price,
          metadataurl
        )
        .send({ from: user.get("ethAddress") });

      const tokenId = response.events.EventCreated.returnValues.event_id;

      setIsminting(false);
      alert(
        `NFT successfully minted. Contract address - ${contractAddress} and Token ID - ${tokenId}`
      );
    } catch (err) {
      console.error(err);
      setIsminting(false);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Head>
        <title>Event Dapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form onSubmit={onSubmit}>
        <label
          className="text-sm font-medium text-black dark:text-gray-500 text-right cursor-pointer"
          onClick={() => router.push("/events")}
        >
          Go to events
        </label>
        <h1 className="text-2xl my-4">Create new event</h1>
        <div>
          <label className="text-sm font-medium text-gray-400 dark:text-gray-500">
            Event Title
          </label>
          <input
            type="text"
            className="border-[1px] p-2 text-lg border-black w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium text-gray-400 dark:text-gray-500">
            Description
          </label>
          <input
            type="text"
            className="border-[1px] p-2 text-lg border-black w-full"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium text-gray-400 dark:text-gray-500">
            Cover Image
          </label>
          <input
            type="file"
            className="border-[1px] p-2 text-lg border-black w-full"
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/png, image/gif, image/jpeg"
            required
          />
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium text-gray-400 dark:text-gray-500">
            Number of tickets
          </label>
          <input
            type="number"
            className="border-[1px] p-2 text-lg border-black w-full"
            placeholder="Ticktes"
            value={ticketCount}
            onChange={(e) => setTicketCount(e.target.value)}
            required
          />
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium text-gray-400 dark:text-gray-500">
            Ticket Price (ETH)
          </label>
          <input
            type="number"
            className="border-[1px] p-2 text-lg border-black w-full"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`mt-5 w-full p-5 bg-green-700 text-white text-lg rounded-xl ${isMinting && "animate-pulse"}`}
          disabled={isMinting}
        >
          {isMinting ? "Minting..." : "Create now"}
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
