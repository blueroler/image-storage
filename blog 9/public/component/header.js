let header = '';
header = `
    <header>
        <nav>
            <div><a class="icon-nav" href="/admin"><i class='bx bx-user-circle'></i></a></div>
            <div><a class="icon-nav" href="/admin"><i class='bx bx-search'></i></a></div>
            <div><a class="icon-nav" href="/"><i class='bx bx-home'></i></a></div>
            <div><a href="topic.html?id=hots"><i class='bx bx-news'></i></a></div>
            <div class="nav-item"><a href="#topic-section"><i class='bx bx-list-ul'></i></a>
                <div class="dropdown" id="dropdown"></div>
            </div>
        </nav>
    </header>
    `;

document.getElementById('header').innerHTML = header;

load_topic();

async function load_topic() {
    const response = await fetch(`${databaseUrl}/public_data/news.json?shallow=true`);
    const news = await response.json();

    let putArray = Object.keys(news).sort().filter(key => key !== 'hots');
    load_dropdown(putArray);
}

function load_dropdown(putArray) {
    const drop = document.getElementById('dropdown');
    drop.innerHTML = '';
    for (let topic of putArray) {
        drop.innerHTML += `<a href="topic.html?id=${topic}">${capitalizeFirstLetter(topic)}</a>`;
    }
}

////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                smoothScroll(targetElement);
            }
        });
    });
});

const OFFSET = 50;

function smoothScroll(targetElement) {
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - OFFSET;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let startTime = null;

    function animationScroll(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);

        window.scrollTo(0, run);

        if (timeElapsed < duration) requestAnimationFrame(animationScroll);
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animationScroll);
}

const style_header = document.createElement("style");
style_header.innerHTML = `
@import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

#header {
    height: 50px;
    width: 100%;
    top: 0;
    background-color: #003366;
    color: #fff;
    text-align: center;
    position: fixed;
    z-index: 1000;
    display: flex;
    justify-content: center;
}

header nav {
    width: 100%;
    height: 50px;
    padding: 0 10px;
    display: flex;
    overflow: hidden;
    gap: 30px;
    justify-content: center;
    align-items: center;
}

header a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 50px;
    color: #fff;
    flex: 1;
    font-size: 18px;
    padding: 0;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    transition: 0.1s;
}

header a:hover,
    header button:hover {
    background-color: #fff;
    color: #003366;
}

header .icon-nav {
    font-size: 20px;
}

.dropdown {
    padding: 10px;
    position: absolute;
    background: #fff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.dropdown a {
    height: 40px;
    width: fit-content;
    color: #003366;
    padding: 10px;
    transition: 0.2s;
    border-radius: 4px;
}

.dropdown a:hover {
    background: #ddd;
}

.nav-item:hover .dropdown {
    opacity: 1;
    visibility: visible;
}

@media (max-width: 620px) {
    header nav {
        gap: 20px;
    }
}
`;

document.head.appendChild(style_header);