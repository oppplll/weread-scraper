// ==UserScript==
// @name         Weread Scraper
// @namespace    https://github.com/Sec-ant/weread-scraper
// @version      0.4
// @description  Export Weread books to html file
// @author       Secant
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// ==/UserScript==

(async function () {
  "use strict";
  // interactive
  GM_registerMenuCommand("Start Scraping", startScraping);
  GM_registerMenuCommand("Cancel Scraping", cancelScraping);
  GM_registerMenuCommand("Stop Scraping & Save", stopScrapingAndSave);
  GM_registerMenuCommand("Set Click Interval", setClickInterval);

  // construct html root
  const rootElement = document.createElement("html");
  const styleElement = document.createElement("style");
  const bodyElement = document.createElement("body");
  rootElement.append(styleElement);
  rootElement.append(bodyElement);

  // initialize flags
  const scrapeFlag = JSON.parse(
    sessionStorage.getItem("scrapeFlag") || "false"
  );
  let contentFound = false;
  let timeoutIsSet = false;
  let abortTimeout = false;

  // define observer handlers
  const contentObserver = new MutationObserver(async (_, observer) => {
    const content = document.querySelector(".preRenderContainer:not([style])");
    if (!contentFound && content) {
      // define styles
      if (styleElement.childNodes.length === 0) {
        const contentStyle = content.querySelector("style");
        if (contentStyle?.childNodes.length) {
          styleElement.innerHTML = contentStyle.innerHTML
            .replaceAll(".readerChapterContent", ".preRenderContent")
            .replaceAll(/汉仪旗黑(?=\d)/g, "汉仪旗黑 ")
            .replaceAll(/汉仪楷体(?!S)/g, "汉仪楷体S");
          styleElement.append(
            ".preRenderContent { page-break-after: always; }"
          );
        }
      }
      // append contents
      const contentDiv = content.querySelector("#preRenderContent");
      if (contentDiv) {
        contentDiv.removeAttribute("id");
        contentDiv
          .querySelectorAll("img")
          .forEach(
            (img) => (img.src = img.getAttribute("data-src") || img.src)
          );
        bodyElement.append(contentDiv.cloneNode(true));
        contentFound = true;
      }
    }

    // turn to next page
    const nextPage = document.querySelector(".readerFooter_button");
    if (contentFound && nextPage && !timeoutIsSet) {
      contentFound = false;
      timeoutIsSet = true;
      // sleep for {click interval} ms
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, getClickInterval());
      });
      timeoutIsSet = false;
      if (abortTimeout) {
        abortTimeout = false;
      } else {
        nextPage.dispatchEvent(
          new MouseEvent("click", {
            clientX: 1,
            clientY: 1,
          })
        );
      }
    }

    // complete
    const ending = document.querySelector(".readerFooter_ending");
    if (ending) {
      stopScrapingAndSave();
    }
  });

  // start observation
  if (scrapeFlag) {
    contentObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // get click interval helper function
  function getClickInterval() {
    return GM_getValue("clickInterval", 0);
  }

  // menu functions
  function stopScrapingAndSave() {
    sessionStorage.setItem("scrapeFlag", "false");
    contentObserver.disconnect();
    const docBlob = new Blob([rootElement.outerHTML], {
      type: "text/html;charset=utf-8;",
    });
    const dummyLink = document.createElement("a");
    dummyLink.href = URL.createObjectURL(docBlob);
    const bookTitle = document
      .querySelector(".readerCatalog_bookInfo_title_txt")
      .textContent.trim();
    dummyLink.download = `${bookTitle}.html`;
    document.body.appendChild(dummyLink);
    dummyLink.click();
    document.body.removeChild(dummyLink);
    URL.revokeObjectURL(dummyLink.href);
    styleElement.innerHTML = "";
    bodyElement.innerHTML = "";
    contentFound = false;
    timeoutIsSet = false;
    abortTimeout = true;
  }

  function startScraping() {
    sessionStorage.setItem("scrapeFlag", "true");
    window.location.reload();
  }

  function cancelScraping() {
    sessionStorage.setItem("scrapeFlag", "false");
    window.location.reload();
  }

  function setClickInterval() {
    const prevClickInterval = getClickInterval();
    let newClickInterval;
    try {
      newClickInterval = parseFloat(
        window.prompt("Click interval (ms):", prevClickInterval)
      );
      if (!Number.isFinite(newClickInterval) || newClickInterval < 0) {
        throw undefined;
      }
    } catch (e) {
      newClickInterval = prevClickInterval;
    }
    GM_setValue("clickInterval", newClickInterval);
  }
})();
