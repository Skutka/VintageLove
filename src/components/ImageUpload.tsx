import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  userId: string;
  currentImage: string;
  profilePhotos: string[];
  onImageUploaded: (url: string) => void;
  onPhotosUpdated: (photos: string[]) => void;
}

export function ImageUpload({ 
  userId, 
  currentImage, 
  profilePhotos, 
  onImageUploaded, 
  onPhotosUpdated 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>, isMainPhoto: boolean = false) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      if (!isMainPhoto && profilePhotos.length >= 4) {
        throw new Error('Maximum 4 additional photos allowed.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      if (isMainPhoto) {
        if (currentImage) {
          const oldPath = currentImage.split('/').pop();
          if (oldPath) {
            await supabase.storage
              .from('profile-images')
              .remove([`${userId}/${oldPath}`]);
          }
        }
        onImageUploaded(publicUrl);
      } else {
        onPhotosUpdated([...profilePhotos, publicUrl]);
      }

      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async (photoUrl: string, index: number) => {
    try {
      const fileName = photoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('profile-images')
          .remove([`${userId}/${fileName}`]);
      }

      const newPhotos = [...profilePhotos];
      newPhotos.splice(index, 1);
      onPhotosUpdated(newPhotos);
      toast.success('Photo removed successfully');
    } catch (error) {
      toast.error('Error removing photo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        {currentImage && (
          <div className="relative">
            <img
              src={currentImage}
              alt="Main Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <span className="absolute bottom-0 left-0 bg-white px-2 py-1 text-sm rounded-full">
              Main Photo
            </span>
          </div>
        )}
        <label className="cursor-pointer">
          <div className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-purple-700 transition">
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Uploading...' : 'Upload Main Photo'}</span>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => uploadImage(e, true)}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Photos ({profilePhotos.length}/4)</h3>
        <div className="grid grid-cols-2 gap-4">
          {profilePhotos.map((photo, index) => (
            <div key={photo} className="relative">
              <img
                src={photo}
                alt={`Profile ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(photo, index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {profilePhotos.length < 4 && (
            <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-40 hover:border-purple-500 transition">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <span className="text-sm text-gray-500">Add Photo</span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={uploadImage}
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}