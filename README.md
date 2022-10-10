# weread-scraper
Export Weread books to html files

<img src="https://user-images.githubusercontent.com/10386119/186714588-97e1b755-ce62-4f89-a64d-268824f39e9e.png" width=480/>

## Steps

- Add [this userscript](https://greasyfork.org/zh-CN/scripts/450169-weread-scraper) in [Tampermonkey](https://www.tampermonkey.net/)
- Select the book you want to save in Weread, e.g. https://weread.qq.com/web/bookDetail/f6432a905b73c0f64797a8d
- Browse the first page of this book or any other page where you want to start to save, e.g. https://weread.qq.com/web/reader/f6432a905b73c0f64797a8dkc81322c012c81e728d9d180
- Left click Tampermonkey icon and then click the "Start Scraping" button in the popped up menu
- Wait for scraping to complete and an HTML file will be automatically generated and downloaded
- You can cancel an ongoing scraping process by clicking "Cancel Scraping"
- You can stop an ongoing scraping process and save the available scraped contents by clicking "Stop Scraping & Save"
- You can set a next-page-click interval by clicking "Set Click Interval" and input the desired value (in milliseconds) 
- That's it!

## Notes

- Chrome and MS Edge are recommended to run this script
- Firefox is recommended to print the downloaded HTML to PDF
- Many of the books use these fonts, install them to have a better reading experience: [汉仪旗黑 50S](https://www.hanyi.com.cn/productdetail?id=831), [汉仪旗黑 65S](https://www.hanyi.com.cn/productdetail.php?id=834) and [汉仪楷体S](https://www.hanyi.com.cn/productdetail.php?id=814). There might be more fonts  but I didn't check them all. If you know, feel free to create issues. Btw, `PingFang SC` would be a good choice to act as a fallback font
- Scraping books with many many pages can crush your browser, cuz I didn't use any mechanism of streaming, chunking or garbage collection. Further work can be done to fix this

Enjoy and please don't use this script for pirating books and selling them!
