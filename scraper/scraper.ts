import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';

const PAGE_SIZE = 20;
const TOTAL = 500;
const NUMBER_OF_PAGES = Math.ceil(TOTAL / PAGE_SIZE);

type ListingDTO = {
    title: string;
    link: string;
    locality: string;
    price: string;
    tags: string[];
    imageUrls: string[];
}

const prisma = new PrismaClient();

async function scrapeAndSaveData(pageNumber: number) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to the target page URL
    const url = `https://www.sreality.cz/en/search/for-sale/apartments?page=${pageNumber}`;
    await page.goto(url);
    await page.waitForLoadState('networkidle');


    // Use Playwright selectors to scrape data from the page
    const propertyElements = await page.$$('div.property');

    const pageData: ListingDTO[] = []

    for (const propertyElement of propertyElements) {
        const { title, link } = await propertyElement.$eval('h2 a.title', (element) => ({ title: element.textContent?.trim() || '', link: 'https://sreality.cz' + (element.getAttribute('href') || '') }));
        const locality = await propertyElement.$eval('.locality', (element) => element.textContent || '');
        const price = await propertyElement.$eval('.price', (element) => element.textContent?.trim() || '');
        const tags = await propertyElement.$$eval('.labels span', (elements) => elements.map((el) => el.textContent));
        const tagsArray = await tags.map((tag) => tag?.toString().trim() || '');
        const imageUrls = await propertyElement.$$eval('a img', (images) => images.map((img) => img.getAttribute('src') || ''));
        const imageUrlsArray = imageUrls.map((url) => url?.toString()).slice(0, -1);

        pageData.push({
            title,
            link,
            locality,
            price,
            tags: tagsArray,
            imageUrls: imageUrlsArray
        })
    }

    await prisma.listings.createMany({ data: pageData })

    await browser.close();
    await prisma.$disconnect();
}


async function main() {
    for (let i = 1; i <= NUMBER_OF_PAGES; i++) {
        console.log('Scraping page', i);
        await scrapeAndSaveData(i).catch((error) => {
            console.error('Error scraping and saving data on page', i, error);
        });
    }

}

main()
