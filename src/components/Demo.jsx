import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";

import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getSummary({
      articleUrl: article.url,
    });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };

      setArticle(newArticle);

      if (!isArticleSaved(article)) {
        const updatedAllArticles = [newArticle, ...allArticles];
        setAllArticles(updatedAllArticles);
        localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
      } else {
        moveArticleToFront(article);
      }
    }
  };

  const isArticleSaved = (article) => {
    const savedArticles = localStorage.getItem("articles");

    if (savedArticles) {
      const articlesArray = JSON.parse(savedArticles);

      return articlesArray.some(
        (savedArticle) => savedArticle.url === article.url
      );
    }

    return false;
  };

  const moveArticleToFront = (article) => {
    const savedArticles = localStorage.getItem("articles");

    const articlesArray = JSON.parse(savedArticles);

    const articleIndex = articlesArray.findIndex(
      (savedArticle) => savedArticle.url === article.url
    );

    const [foundArticle] = articlesArray.splice(articleIndex, 1);

    articlesArray.unshift(foundArticle);

    localStorage.setItem("articles", JSON.stringify(articlesArray));
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="mt-16 w-full max-w-xl mb-10 ">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          <input
            type="url"
            placeholder="Enter Article URL"
            value={article.url}
            required
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn
            peer-focus:text-gray-700"
          >
            ↵ Enter
          </button>
        </form>

        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card hover:bg-gray-100"
            >
              <div
                className="copy_btn"
                onClick={(event) => {
                  event.stopPropagation();
                  handleCopy(item.url);
                }}
              >
                <img
                  src={copied === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[50%] h-[50%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi blue_gradient font-medium text-sm truncate peer-hover:text-red-400">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-center text-red-500">
            Well, that wasn't supposed to happen... <br /> &lt;Probably ran out
            of API calls&gt;
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-white text-xl">
                Article <span className="orange_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-white">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
