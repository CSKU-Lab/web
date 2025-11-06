"use client";
import DescriptionSection from "./_components/DescriptionSection";
import DetailSection from "./_components/DetailSection";
import MultipleTabsSection from "./_components/MultipleTabsSection";
import MaterialProvider from "./_providers/MaterialProvider";

function MaterialPage() {
  return (
    <>
      <MaterialProvider>
        <DetailSection />
        <div className="flex flex-1 min-h-0">
          <DescriptionSection />
          <MultipleTabsSection />
        </div>
      </MaterialProvider>
    </>
  );
}

export default MaterialPage;
