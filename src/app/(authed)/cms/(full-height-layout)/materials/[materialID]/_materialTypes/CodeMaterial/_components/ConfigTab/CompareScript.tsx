import SearchSelect from "~/components/commons/SearchSelect";
import { cmsCompareService } from "~/services/cms-compare.service";

interface Props {
  value: { id: string; name: string } | null;
  onChange: (value: { id: string; name: string }) => void;
  isOwner: boolean;
}
function CompareScript({ value, onChange, isOwner }: Props) {
  const queryCompareScripts = async (query: string) => {
    const compares = await cmsCompareService.getCompareScripts({
      search: query,
    });
    return compares;
  };
  return (
    <SearchSelect
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
