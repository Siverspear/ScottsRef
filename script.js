const apiKey = "HE9Rauw3o4Wv4XKRomcSfBhcgqAWLwCAuKj7fgU023nSytb9SkeimzMk"; // Replace with your Pexels API key
const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".lightbox .close");
const backTop = document.getElementById("backTop");

const quickCategoriesDiv = document.getElementById("quickCategories");

let currentPage = 1;
let currentQuery = "art";
let loadingImages = false;

// 200+ artist categories (grouped for clarity)
const artistCategories = [
  // Body parts
  "head","face","eyes","nose","mouth","ears","hair","neck","shoulders","arms","hands","fingers","torso","legs","feet","toes","muscles",
  // Poses
  "standing","sitting","lying","running","jumping","dancing","fighting","relaxing","arms up","arms down","crossed legs","leaning",
  // Expression
  "happy","sad","angry","fear","surprise","neutral","laughing","crying",
  // Lighting
  "golden hour","night","studio light","low light","backlight","silhouette","dramatic shadows",
  // Clothing / Costume
  "casual","formal","armor","robes","dresses","suits","hats","shoes","accessories",
  // Environment / Scene
  "interiors","buildings","streets","forest","mountains","beach","city","rural","vehicles","furniture",
  // Subjects / Themes
  "humans","animals","food","nature","objects","weapons","props","instruments","technology",
  // Art style / Color
  "black and white","monochrome","colorful","pastel","dark","vibrant",
  // More detailed
  "hands gestures","facial angles","full body front","full body back","profile view","overhead view","sitting pose","crouching","kneeling","running pose",
  "action pose","relaxed pose","draped clothing","armor details","historical clothing","modern clothing","fantasy clothing",
  "interior decor","urban streets","architecture","skyline","mountain landscape","forest landscape","beach scene","night scene","sunset","sunrise",
  "portrait","headshot","figure study","muscle study","gesture drawing","dynamic pose","still life","props arrangement","food still life",
  "animal study","bird","dog","cat","horse","insect","vehicle study","instrument study","weapon study","character design","costume design",
  "dramatic lighting","soft lighting","shadow study","high contrast","low contrast","vibrant colors","muted colors","warm colors","cool colors","pastel palette",
  "monochrome palette","concept art","illustration","digital art reference","photorealistic","cartoon style","anime style","comic style","surreal","fantasy"
];

// Render quick category buttons
artistCategories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
        currentQuery = cat;
        currentPage = 1;
        gallery.innerHTML = "";
        loadImages();
    });
    quickCategoriesDiv.appendChild(btn);
});

// Search button click
searchBtn.addEventListener("click", () => {
    currentQuery = searchInput.value.trim() || "art";
    currentPage = 1;
    gallery.innerHTML = "";
    loadImages();
});

// Enter key on search input triggers search
searchInput.addEventListener("keyup", (e) => {
    if(e.key === "Enter"){
        searchBtn.click();
    }
});

// Infinite scroll + back to top button toggle
window.addEventListener("scroll", () => {
    backTop.style.display = window.scrollY > 400 ? "block" : "none";

    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 150 && !loadingImages){
        currentPage++;
        loadImages();
    }
});

// Back to top button click
backTop.addEventListener("click", () => {
    window.scrollTo({top: 0, behavior: "smooth"});
});

// Lightbox open
gallery.addEventListener("click", e => {
    if(e.target.tagName === "IMG"){
        lightboxImg.src = e.target.dataset.large || e.target.src;
        lightbox.style.display = "flex";
    }
});

// Lightbox close
closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
});

// Close lightbox if clicking outside image
lightbox.addEventListener("click", e => {
    if(e.target === lightbox){
        lightbox.style.display = "none";
    }
});

// Load images function
async function loadImages(){
    loadingImages = true;
    loading.style.display = "block";

    const perPage = 15;
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(currentQuery)}&per_page=${perPage}&page=${currentPage}`;

    try {
        const res = await fetch(url, {
            headers: { Authorization: apiKey }
        });
        if(!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        if(data.photos.length === 0 && currentPage === 1){
            gallery.innerHTML = `<p style="color:#777; text-align:center;">No results found for "<strong>${currentQuery}</strong>". Try another search or category.</p>`;
        } else {
            displayImages(data.photos);
        }
    } catch (err) {
        console.error("Error fetching images:", err);
        if(currentPage === 1) {
            gallery.innerHTML = `<p style="color:#f44336; text-align:center;">Failed to load images. Please try again later.</p>`;
        }
    }

    loading.style.display = "none";
    loadingImages = false;
}

// Display images in gallery
function displayImages(photos){
    photos.forEach(photo => {
        const card = document.createElement("div");
        card.className = "image-card";

        // Use medium size for thumbnails, large for lightbox
        card.innerHTML = `<img src="${photo.src.medium}" alt="${photo.alt || currentQuery}" data-large="${photo.src.large}" loading="lazy">`;

        gallery.appendChild(card);
    });
}

// Initial load
loadImages();