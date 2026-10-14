// TEMPLATE — one recorded part of a user guide (Mode VIDEO). Copy to a working folder (e.g. .playwright-mcp/user-guide/rec_1.js),
// replace every <…>, then run:  browser_run_code_unsafe  filename=<absolute path of the copy>
// Result: { name, err, res } — err != null ⇒ look at <outDir>video/<name>__error.png, fix, delete that part's outputs, record again.
//
// Rules (skills-user-guide-writer · Mode VIDEO):
//   - EVERY step of a main task is highlighted: ug.click / ug.fill / ug.look / ug.marks. Never a plain screenshot.
//   - Step numbers restart at 1 for each task and match the numbered steps in the guide.
//   - One page with several steps → ug.marks([...]) with numbers 1, 2, 3… → one overview screenshot.
//   - Captions in the guide language (lang). Image names: ASCII slug p<part>-<task>-s<step>-<slug>.png.
//   - Supporting steps (create test data, navigation the reader already knows) are NOT recorded — run them in a separate unrecorded script.
async (page) => {
  const ROOT = '<ROOT>';                                     // e.g. D:/work/my-project
  await page.goto('file:///' + ROOT + '/scripts/user-guide/boot.js');
  const UG = await eval(await page.evaluate(() => document.body.innerText))(page, {
    root: ROOT, outDir: ROOT + '/docs/user-guides/<module>/', lang: '<en|vi>',
  });
  const BASE = UG.env['<APP_BASE_URL_KEY>'];                  // URL from .env — never hard-code environments or secrets

  return await UG.record('p1_<area>_<task>', async (p, ug) => {
    const nl = () => p.waitForLoadState('networkidle').catch(() => {});
    ug.section = '<Part 1 · Task title>';
    await p.goto(BASE + '<path of the start page>'); await nl();
    await ug.caption('<Signed in as <role> · <context the viewer needs>>', 1500);

    // Step 1 — click (frame + badge 1 + caption, screenshot, then click)
    await ug.click(p.getByRole('link', { name: '<Menu label>' }), 1, 'Click "<Menu label>"', 'p1-1-s1-<slug>.png'); await nl();

    // Step 2 — type a value (frame, typed character by character)
    await ug.fill(p.getByLabel('<Field label>'), '<sample value>', 2, '<Field label>: enter <what>', null);

    // Steps 3–5 — several fields on one page: one overview screenshot with numbers 3, 4, 5
    await ug.marks([
      { loc: p.getByLabel('<Field A>'), n: 3, label: '<Field A>' },
      { loc: p.getByLabel('<Field B>'), n: 4, label: '<Field B>' },
      { loc: p.getByRole('button', { name: '<Save>' }), n: 5, label: 'Click "<Save>"' },
    ], '<Steps 3–5 — what the reader does on this page>');
    await ug.wait(3500); await ug.shot('p1-1-s3-5-<slug>.png'); await ug.clear();
    await p.getByRole('button', { name: '<Save>' }).click(); await nl();

    // Result — check step: frame the success message / new row, keep it on screen, screenshot
    await ug.look(p.getByText('<success message, verbatim>'), 6, 'The page shows "<success message>"', 'p1-1-s6-<slug>.png', null, 3000);
    await ug.clear();
    return { ok: true };
  }
  // , { login: UG.formLogin({ url: UG.env.<LOGIN_URL_KEY>, user: UG.env.<USER_KEY>, pass: UG.env.<PASS_KEY> }) }   // omit → reuse the MCP session
  );
}
