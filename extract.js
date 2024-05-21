let originalImageData, watermarkData;

function previewImage(event) {
  const preview = document.getElementById('preview');
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const img = new Image();
    img.onload = function() {
      const canvas = document.getElementById('originalCanvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      originalImageData = reader.result;
      extractWatermark();
    }
    img.src = reader.result;
  }

  reader.readAsDataURL(file);
}

function extractWatermark() {
  const watermarkCanvas = document.getElementById('watermarkCanvas');
  const context = watermarkCanvas.getContext('2d');

  const img = new Image();
  img.onload = function() {
    watermarkCanvas.width = img.width;
    watermarkCanvas.height = img.height;
    context.drawImage(img, 0, 0);

    const imageData = context.getImageData(0, 0, watermarkCanvas.width, watermarkCanvas.height);
    const pixelData = imageData.data;

    const watermarkData = new Uint8ClampedArray(watermarkCanvas.width * watermarkCanvas.height * 4);

    let pixelIndex = 0;
    for (let y = 0; y < watermarkCanvas.height; y++) {
      for (let x = 0; x < watermarkCanvas.width; x++) {
        const r = pixelData[pixelIndex];
        const g = pixelData[pixelIndex + 1];
        const b = pixelData[pixelIndex + 2];
        const a = pixelData[pixelIndex + 3];

        watermarkData[pixelIndex] = r;
        watermarkData[pixelIndex + 1] = g;
        watermarkData[pixelIndex + 2] = b;
        watermarkData[pixelIndex + 3] = a;

        pixelIndex += 4;
      }
    }

    const watermarkImageData = new ImageData(watermarkData, watermarkCanvas.width, watermarkCanvas.height);
    context.putImageData(watermarkImageData, 0, 0);
  }

  const originalImage = new Image();
  originalImage.onload = function() {
    const originalCanvas = document.getElementById('originalCanvas');
    const context = originalCanvas.getContext('2d');
    originalCanvas.width = originalImage.width;
    originalCanvas.height = originalImage.height;
    context.drawImage(originalImage, 0, 0);
  }
  originalImage.src = originalImageData;
}