const validHash = ["gallery", "story"];

const profileContainer = document.getElementById("profile-container");
const galleryContainer = document.getElementById("gallery-container");
const storyContainer = document.getElementById("story-container");

const profileButton = document.getElementById("profile-nav-button");
const galleryButton = document.getElementById("gallery-nav-button");
const storyButton = document.getElementById("story-nav-button");

function handleHashChange() {
  const currentHash = window.location.hash.slice(1);
  if (isValidHash(currentHash)) {
    jumpToSection(currentHash);
  } else {
    showDefaultProfile();
  }
}

function jumpToSection(currentHash) {
  hideAllSections();
  const selectedSectionId = currentHash + "-container";
  const selectedSection = document.getElementById(selectedSectionId);
  selectedSection.style.display = "block";

  const selectedButtonId = currentHash + "-nav-button";
  const selectedButton = document.getElementById(selectedButtonId);
  selectedButton.classList.add("active");
}

function showDefaultProfile() {
  hideAllSections();
  profileContainer.style.display = "block";
  profileButton.classList.add("active");
  history.replaceState(
    null,
    document.title,
    window.location.pathname + window.location.search,
  );
}

function hideAllSections() {
  document.querySelectorAll(".section-container").forEach((section) => {
    section.style.display = "none";
  });
  document.querySelectorAll(".nav-info-buttons a").forEach((button) => {
    button.classList.remove("active");
  });
}

function isValidHash(currentHash) {
  if (!currentHash || currentHash.trim() === "") {
    return false;
  }
  if (currentHash === "story" && !storyContainer) {
    return false;
  }
  if (currentHash === "gallery" && !galleryContainer) {
    return false;
  }
  const isValidHash = validHash.includes(currentHash);
  return isValidHash;
}

window.addEventListener("DOMContentLoaded", () => {
  handleHashChange();
});

window.addEventListener("hashchange", () => {
  handleHashChange();
});

/*--------------Modal---------------------*/

const modalImg = document.getElementById("modal-image");
function showImage(image) {
  modalImg.style.display = "none";
  modalImg.src = image.src;

  modalImg.onload = function () {
    modalImg.style.display = "block";
  };
}

function showNextOrPrevImg(direction) {
  const visibleImages = Array.from(
    document.querySelectorAll(
      ".chara-gallery-img-thumbnail img:not(#modal-image)",
    ),
  ).filter((img) => img.checkVisibility());
  const currentSrc = modalImg.src;
  let currentIndex = visibleImages.findIndex((img) => img.src === currentSrc);
  let nextIndex = currentIndex + direction;
  if (direction === 1 && nextIndex >= visibleImages.length) {
    nextIndex = 0;
  } else if (direction === -1 && nextIndex === -1) {
    nextIndex = visibleImages.length - 1;
  }
  showImage(visibleImages[nextIndex]);
}
