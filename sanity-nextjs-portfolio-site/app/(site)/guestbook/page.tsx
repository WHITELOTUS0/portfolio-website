// guestbook/page.tsx
"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { supabase } from "../supabaseClient";

// Define a type for the message data structure
interface Message {
 message: string;
 username: string;
 created_at: string;
}


export default function Guestbook() {
  const { data: session } = useSession<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message[]>([]);
  const [userMsg, setUserMsg] = useState<string>("");

  const getGuestBookData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("guestbook")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setMessage(data as Message[]);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGuestBookData();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMsg(e.target.value);
  };

  const createMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("guestbook")
        .insert([
          {
            message: userMsg,
            username: session?.user?.name || "",
          },
        ]);
      setUserMsg("");
      getGuestBookData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="lg:max-w-7xl mx-auto max-w-3xl md:px-16 px-6">
    <div className="container mx-auto max-w-5xl mt-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight">
            Guestbook
          </h1>
          <p className="text-base text-zinc-400 leading-relaxed">
            Leave a message for me below. It could be anything – appreciation, information, wisdom, or even humor. Surprise me!
          </p>
          <br/>

      {!session && (
        <button
          onClick={() => signIn("github")}
          className="bg-gray-900 flex flex-row justify-center gap-5 rounded-xl text-white px-5 py-3"
        >
          Sign in with Github
        </button>
      )}

      <div className="flex flex-col gap-5">
        {session && (
          <>
            <h4 className="text-lg">Signed in as {session?.user?.name}</h4>
            <div>
              <form onSubmit={createMessage} className="flex flex-row gap-3">
                <input
                  type="text"
                  value={userMsg}
                  onChange={handleInput}
                  className="border-2 p-2 rounded-md w-full"
                  placeholder="Enter Your Message"
                />
                <button
                  type="submit"
                  className="bg-black px-5 rounded-md text-white w-[250px]"
                >
                  Submit
                </button>
              </form>
            </div>
            <button
              onClick={() => signOut()}
              className="bg-black text-white flex flex-row gap-3 items-center p-3 rounded-md w-[250px] justify-center"
            >
              Sign out
            </button>
          </>
        )}

        <div className="mt-10 flex flex-col gap-3">
          {loading && <h1>Loading ..</h1>}
          {message &&
            message.map((item: Message, index: number) => (
              <div
                key={index}
                className="flex flex-row gap-5 bg-secondary p-5 rounded-xl justify-between mt-5"
              >
                <div className="left flex flex-row gap-5">
                  <p style={{ color: "#525252" }}>{item.username} : </p>
                  <p style={{ color: "#525252" }}>{item.message}</p>
                </div>
                <p style={{ color: "#525252" }}>{item.created_at}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
    </main>
  );
}




