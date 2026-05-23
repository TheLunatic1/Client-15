export const compressImage = async (
  file: File,
  maxSizeMB = 2,
  maxWidthOrHeight = 1920
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // If the file is smaller than the target max size, we can return it directly.
    if (file.size / 1024 / 1024 <= maxSizeMB) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = Math.round((height * maxWidthOrHeight) / width);
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = Math.round((width * maxWidthOrHeight) / height);
            height = maxWidthOrHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        
        // Use JPEG for compression unless it's a PNG that needs transparency
        // (For simplicity and better compression, we convert to JPEG when reducing size,
        // but we can preserve PNG if it's explicitly a PNG)
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              
              const compressedFile = new File([blob], file.name, {
                type: mimeType,
                lastModified: Date.now(),
              });

              // If it's still too big and we haven't degraded quality too much, try again
              if (compressedFile.size / 1024 / 1024 > maxSizeMB && quality > 0.4) {
                quality -= 0.15;
                tryCompress();
              } else {
                resolve(compressedFile);
              }
            },
            mimeType,
            quality
          );
        };
        
        tryCompress();
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
