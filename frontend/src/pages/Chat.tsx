import { Button } from "@/components";
import httpClient from "@/shared/httpClient";
import { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function Chat() {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const send = async () => {
    const res = await httpClient.post("api/v1/chat", {
      message: message,
    });
    console.log(res);
  };

  return (
    <div className="flex flex-col bg-slate-50 w-full justify-center items-center">
      <div className="flex flex-col p-3 gap-3 h-full w-full lg:w-1/2 xl:w-2/3">
        <div className="flex-1 border p-3 rounded bg-white"></div>
        <div className="flex gap-3">
          <input
            onChange={handleChange}
            type="text"
            className="border px-3 py-2 w-full focus:outline-none focus:ring-2 ring-green-500 ring-offset-2 rounded"
          />
          <Button
            icon={<FiSend size={18} />}
            label="Send"
            onClick={send}
          ></Button>
        </div>
      </div>
    </div>
  );
}
