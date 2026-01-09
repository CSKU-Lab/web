"use client";

import { MDXRemote } from "next-mdx-remote";

interface Props {
  source: any;
}
function MDXClient({ source }: Props) {
  return <MDXRemote {...source} />;
}

export default MDXClient;
