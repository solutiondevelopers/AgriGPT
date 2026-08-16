export interface SeedQualityScanResult {
  isSeedImage: boolean;
  seedType: string;
  overallQualityScore: number;
  viabilityEstimate: string;
  purityPercentage: number;
  defectRate: string;
  moistureEstimate: string;
  observations: string[];
  recommendation: string;
  disclaimer: string;
}

export interface SeedQualityScanRequest {
  image: string;
  seedType?: string;
  language: 'en' | 'hi' | 'mr' | string;
}

export const seedQualityService = {
  validateImage(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: "Please select an image of the seeds." };
    }
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return { valid: false, error: "Unsupported image format. Please upload JPG, PNG, or WEBP." };
    }
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: "Image size exceeds 10 MB limit." };
    }
    return { valid: true };
  },

  async processImageForUpload(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read image file."));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error("Invalid image format or corrupted file."));
        img.onload = () => {
          const maxDim = 1280;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(e.target?.result as string);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  },

  async analyzeSeedQuality(request: SeedQualityScanRequest): Promise<SeedQualityScanResult> {
    const response = await fetch('/api/seed-quality', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with error status ${response.status}`);
    }
    
    return await response.json();
  }
};
