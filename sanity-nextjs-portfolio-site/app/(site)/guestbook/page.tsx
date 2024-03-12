// guestbook/page.tsx
"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

// Define a type for the message data structure
interface Message {
 message: string;
 username: string;
 created_at: string;
}

export default function GuestBook() {
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
    <div className="max-w-7xl mx-auto lg:px-16 px-6 mt-20 mb-16">
      <section className="flex flex-col lg:flex-row items-center lg:justify-between gap-x-12">
        <div className="lg:max-w-2xl max-w-2xl">
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
              className="bg-gray-900 flex justify-center items-center gap-5 rounded-xl text-white px-5 py-3 mt-8"
            >
              Sign in with Github
            </button>
          )}

          <div className="mt-10 flex flex-col gap-3 lg:max-w-lg max-w-lg">
            {loading && <h1>Loading ..</h1>}
            {message &&
              message.map((item: Message, index: number) => (
                <div
                  key={index}
                  className="flex flex-col bg-secondary p-5 rounded-xl justify-between"
                >
                  <div className="flex flex-row gap-5">
                    <p style={{ color: "#525252", fontWeight: "bold" }}>{item.username}:</p>
                    <p style={{ color: "#525252" }}>{item.message}</p>
                  </div>
                  <p style={{ color: "#525252", alignSelf: "flex-end" }}>{item.created_at}</p>
                </div>
              ))}
          </div>
        </div>

        {session && (
          <div>
            <h4 className="text-lg mt-8">Signed in as {session?.user?.name}</h4>
            <form onSubmit={createMessage} className="flex flex-row gap-3 mt-4">
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
        )}
      </section>
    </div>
  );
}



