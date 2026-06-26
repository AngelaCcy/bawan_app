import { put } from "@vercel/blob";

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const { url } = await put(`avatars/${userId}.${ext}`, file, {
    access: "public",
    addRandomSuffix: false,
  });
  return url;
}
