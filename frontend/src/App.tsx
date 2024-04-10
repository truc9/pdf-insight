import React, { useState } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const Button: React.FC<ButtonProps> = ({ label, ...props }) => {
  return (
    <button
      {...props}
      className="px-4 py-3 bg-white rounded border focus:outline-none active:outline-none active:ring-2 ring-offset-2 ring-orange-500"
    >
      {label}
    </button>
  );
};

function App() {
  const [file, setFile] = useState<File>(null!);

  function fileUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      console.log("no file uploaded");
      return;
    }
    setFile(e.target.files[0]);
    console.log(e.target.files);
  }

  function handleUpload() {
    if (!file || !file.name) {
      alert("There is no file uploaded...");
      return;
    }

    console.log(`Got file ${file.name} size (${file.size})`);

    const data = new FormData();
    data.append("file", file);

    fetch("http://localhost:8000/api/v1/pdfs/extract", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="w-screen h-screen bg-white">
      <div className="w-full h-full flex flex-col">
        <div className="p-10 flex items-center gap-3 border-b">
          <div className="text-xl">PDF Insight</div>
        </div>

        <div className="p-10 flex items-start flex-col gap-3 flex-1 bg-slate-100">
          <div className="flex gap-3 items-center">
            <input
              multiple={false}
              onChange={fileUploadChange}
              type="file"
              name="file"
              className="bg-white p-2 rounded border active:ring-2 ring-roange-500 ring-offset-2"
            />
            <Button onClick={handleUpload} label="Upload" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
