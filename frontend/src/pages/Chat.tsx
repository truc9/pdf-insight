import { Button } from "@/components";
import httpClient from "@/shared/httpClient";
import { useState } from "react";

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
    <div>
      <textarea className="p-2" rows={5} onChange={handleChange}></textarea>
      <Button label="Send" onClick={send}></Button>
    </div>
  );
}
