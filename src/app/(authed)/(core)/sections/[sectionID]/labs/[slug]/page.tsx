import PageTitle from "~/components/commons/PageTitle";
import { MaterialPieChart } from "../_components/MaterialPieChart";
import MaterialInfList from "../_components/MaterialInfList";

export default function LabPage() {
  const materialTypeData = {
    title: "Material Type",
    fields: [
      {
        label: "Code",
        value: 10,
      },
      {
        label: "Type",
        value: 10,
      },
      {
        label: "Document",
        value: 10,
      },
    ],
  };
  const materialProgressData = {
    title: "Material Progress",
    fields: [
      {
        label: "Total Material",
        value: 10,
      },
      {
        label: "Todo",
        value: 10,
      },
      {
        label: "Done",
        value: 10,
      },
    ],
  };
  return (
    <div className="p-4 flex flex-col min-h-[100vh] h-full gap-10 ">
      <div className="flex flex-row min-h-3/12 shadow-md rounded-lg p-6 gap-6">
        <div className="flex flex-row gap-10 items-center h-full w-full">
          <div className="aspect-square h-full max-h-[15rem] w-full flex items-center justify-center">
            <MaterialPieChart />
          </div>
          <div className="w-px bg-gray-200 self-stretch" />
          <div className="flex flex-col text-xl gap-4 h-full justify-between w-full">
            <div className="flex flex-col gap-3">
              <h2 className="font-bold">Lab Name</h2>
              <p className="text-xs">Due date: 12/12/2025</p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-xs w-full">
              <DataFields data={materialTypeData} />
              <DataFields data={materialProgressData} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-full flex-1">
        <PageTitle>Materials</PageTitle>
        <div className="flex flex-col h-full flex-1">
          <MaterialInfList />
        </div>
      </div>
    </div>
  );
}

interface DataFieldsProps {
  data: {
    title: string;
    fields: { label: string; value: number }[];
  };
}

const DataFields = ({ data }: DataFieldsProps) => {
  const { title, fields } = data;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold">{title}</h2>
      <span>
        {fields.map((field, i) => (
          <div key={i} className="grid grid-cols-2">
            <p>{field.label}:</p>
            <p>{field.value}</p>
          </div>
        ))}
      </span>
    </div>
  );
};
