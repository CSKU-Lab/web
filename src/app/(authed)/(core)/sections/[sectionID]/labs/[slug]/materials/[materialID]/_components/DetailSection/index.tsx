import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";
import { renderStatus } from "./renderStatus";

function DetailSection() {
  return (
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 w-full flex items-center jubstify-between gap-4">
      <HeaderItem label="Name" value="Blackjack (Easy)" />
      <HeaderItem label="Status" value={renderStatus("NO_SUBMISSION")} />
    </div>
  );
}

export default DetailSection;
