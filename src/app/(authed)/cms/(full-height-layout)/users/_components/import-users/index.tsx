import { ExternalLink, Import } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import { parseCSV } from "./parse-csv";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FileUploader } from "~/components/commons/FileUploader";
import { useQueryClient } from "@tanstack/react-query";
import { userService } from "~/services/user.service";
import { toast } from "sonner";
import { queryKeys } from "~/queryKeys";
import CodeMirror from "~/components/Editor/CodeMirror";

type Tab = "file" | "editor";

function ImportUser() {
  const exampleCSV = `type,username,password,display_name,email,roles,group\ncredential,john_doe,password123,John Doe,,student,CS101\noauth,jane_smith,,Jane Smith,jane.smith@example.com,instructor+student,`;
  const [rawData, setRawData] = useState(exampleCSV);
  const [selectedTab, setSelectedTab] = useState<Tab>("file");

  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const handleImport = async () => {
    try {
      setIsLoading(true);
      const parsedUsers = parseCSV(rawData);
      await userService.importUsers(parsedUsers);
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      toast.success("Users imported successfully!");
      setIsOpen(false);
      setRawData(exampleCSV);
    } catch (err) {
      toast.error("Failed to import users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Import size="1rem" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[800px] sm:max-w-fit">
        <DialogHeader className="flex-row justify-between p-4 w-full">
          <div className="space-y-2 w-full">
            <DialogTitle>Import Users</DialogTitle>
            <DialogDescription>
              Upload a CSV file or write CSV content directly in the editor.
            </DialogDescription>
            <a
              className="inline-flex items-center gap-1.5 hover:text-(--grass-9)"
              href="#"
            >
              <ExternalLink size="1rem" />
              Docs
            </a>
          </div>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <Tabs
            defaultValue="file"
            className="mt-4"
            value={selectedTab}
            onValueChange={(val) => setSelectedTab(val as Tab)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">File Upload</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
            </TabsList>
            <TabsContent value="file" className="mt-4">
              <FileUploader
                className="min-h-[300px] border rounded-md"
                onFileSelect={async (files) => {
                  const file = files[0];
                  if (file) {
                    const content = await file.text();
                    setRawData(content);
                    setSelectedTab("editor");
                  }
                }}
                accept={{
                  "text/csv": [".csv"],
                }}
                maxSize={10485760} // 10MB
              />
            </TabsContent>
            <TabsContent value="editor" className="mt-4">
              <div className="h-[300px] border border-(--gray-4) rounded-lg overflow-hidden">
                <CodeMirror
                  className="h-full"
                  value={rawData}
                  onChange={setRawData}
                  placeholder=""
                />
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end mt-2 gap-1.5">
            <Button
              {...{ isLoading }}
              onClick={handleImport}
              variant="action"
              className="px-8"
            >
              <Import size="1rem" />
              Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ImportUser;
