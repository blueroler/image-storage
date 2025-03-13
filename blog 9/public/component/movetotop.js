const getmoveToTop = document.getElementById("moveToTop");
getmoveToTop.innerHTML = `<button id="moveToTopBtn" onclick="moveToTop()"><i class='bx bx-up-arrow-alt'></i></button>`;

const moveToTopBtn = document.getElementById("moveToTopBtn");
window.onscroll = function () {
  if (document.documentElement.scrollTop > 200) {
    moveToTopBtn.classList.add("show");
  } else {
    moveToTopBtn.classList.remove("show");
  }
};

function moveToTop() {
  scrollToTop(800);
}

function scrollToTop(duration) {
  const start = window.scrollY;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeProgress = easeInOutQuad(progress);
    const currentScroll = start * (1 - easeProgress);

    window.scrollTo(0, currentScroll);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  requestAnimationFrame(animateScroll);
}

const style_moveToTopBtn = document.createElement("style");
style_moveToTopBtn.innerHTML = `
  #moveToTopBtn {
    position: fixed;
    bottom: 100px;
    right: 20px;
    opacity: 0;
    visibility: hidden;
    color: white;
    font-size: 20px;
    border: none;
    border-radius: 50%;
    padding: 8px 8px;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 1s, visibility 1s;
    font-size: 16px;
    z-index: 10;
  }

  #moveToTopBtn i {
    font-size: 30px;
  }

  #moveToTopBtn.show {
    opacity: 1;
    visibility: visible;
  }

  #moveToTopBtn:hover {
    background-color: #003366;
  }
`;

document.head.appendChild(style_moveToTopBtn);

