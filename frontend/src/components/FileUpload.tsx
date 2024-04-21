import React from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

interface FileUploadProp {
  mode?: "single" | "multiple";
  label?: string;
  onFileChange?: (file: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProp> = ({
  mode,
  label,
  onFileChange,
}) => {
  const ref = React.useRef<HTMLInputElement>(null!);
  const [description, setDescription] = React.useState<string | undefined>(
    label
  );

  function fileUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const files: File[] = [];
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files[i]);
    }

    setDescription(files.map((f) => f.name).join(", "));

    if (onFileChange) {
      onFileChange(files);
    }
  }

  function click() {
    ref.current.click();
  }

  function clear() {
    ref.current.value = "";
    setDescription("");
    if (onFileChange) {
      onFileChange([]);
    }
  }

  return (
    <div className="relative">
      <input
        hidden
        ref={ref}
        multiple={mode === "multiple"}
        onChange={fileUploadChange}
        type="file"
        name="file"
        accept="application/pdf"
      />
      <div
        onClick={click}
        className="shadow-sm bg-white border pl-4 pr-10 py-3 min-w-72 hover:cursor-pointer rounded active:ring-2 ring-green-500 ring-offset-2"
      >
        <span className="text-sm">
          {description || "Click here to upload file..."}
        </span>
      </div>

      {ref.current && ref.current.value && (
        <button
          onClick={clear}
          className="transition-all absolute top-2 right-2 py-2 px-2 bg-red-500 text-white rounded shadow active:ring-2 active:text-lg ring-offset-2 ring-red-500"
        >
          <FiX />
        </button>
      )}
      {(!ref.current || !ref.current.value) && (
        <div className="absolute top-2 right-2 py-2 px-2">
          <FiUploadCloud />
        </div>
      )}
    </div>
  );
};
