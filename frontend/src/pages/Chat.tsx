import { Button } from "@/components";
import httpClient from "@/shared/httpClient";
import { useState } from "react";
import { PiMagicWandThin } from "react-icons/pi";

interface C {
  role: "user" | "bot";
  content: string;
}

export default function Chat() {
  const [conversation, setConversation] = useState<C[]>([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setConversation([...conversation, { role: "user", content: question }]);
    const res = await httpClient.post("api/v1/chat", { question });
    console.log(res);
    setConversation([...conversation, { role: "bot", content: res }]);
    setIsLoading(false);
  }

  function handleInputChange(e) {
    setQuestion(e.target.value);
  }

  return (
    <div className="flex flex-col bg-slate-50 w-full justify-center items-center">
      <div className="flex flex-col p-3 gap-3 h-full w-full lg:w-1/2 xl:w-2/3">
        <div className="flex-1 border p-3 rounded bg-white flex flex-col gap-2">
          {conversation.map((chat, index) => (
            <div key={index} className="bg-slate-50 p-2 text-sm rounded">
              <div dangerouslySetInnerHTML={{ __html: chat.content }}></div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="Ask me anything ?"
            className="border px-3 py-2 w-full focus:outline-none focus:ring-2 ring-green-500 ring-offset-2 rounded"
          />
          <Button
            loading={isLoading}
            icon={<PiMagicWandThin size={20} />}
            label="AI"
            type="submit"
          ></Button>
        </form>
      </div>
    </div>
  );
}
