// Boot the User Guide recorder (ug-lib.js) on the Playwright MCP page. Inside a browser_run_code_unsafe script:
//
//   await page.goto('file:///<ROOT>/scripts/user-guide/boot.js');
//   const UG = await eval(await page.evaluate(() => document.body.innerText))(page, {
//     root: '<ROOT>',                                   // absolute repo path with forward slashes, e.g. D:/work/my-project
//     outDir: '<ROOT>/docs/user-guides/<module>/',      // images → <outDir>images/ · videos → <outDir>video/
//     lang: 'en',                                       // vi | en | … → caption step word ("Bước 3" / "Step 3")
//     envFile: '.env',                                  // optional — values readable as UG.env.KEY (never print them)
//   });
//
// The MCP sandbox has no require/import/process/URL → files are read through page.goto('file:///…').
// Boot navigates the MCP page to local files: run it BEFORE signing in on the MCP page only if you pass a login function to UG.record.
(async (page, cfg) => {
  const ROOT = 'file:///' + cfg.root.replace(/\\/g, '/').replace(/\/?$/, '/');
  const read = async (p) => { await page.goto(ROOT + p); return page.evaluate(() => (document.querySelector('pre') || document.body).innerText); };
  const src = await read('scripts/user-guide/ug-lib.js');
  const env = {};
  if (cfg.envFile !== false) {
    try {
      for (const l of (await read(cfg.envFile || '.env')).split(/\r?\n/)) { const m = l.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
    } catch (e) { /* no .env — fine when the MCP session is already signed in */ }
  }
  const OUT = cfg.outDir.replace(/\\/g, '/').replace(/\/?$/, '/');
  const UG = eval(src)(page, Object.assign({ imgDir: OUT + 'images/', videoDir: OUT + 'video/', env, __src: src }, cfg));
  UG.env = env;
  return UG;
})
