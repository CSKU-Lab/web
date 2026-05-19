"use client";

import RouteNavigation from "../_components/RouteNavigation";
import MaterialListPage from "./_components/MaterialListPage";

export default function CourseMaterialsPage() {
  return (
    <>
      <RouteNavigation title="Materials" />
      <MaterialListPage />
    </>
  );
}
