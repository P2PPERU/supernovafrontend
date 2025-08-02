import { api } from '@/lib/axios';

export interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

export const uploadService = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Construir URL completa
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseUrl}${response.data.url}`;
  },
  
  deleteImage: async (filename: string): Promise<void> => {
    await api.delete(`/upload/image/${filename}`);
  },
  
  // Nuevo método para listar imágenes
  getImages: async (): Promise<UploadedImage[]> => {
    const response = await api.get('/upload/images');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
    
    // Asegurar que las URLs sean completas
    return response.data.images.map((img: any) => ({
      ...img,
      url: img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`
    }));
  },
};