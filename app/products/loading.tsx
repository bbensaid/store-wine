"use client";

import LoadingContainer from "@/components/global/LoadingContainer";
import { useMemo } from "react";

function loading() {
  const filters = useMemo(
    () =>
      Object.fromEntries(
        Array.from(searchParams.entries()).filter(([key]) => key !== "page")
      ),
    [searchParams]
  );

  return <LoadingContainer />;
}
export default loading;
