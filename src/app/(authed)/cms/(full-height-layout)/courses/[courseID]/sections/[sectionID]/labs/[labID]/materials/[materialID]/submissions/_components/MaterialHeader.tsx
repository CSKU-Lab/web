import { useMaterialDisplay } from "~/hooks/useMaterialDisplay";
import type { CMSMaterial } from "~/types/cms-material";

interface MaterialHeaderProps {
  material: CMSMaterial;
}

function MaterialHeader({ material }: MaterialHeaderProps) {
  const { logoMap } = useMaterialDisplay();

  return (
    <div className="px-4 py-3 border-b border-(--gray-4)">
      <div className="flex items-center gap-2">
        {logoMap[material.type]}
        <h3 className="text-sm font-semibold text-(--gray-12)">
          {material.name}
        </h3>
      </div>
      {material.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {material.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-(--gray-3) text-(--gray-11)"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default MaterialHeader;
