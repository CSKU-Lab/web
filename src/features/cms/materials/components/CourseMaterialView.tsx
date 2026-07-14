import { notFound } from "next/navigation";
import { cmsMaterialService } from "~/services/cms-material.service";
import { cmsCourseService } from "~/services/cms-course.service";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import CodeMaterial from "~/features/cms/materials/types/CodeMaterial";
import TypingMaterial from "~/features/cms/materials/types/TypingMaterial";
import DocumentMaterial from "~/features/cms/materials/types/DocumentMaterial";
import { getUser } from "~/lib/get-user";

async function getMaterial(courseID: string, materialID: string) {
  try {
    return await cmsMaterialService.getById(courseID, materialID);
  } catch (error: any) {
    if (error) {
      notFound();
    }
    throw error;
  }
}

export async function CourseMaterialView({
  courseID,
  materialID,
}: {
  courseID: string;
  materialID: string;
}) {
  const [material, course, user] = await Promise.all([
    getMaterial(courseID, materialID),
    cmsCourseService.getById(courseID),
    getUser(),
  ]);

  const isInstructor = user.roles.includes("instructor") && !user.roles.includes("admin");
  const isCourseCreator = course?.creators?.some((c) => c.id === user.sub);
  const isRestrictedInstructor = isInstructor && !isCourseCreator;
  const isOwner =
    !isRestrictedInstructor &&
    (material.created_by.id === user.sub || material.visibility === "public");

  if (material.type === "code") {
    return <CodeMaterial isOwner={isOwner} />;
  }

  if (material.type === "typing" || (material.type as string) === "type") {
    return <TypingMaterial isOwner={isOwner} />;
  }

  if (material.type === "document") {
    return <DocumentMaterial isOwner={isOwner} />;
  }

  return (
    <div className="flex justify-center items-center h-full">
      <h4 className="text-(--gray-11)">
        Material type &quot;{titleFormatter(material.type)}&quot; is not supported
        yet.
      </h4>
    </div>
  );
}
