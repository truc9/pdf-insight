import React, { useState } from "react";
import { Button, FileUpload, Loading } from "@/components";
import { PageTextModel } from "@/models";
import httpClient from "@/shared/httpClient";

function Dashboard() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [pages, setPages] = React.useState<PageTextModel[]>([]);
  const [loading, setLoading] = useState(false);

  async function train() {
    if (!files.length) {
      alert("No PDF datasource files");
      return;
    }
    setLoading(true);
    // Only single upload
    const req = new FormData();
    req.append("file", files[0]);
    const result = await httpClient.post("api/v1/pdfs/upload", req);
    const pageData: PageTextModel[] = result.data.map((item: any) => {
      return {
        pageNumber: item.page_number,
        lines: item.lines,
      };
    });
    setPages(pageData);
    setLoading(false);
  }

  function onFileChange(files: File[]) {
    setFiles(files);
  }

  return (
    <div className="w-full flex flex-col gap-2 p-5 bg-slate-50">
      <div className="text-xl font-bold">Upload PDF for data source</div>
      <div className="flex items-center gap-3">
        <FileUpload mode="single" onFileChange={onFileChange} />
        {!!files.length && (
          <Button disabled={loading} onClick={train} label="✨ Train" />
        )}
      </div>
      {loading && (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto p-3 backdrop-opacity-10 backdrop-blur bg-white/30 rounded border">
          <Loading />
        </div>
      )}
      {!loading && !!pages.length && (
        <div className="flex flex-col gap-3 overflow-y-auto p-3 bg-white rounded border shadow-inner">
          {pages.map((p, i) => {
            return (
              <div key={i} className="p-3 border rounded bg-zinc-50 relative">
                <h3 className="absolute px-3 bg-green-500 text-white top-0 right-0">
                  Page {p.pageNumber}
                </h3>
                <div className="text-xs font-mono flex flex-col gap-2 text-justify">
                  {p.lines.map((text, j) => {
                    return <div key={j}>{text}</div>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
