const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');
const postId = urlParams.get('id');
let Lists_Height = 5;

show_posts();

////////////////////////////////////////////////////////////

const observer = new ResizeObserver(updateBox2Height);
observer.observe(document.querySelector('.post-body'));

function updateBox2Height() {
  const box1 = document.querySelector('.post-body');
  const box2 = document.querySelector('.topic-container');
  const windowWidth = window.innerWidth;

  if (box1 && box2) {
    if (windowWidth > 620) {
      const List_Height = 30 + box1.offsetHeight;
      box2.style.height = `${List_Height}px`;
    } else { }
  }
}

//////////////////////////////////////////////////////////////

function shows_error() {
  document.querySelector('.main-content').innerHTML = '';
  document.querySelector('.main-content').innerHTML = `
  <div class="error">
    <div class="error-noti">
      <h1>Có gì đó không ổn rồi…</h1>
    </div>
    <div class="error-task">
      <h4>Tại sao bạn thấy trang này?</h4>
      <ol>
        <li>Có thể bài viết đã bị xóa hoặc đã bị ẩn đi.</li>
        <li>Có thể bạn đang cố truy cập URL không chính xác!</li>
      </ol>
      <h4>Bạn nên làm gì khi gặp trang này?</h4>
      <ol>
        <li>Nhấp vào nút <button onclick="window.history.back();"><i class='bx bx-left-arrow-alt'></i></button> trên trình duyệt của bạn.</li>
        <li>Hoặc đến trang chủ của chúng tôi <button onclick='window.location.href = "/";'>Return 🏠</button></li>
      </ol>
    </div>
  </div>
  `;
}

//////////////////////////////////////////////////////////////////

function show_posts() {
  document.getElementById('post-section').innerHTML = `
    <div id="posts-title"></div>
    <div class="post-body" id="post-body"></div>`;
  posts_name()
}

async function posts_name() {
  try {
    const response = await fetch(`${databaseUrl}/public_data/news/${topic}/${postId}.json`);
    const post = await response.json();

    if (!post) {
      shows_error();
      return;
    }

    let titleElement = document.head.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      document.head.appendChild(titleElement);
    }
    titleElement.textContent = textOutput(post.name);

    const htmlContent = `
      <div class="posts-title">
        <p>${capitalizeFirstLetter(post.topic)}</p>
        <small>Ngày đăng: ${new Date(post.timestamp).toLocaleString()}</small>
      </div>
      <h2>${textOutput(post.name)}</h2>
    `;
    document.getElementById('posts-title').innerHTML = htmlContent;
    posts_body_content();
  } catch (error) {
    shows_error();
  }
}

async function posts_body_content() {
  const fetchUrl = `${databaseUrl_post}/${postId}.json`;
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      return;
    }

    const data = await response.json();
    let htmlContent = '';

    const content = data === null ? '' : data;

    htmlContent += `<div>${content}</div>`;

    document.getElementById('post-body').innerHTML = htmlContent;
  } catch (error) {
    shows_error();
  }
  load_more();
  show_list();
}

//////////////////////////////////////////////////////////////////////////////

async function load_more() {
  const response = await fetch(`${databaseUrl}/public_data/news.json?shallow=true`);
  const news = await response.json();

  let putArray = Object.keys(news).sort().filter(key => key !== topic);
  put_topic(putArray);
}

function put_topic(putArray) {
  const show = document.getElementById('list-section');
  show.innerHTML = `
        <div class="cover-title">
          <h2>More topic</h2>
          <div class="cover-left-title"></div>
        </div>
        <div class="topic-container" id="topic-container"></div>
        `;

  for (let post of putArray) {
    const topic_container = document.getElementById('topic-container');
    topic_container.innerHTML += `<div class="topic-item" id="${post}-section"></div>`;
  }
  initializeSections(putArray);
}

function initializeSections(putArray) {
  putArray.forEach((section) => {
    const sectionElement = document.getElementById(`${section}-section`);
    sectionElement.innerHTML = `
      <h3><a href="topic.html?id=${section}">${capitalizeFirstLetter(section)}</a></h3>
      <div>
        <div id="${section}-carousel"></div>
      </div>`;
    loadData(section);
  });
}

async function loadData(section) {
  const carousel = document.getElementById(`${section}-carousel`);
  const response = await fetch(`${databaseUrl}/public_data/news/${section}.json?orderBy="$key"&limitToFirst=2`);
  const news = await response.json();
  const newsArray = Object.entries(news || {}).map(([id, item]) => ({
    id,
    ...item,
  }));

  let contentHTML = '';
  for (let article of newsArray) {
    contentHTML += `
          <a href="posts.html?topic=${article.topic}&id=${article.id}" class="news-item">
            <div class="list-news-img">
              <img src="${article.summary}" alt="${article.name}" />
            </div>
            <div class="list-news-text">
              <div>
                <small>${new Date(article.timestamp).toLocaleDateString()}</small>
                <h4>${textOutput(article.name)}</h4>
              </div>
            </div>
        </a>
        `;
  }
  carousel.innerHTML = contentHTML;
  updateBox2Height();
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function show_list() {
  const show_list = document.getElementById('topic-section');
  show_list.innerHTML = '';
  show_list.innerHTML = `
      <div class="cover-title">
        <h2>Tiếp theo</h2>
        <div class="cover-left-title"></div>
      </div>
    <div class="posts-list" id="posts-list"></div>`;
  list();
}

async function list() {
  const response = await fetch(`${databaseUrl}/public_data/news/${topic}.json?orderBy="$key"&limitToFirst=4`);
  const news = await response.json();
  const newsArray = Object.entries(news || {}).map(([id, item]) => ({
    id,
    ...item,
  }));

  const container = document.getElementById('posts-list');
  container.innerHTML = '';

  let contentHTML = '';
  let count = 0;
  for (let article of newsArray) {
    if (count >= 3) {
      break;
    }
    if (article.id !== postId) {
      contentHTML += `
        <a href="posts.html?topic=${article.topic}&id=${article.id}" >
            <div class="section-img">
              <img src="${article.summary}" alt="${article.name}" />
            </div>
            <div class="section-text">
              <div>
                <h4>${capitalizeFirstLetter(textOutput(article.name))}</h4>
              </div>
              <small>${new Date(article.timestamp).toLocaleDateString()}</small>
            </div>
          </a>`;
      count++;
    }
  }
  container.innerHTML = contentHTML;
}
