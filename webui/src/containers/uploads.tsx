import { useEffect, useState } from "react";
import { FiCornerUpRight, FiRadio, FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";

import { Button, FileUpload } from "@/components";
import { SourceDocModel } from "@/models";
import httpClient from "@/shared/http-client";

function Uploads() {
  const [loadingDoc, setLoadingDoc] = useState<SourceDocModel | null>(null);
  const [docs, setDocs] = useState<SourceDocModel[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    loadDocItems();
  }, []);

  async function loadDocItems() {
    const docs = await httpClient.get("api/v1/documents/paths");
    setDocs(docs);
  }

  async function loadDoc(srcDoc: SourceDocModel) {
    try {
      setLoadingDoc(srcDoc);
      await httpClient.post(`api/v1/documents/load`, srcDoc);
      toast.success(`Load ${srcDoc.name} successfully.`);
    } catch (err) {
      toast.error("Unable to load from PDF.");
    } finally {
      setLoadingDoc(null);
    }
  }

  async function handleFileChange(files: File[]) {
    setFiles(files);
  }

  async function handleUpload() {
    console.log("Uploading files");
    console.log(files);
    if (files.length === 0) {
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    await httpClient.post("api/v1/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await loadDocItems();
  }

  return (
    <div className="w-full flex flex-col gap-2 p-5 bg-slate-100 text-slate-600">
      <div className="text-xl font-bold flex items-center gap-2">
        <FiUploadCloud /> <h3>Upload</h3>
      </div>
      <div className="flex items-cente gap-2 mb-5">
        <FileUpload onFileChange={handleFileChange} />
        {files.length !== 0 && <Button onClick={handleUpload} label="Upload" />}
      </div>

      <div className="text-xl font-bold flex items-center gap-2">
        <FiRadio /> <h3>Train your data</h3>
      </div>
      <div className="flex flex-col gap-2">
        {docs &&
          docs.map((srcDoc, index) => {
            return (
              <div className="shadow-lg flex items-center justify-between p-2 bg-white rounded">
                <div className="flex items-center gap-3 p-5" key={index}>
                  <span>{srcDoc.name}</span>
                </div>
                <Button
                  icon={<FiCornerUpRight />}
                  label="Feed LLM"
                  loading={loadingDoc?.name === srcDoc.name}
                  onClick={() => loadDoc(srcDoc)}
                ></Button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Uploads;
