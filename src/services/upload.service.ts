import { api } from '@/lib/axios';
import { AxiosError } from 'axios';

interface UploadResponse {
  success: boolean;
  filename: string;
  url: string;
  size: number;
}

interface ImagesListResponse {
  success: boolean;
  images: Array<{
    filename: string;
    url: string;
    size: number;
    uploadedAt: string;
    createdAt?: string;
    modifiedAt?: string;
  }>;
}

// Helper para construir URLs completas
const buildImageUrl = (path: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
  
  console.log('Building image URL for path:', path);
  console.log('Base URL:', baseUrl);
  
  // Si ya es una URL completa, devolverla
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Si es una ruta que empieza con /, agregarla al baseUrl
  if (path.startsWith('/')) {
    return `${baseUrl}${path}`;
  }
  
  // Si no tiene /, construir la ruta completa
  return `${baseUrl}/uploads/news/${path}`;
};

export const uploadService = {
  // Subir imagen
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('Uploading image...');
      
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);

      // Construir la URL completa de la imagen
      const imageUrl = buildImageUrl(
        response.data.url || 
        response.data.path || 
        response.data.filename
      );

      console.log('Final image URL:', imageUrl);

      return {
        ...response.data,
        url: imageUrl
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Listar imágenes - ACTUALIZADO
  getImages: async (): Promise<ImagesListResponse> => {
    try {
      console.log('Fetching images...');
      
      const response = await api.get('/upload/images');
      
      console.log('Images list response:', response.data);
      
      // Si no hay imágenes, devolver array vacío
      if (!response.data.images || response.data.images.length === 0) {
        return {
          success: true,
          images: []
        };
      }
      
      // Transformar las URLs de las imágenes
      const images = response.data.images.map((img: any) => {
        // El backend devuelve la URL como "/uploads/news/filename.png"
        // Necesitamos construir la URL completa
        const imageUrl = buildImageUrl(img.url || img.path || img.filename);
        
        console.log('Image transformed:', {
          original: img,
          transformedUrl: imageUrl
        });
        
        return {
          ...img,
          url: imageUrl,
          // Normalizar los campos de fecha
          uploadedAt: img.uploadedAt || img.createdAt || img.modifiedAt
        };
      });
      
      return {
        success: true,
        images
      };
    } catch (error) {
      console.error('Error fetching images:', error);
      
      // Verificar si es un error de Axios
      if (error instanceof AxiosError) {
        // Si hay error de autenticación, devolver array vacío
        if (error.response?.status === 401) {
          console.log('Authentication error - returning empty array');
          return {
            success: false,
            images: []
          };
        }
      }
      
      throw error;
    }
  },

  // Eliminar imagen
  deleteImage: async (filename: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Deleting image:', filename);
      const response = await api.delete(`/upload/image/${filename}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Helper para obtener la URL completa de una imagen
  getImageUrl: (filename: string): string => {
    if (!filename) return '';
    return buildImageUrl(filename);
  },
};