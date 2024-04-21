import { Button, Loading } from "@/components";
import httpClient from "@/shared/httpClient";
import { useState } from "react";
import { LiaRobotSolid } from "react-icons/lia";
import { PiMagicWandThin, PiUserCircle } from "react-icons/pi";
import { toast } from "react-toastify";

interface C {
  role: "user" | "bot";
  content: string;
}

export default function Chat() {
  const [conversation, setConversation] = useState<C[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!question) {
      toast.error("Question not provided.");
      return;
    }
    setConversation([...conversation, { role: "user", content: question }]);
    setQuestion("");
    setLoading(true);
    const response = await httpClient.post("api/v1/chat", { question });
    setConversation([
      ...conversation,
      { role: "user", content: question },
      { role: "bot", content: response },
    ]);
    setLoading(false);
    setQuestion("");
  }

  function handleInputChange(e) {
    setQuestion(e.target.value);
  }

  return (
    <div className="flex flex-col bg-slate-50 w-full justify-center items-center">
      <div className="flex flex-col p-5 gap-3 h-full w-full lg:w-1/2 xl:w-2/3">
        <div className="flex-1 border p-3 rounded bg-white flex flex-col gap-2">
          {conversation.map((chat, index) => (
            <div key={index} className="bg-slate-50 p-2 rounded">
              <div className="flex gap-2 items-center">
                <div>
                  {chat.role == "user" ? (
                    <PiUserCircle size={22} />
                  ) : (
                    <LiaRobotSolid size={22} />
                  )}
                </div>
                {chat.content}
              </div>
            </div>
          ))}
          {loading && (
            <>
              <div className="bg-slate-50 p-2 text-sm rounded">
                <Loading />
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
            placeholder="Ask me anything ?"
            className="border px-3 py-2 w-full focus:outline-none focus:ring-2 ring-rose-500 ring-offset-2 rounded"
          />
          <Button
            disabled={!question}
            loading={loading}
            icon={<PiMagicWandThin size={20} />}
            showLabel={false}
            type="submit"
          ></Button>
        </form>
      </div>
    </div>
  );
}
