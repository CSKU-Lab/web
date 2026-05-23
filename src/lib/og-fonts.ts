import { readFile } from "fs/promises";
import path from "path";

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export async function loadOGFonts() {
  const [regular, bold] = await Promise.all([
    readFile(path.join(process.cwd(), "src/assets/fonts/Boon-Regular.ttf")),
    readFile(path.join(process.cwd(), "src/assets/fonts/Boon-SemiBold.ttf")),
  ]);
  return [
    { name: "Boon", data: toArrayBuffer(regular), weight: 400 as const },
    { name: "Boon", data: toArrayBuffer(bold), weight: 600 as const },
    { name: "Boon", data: toArrayBuffer(bold), weight: 700 as const },
  ];
}
