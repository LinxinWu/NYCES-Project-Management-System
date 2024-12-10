export const compressImage = async (imageData) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageData;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Determine optimal dimensions based on image size
      const maxDimension = Math.max(width, height);
      let targetWidth = width;
      let targetHeight = height;
      
      // Scale down large images more aggressively
      if (maxDimension > 3000) {
        const scale = 1500 / maxDimension;
        targetWidth = Math.round(width * scale);
        targetHeight = Math.round(height * scale);
      } else if (maxDimension > 2000) {
        const scale = 1200 / maxDimension;
        targetWidth = Math.round(width * scale);
        targetHeight = Math.round(height * scale);
      } else if (maxDimension > 1000) {
        const scale = 800 / maxDimension;
        targetWidth = Math.round(width * scale);
        targetHeight = Math.round(height * scale);
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Determine quality based on file size
      const initialData = canvas.toDataURL('image/jpeg', 0.9);
      const initialSize = initialData.length * 0.75; // Approximate size in bytes
      
      // Adjust quality based on size
      let quality = 0.9;
      if (initialSize > 2000000) quality = 0.6;
      else if (initialSize > 1000000) quality = 0.7;
      else if (initialSize > 500000) quality = 0.8;

      // Convert to compressed base64
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
}; 