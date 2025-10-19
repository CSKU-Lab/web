"use client";

interface Props {
  children?: React.ReactNode;
}

function PageTitle({ children }: Props) {
  return (
    <h5 className="text-(--gray-12) text-2xl font-medium transition-all ml-4">
      {children}
    </h5>
  );
}

export default PageTitle;
