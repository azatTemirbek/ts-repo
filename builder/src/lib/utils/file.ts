import { access, mkdir, writeFile } from "fs/promises";
import path from "path";


export async function isExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

export async function exportToFile(filePath: string, data: string) {
  try {
    const dirname = path.dirname(filePath);
    const exist = await isExists(dirname);
    if (!exist) {
      await mkdir(dirname, {recursive: true});
    }
    await writeFile(filePath, data);
  } catch (err: any) {
    throw new Error(err);
  }
}