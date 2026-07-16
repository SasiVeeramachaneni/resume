import puppeteer from "puppeteer-core";
const browser = await puppeteer.connect({ browserURL: "http://127.0.0.1:9222", defaultViewport: null });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36");
await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(Navigator.prototype, "webdriver", { get: () => undefined, configurable: true });
  Object.defineProperty(Navigator.prototype, "languages", { get: () => ["en-US","en"], configurable: true });
  Object.defineProperty(Navigator.prototype, "plugins", { get: () => [1,2,3], configurable: true });
  window.chrome = window.chrome || { runtime: {} };
});
await page.goto("https://www.linkedin.com/in/me", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForSelector("main", { timeout: 60000 });
await new Promise(r => setTimeout(r, 2500));
// Scroll main + window progressively to trigger lazy sections
for (let i=0; i<20; i++) {
  await page.evaluate(() => {
    window.scrollBy(0, 900);
    const m = document.querySelector("main");
    if (m) m.scrollIntoView({ behavior: "instant", block: "end" });
    document.querySelectorAll("*").forEach(el => {
      if (el.scrollHeight > el.clientHeight + 50 && getComputedStyle(el).overflowY !== "visible") {
        el.scrollBy(0, 900);
      }
    });
  });
  await new Promise(r => setTimeout(r, 250));
}
await new Promise(r => setTimeout(r, 1500));
const data = await page.evaluate(() => {
  function txt(el){return (el&&el.innerText?el.innerText:"").trim();}
  const sections = Array.from(document.querySelectorAll("section"))
    .map((s)=>({label: txt(s.querySelector("h2,h3,[role=heading]")).slice(0,40), lis: s.querySelectorAll("li").length, cls: (s.className||"").toString().slice(0,30)}));
  const heads = Array.from(document.querySelectorAll('h2,h3,[role="heading"]')).map(h => txt(h).slice(0,40)).filter(Boolean);
  return { url: location.href, h2Count: heads.length, headings: heads, sections: sections.slice(0,40), scrollTop: window.scrollY, docHeight: document.documentElement.scrollHeight };
});
console.log(JSON.stringify(data, null, 2));
await page.close();
browser.disconnect();
