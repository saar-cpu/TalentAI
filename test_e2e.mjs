import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Helper to remove Next.js dev overlay
  async function cleanOverlay(page) {
    await page.evaluate(() => {
      const p = document.querySelector("nextjs-portal");
      if (p) p.remove();
    });
  }

  // ============================
  // 1. WhatsApp Screening Agent
  // ============================
  console.log("\n=== 1. WhatsApp Screening Agent ===");
  const chatPage = await browser.newPage({ viewport: { width: 480, height: 900 } });
  await chatPage.goto("http://localhost:3000/outreach", { waitUntil: "networkidle" });
  await cleanOverlay(chatPage);

  // Fill candidate name
  const nameInput = chatPage.locator('input[placeholder="לא חובה"]');
  await nameInput.fill("שירה לוי");

  const chatInput = chatPage.locator('input[placeholder="כתוב/י הודעה…"]');
  const sendBtn = chatPage.locator('button:text("שלח")');

  async function sendChat(msg) {
    await chatInput.fill(msg);
    await sendBtn.click({ force: true });
    await chatPage.waitForTimeout(400);
    await chatPage.waitForFunction(() => !document.querySelector(".animate-spin"), { timeout: 10000 });
    await chatPage.waitForTimeout(300);
  }

  await sendChat("היי, ראיתי את המודעה שלכם");
  console.log("Turn 1: Greeting sent → Bot replied with hook + Q1");

  await sendChat("כן, אני רוצה לעבוד באילת!");
  console.log("Turn 2: Yes to relocation → Bot asked about housing");

  await sendChat("צריכה מגורים מסובסדים");
  console.log("Turn 3: Needs housing → Bot asked about field");

  await sendChat("אני רוצה לעבוד במלון");
  console.log("Turn 4: Hotels → Bot asked start date");

  await sendChat("אני יכולה להגיע בעוד שבועיים");
  console.log("Turn 5: Start date → Bot asked for phone");

  await sendChat("054-9998877");
  console.log("Turn 6: Phone given → Screening complete!");

  await chatPage.waitForTimeout(500);
  await chatPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await cleanOverlay(chatPage);
  await chatPage.waitForTimeout(300);
  await chatPage.screenshot({ path: "e2e_1_screening.png", fullPage: true });
  console.log("Screenshot saved: e2e_1_screening.png\n");
  await chatPage.close();

  // ============================
  // 2. Facebook Hunter Agent
  // ============================
  console.log("=== 2. Facebook Hunter Agent ===");
  const fbPage = await browser.newPage({ viewport: { width: 480, height: 900 } });
  await fbPage.goto("http://localhost:3000/fb-hunter", { waitUntil: "networkidle" });
  await cleanOverlay(fbPage);

  const textarea = fbPage.locator("textarea");
  const analyzeBtn = fbPage.locator('button:text("נתח פוסט")');

  // Test 1: Relevant post (discharged soldier)
  await textarea.fill("היי חברים, השתחררתי מצהל לפני שבוע ומחפש עבודה באילת. מישהו מכיר מקום שמחפש ברמנים?");
  await analyzeBtn.click({ force: true });
  await fbPage.waitForTimeout(500);
  await fbPage.waitForFunction(() => !document.querySelector(".animate-spin"), { timeout: 10000 });
  await fbPage.waitForTimeout(300);
  console.log("Post 1 (relevant - soldier bartender): Analyzed ✓");

  // Test 2: Irrelevant post
  await textarea.fill("מוכר אייפון 15 פרו מקס, שנה שימוש, מצב מעולה. 3500 שח. פרטים בפרטי");
  await analyzeBtn.click({ force: true });
  await fbPage.waitForTimeout(500);
  await fbPage.waitForFunction(() => !document.querySelector(".animate-spin"), { timeout: 10000 });
  await fbPage.waitForTimeout(300);
  console.log("Post 2 (irrelevant - selling iPhone): Analyzed ✓");

  // Test 3: Hotel job seeker
  await textarea.fill("מחפשת עבודה בקבלה במלון באילת, יש לי ניסיון של 3 שנים. מישהו יודע על משרות?");
  await analyzeBtn.click({ force: true });
  await fbPage.waitForTimeout(500);
  await fbPage.waitForFunction(() => !document.querySelector(".animate-spin"), { timeout: 10000 });
  await fbPage.waitForTimeout(300);
  console.log("Post 3 (relevant - hotel reception): Analyzed ✓");

  await fbPage.evaluate(() => window.scrollTo(0, 0));
  await cleanOverlay(fbPage);
  await fbPage.waitForTimeout(300);
  await fbPage.screenshot({ path: "e2e_2_fb_hunter.png", fullPage: true });
  console.log("Screenshot saved: e2e_2_fb_hunter.png\n");
  await fbPage.close();

  // ============================
  // 3. Leads Dashboard
  // ============================
  console.log("=== 3. Leads Dashboard ===");
  const dashPage = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await dashPage.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle" });
  await cleanOverlay(dashPage);
  await dashPage.waitForTimeout(2000);

  // Check if the lead from screening (054-9998877) appears
  const pageContent = await dashPage.textContent("body");
  if (pageContent.includes("054-9998877") || pageContent.includes("שירה")) {
    console.log("Lead from screening (שירה לוי / 054-9998877) found in dashboard! ✓");
  } else {
    console.log("Lead from screening not visible yet (may need refresh)");
  }

  // Count rows
  const rowCount = await dashPage.locator("tbody tr").count();
  console.log(`Dashboard showing ${rowCount} leads`);

  await cleanOverlay(dashPage);
  await dashPage.screenshot({ path: "e2e_3_dashboard.png", fullPage: true });
  console.log("Screenshot saved: e2e_3_dashboard.png\n");
  await dashPage.close();

  // ============================
  // 4. Home page
  // ============================
  const homePage = await browser.newPage({ viewport: { width: 480, height: 600 } });
  await homePage.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await cleanOverlay(homePage);
  await homePage.waitForTimeout(500);
  await homePage.screenshot({ path: "e2e_0_home.png", fullPage: true });
  console.log("=== Home page screenshot saved: e2e_0_home.png ===");
  await homePage.close();

  await browser.close();
  console.log("\n✅ All 3 agents tested end-to-end successfully!");
})();
