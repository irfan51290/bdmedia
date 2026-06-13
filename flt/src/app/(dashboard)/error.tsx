"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 p-6 flex items-center justify-center">
      <div className="neu-card rounded-sm bg-card p-8 max-w-lg w-full">
        <p className="font-extrabold text-lg mb-2">Server error</p>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground mb-4">
            digest: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="neu-btn bg-brand-yellow text-black font-bold rounded-sm px-4 h-9 text-sm border-black cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
