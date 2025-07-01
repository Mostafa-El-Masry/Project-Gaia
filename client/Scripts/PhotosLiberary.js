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

  // --- Shuffle the Assets array ---
  for (let i = Assets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [Assets[i], Assets[j]] = [Assets[j], Assets[i]];
  }
  // --- End shuffle ---

  // --- SLIDER LOGIC ---
  let currentIndex = 0;
  const sliderImage = document.getElementById('slider-image');
  const sliderPrev = document.getElementById('slider-prev');
  const sliderNext = document.getElementById('slider-next');
  const sliderCounter = document.getElementById('slider-counter');

  function updateSlider() {
    if (!sliderImage) return;
    sliderImage.src = Assets[currentIndex];
    sliderCounter.textContent = `Image ${currentIndex + 1} of ${Assets.length}`;
  }

  if (sliderPrev && sliderNext && sliderImage) {
    sliderPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + Assets.length) % Assets.length;
      updateSlider();
    });
    sliderNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % Assets.length;
      updateSlider();
    });
    updateSlider();
  }
  // --- END SLIDER LOGIC ---

  // Clear previous gallery content to avoid duplicates
  imgGallery.innerHTML = "";
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

  // Button event (if present)
  const btn = document.getElementById('myBtn');
  if (btn && !btn.dataset.listener) {
    btn.addEventListener('click', myFunc);
    btn.dataset.listener = "true";
  }

  // --- CAROUSEL LOGIC ---
  const carouselTrack = document.getElementById('carousel-track');
  if (carouselTrack && Array.isArray(Assets) && Assets.length > 0) {
    let currentIndex = 0;

    function renderCarousel() {
      carouselTrack.innerHTML = '';

      // Show 7 images: 3 left, center, 3 right (with wrap-around)
      const visibleCount = 7;
      const half = Math.floor(visibleCount / 2);

      carouselTrack.style.position = 'relative';

      // Dynamically calculate container size
      const containerWidth = carouselTrack.offsetWidth || 1200;
        // Increase the carousel height and main image height
      const containerHeight = carouselTrack.offsetHeight || window.innerHeight * 0.95 || 900;

      // Main image: up to 80% of container width and 90% of container height, but never more than 900x900px
      const mainImgMaxWidth = Math.min(containerWidth * 0.8, 900);
      const mainImgMaxHeight = Math.min(containerHeight * 0.9, 900);

      // Side images: 45% of main image size
      const sideImgMaxWidth = mainImgMaxWidth * 0.45;
      const sideImgMaxHeight = mainImgMaxHeight * 0.7;

      for (let offset = -half; offset <= half; offset++) {
        let idx = (currentIndex + offset + Assets.length) % Assets.length;
        const img = document.createElement('img');
        img.src = Assets[idx];
        img.draggable = false;
        img.style.position = 'absolute';
        img.style.top = '50%';
        img.style.left = '50%';
        img.style.objectFit = 'contain';
        img.style.background = '#fff';

        if (offset === 0) {
          img.style.maxWidth = `${mainImgMaxWidth}px`;
          img.style.maxHeight = `${mainImgMaxHeight}px`;
          img.style.width = 'auto';
          img.style.height = 'auto';
          img.style.zIndex = 10;
          img.style.transform = `translate(-50%, -50%) scale(1)`;
        } else {
          img.style.maxWidth = `${sideImgMaxWidth}px`;
          img.style.maxHeight = `${sideImgMaxHeight}px`;
          img.style.width = 'auto';
          img.style.height = 'auto';
          img.style.zIndex = 10 - Math.abs(offset);
          img.style.transform = `translate(-50%, -50%) translateX(${offset * (mainImgMaxWidth * 0.55)}px)`;
        }

        img.style.transition = 'all 0.4s cubic-bezier(.4,2,.6,1)';
        img.className = 'rounded-xl shadow-xl cursor-pointer select-none';

        if (offset !== 0) {
          img.onclick = () => {
            currentIndex = idx;
            renderCarousel();
          };
        }
        carouselTrack.appendChild(img);
      }
      // Increase the carousel container height
      carouselTrack.style.height = `${mainImgMaxHeight + 80}px`;
      carouselTrack.style.width = '100%';
      carouselTrack.style.overflow = 'visible';
    }

    // Re-render on window resize for responsiveness
    window.addEventListener('resize', renderCarousel);

    renderCarousel();
  }

  // --- ADVANCED CAROUSEL LOGIC ---
  const carouselList = document.getElementById('carousel-list');
  const carouselThumbnails = document.getElementById('carousel-thumbnails');
  const nextDom = document.getElementById('next');
  const prevDom = document.getElementById('prev');
  const carouselDom = document.querySelector('.carousel');

  if (carouselList && carouselThumbnails && Assets.length > 0) {
    // Populate carousel items
    function populateCarousel() {
      carouselList.innerHTML = '';
      carouselThumbnails.innerHTML = '';
      for (let i = 0; i < Assets.length; i++) {
        // Main carousel item
        const item = document.createElement('div');
        item.className = 'item';
        const img = document.createElement('img');
        img.src = Assets[i];
        item.appendChild(img);
        carouselList.appendChild(item);

        // Thumbnail item
        const thumb = document.createElement('div');
        thumb.className = 'item';
        const thumbImg = document.createElement('img');
        thumbImg.src = Assets[i];
        thumb.appendChild(thumbImg);
        carouselThumbnails.appendChild(thumb);
      }
    }

    populateCarousel();

    let currentIndex = 0;
    let timeAutoNext = 7000;
    let runNextAuto;

    function updateActive() {
      const items = carouselList.querySelectorAll('.item');
      const thumbs = carouselThumbnails.querySelectorAll('.item');
      items.forEach((el, idx) => el.style.display = idx === currentIndex ? 'flex' : 'none');

      // Show only 4 thumbnails: 2 before, current, 1 after
      const thumbCount = 4;
      const half = Math.floor(thumbCount / 2);
      thumbs.forEach((el, idx) => {
        // Calculate if this thumb should be visible
        let show = false;
        let rel = idx - currentIndex;
        if (rel < -Assets.length / 2) rel += Assets.length;
        if (rel > Assets.length / 2) rel -= Assets.length;
        if (Math.abs(rel) <= half) show = true;
        el.style.display = show ? 'block' : 'none';
        el.classList.toggle('active', idx === currentIndex);
        el.onclick = () => {
          currentIndex = idx;
          updateActive();
          resetAuto();
        };
      });
    }

    function showSlider(type) {
      if (type === 'next') {
        currentIndex = (currentIndex + 1) % Assets.length;
      } else {
        currentIndex = (currentIndex - 1 + Assets.length) % Assets.length;
      }
      updateActive();
      resetAuto();
    }

    function resetAuto() {
      clearTimeout(runNextAuto);
      runNextAuto = setTimeout(() => {
        showSlider('next');
      }, timeAutoNext);
    }

    nextDom.onclick = () => showSlider('next');
    prevDom.onclick = () => showSlider('prev');

    updateActive();
    resetAuto();
  }

  // Fetch more images dynamically and add to Assets
  fetch('/Assets/images/list.json')
    .then(res => res.json())
    .then(moreImages => {
      if (Array.isArray(moreImages)) {
        Assets.push(...moreImages);
        // Shuffle again if you want
        for (let i = Assets.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [Assets[i], Assets[j]] = [Assets[j], Assets[i]];
        }
        if (typeof renderCarousel === 'function') renderCarousel();
      }
    })
    .catch(err => {
      console.warn('No extra images loaded:', err);
    });
})();