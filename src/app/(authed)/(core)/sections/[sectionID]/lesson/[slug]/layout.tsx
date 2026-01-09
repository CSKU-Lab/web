import type { ReactNode } from "react";
import PageControl from "../_components/PageControl";
import { type Metadata } from "next";

interface Props {
  children: ReactNode;
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ courseId: string; slug: string }>;
}): Promise<Metadata> => {
  // const { courseId, slug } = params;
  const lessonName = "Lesson 1.1 Repetition: while";
  const isNotFit = lessonName.length > 32;
  let title = lessonName.slice(0, 32);

  if (isNotFit) title += "...";

  return {
    title: `${title} | CS Lab`,
  };
};

function LessonLayout({ children }: Props) {
  return (
    <div className="relative">
      <div className="p-4 container mx-auto max-w-6xl lg:px-10 prose prose-code:before:content-none prose-code:after:content-none font-anuphan">
        <div className="flex items-center gap-4 mb-14">
          <div className="not-prose">
            <h5 className="text-(--gray-11) text-sm">Lesson 1.1</h5>
            <h2 className="text-3xl font-medium">
              Repetition: <code>while</code>
            </h2>
          </div>
        </div>
        {children}
        <PageControl
          nextPage={{
            slug: "something-easy",
            title: "Something Easy",
          }}
          prevPage={{
            slug: "something-fun",
            title: "Something Fun",
          }}
        />
      </div>
    </div>
  );
}

export default LessonLayout;
