import { MenuSquare } from "lucide-react";

function MainPageEmptyState() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-7xl text-(--gray-11) mb-6 flex justify-center">
          <MenuSquare size={64} />
        </div>
        <h2 className="text-2xl font-semibold text-(--gray-12) mb-3">
          Select a Menu to Get Started
        </h2>
        <p className="text-(--gray-10) text-sm leading-relaxed">
          Choose an option from the left sidebar to continue
        </p>
      </div>
    </div>
  );
}

export default MainPageEmptyState;
