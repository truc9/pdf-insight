import { ScaleLoader, SyncLoader } from "react-spinners";

export function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <ScaleLoader />
    </div>
  );
}

export function TypingLoading() {
  return (
    <div className="w-full h-full flex gap-3 justify-center items-center p-3">
      <SyncLoader />
    </div>
  );
}
