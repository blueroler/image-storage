const show_ads = document.getElementById('ads-section');
show_ads.innerHTML = `<div class="ads-banner" id="ads-banner"></div>`;

const banner = document.getElementById('ads-banner');
banner.style.display = 'none';
let items = [];
let currentIndex = 0;

ads_to_head();
check_ads_status();

async function check_ads_status() {
    const response = await fetch(`${databaseUrl}/public_data/ads.json`);
    const post = await response.json();

    if (post.ads_status == 0) {

    } else {
        document.querySelector('#ads-section').style.display = 'block';
        fetchAds();
    }
}

async function fetchAds() {
    try {
        const response = await fetch(`${databaseUrl}/public_data/ads/ads_banner.json`);
        const data = await response.json();

        if (data) {
            const newsArray = Object.entries(data).map(([id, item]) => ({ id, ...item }));
            newsArray.sort((a, b) => b.timestamp - a.timestamp);

            const items = newsArray.map(item => ({
                img: item.img,
                url: item.ads
            }));

            renderBanner(items);
        } else {
            banner.style.display = 'none';
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ Firebase:", error);
    }
}


function renderBanner(items) {
    banner.style.display = 'block';
    banner.innerHTML = '';

    items.forEach((item, index) => {
        const anchor = document.createElement('a');
        anchor.className = 'banner-item';
        anchor.href = item.url;
        anchor.style.backgroundImage = `url('${item.img}')`;

        if (index === 0) {
            anchor.classList.add('active');
            anchor.style.zIndex = 2;
        } else {
            anchor.style.zIndex = 1;
        }

        banner.appendChild(anchor);
    });

    if (items.length > 1) {
        initializeBanner();
    }
}

function showNextItem() {
    const allItems = document.querySelectorAll('.banner-item');
    const currentItem = allItems[currentIndex];
    const nextIndex = (currentIndex + 1) % allItems.length;
    const nextItem = allItems[nextIndex];

    currentItem.classList.remove('active');
    currentItem.classList.add('exiting');
    currentItem.style.zIndex = 1;

    nextItem.style.left = '100%';
    nextItem.style.zIndex = 2;

    setTimeout(() => {
        nextItem.classList.add('active');
        nextItem.style.left = '0';
    }, 10);

    setTimeout(() => {
        currentItem.classList.remove('exiting');
        currentItem.style.left = '100%';
        currentItem.style.zIndex = '';
        currentIndex = nextIndex;
    }, 1000);
}

function initializeBanner() {
    const allItems = document.querySelectorAll('.banner-item');
    if (allItems.length === 0) return;

    currentIndex = 0;
    allItems.forEach(item => {
        item.classList.remove('active', 'exiting');
        item.style.left = '100%';
        item.style.zIndex = 1;
    });

    allItems[currentIndex].classList.add('active');
    allItems[currentIndex].style.left = '0';
    allItems[currentIndex].style.zIndex = 2;

    setInterval(showNextItem, 5000);
}

async function ads_to_head() {
    try {
        const response = await fetch(`${databaseUrl}/public_data/ads/ads_script/customer.json`);
        if (!response.ok) {
            return;
        }
        const customer = await response.json();
        if (!customer.script) {
            return;
        }
        const ads_script = customer.script;
        const container = document.createElement('div');
        container.innerHTML = ads_script;
        document.head.appendChild(container.firstChild);
    } catch (error) {
        return;
    }
}

const style_ads = document.createElement("style");
style_ads.innerHTML = `
    #ads-section {
    display: none;
    width: 100%;
    aspect-ratio: 4 / 1;
    margin: 10px auto;
    padding-bottom: 10px;
    border-bottom: 2px solid #ddd;
    }

    .ads-banner {
    text-align: center;
    max-width: 1020px;
    aspect-ratio: 4 / 1;
    position: relative;
    overflow: hidden;
    }

    .banner-item {
    position: absolute;
    top: 0;
    left: 100%;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transform: scale(1);
    transition: opacity 1s, transform 1s, left 1s;
    }

    .banner-item.active {
    left: 0;
    opacity: 1;
    transform: scale(1);
    }

    .banner-item.exiting {
    opacity: 0;
    transform: scale(0.5);
    }
`;

document.head.appendChild(style_ads);