import SearchSelect from "~/components/commons/SearchSelect";
import { cmsCompareService } from "~/services/cms-compare.service";
import type { CompareScriptDetail } from "~/types/config";

interface Props {
  value: { id: string; name: string } | null;
  onChange: (value: { id: string; name: string }) => void;
  isOwner: boolean;
}

function CompareScript({ value, onChange, isOwner }: Props) {
  const queryCompareScripts = async (query: string) => {
    const response = await cmsCompareService.getPagination({
      params: {
        search: query,
        page: 1,
        page_size: 20,
      },
    });
    return response.data;
  };

  return (
    <SearchSelect<CompareScriptDetail>
      value={value}
      className="w-full"
      queryFn={queryCompareScripts}
      disabled={!isOwner}
    >
      {(options) =>
        options.map((option) => (
          <button
            key={option.id}
            className="text-start text-sm hover:bg-(--gray-3) w-full rounded-md p-2"
            onClick={() => onChange(option)}
          >
            {option.name}
          </button>
        ))
      }
    </SearchSelect>
  );
}

export default CompareScript;
