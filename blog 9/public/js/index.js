const lazy_load = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'IMG') {
          node.setAttribute('loading', 'lazy');
        } else if (node.querySelectorAll) {
          node.querySelectorAll('img').forEach((img) => {
            img.setAttribute('loading', 'lazy');
          });
        }
      });
    }
  });
});

lazy_load.observe(document.body, {
  childList: true,
  subtree: true
});

///////////////////////////////////////////////////////////////////////////////////

show_hots();

function show_hots() {
  document.getElementById('hots-section').innerHTML =
    `<div class="section-title">
      <div class="cover-title">
        <a href="topic.html?id=hots"><h2>Breaking News</h2></a>
        <a href="topic.html?id=hots" class="cover-left-title"></a>
      </div>
    </div>
    <div class="hots-body">
      <div class="pin-content" id="pin-content"></div>
      <div class="hots-content" id="hots-content"></div>
      <div class="list-content" id="list-content"></div>
    </div> `;

  hots();
  pin_content();
}

function pin_content() {
  const container = document.getElementById('pin-content');
  container.innerHTML = '';
  container.innerHTML = `
  <div>
    <h4>Bài viết đã Ghim</h4>
    <div id="pin-post" class="pin-post"></div>
  </div>
  <div>
    <div><h4>ADS Auto Script</h4></div>
  </div>
  `;
  pin_post()
}

async function pin_post() {
  const container = document.getElementById('pin-post');
  container.innerHTML = '';
  let contentHTML = '';

  const data_pin = await fetch(`${databaseUrl}/public_data/pins.json`);
  const data_get = await data_pin.json();
  const get_topic = data_get.topic;
  const get_ID = data_get.Id;

  const response = await fetch(`${databaseUrl}/public_data/news/${get_topic}/${get_ID}.json`);
  const news = await response.json();

  if (!news) {
    contentHTML += `
      <div><p style="text-align: center; margin: 10px 0;">Không có</p></div>
    `;
  } else {
    contentHTML += `
          <a href="posts.html?topic=${get_topic}&id=${get_ID}" >
            <div class="section-img">
              <img src="${news.summary}" alt="${news.name}" />
              <h5>${capitalizeFirstLetter(news.topic)}</h5>
            </div>
            <div class="section-text">
              <h4>${capitalizeFirstLetter(textOutput(news.name))}</h4>
            </div>
          </a>`;
  }
  container.innerHTML = contentHTML;
}

async function hots() {
  const response = await fetch(`${databaseUrl}/public_data/news/hots.json?orderBy="$key"&limitToFirst=5`);
  const news = await response.json();
  const first_container = document.getElementById('hots-content');
  first_container.innerHTML = '';

  const newsArray = Object.entries(news || {})
    .map(([id, item]) => ({ id, ...item }))

  newsArray.sort((a, b) => b.timestamp - a.timestamp);

  const firstArray = newsArray.slice(0, 1);
  let first_contentHTML = '';
  for (let article of firstArray) {
    first_contentHTML += `
      <div class="first-news-item">
        <a href="posts.html?topic=${article.topic}&id=${article.id}" >
          <div class="first-section-img">
            <img src="${article.summary}" />
          </div>
          <div class="first-section-text">
            <h4>${capitalizeFirstLetter(textOutput(article.name))}</h4>
          </div>
        </a>
      </div>
    `;
  }
  first_container.innerHTML = first_contentHTML;

  const second_container = document.getElementById('list-content');
  second_container.innerHTML = '';

  const secondArray = newsArray.slice(1, 5);
  let second_contentHTML = '';
  for (let article of secondArray) {
    second_contentHTML += `
        <a href="posts.html?topic=${article.topic}&id=${article.id}" class="news-item">
            <div class="list-news-img">
              <img src="${article.summary}" alt="${article.name}" />
            </div>
            <div class="list-news-text">
              <div>
                <small>${new Date(article.timestamp).toLocaleDateString()}</small>
                <h4>${capitalizeFirstLetter(textOutput(article.name))}</h4>
              </div>
            </div>
        </a>
      `;
  }
  second_container.innerHTML = second_contentHTML;
  document.getElementById('hots-section').classList.remove('hide')
  load_topic();
}

/////////////////////////////////////////////////////////////////////////////////

async function load_topic() {
  const response = await fetch(`${databaseUrl}/public_data/news.json?shallow=true`);
  const news = await response.json();

  let putArray = Object.keys(news).sort().filter(key => key !== 'hots');
  put_topic(putArray);
}


function put_topic(putArray) {
  const show = document.getElementById('topic-section');
  show.innerHTML = `
      <div class="section-title">
        <div class="cover-title">
          <h2>More topic</h2>
          <div class="cover-left-title"></div>
        </div>
      </div>
        `;
  for (let post of putArray) {
    show.innerHTML += `<div class="topic-item" id="${post}-section"></div>`;
  }
  initializeSections(putArray);
}

///////////////////////////////////////////////////////////////////////////////

function initializeSections(putArray) {
  putArray.forEach((section) => {
    const sectionElement = document.getElementById(`${section}-section`);
    sectionElement.innerHTML = `
      <h2><a href="topic.html?id=${section}">${capitalizeFirstLetter(section)}</a></h2>
      <div class="carousel hide" id="${section}-carousel"></div>`;
    loadData(section);
  });
}

async function loadData(section) {
  const carousel = document.getElementById(`${section}-carousel`);
  const response = await fetch(`${databaseUrl}/public_data/news/${section}.json?orderBy="$key"&limitToFirst=3`);
  const news = await response.json();
  const newsArray = Object.entries(news || {}).map(([id, item]) => ({
    id,
    ...item,
  }));

  let contentHTML = '';
  for (let article of newsArray) {
    contentHTML += `
           <a href="posts.html?topic=${article.topic}&id=${article.id}" >
            <div class="section-img">
              <img src="${article.summary}" alt="${article.name}" />
              <!-- <h5>${capitalizeFirstLetter(article.topic)}</h5> -->
            </div>
            <div class="section-text">
              <div>
                <h4>${capitalizeFirstLetter(textOutput(article.name))}</h4>
              </div>
              <small>${new Date(article.timestamp).toLocaleDateString()}</small>
            </div>
          </a>`;
  }
  carousel.innerHTML = contentHTML;
  document.getElementById(section + '-carousel').classList.remove('hide')
}