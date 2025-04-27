import "dotenv/config";
import { createClient } from "redis";
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { promises as fs } from "fs";
import path from "path";

puppeteer.use(StealthPlugin());

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Connect to Redis
(async () => {
  await redisClient.connect();
})();

const randomDelay = (min: number, max: number): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// User agent pool for rotation
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0',
];

const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];

// Country code mapping
const countryCodes: { [key: string]: string } = {
  afghanistan: 'af',
  albania: 'al',
  algeria: 'dz',
  andorra: 'ad',
  angola: 'ao',
  antigua: 'ag',
  argentina: 'ar',
  armenia: 'am',
  australia: 'au',
  austria: 'at',
  azerbaijan: 'az',
  bahamas: 'bs',
  bahrain: 'bh',
  bangladesh: 'bd',
  barbados: 'bb',
  belarus: 'by',
  belgium: 'be',
  belize: 'bz',
  benin: 'bj',
  bhutan: 'bt',
  bolivia: 'bo',
  bosnia: 'ba',
  botswana: 'bw',
  brazil: 'br',
  brunei: 'bn',
  bulgaria: 'bg',
  burkina: 'bf',
  burundi: 'bi',
  cambodia: 'kh',
  cameroon: 'cm',
  canada: 'ca',
  cape_verde: 'cv',
  central_african_republic: 'cf',
  chad: 'td',
  chile: 'cl',
  china: 'cn',
  colombia: 'co',
  comoros: 'km',
  congo: 'cg',
  costa_rica: 'cr',
  croatia: 'hr',
  cuba: 'cu',
  cyprus: 'cy',
  czech: 'cz',
  denmark: 'dk',
  djibouti: 'dj',
  dominica: 'dm',
  dominican_republic: 'do',
  east_timor: 'tl',
  ecuador: 'ec',
  egypt: 'eg',
  el_salvador: 'sv',
  equatorial_guinea: 'gq',
  eritrea: 'er',
  estonia: 'ee',
  eswatini: 'sz',
  ethiopia: 'et',
  fiji: 'fj',
  finland: 'fi',
  france: 'fr',
  gabon: 'ga',
  gambia: 'gm',
  georgia: 'ge',
  germany: 'de',
  ghana: 'gh',
  greece: 'gr',
  grenada: 'gd',
  guatemala: 'gt',
  guinea: 'gn',
  guinea_bissau: 'gw',
  guyana: 'gy',
  haiti: 'ht',
  honduras: 'hn',
  hungary: 'hu',
  iceland: 'is',
  india: 'in',
  indonesia: 'id',
  iran: 'ir',
  iraq: 'iq',
  ireland: 'ie',
  israel: 'il',
  italy: 'it',
  ivory_coast: 'ci',
  jamaica: 'jm',
  japan: 'jp',
  jordan: 'jo',
  kazakhstan: 'kz',
  kenya: 'ke',
  kiribati: 'ki',
  korea_north: 'kp',
  korea_south: 'kr',
  kosovo: 'xk',
  kuwait: 'kw',
  kyrgyzstan: 'kg',
  laos: 'la',
  latvia: 'lv',
  lebanon: 'lb',
  lesotho: 'ls',
  liberia: 'lr',
  libya: 'ly',
  liechtenstein: 'li',
  lithuania: 'lt',
  luxembourg: 'lu',
  madagascar: 'mg',
  malawi: 'mw',
  malaysia: 'my',
  maldives: 'mv',
  mali: 'ml',
  malta: 'mt',
  marshall_islands: 'mh',
  mauritania: 'mr',
  mauritius: 'mu',
  mexico: 'mx',
  micronesia: 'fm',
  moldova: 'md',
  monaco: 'mc',
  mongolia: 'mn',
  montenegro: 'me',
  morocco: 'ma',
  mozambique: 'mz',
  myanmar: 'mm',
  namibia: 'na',
  nauru: 'nr',
  nepal: 'np',
  netherlands: 'nl',
  new_zealand: 'nz',
  nicaragua: 'ni',
  niger: 'ne',
  nigeria: 'ng',
  north_macedonia: 'mk',
  norway: 'no',
  oman: 'om',
  pakistan: 'pk',
  palau: 'pw',
  palestine: 'ps',
  panama: 'pa',
  papua_new_guinea: 'pg',
  paraguay: 'py',
  peru: 'pe',
  philippines: 'ph',
  poland: 'pl',
  portugal: 'pt',
  qatar: 'qa',
  romania: 'ro',
  russia: 'ru',
  rwanda: 'rw',
  saint_kitts_and_nevis: 'kn',
  saint_lucia: 'lc',
  saint_vincent_and_the_grenadines: 'vc',
  samoa: 'ws',
  san_marino: 'sm',
  sao_tome_and_principe: 'st',
  saudi_arabia: 'sa',
  senegal: 'sn',
  serbia: 'rs',
  seychelles: 'sc',
  sierra_leone: 'sl',
  singapore: 'sg',
  slovakia: 'sk',
  slovenia: 'si',
  solomon_islands: 'sb',
  somalia: 'so',
  south_africa: 'za',
  south_sudan: 'ss',
  spain: 'es',
  sri_lanka: 'lk',
  sudan: 'sd',
  suriname: 'sr',
  sweden: 'se',
  switzerland: 'ch',
  syria: 'sy',
  taiwan: 'tw',
  tajikistan: 'tj',
  tanzania: 'tz',
  thailand: 'th',
  togo: 'tg',
  tonga: 'to',
  trinidad_and_tobago: 'tt',
  tunisia: 'tn',
  turkey: 'tr',
  turkmenistan: 'tm',
  tuvalu: 'tv',
  uganda: 'ug',
  ukraine: 'ua',
  united_arab_emirates: 'ae',
  'united kingdom': 'uk',
  'united states': 'us',
  uruguay: 'uy',
  uzbekistan: 'uz',
  vanuatu: 'vu',
  vatican: 'va',
  venezuela: 've',
  vietnam: 'vn',
  yemen: 'ye',
  zambia: 'zm',
  zimbabwe: 'zw',
  global: '',
  // Add more mappings let's see
};

function normalizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = parsedUrl.hostname.replace(/^www\./i, '');
    const path = parsedUrl.pathname.replace(/\/$/, '');
    return `${hostname}${path}`.toLowerCase();
  } catch (e) {
    console.error('Error normalizing URL:', e);
    return url
      .toLowerCase()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/$/, '');
  }
}

// Save screenshot and HTML for debugging
async function saveDebugInfo(page: import("puppeteer").Page, filenamePrefix: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotPath = path.join(__dirname, `debug-${filenamePrefix}-${timestamp}.png`);
  const htmlPath = path.join(__dirname, `debug-${filenamePrefix}-${timestamp}.html`);
  
  try {
    await page.title(); // Check if page is active
    await page.screenshot({ path: screenshotPath, fullPage: true });
    const html = await page.content();
    await fs.writeFile(htmlPath, html);
    console.log(`Saved debug info: ${screenshotPath}, ${htmlPath}`);
  } catch (e) {
    console.error('Error saving debug info:', e);
  }
}

async function getSERPPage(
  blogPostUrl: string,
  keyword: string,
  country: string
): Promise<number | "no ranking" | "captcha"> {
  const cacheKey = `${blogPostUrl}-${keyword}-${country}-v1`;
  console.log('Starting search for:', { url: blogPostUrl, keyword, country });

  const cachedRank = await redisClient.get(cacheKey);
  if (cachedRank && !process.env.BYPASS_CACHE) {
    console.log("Returning cached result:", cachedRank);
    if (cachedRank === "no ranking" || cachedRank === "captcha") {
      return cachedRank;
    }
    return parseInt(cachedRank, 10);
  }

  const browser = await puppeteer.launch({
    headless: process.env.NON_HEADLESS === 'true' ? false : true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--lang=en-US,en",
      "--window-size=1920,1080",
      "--disable-web-security",
      process.env.PROXY_URL ? `--proxy-server=${process.env.PROXY_URL}` : '',
    ].filter(Boolean),
  });

  let page: import("puppeteer").Page | null = null;

  try {
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(getRandomUserAgent());
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    });

    // Authenticate proxy if provided
    if (process.env.PROXY_USERNAME && process.env.PROXY_PASSWORD) {
      await page.authenticate({
        username: process.env.PROXY_USERNAME,
        password: process.env.PROXY_PASSWORD,
      });
    }

    // Spoof browser properties
    await page.evaluateOnNewDocument(() => {
      interface ChromeWindow extends Window {
        chrome?: Record<string, unknown>;
      }
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
      (window as ChromeWindow).chrome = (window as ChromeWindow).chrome || {};
    });

    const normalizedTargetUrl = normalizeUrl(blogPostUrl);
    console.log('Looking for normalized URL:', normalizedTargetUrl);

    for (let pageNum = 0; pageNum < 10; pageNum++) {
      const start = pageNum * 10;
      const countryCode = countryCodes[country.toLowerCase()] || country.toLowerCase();
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=10&start=${start}${countryCode ? `&gl=${countryCode}&hl=en` : ''}`;
      console.log('Navigating to URL:', googleUrl);

      // Retry navigation on failure
      let navigationSuccess = false;
      for (let navAttempt = 0; navAttempt < 3; navAttempt++) {
        try {
          const response = await page.goto(googleUrl, {
            waitUntil: ["domcontentloaded", "networkidle2"],
            timeout: 60000,
          });
          console.log('HTTP status:', response?.status() || 'No response');
          if (response && response.status() >= 400) {
            console.log(`Received HTTP ${response.status()}, likely blocked`);
            await saveDebugInfo(page, `http-error-${pageNum}-${navAttempt}`);
            continue;
          }
          navigationSuccess = true;
          break;
        } catch (navError) {
          console.error(`Navigation attempt ${navAttempt + 1} failed:`, navError);
          if (navError.message.includes('net::ERR_EMPTY_RESPONSE')) {
            console.log('Retrying due to ERR_EMPTY_RESPONSE');
            await randomDelay(5000, 10000);
            await page.setUserAgent(getRandomUserAgent());
          } else {
            throw navError;
          }
        }
      }

      if (!navigationSuccess) {
        console.log('All navigation attempts failed');
        await saveDebugInfo(page, `nav-failure-${pageNum}`);
        return "captcha";
      }

      await page.waitForSelector('div#search, div#center_col', { timeout: 30000 })
        .catch(() => console.log('Search results selector timeout'));

      const isSERP = await page.evaluate(() => {
        return !!document.querySelector('div#search, div#center_col, input[name="q"]');
      });
      if (!isSERP) {
        console.log('Not a valid SERP page, likely CAPTCHA or error');
        await saveDebugInfo(page, `captcha-page-${pageNum}`);
        return "captcha";
      }

      const isCaptcha = await page.evaluate(() => {
        const captchaIndicators = [
          'form#captcha-form',
          'div.g-recaptcha',
          'form[action*="sorry/index"]',
          'input[name="captcha"]',
        ];
        return captchaIndicators.some(selector => !!document.querySelector(selector)) ||
               document.title.includes('Before you continue') ||
               window.location.pathname.includes('/sorry/');
      });

      if (isCaptcha) {
        console.log('CAPTCHA detected, stopping search');
        await saveDebugInfo(page, `captcha-page-${pageNum}`);
        return "captcha";
      }

      const links = await page.evaluate(() => {
        const results: string[] = [];
        document.querySelectorAll('div.yuRUbf > a, div.tF2Cxc > a, div.rc > a, h3 > a, div.MjjYud > a')
          .forEach(el => {
            if (el instanceof HTMLAnchorElement) {
              const href = el.href.includes('/url?q=') ?
                new URL(el.href).searchParams.get('q') || el.href :
                el.href;
              if (href && href.startsWith('http')) {
                results.push(href);
              }
            }
          });
        return results;
      });

      console.log(`Found ${links.length} links on page ${pageNum + 1}`);
      console.log('Raw links:', links);
      const normalizedLinks = links.map(normalizeUrl);
      console.log('Normalized links:', normalizedLinks);

      const foundIndex = normalizedLinks.findIndex(link => {
        const target = normalizedTargetUrl.replace(/^www\./i, '');
        const linkNoWww = link.replace(/^www\./i, '');
        const isMatch = linkNoWww.includes(target) || target.includes(linkNoWww) ||
          linkNoWww === target || link === normalizedTargetUrl;
        if (isMatch) {
          console.log('Found matching URL:', link);
          console.log('Matched with target:', normalizedTargetUrl);
        }
        return isMatch;
      });

      if (foundIndex !== -1) {
        const ranking = foundIndex + 1 + (pageNum * 10);
        console.log(`Found URL at position ${ranking}`);
        await redisClient.set(cacheKey, ranking.toString(), { EX: 86400 });
        await browser.close();
        return ranking;
      }

      if (links.length < 5) {
        console.log('No more pages of results. Stopping search.');
        break;
      }

      await randomDelay(5000, 10000);
    }

    console.log('URL not found in first 100 results');
    await redisClient.set(cacheKey, "no ranking", { EX: 3600 });
  } catch (error) {
    console.error('Error during search:', error);
    if (page) {
      await saveDebugInfo(page, 'error');
    }
    return "captcha";
  } finally {
    await browser.close();
  }
  return "no ranking";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url, keywords, country }: { url: string; keywords: string[]; country?: string } = req.body;

  if (!url || !Array.isArray(keywords) || keywords.length === 0) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const MAX_RETRIES = 2;

  try {
    const results = {
      website: url,
      keywords: await Promise.all(
        keywords.map(async (keyword) => {
          let lastError;
          for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
              const ranking = await getSERPPage(url, keyword, country || "Global");
              if (ranking !== "captcha") {
                return { keyword, ranking, country: country || "Global" };
              }
              lastError = "CAPTCHA detected or navigation failed";
              await randomDelay(10000, 20000);
            } catch (error) {
              lastError = error;
              if (attempt < MAX_RETRIES) {
                await randomDelay(5000, 10000);
              }
            }
          }
          console.error(`All retries failed for keyword "${keyword}":`, lastError);
          return { keyword, ranking: "no ranking", country: country || "Global" };
        })
      ),
    };
    res.status(200).json(results);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}