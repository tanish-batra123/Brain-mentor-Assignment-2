import News from "../models/newsModals.js";
import { generateSummary } from "../utils/gemini.js";

const API_KEY = "";

export const newsStore = {
   general:[],
  business: [],
  sports: [],
  technology: [],
  health: [],
  science: [],
  entertainment: [],
  politics: [],
};

export async function getNews(category) {
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.articles;
  } catch (error) {
    console.log(error);
  }
}

export async function preLoadNews() {
    const categories = [
        "general",
        "business",
        "sports",
        "technology",
        "health",
        "science",
        "entertainment",
        "politics"
    ];

    for (const category of categories) {
        const articles = await getNews(category);
      
        newsStore[category] = articles.map((article, index) =>
            new News(
                article.title,
                article.author,
                article.content,
                article.description,
                article.source.name,
                article.urlToImage,
                article.url,
                article.publishedAt,
                category,
                article.aiSummary
            )
        );
    }
}

export function getNewsFromStore(category){
 return newsStore[category];
}

export async function getAiSummary(newsArr){
  const data=await generateSummary(newsArr)
return data;
  
}
