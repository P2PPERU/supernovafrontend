import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
  
  // Obtener el token de las cookies - AGREGAR await
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  
  if (!token) {
    return NextResponse.json({
      success: false,
      error: 'No authentication token found',
      message: 'Please login first'
    });
  }
  
  try {
    // Intentar obtener la lista de imágenes con autenticación
    const response = await fetch(`${baseUrl}/api/upload/images`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    console.log('Backend response:', data);
    
    // Verificar una imagen específica si hay imágenes
    if (data.images && data.images.length > 0) {
      // Construir la URL de la imagen correctamente
      let testImageUrl = '';
      
      if (data.images[0].url) {
        // Si la imagen ya tiene URL, usarla
        testImageUrl = data.images[0].url.startsWith('http') 
          ? data.images[0].url 
          : `${baseUrl}${data.images[0].url}`;
      } else if (data.images[0].path) {
        // Si tiene path, construir URL
        testImageUrl = `${baseUrl}${data.images[0].path}`;
      } else if (data.images[0].filename) {
        // Si solo tiene filename, construir la ruta completa
        testImageUrl = `${baseUrl}/uploads/news/${data.images[0].filename}`;
      }
      
      // Intentar acceder a la imagen
      const imageResponse = await fetch(testImageUrl);
      
      return NextResponse.json({
        success: true,
        apiUrl: baseUrl,
        imagesData: data,
        firstImage: data.images[0],
        testImageUrl,
        imageExists: imageResponse.ok,
        imageStatus: imageResponse.status,
        imageContentType: imageResponse.headers.get('content-type')
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'No images found in database',
      apiUrl: baseUrl,
      data,
      responseStatus: response.status
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      apiUrl: baseUrl
    });
  }
}