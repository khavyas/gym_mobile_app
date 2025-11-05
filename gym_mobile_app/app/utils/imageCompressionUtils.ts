
import { Platform, Alert } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

// Configuration constants
const MAX_FILE_SIZE_KB = 900; // Leave 100KB buffer under 1MB LogMeal limit
const MAX_IMAGE_DIMENSION = 1920;
const DEFAULT_COMPRESSION_QUALITY = 0.8;

/**
 * Check if file size exceeds the threshold
 * @param sizeInBytes - File size in bytes
 * @param thresholdKB - Threshold in kilobytes (default: 900KB)
 * @returns boolean indicating if compression is needed
 */
export const needsCompression = (sizeInBytes: number, thresholdKB: number = MAX_FILE_SIZE_KB): boolean => {
  const sizeInKB = sizeInBytes / 1024;
  console.log(`File size: ${sizeInKB.toFixed(2)}KB, Threshold: ${thresholdKB}KB`);
  return sizeInKB > thresholdKB;
};

/**
 * Get file size from web File object
 * @param file - Web File object
 * @returns Size in bytes
 */
export const getWebFileSize = (file: File): number => {
  return file.size;
};

/**
 * WEB ONLY: Compress image using Canvas API
 * @param file - Original image file
 * @param maxSizeKB - Maximum target size in KB
 * @returns Compressed File object
 */
export const compressImageWeb = async (
  file: File,
  maxSizeKB: number = MAX_FILE_SIZE_KB
): Promise<File> => {
  if (Platform.OS !== 'web') {
    throw new Error('compressImageWeb can only be used on web platform');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions maintaining aspect ratio
        if (width > height && width > MAX_IMAGE_DIMENSION) {
          height = (height * MAX_IMAGE_DIMENSION) / width;
          width = MAX_IMAGE_DIMENSION;
        } else if (height > MAX_IMAGE_DIMENSION) {
          width = (width * MAX_IMAGE_DIMENSION) / height;
          height = MAX_IMAGE_DIMENSION;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Start with quality 0.9 and reduce if needed
        let quality = 0.9;
        
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              const sizeKB = blob.size / 1024;
              
              console.log(`Compression attempt - Quality: ${quality.toFixed(2)}, Size: ${sizeKB.toFixed(2)}KB`);
              
              // Accept if size is good or we've hit minimum quality
              if (sizeKB <= maxSizeKB || quality <= 0.3) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                
                console.log(`✅ Compression complete: ${(file.size / 1024).toFixed(0)}KB → ${sizeKB.toFixed(0)}KB (quality: ${quality})`);
                resolve(compressedFile);
              } else {
                // Reduce quality and try again
                quality -= 0.1;
                tryCompress();
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        tryCompress();
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

/**
 * NATIVE ONLY: Compress image using expo-image-manipulator
 * @param imageUri - URI of the image
 * @param quality - Compression quality (0-1)
 * @returns Object with compressed URI and size info
 */
export const compressImageNative = async (
  imageUri: string,
  quality: number = DEFAULT_COMPRESSION_QUALITY
): Promise<{ uri: string; width?: number; height?: number }> => {
  if (Platform.OS === 'web') {
    throw new Error('compressImageNative can only be used on native platforms');
  }

  try {
    console.log(`🔄 Compressing native image with quality: ${quality}`);
    
    const manipulatedImage = await ImageManipulator.manipulateAsync(
    imageUri,
    [
        { resize: { width: MAX_IMAGE_DIMENSION } },
    ],
    {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,  // ✅ CORRECT
    }
    );

    console.log(`✅ Native compression complete`);
    return manipulatedImage;
  } catch (error) {
    console.error('Error compressing native image:', error);
    throw error;
  }
};

/**
 * Process image based on platform and size
 * @param input - File (web) or URI string (native)
 * @param showAlert - Whether to show compression alert to user
 * @returns Processed file/URI
 */
export const processImage = async (
  input: File | string,
  showAlert: boolean = true
): Promise<File | string> => {
  try {
    if (Platform.OS === 'web' && input instanceof File) {
      // Web platform processing
      const fileSize = getWebFileSize(input);
      
      if (needsCompression(fileSize)) {
        if (showAlert) {
          Alert.alert(
            'Compressing Image',
            'Your image is being optimized for upload...'
          );
        }
        return await compressImageWeb(input);
      }
      return input;
      
    } else if (Platform.OS !== 'web' && typeof input === 'string') {
      // Native platform processing
      // Note: For native, we compress preemptively as we can't easily check size
      if (showAlert) {
        Alert.alert(
          'Processing Image',
          'Your image is being optimized...'
        );
      }
      const result = await compressImageNative(input);
      return result.uri;
      
    } else {
      throw new Error('Invalid input type for current platform');
    }
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

/**
 * Validate image before processing
 * @param input - File or URI
 * @returns Validation result with message
 */
export const validateImage = (input: File | string): { valid: boolean; message?: string } => {
  if (Platform.OS === 'web' && input instanceof File) {
    // Check file type
    if (!input.type.startsWith('image/')) {
      return { valid: false, message: 'Please select a valid image file' };
    }
    
    // Check if file is too large even before compression (>10MB is suspicious)
    const sizeInMB = input.size / (1024 * 1024);
    if (sizeInMB > 10) {
      return { 
        valid: false, 
        message: 'Image is too large (>10MB). Please choose a smaller image.' 
      };
    }
    
    return { valid: true };
  } else if (typeof input === 'string' && input.length > 0) {
    return { valid: true };
  }
  
  return { valid: false, message: 'Invalid image input' };
};

/**
 * Format bytes to human readable string
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "250 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};