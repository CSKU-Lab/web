"use client";

import PageTitle from "~/components/commons/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import LabTable from "./_components/LabTable";
import DefaultLabTable from "./_components/DefaultLabTable";

const tabMap = {
  lab: {
    label: "Labs",
    value: "lab",
  },
  defaultLab: {
    label: "Default Labs",
    value: "default-lab",
  },
};

export default function LabPage() {
  return (
    <div className="flex flex-col h-[100vh] w-full overflow-y-auto space-y-4">
      <PageTitle>Labs</PageTitle>
      <div className="flex flex-col h-full">
        <Tabs
          defaultValue={tabMap["lab"].value}
          className="flex flex-col h-full"
        >
          <TabsList className="flex flex-row ml-4">
            <TabsTrigger value={tabMap["lab"].value}>
              {tabMap["lab"].label}
            </TabsTrigger>
            <TabsTrigger value={tabMap["defaultLab"].value}>
              {tabMap["defaultLab"].label}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={tabMap["lab"].value}>
            <LabTable />
          </TabsContent>
          <TabsContent value={tabMap["defaultLab"].value}>
            <DefaultLabTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
