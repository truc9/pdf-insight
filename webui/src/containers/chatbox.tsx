import { useState } from "react";
import { LiaRobotSolid } from "react-icons/lia";
import { PiMagicWandThin, PiUserCircle } from "react-icons/pi";
import Markdown from "react-markdown";
import { toast } from "react-toastify";
import remarkGfm from "remark-gfm";

import { Button } from "@/components";
import { TypingLoading } from "@/components/Loading";
import httpClient from "@/shared/http-client";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export default function ChatBox() {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string>("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!question) {
      toast.error("Question not provided.");
      return;
    }
    setChat([...chat, { role: "user", content: question }]);
    setLoading(true);
    setQuestion("");
    console.log("start streaming");
    let str = "";
    for await (const chunk of httpClient.streaming("api/v1/chat", {
      question,
    })) {
      setLoading(false);
      console.log(chunk, "");
      setAnswer((prev) => prev + chunk);
      str += chunk;
    }

    console.log("end streaming");

    setChat([
      ...chat,
      { role: "user", content: question },
      { role: "bot", content: str },
    ]);
    setAnswer("");

    setQuestion("");
  }

  function handleInputChange(e) {
    setQuestion(e.target.value);
  }

  return (
    <div className="flex flex-col bg-slate-300 w-full justify-center items-center">
      <div className="flex flex-col p-5 gap-3 h-full w-full xl:w-3/5 lg:w-2/3">
        <div className="flex-1 border p-3 rounded bg-white flex flex-col gap-2 overflow-y-auto shadow-lg">
          {chat.map((chat, index) => (
            <div
              key={index}
              className={`${
                chat.role === "user" ? "bg-white" : "bg-slate-50"
              } p-2 rounded`}
            >
              <div className="flex gap-2 items-center">
                <div>
                  {chat.role == "user" ? (
                    <PiUserCircle size={22} />
                  ) : (
                    <LiaRobotSolid size={22} />
                  )}
                </div>
                <div className="flex flex-col">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {chat.content}
                  </Markdown>
                </div>
              </div>
            </div>
          ))}
          {answer && (
            <div className="p-2 rounded bg-slate-50 shadow-lg">
              <div className="flex gap-2 items-center">
                <div>
                  <LiaRobotSolid size={22} />
                </div>
                <div className="flex flex-col">
                  <Markdown remarkPlugins={[remarkGfm]}>{answer}</Markdown>
                </div>
              </div>
            </div>
          )}
          {loading && (
            <>
              <div className="bg-slate-50 p-2 text-sm rounded shadow-lg">
                <TypingLoading />
              </div>
            </>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            disabled={loading}
            onChange={handleInputChange}
            value={question}
            type="text"
            placeholder="Tell me what you want to know?"
            className="border px-3 py-3 w-full focus:outline-none ring-2 ring-green-500 ring-offset-2 rounded shadow-lg"
          />
          <Button
            disabled={!question}
            loading={loading}
            icon={<PiMagicWandThin size={18} />}
            showLabel={false}
            type="submit"
          ></Button>
        </form>
      </div>
    </div>
  );
}
