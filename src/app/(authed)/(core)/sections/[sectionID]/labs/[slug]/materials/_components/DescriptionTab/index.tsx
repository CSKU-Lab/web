import { CircleCheck } from "lucide-react";
import { serialize } from "next-mdx-remote/serialize";
import MDXClient from "./MDXClient";

import remarkGfm from "remark-gfm";
import lab1 from '~/__mocks__/lab1'

async function DescriptionTab() {
  const mdxSource = await serialize(lab1, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [],
    },
  });

  return (
    <>
      <h3 className="text-xl font-semibold">
        Find a, b in which a*b=n and (a+b) is the lowest
      </h3>
      <div className="flex items-center gap-2 text-grass-9 w-fit rounded-full my-4">
        <CircleCheck size="1.5rem" />
        <h5 className="text-sm font-semibold">Passed</h5>
      </div>

      <div className="prose prose-code:before:content-none prose-code:after:content-none font-anuphan">
        <MDXClient source={mdxSource} />
      </div>
    </>
  );
}

export default DescriptionTab;
