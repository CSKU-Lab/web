"use client";
import { scan } from "react-scan";
import { useEffect } from "react";

function ReactScan() {
  useEffect(() => {
    scan({
      enabled: true,
    });
  }, []);
  return <div></div>;
}

export default ReactScan;
