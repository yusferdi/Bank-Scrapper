const puppeteer = require("puppeteer-extra");
const { newInjectedPage } = require("fingerprint-injector");

//Constant variables for input login
const userName   = 'USER';
const passWord   = 'PASS';

(async () => {
    
    //Constant variables for puppeteer
    const browser = await puppeteer.launch({
        headless: false, // true if needed
        args: [
        '--log-level=3', 
        '--no-default-browser-check',
        '--disable-infobars',
        '--disable-web-security',
        '--disable-site-isolation-trials',
        ]
    // executablePath: 'google-chrome', path google chrome  (uncomment line ini jika tidak diperlukan)  tapi direkomendasikan menggunakan google chrome 
    });
    const page = await newInjectedPage(
        browser,
        {
            // constraints for the generated fingerprint
            fingerprintOptions: {
                devices: ['desktop'],
                operatingSystems: ['macos'],
            },
        },
    );

    page.on('dialog', async (dialog) => {
        console.log("[Error]: " + dialog.message()); // Mencetak pesan dari alert

        await dialog.dismiss();
    });

  // Set viewport width and height
    await page.setViewport({ width: 1280, height: 720 });
    const website_url = 'https://ibank.klikbca.com/';
    await page.goto( website_url, { waitUntil: "domcontentloaded" } );
    await page.type( "#txt_user_id", userName, { delay: 100 } );
    await page.type( "#txt_pswd", passWord, { delay: 100 } );
    await page.click('input[value="LOGIN"]', { delay: 200 } );
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    const pageSource = await page.evaluate(() => {
        return document.documentElement.outerHTML;
    });

    if(pageSource.includes("authentication.do?value(actions)=welcome")){
        console.log("[LOG] Login berhasil!");
        await page.goto( "https://ibank.klikbca.com/nav_bar/account_information_menu.htm", { waitUntil: "domcontentloaded" } );
        await page.click('body table tbody tr td:nth-child(2) table tbody tr:nth-child(4) td table tbody tr:nth-child(1) td:nth-child(2) font a', { delay: 200 } );
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        await page.click('body table tbody tr td:nth-child(2) table tbody tr:nth-child(4) td table tbody tr:nth-child(1) td:nth-child(2) font a', { delay: 200 } );
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        const newPageSource = await page.evaluate(() => {
            return document.documentElement.outerHTML;
        });

        console.log(newPageSource);
    };


    // Capture screenshot first
    await page.screenshot({
        path: 'screenshots.jpg',
    });
})();
