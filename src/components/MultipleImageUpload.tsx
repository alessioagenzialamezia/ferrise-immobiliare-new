import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';
import { uploadImage, deleteImage } from '../lib/supabase';

interface MultipleImageUploadProps {
  currentImages?: string[];
  onImagesChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
}

export default function MultipleImageUpload({ 
  currentImages = [], 
  onImagesChange, 
  folder = 'properties',
  maxImages = 15 
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Usa direttamente currentImages invece di stato locale
  const images = currentImages;

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Controlla il limite massimo
    if (images.length + files.length > maxImages) {
      alert(`Puoi caricare massimo ${maxImages} immagini. Attualmente ne hai ${images.length}.`);
      return;
    }

    // Valida i file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert('Per favore seleziona solo file immagine validi');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ogni file deve essere massimo 5MB');
        return;
      }
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(file => uploadImage(file, folder));
      const newImageUrls = await Promise.all(uploadPromises);
      
      const updatedImages = [...images, ...newImageUrls];
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Errore durante il caricamento delle immagini');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (indexToRemove: number) => {
    const imageToRemove = images[indexToRemove];
    
    try {
      // Elimina l'immagine dallo storage
      await deleteImage(imageToRemove);
      // Aggiorna l'array delle immagini
      const updatedImages = images.filter((_, index) => index !== indexToRemove);
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Errore durante l\'eliminazione dell\'immagine');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Immagini Proprietà ({images.length}/{maxImages})
        </label>
        {canAddMore && (
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={uploading}
            className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Aggiungi
          </button>
        )}
      </div>

      {/* Grid delle immagini */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <img 
              src={imageUrl} 
              alt={`Immagine ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Placeholder per aggiungere nuove immagini */}
        {canAddMore && (
          <div 
            onClick={triggerFileInput}
            className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-1"></div>
                <p className="text-xs text-gray-600">Caricamento...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                <p className="text-xs text-gray-600 text-center">Clicca per aggiungere</p>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading || !canAddMore}
      />

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Nessuna immagine caricata</p>
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={uploading}
            className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Carica Immagini
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Formati supportati: PNG, JPG, GIF. Dimensione massima per file: 5MB. 
        Puoi caricare fino a {maxImages} immagini per proprietà.
      </p>
    </div>
  );
}