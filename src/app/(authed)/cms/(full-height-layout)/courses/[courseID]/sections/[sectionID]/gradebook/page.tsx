"use client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "~/components/commons/DataTable";
import { columns } from "./_columns/gradebook.columns";

function GradebookPage() {
  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns,
    data: [
      {
        username: "6510405814",
        display_name: "Sornchai Somsakul",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405825",
        display_name: "Pattara Poomjai",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405836",
        display_name: "Chalida Chaiyaporn",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 5,
            manual_score: 7,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405847",
        display_name: "Thitipong Thongchai",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405858",
        display_name: "Nattaporn Narak",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405859",
        display_name: "Kanchana Kittisak",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 5,
            manual_score: 7,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405860",
        display_name: "Anupong Anuman",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405861",
        display_name: "Siriporn Sirichai",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405862",
        display_name: "Prasert Praphan",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405863",
        display_name: "Wanida Wongdee",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405864",
        display_name: "Suthep Sukhothai",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 5,
            manual_score: 7,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405865",
        display_name: "Nanthawan Nakhon",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405866",
        display_name: "Chaiyut Chaiprakarn",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 5,
            manual_score: 7,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405867",
        display_name: "Rattana Rattanakosin",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405868",
        display_name: "Komsan Kongkaew",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 5,
            manual_score: 7,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405869",
        display_name: "Supaporn Suphan",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405870",
        display_name: "Thawatchai Thanakorn",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405871",
        display_name: "Patcharaporn Pattana",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405872",
        display_name: "Vichai Vongvanich",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405873",
        display_name: "Nalinee Narong",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 5,
            manual_score: 7,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405874",
        display_name: "Sombat Somchai",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405875",
        display_name: "Piyanut Piyaporn",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 5,
            manual_score: 7,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405876",
        display_name: "Kittipong Kittisak",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405877",
        display_name: "Yuthana Yoddee",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 8,
            manual_score: 4,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 10,
            manual_score: 2,
            total_score: 12,
          },
        ],
      },
      {
        username: "6510405878",
        display_name: "Apinya Apirak",
        labs: [
          {
            id: "lab-01",
            name: "Lab 01",
            auto_score: 7,
            manual_score: 5,
            total_score: 12,
          },
          {
            id: "lab-02",
            name: "Lab 02",
            auto_score: 6,
            manual_score: 6,
            total_score: 12,
          },
          {
            id: "lab-03",
            name: "Lab 03",
            auto_score: 9,
            manual_score: 3,
            total_score: 12,
          },
        ],
      },
    ],
  });
  return (
    <DataTable table={table} textAlign="center" columnBordered hidePagination totalData={20} />
  );
}

export default GradebookPage;
