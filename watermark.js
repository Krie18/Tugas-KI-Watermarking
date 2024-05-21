let imageData;
let watermarkData;
let imageWidth, imageHeight;
let downloadLink;

function previewImage(event) {
  const preview = document.getElementById('preview');
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const img = new Image();
    img.onload = function() {
      const maxWidth = 400;
      const maxHeight = 400;

      let widthRatio = img.width / maxWidth;
      let heightRatio = img.height / maxHeight;
      let ratio = Math.max(widthRatio, heightRatio);

      if (ratio > 1) {
        imageWidth = Math.round(img.width / ratio);
        imageHeight = Math.round(img.height / ratio);
      } else {
        imageWidth = img.width;
        imageHeight = img.height;
      }

      preview.width = imageWidth;
      preview.height = imageHeight;
      preview.src = reader.result;
      imageData = reader.result;
    }
    img.src = reader.result;
  }

  reader.readAsDataURL(file);
}

function previewWatermark(event) {
  const watermarkPreview = document.getElementById('watermarkPreview');
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    watermarkPreview.src = reader.result;
    watermarkData = reader.result;
  }

  reader.readAsDataURL(file);
}

function addWatermark() {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  downloadLink = document.getElementById('downloadLink');
  downloadLink.style.display = 'none';

  const img = new Image();
  img.onload = function() {
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    context.drawImage(img, 0, 0, imageWidth, imageHeight);

    const watermarkImg = new Image();
    watermarkImg.onload = function() {
      context.globalAlpha = 0.5; // Mengatur transparansi watermark
      context.globalCompositeOperation = 'source-over';
      context.drawImage(watermarkImg, 0, 0, imageWidth, imageHeight);
      context.globalAlpha = 1.0;
    }
    watermarkImg.src = watermarkData;

    const watermarkedImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    localStorage.setItem('watermarkedImageData', JSON.stringify(Array.from(watermarkedImageData.data)));
    localStorage.setItem('originalImageData', imageData);

    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.style.display = 'inline';
  }
  img.src = imageData;
}