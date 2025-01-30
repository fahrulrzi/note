import { UploadedFile } from "express-fileupload";
import { supabase } from "../service/supabase";
import { v4 as uuidv4 } from "uuid";

async function uploadImage(imageFile: UploadedFile, noteId: Number) {
  try {
    const fileName = `${uuidv4()}_${imageFile.name}`;
    const sanitizedFileName = fileName.replace(/[{}<>^%$&*#@!]/g, "");

    // Upload image to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("image_note")
      .upload(sanitizedFileName, imageFile.data, {
        contentType: imageFile.mimetype,
      });
    if (uploadError) throw uploadError;

    // Get public URL of the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from("image_note").getPublicUrl(sanitizedFileName);

    // Insert image data to database
    const { data, error } = await supabase.from("note_images").insert([
      {
        note_id: noteId,
        image_url: publicUrl,
        image_name: sanitizedFileName,
      },
    ]);

    if (error) throw error;

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
}

export { uploadImage };
