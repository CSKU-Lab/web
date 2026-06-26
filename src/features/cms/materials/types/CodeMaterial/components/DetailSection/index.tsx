import { titleFormatter } from "~/lib/formatters/titleFormatter";
import useGetMaterial from "~/features/cms/materials/hooks/useGetMaterial";
import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";
import SaveButton from "~/features/cms/materials/types/CodeMaterial/components/DetailSection/SaveButton";
import SaveStatus from "~/features/cms/materials/types/CodeMaterial/components/DetailSection/SaveStatus";
import SettingsButton from "~/features/cms/materials/types/CodeMaterial/components/DetailSection/SettingsButton";
import DeleteButton from "~/features/cms/materials/types/CodeMaterial/components/DetailSection/DeleteButton";
import { Globe, Lock } from "lucide-react";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import ForkMaterialButton from "~/features/cms/materials/components/ForkMaterialButton";
import CloneMaterialButton from "~/features/cms/materials/components/CloneMaterialButton";

function DetailSection() {
  const { data: detail, isLoading } = useGetMaterial();
  return (
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 w-full flex items-center jubstify-between gap-4 mt-4">
      <div className="flex-1 flex gap-4 overflow-x-auto">
        <HeaderItem label="Name" value={detail?.name} isLoading={isLoading} />
        <HeaderItem
          label="Type"
          value={titleFormatter(detail?.type ?? "")}
          isLoading={isLoading}
        />
        <HeaderItem
          label="Created By"
          value={
            <div className="flex items-center gap-1.5">
              <UserProfileImage
                src={detail?.created_by?.profile_image}
                username={detail?.created_by?.username ?? ""}
                size="1.25rem"
              />
              <h4 className="font-medium">{detail?.created_by.display_name}</h4>
            </div>
          }
          isLoading={isLoading}
        />

        <HeaderItem
          label="Visibility"
          value={
            <div className="flex items-center gap-2">
              {detail?.visibility === "public" && <Globe size="0.9rem" />}
              {detail?.visibility === "private" && <Lock size="0.9rem" />}
              <h4 className="font-medium">
                {titleFormatter(detail?.visibility ?? "")}
              </h4>
            </div>
          }
          isLoading={isLoading}
        />
        {/* <HeaderItem */}
        {/*   label="Manual Score" */}
        {/*   value={detail?.manual_score ?? 0} */}
        {/*   isLoading={isLoading} */}
        {/* /> */}
        {/* <HeaderItem label="Submissions" value={10000} isLoading={isLoading} /> */}
        <SaveStatus />
      </div>

      <div className="flex gap-2">
        <ForkMaterialButton />
        <CloneMaterialButton />
        <SaveButton />
        <SettingsButton />
        <DeleteButton />
      </div>
    </div>
  );
}

export default DetailSection;
