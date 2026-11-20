export type UploadImageResponse = {
  success: boolean;
  imageUrl: string;
};

export const uploadImage = async (
  file: File
): Promise<string> => {
  // Validate image
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image.");
  }

  // Validate size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size must be less than 5MB.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.imageUrl) {
    throw new Error(data.message || "Image upload failed.");
  }

  return data.imageUrl as string;
};