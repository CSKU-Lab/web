"use client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "~/components/commons/DataTable";
import { columns } from "./_columns/gradebook.columns";
import RouteNavigation from "../_components/RouteNavigation";

function GradebookPage() {
  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    columns,
    data: [
      {
        username: "6510405814",
        display_name: "ณัฐวุฒิ แสงสว่าง",
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
        display_name: "สุภาพร ใจดี",
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
        display_name: "พัชรพล พลายแก้ว",
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
        display_name: "วรางคณา วีระกุล",
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
        display_name: "ธนากรณ์ ทองสุข",
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
        display_name: "นวลพรรณ นิลกาญจน์",
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
        display_name: "ศุภชัย ชัยชนะ",
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
        display_name: "อรพรรณ อรุณสวัสดิ์",
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
        display_name: "กิตติพงษ์ กาญจนรัตน์",
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
        display_name: "สมชาย สมบัติ",
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
        display_name: "จิราพร จิตรกร",
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
        display_name: "วัชรพล วัฒนศักดิ์",
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
        display_name: "รุ่งนภา รุ่งเรือง",
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
        display_name: "ธีรพงษ์ ธีระวัฒน์",
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
        display_name: "นันทนา นันทาพร",
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
        display_name: "พีรพล พีรพงษ์",
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
        display_name: "สาวิตรี สายใจ",
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
        display_name: "วิชัย วิชาชัย",
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
        display_name: "ลัดดา ลัดดาวัลย์",
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
        display_name: "ชัยวัฒน์ ชัยนาท",
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
        display_name: "มนต์นภา มนต์นวล",
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
        display_name: "รัฐพงษ์ รัฐวิไล",
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
        display_name: "สุนิสา สุนันท์",
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
        display_name: "เอกพล เอกวัฒน์",
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
        display_name: "วรุณ วรุณ",
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
    <>
      <RouteNavigation title="Gradebook" />
      <DataTable
        table={table}
        columnBordered
        hidePagination
        textAlign="center"
        totalData={20}
        className="font-[Boon]"
      />
    </>
  );
}

export default GradebookPage;
