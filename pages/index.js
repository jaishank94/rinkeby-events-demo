import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";

export default function Home() {
  const { authenticate, isAuthenticated } = useMoralis();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push("/events");
  }, [isAuthenticated]);

  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <Head>
        <title>Event Dapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Welcome to Event Dapp</span>
            <span className="block text-indigo-600">Ready to dive in?</span>
          </h2>
          <div className="ml-3 mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={authenticate}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {" "}
                Connect wallet{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
