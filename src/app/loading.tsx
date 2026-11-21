
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#fffaf7]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1ec]">
          <Loader2 className="h-9 w-9 animate-spin text-[#f45b4f]" />
        </div>

        <div className="text-center">
          <h2 className="text-base font-semibold text-[#302521]">
            Please wait
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Loading your experience...
          </p>
        </div>
      </div>
    </div>
  );
}
