import { ArrowLeft, NotebookPen, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/commons/Button";
import { FileUploader } from "~/components/commons/FileUploader";
import CodeMirror from "~/components/Editor/CodeMirror";

interface Props {
  value: string[];
  onChange: (users: string[]) => void;
}

function StudentImport({ value, onChange }: Props) {
  const [editorValue, setEditorValue] = useState(value.join("\n"));
  const [importBy, setImportBy] = useState<"upload" | "editor" | null>(null);

  const handleOnUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const textContent = await file.text();
    const studentsData = textContent;

    setEditorValue(studentsData);
    setImportBy("editor");
  };

  useEffect(() => {
    const parsedStudents = editorValue
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    onChange(parsedStudents);
  }, [editorValue, onChange]);
  console.log(editorValue);

  return (
    <div>
      {importBy === null && (
        <div className="flex items-center gap-4">
          <Button onClick={() => setImportBy("upload")}>
            <Upload size="1rem" />
            Upload
          </Button>
          <span className="text-sm text-(--gray-11)">or</span>
          <Button onClick={() => setImportBy("editor")}>
            <NotebookPen size="1rem" />
            Text Editor
          </Button>
        </div>
      )}

      {importBy !== null && (
        <Button
          variant="transparent"
          className="mb-4"
          onClick={() => setImportBy(null)}
        >
          <ArrowLeft size="1rem" /> Back
        </Button>
      )}

      {importBy === "upload" && (
        <FileUploader
          onFileSelect={handleOnUpload}
          accept={{ "text/csv": [".csv"] }}
          maxSize={10000000}
          className="flex-1 h-80"
        />
      )}
      {importBy === "editor" && (
        <div className="border rounded-md overflow-hidden h-80 flex-1">
          <CodeMirror
            className="h-full"
            value={editorValue}
            onChange={setEditorValue}
          />
        </div>
      )}
    </div>
  );
}

export default StudentImport;
