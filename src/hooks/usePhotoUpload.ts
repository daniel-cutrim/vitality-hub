import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UploadResult {
  url: string;
  path: string;
}

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadPhoto = async (
    file: File,
    userId: string,
    folder: 'anamnese' | 'checkin'
  ): Promise<UploadResult | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('user-photos')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('user-photos')
      .getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
  };

  const uploadMultiplePhotos = async (
    files: File[],
    userId: string,
    folder: 'anamnese' | 'checkin'
  ): Promise<string[]> => {
    setUploading(true);
    const urls: string[] = [];

    try {
      for (const file of files) {
        const result = await uploadPhoto(file, userId, folder);
        if (result) {
          urls.push(result.url);
        }
      }
    } finally {
      setUploading(false);
    }

    return urls;
  };

  const deletePhoto = async (filePath: string): Promise<boolean> => {
    const { error } = await supabase.storage
      .from('user-photos')
      .remove([filePath]);

    return !error;
  };

  return {
    uploadPhoto,
    uploadMultiplePhotos,
    deletePhoto,
    uploading,
  };
}
