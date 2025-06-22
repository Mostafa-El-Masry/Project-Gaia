// const Name = "Mostafa";

// Reference to the gallery container
const imgGallery = document.querySelector(".imggallery");

// Generate jpg image paths (1-164)
const jpgAssets = Array.from({ length: 164 }, (_, i) => `/Assets/images/jpg (${i + 1}).jpg`);

// Generate webp image paths (1-5)
const webpAssets = Array.from({ length: 5 }, (_, i) => `/Assets/images/webp (${i + 1}).webp`);

// Generate gif image paths (1-8)
const gifAssets = Array.from({ length: 3 }, (_, i) => `/Assets/images/gif (${i + 1}).gif`);

// Combine all assets
const Assets = [...jpgAssets, ...webpAssets, ...gifAssets];

// Add classes to gallery container (once)
imgGallery.classList.add("mt-5", "justify-around");

// Use a DocumentFragment for better performance
const fragment = document.createDocumentFragment();

Assets.forEach((assetSrc) => {
  const galleryDiv = document.createElement("div");
  const link = document.createElement("a");
  const img = document.createElement("img");

  link.append(img);
  galleryDiv.append(link);

  link.setAttribute("target", "_blank");
  link.setAttribute("href", assetSrc);

  img.setAttribute("src", assetSrc);
  img.setAttribute("alt", "Gallery Image");
  img.classList.add("rounded-lg", "box-border");

  galleryDiv.classList.add("flex", "max-w-lg", "rounded-lg");

  fragment.append(galleryDiv);
});

imgGallery.append(fragment);