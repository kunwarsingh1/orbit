/**
 * Reads `public/360 Sourcing Suite.docx` and prints plain text to stdout
 * (or writes to a file) for transcribing into `src/data/*.ts`.
 *
 * Usage: npm run extract:sourcing-doc
 * Requires: place the Word file at public/360 Sourcing Suite.docx
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mammoth from "mammoth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const docPath = path.join(root, "public", "360 Sourcing Suite.docx");

if (!fs.existsSync(docPath)) {
  console.error(`Missing file: ${docPath}`);
  console.error("Add your Word document there, then run this script again.");
  process.exit(1);
}

const result = await mammoth.extractRawText({ path: docPath });
process.stdout.write(result.value);
if (result.messages?.length) {
  console.error("\n--- mammoth messages ---\n", result.messages);
}
