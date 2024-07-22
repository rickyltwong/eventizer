import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(
  req: NextRequest,
): Promise<NextResponse | undefined> {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { status: 'fail', error: 'No file uploaded' },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadDir = path.join(process.cwd(), 'public/images');

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, new Uint8Array(buffer));

    // Revalidate cache (if needed)
    revalidatePath('/');

    return NextResponse.json({
      status: 'success',
      imageUrl: `/images/${file.name}`,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
      return NextResponse.json(
        { status: 'fail', error: e.message },
        { status: 500 },
      );
    }
  }
}
