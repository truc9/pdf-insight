import { useEffect, useState } from "react";
import { Button } from "@/components";
import httpClient from "@/shared/httpClient";
import { toast } from "react-toastify";

function Load() {
  const [loadingLoad, setLoadingLoad] = useState(false);
  const [docs, setDocs] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const docs = await httpClient.get("api/v1/documents/paths");
      setDocs(docs);
    })();
  }, []);

  async function loadDoc(doc: string) {
    try {
      setLoadingLoad(true);
      await httpClient.get(`api/v1/documents/load?doc=${doc}`);
      toast.success("Load to vectordb successfully");
    } catch (err) {
      toast.error("Unable to load from PDF.");
    } finally {
      setLoadingLoad(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-2 p-5 bg-slate-50">
      <div className="text-xl font-bold">
        Upload your own data and feed the LLM
      </div>

      <div className="flex flex-col gap-2">
        {docs &&
          docs.map((doc, index) => {
            return (
              <div className="flex items-center justify-between p-2 bg-slate-200 rounded border">
                <div className="flex items-center gap-3 p-5" key={index}>
                  <span>{doc}</span>
                </div>
                <Button
                  label="Load to VectorDB"
                  loading={loadingLoad}
                  onClick={() => loadDoc(doc)}
                ></Button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Load;
