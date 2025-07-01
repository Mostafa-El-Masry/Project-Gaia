(function () {
  // Reference to the gallery container
  const imgGallery = document.querySelector(".imggallery");
  if (!imgGallery) return; // Exit if not on the correct page

  // Generate jpg image paths (1-164)
  const jpgAssets = Array.from({ length: 164 }, (_, i) => `/Assets/images/jpg (${i + 1}).jpg`);
  // Generate webp image paths (1-2)
  const webpAssets = Array.from({ length: 2 }, (_, i) => `/Assets/images/webp (${i + 1}).webp`);
  // Generate gif image paths (1-3)
  const gifAssets = Array.from({ length: 3 }, (_, i) => `/Assets/images/gif (${i + 1}).gif`);
  // Combine all assets
  const Assets = [...jpgAssets, ...gifAssets, ...webpAssets];

  // Shuffle the Assets array
  for (let i = Assets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [Assets[i], Assets[j]] = [Assets[j], Assets[i]];
  }

  // --- SLIDER LOGIC (main image + left/right thumbnails) ---
  let currentIndex = 0;
  const carouselList = document.getElementById('carousel-list');
  const leftThumb = document.getElementById('carousel-thumb-left');
  const rightThumb = document.getElementById('carousel-thumb-right');

  function updateActive() {
    // Show main image
    carouselList.innerHTML = '';
    const mainDiv = document.createElement('div');
    mainDiv.className = 'item';
    const mainImg = document.createElement('img');
    mainImg.src = Assets[currentIndex];
    mainDiv.appendChild(mainImg);
    carouselList.appendChild(mainDiv);

    // Show left thumbnail
    leftThumb.innerHTML = '';
    let prevIdx = (currentIndex - 1 + Assets.length) % Assets.length;
    let prevDiv = document.createElement('div');
    prevDiv.className = 'item';
    let prevImg = document.createElement('img');
    prevImg.src = Assets[prevIdx];
    prevDiv.appendChild(prevImg);
    prevDiv.onclick = () => {
      currentIndex = prevIdx;
      updateActive();
    };
    leftThumb.appendChild(prevDiv);

    // Show right thumbnail
    rightThumb.innerHTML = '';
    let nextIdx = (currentIndex + 1) % Assets.length;
    let nextDiv = document.createElement('div');
    nextDiv.className = 'item';
    let nextImg = document.createElement('img');
    nextImg.src = Assets[nextIdx];
    nextDiv.appendChild(nextImg);
    nextDiv.onclick = () => {
      currentIndex = nextIdx;
      updateActive();
    };
    rightThumb.appendChild(nextDiv);
  }

  updateActive();

  // --- GALLERY LOGIC (optional, if you want the gallery below) ---
  imgGallery.innerHTML = "";
  imgGallery.classList.add("mt-5", "justify-around");
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
})();