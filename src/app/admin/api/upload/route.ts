import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ status: "fail", error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadDir = path.join(process.cwd(), 'public/images');

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    // Revalidate cache (if needed)
    revalidatePath("/");

    return NextResponse.json({ status: "success", imageUrl: `/images/${file.name}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e.message }, { status: 500 });
  }
}



