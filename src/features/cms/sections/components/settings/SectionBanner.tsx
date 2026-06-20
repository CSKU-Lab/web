"use client";
import { Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface Props {
  value: string | File | null;
  onChange: (value: File) => void;
  children?: React.ReactNode;
}

function SectionBanner({ value, onChange, children }: Props) {
  const [previewImage, setPreviewImage] = useState<string | Blob | null>(value);

  useEffect(() => {
    if (typeof value === "string") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewImage(value);
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      onChange(file);
      setPreviewImage(URL.createObjectURL(file));
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: { "image/*": [] },
      maxSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 1,
      onDrop,
      onDropRejected: () => {
        toast.error("Error", {
          description: "File is too large or of invalid type.",
        });
      },
    });

  return (
    <div
      {...getRootProps()}
      className="w-full aspect-video rounded-lg bg-(--gray-6) overflow-hidden cursor-pointer group relative"
    >
      {isDragActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-(--gray-9)/80 text-(--gray-2)">
          {isDragReject ? "File not accepted" : "Drop the image here..."}
        </div>
      )}
      <input {...getInputProps()} />
      <div className="absolute inset-0 bg-(--gray-9)/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-(--gray-1) font-medium text-lg">
        <Pencil size="1rem" />
      </div>
      {previewImage !== null && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewImage}
          className="object-cover object-center w-full h-full text-transparent"
          alt="section banner"
        />
      )}
      {children}
    </div>
  );
}

export default SectionBanner;
