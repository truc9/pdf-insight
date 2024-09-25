import { useEffect, useState } from "react";
import { Button } from "@/components";
import httpClient from "@/shared/httpClient";
import { toast } from "react-toastify";
import { SourceDoc } from "@/models/SourceDoc";
import { FiUpload } from "react-icons/fi";

function Load() {
  const [loadingDoc, setLoadingDoc] = useState<SourceDoc | null>(null);
  const [docs, setDocs] = useState<SourceDoc[]>([]);

  useEffect(() => {
    (async () => {
      const docs = await httpClient.get("api/v1/documents/paths");
      setDocs(docs);
    })();
  }, []);

  async function loadDoc(srcDoc: SourceDoc) {
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

  return (
    <div className="w-full flex flex-col gap-2 p-5 bg-slate-300 text-slate-600">
      <div className="text-xl font-bold">
        Feed your PDF to Large Language Model
      </div>

      <div className="flex flex-col gap-2">
        {docs &&
          docs.map((srcDoc, index) => {
            return (
              <div className="flex items-center justify-between p-2 bg-white rounded border border-dashed">
                <div className="flex items-center gap-3 p-5" key={index}>
                  <span>{srcDoc.name}</span>
                </div>
                <Button
                  icon={<FiUpload />}
                  label="Load source"
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

export default Load;
