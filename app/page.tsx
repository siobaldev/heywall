import { Suspense } from "react";
import Header from "@/components/header";
import WallLoader from "@/components/wall-loader";

export default function Page() {
  return (
    <div className="lg:mx-auto max-w-300 pb-10 sm:px-4">
      <Header />
      <div className="px-4 sm:px-0">
        <Suspense fallback={<div className="mt-6 h-48 animate-pulse rounded-sm bg-white" />}>
          <WallLoader />
        </Suspense>
      </div>
    </div>
  );
}
