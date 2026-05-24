import { languageServer } from "codemirror-languageserver";

export function createLspExtension(
  lang: string,
  sessionId: string,
  token: string,
  lspUrl: string,
  ext: string,
) {
  const serverUri =
    `${lspUrl}/lsp?lang=${lang}&sessionId=${sessionId}&token=${encodeURIComponent(token)}` as `ws://${string}` | `wss://${string}`;

  return languageServer({
    serverUri,
    rootUri: `file:///session/${sessionId}`,
    documentUri: `file:///session/${sessionId}/main.${ext}`,
    languageId: lang,
    workspaceFolders: null,
  });
}
