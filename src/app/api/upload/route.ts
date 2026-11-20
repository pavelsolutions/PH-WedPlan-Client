
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image");

    // Check image
    if (!(image instanceof File)) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    // Check image type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Check image size (5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image must be smaller than 5MB" },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing");
    }

    // Prepare ImgBB request
    const uploadData = new FormData();

    uploadData.append("image", image);

    // Upload image to ImgBB
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { message: "Image upload failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.data.url,
    });

  } catch (error) {
    console.error("Image Upload Error:", error);

    return NextResponse.json(
      { message: "Something went wrong during image upload" },
      { status: 500 }
    );
  }
}
