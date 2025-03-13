const urlParams = new URLSearchParams(window.location.search);
const get_topic = urlParams.get('id');

show_topic();

function show_topic() {
  const show_topic = document.getElementById('topic-section');
  show_topic.innerHTML = `
    <div class="section-title">
        <div class="cover-title">
          <h2>${capitalizeFirstLetter(get_topic)}</h2>
          <div class="cover-left-title"></div>
        </div>
    </div>
    <div class="topic-content" id="topic-content"></div>
    `;
  topic_content();
}

async function topic_content() {
  const response = await fetch(`${databaseUrl}/news/${get_topic}/.json?orderBy="$key"&limitToFirst=9`);
  const news = await response.json();
  const container = document.getElementById('topic-content');
  container.innerHTML = '';

  const newsArray = Object.entries(news || {})
    .map(([id, item]) => ({ id, ...item }))

  let contentHTML = '';
  for (let article of newsArray) {
    titleHTML = article.topic;
    contentHTML += `
      <div class="carousel-item">
           <a href="posts.html?topic=${article.topic}&id=${article.id}" >
            <div class="section-img">
              <img src="${article.summary}" alt="${article.name}" />
              <!-- <h4>${capitalizeFirstLetter(article.topic)}</h4> -->
            </div>
            <div class="section-text">
              <div>
                <h4>${capitalizeFirstLetter(textOutput(article.name))}</h4>
              </div>
              <small>${new Date(article.timestamp).toLocaleDateString()}</small>
            </div>
          </a>
        </div>`;
  }
  container.innerHTML = contentHTML;
  document.getElementById('topic-section').classList.remove('hide')

  let titleElement = document.head.querySelector('title');
  if (!titleElement) {
    titleElement = document.createElement('title');
    document.head.appendChild(titleElement);
  }
  titleElement.textContent = textOutput(titleHTML);

}