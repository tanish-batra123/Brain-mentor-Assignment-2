import {
  getAiSummary,
  getNews,
  getNewsFromStore,
  newsStore,
  preLoadNews,
} from "../service/newsService.js";

window.addEventListener("DOMContentLoaded", init);

async function init() {
  bindEvents();
  clickByCategory();
  await initializeNews();

  const GeneralNews = getCategorieNews("general");
  const summary = await getAiSummary(GeneralNews);

  GeneralNews.forEach((news, idx) => {
    news.aiSummary = summary?.[idx]?.summary;
  });

  renderNews.setNews(GeneralNews);
}

function bindEvents(category) {
  document.querySelector(".hamburger-icon").addEventListener("click", handleMenuBar);
}

function handleMenuBar() {
  const sidebar = document.querySelector(".sidebar");
  document.querySelector(".sidebar").classList.toggle("Toggel");
  document.querySelector(".open-close").classList.toggle("shift");
  const icon = document.querySelector(".hamburger-icon");
  const menu = document.querySelector(".menu");

  if (sidebar.classList.contains("Toggel")) {
    icon.innerText = "x";
    menu.innerText = "close";
  } else {
    icon.innerText = "☰";
    menu.innerText = "menu";
  }
}

async function initializeNews() {
  await preLoadNews();

  
  const btn=document.createElement("button")
   btn.id = "loadMore";
  btn.innerText = "Load More";
   btn.addEventListener("click", () => {
    renderNews.loadMore();
  });
  document.querySelector(".btn-div").appendChild(btn)
}

function getCategorieNews(category) {
  console.log(getNewsFromStore(category));

  return getNewsFromStore(category);
}

function createRenderer() {
  let count = 5;
  let currentNews = [];

  return {
    setNews(newsArr) {
      currentNews = newsArr;
      count = 5;
      this.render();
    },

    render() {
      const container = document.querySelector(".news-list");
      container.innerHTML = "";

      for (let i = 0; i < count && i < currentNews.length; i++) {
        const news = currentNews[i];

        const card = document.createElement("div");
        card.className = "news-card";

        card.innerHTML = `
             <img  src="${news.imgUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOnNEiQsnaitsfR453FZAGcsUfIBQX-qMb4DwDdQy-IA&s=10"}" 
                 alt="${news.title}"
                  onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOnNEiQsnaitsfR453FZAGcsUfIBQX-qMb4DwDdQy-IA&s=10'">

            <div class="content">

                <h2>${news.title}</h2>

                <p class="meta">
                    <strong>short</strong> by ${news.author || "Unknown"} |
                    ${new Date(news.publishAt).toLocaleString()}
                </p>

                 <p>
                    ${news.aiSummary || news.description}
                </p>

               <a href="${news.articleUrl}" target="_blank">
                Read More
                </a>

            </div>
        `;

        container.appendChild(card);
      }
    },

    loadMore() {
      count += 5;
      this.render();
    },
  };
}

const renderNews = createRenderer();

// document.querySelector("#loadMore").addEventListener("click", () => {
//   renderNews.loadMore();
// });

function clickByCategory() {
  const categoryList = document.querySelector(".category-list");

  categoryList.addEventListener("click", async (e) => {
    if (e.target.tagName === "LI") {
      const selectedCategory = e.target.innerText.toLowerCase();

      const newsarr = getCategorieNews(selectedCategory);

      if (newsarr.length > 0 && !newsarr[0].aiSummary) {
        const summaries = await getAiSummary(newsarr);

        console.log(summaries);
        newsarr.forEach((news, idx) => {
          news.aiSummary = summaries?.[idx]?.summary;
        });
      }

      renderNews.setNews(newsarr);
    }
  });
}
