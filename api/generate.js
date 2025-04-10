const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const qrUrl = req.query.qr;

  if (!qrUrl) {
    return res.status(400).send("Falta el parámetro 'qr'");
  }

  const html = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
          }
          .container {
            position: relative;
            width: 589px;
            height: 1557px;
            background-image: url('https://i.imgur.com/LvIHTZL.jpeg');
            background-size: cover;
            background-position: center;
          }
          .qr {
            position: absolute;
            top: 920px;
            left: 50%;
            transform: translateX(-50%);
            width: 194px;
            height: 194px;
            border-radius: 12px;
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img class="qr" src="${qrUrl}" />
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const image = await page.screenshot({ type: "png" });
  await browser.close();

  res.setHeader("Content-Type", "image/png");
  res.send(image);
};

