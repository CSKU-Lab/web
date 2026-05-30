import { CourseMaterialView } from "~/features/cms/materials";

export default async function Page(props: {
  params: Promise<{ courseID: string; materialID: string }>;
}) {
  const { courseID, materialID } = await props.params;
  return <CourseMaterialView courseID={courseID} materialID={materialID} />;
}
