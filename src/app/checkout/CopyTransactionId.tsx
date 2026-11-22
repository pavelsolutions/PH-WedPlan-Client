"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyTransactionIdProps {
  transactionId: string;
}

export default function CopyTransactionId({
  transactionId,
}: CopyTransactionIdProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transactionId);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy transaction ID", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-[#92283D]/30 hover:bg-[#92283D]/5 hover:text-[#92283D]"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </button>
  );
}