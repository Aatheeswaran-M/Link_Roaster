const axios = require('axios');
const cheerio = require('cheerio');

const scrapeUrl = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove scripts and styles to get clean text
    $('script, style, noscript, iframe').remove();

    const title = $('meta[property="og:title"]').attr('content') || $('head > title').first().text().trim() || $('title').first().text().trim() || '';
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const ogDescription = $('meta[property="og:description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';

    let bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    
    // Combine meta description and body text to give AI good context
    let combinedText = `${metaDescription} ${ogDescription} ${bodyText}`.trim();
    
    // Limit to 3000 characters
    const scrapedText = combinedText.substring(0, 3000);

    return {
      title,
      ogImage,
      scrapedText,
    };
  } catch (error) {
    console.error(`Scraping error for ${url}:`, error.message);
    
    let domainName = 'the website';
    try {
      const parsedUrl = new URL(url);
      domainName = parsedUrl.hostname.replace(/^www\./, '');
    } catch (e) {}

    // Instead of throwing an error, return fallback content to roast the domain and their bot protection
    return {
      title: domainName,
      ogImage: '',
      scrapedText: `The website at ${url} (domain: ${domainName}) blocked our scraper, returned an error, or requires authentication. They are heavily protected against bots or have strict policies. Please roast the domain name itself and the fact that they are hiding their content behind bot protection or paywalls. Be savage about it.`,
    };
  }
};

module.exports = { scrapeUrl };
