import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    // Validate image exists
    if (!(image instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Image is required.",
        },
        { status: 400 }
      );
    }

    // Validate image type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image files are allowed.",
        },
        { status: 400 }
      );
    }

    // Validate size
    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image must be smaller than 5MB.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("ImgBB API key is missing.");
    }

    const uploadData = new FormData();
    uploadData.append("image", image);

    // Upload to ImgBB
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
        {
          success: false,
          message: result.error?.message || "Image upload failed.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.data.display_url,
    });
  } catch (error) {
    console.error("Image Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong during image upload.",
      },
      { status: 500 }
    );
  }
}