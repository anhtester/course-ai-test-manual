// User Guide recorder — highlight + numbered click badges + caption bar, screenshots and per-part videos.
// Project-agnostic. Loaded through scripts/user-guide/boot.js (the Playwright MCP sandbox has no require/import/process).
// Skill: .claude/skills/skills-user-guide-writer/SKILL.md (Mode LIVE / VIDEO) · Workflow: /generate-user-guide
//
// Every step = "mark → pause so the viewer can see it → (screenshot) → act".
//   - Red frame around the target + a round numbered badge (click order 1, 2, 3…) + optional dark label.
//   - Caption bar at the bottom: "<section> · Step n — <text>" (step word follows `lang`).
//   - Several steps on one page: ug.marks([...]) draws all frames at once with their numbers → one overview screenshot.
// The overlay is drawn in the top document with position:fixed from boundingBox(), so elements inside iframes work too.
// Pauses only slow the video down for viewers — this is a documentation recorder, NOT test automation (no hard sleeps in tests).
(page, opts) => {
  const STEP_WORD = { vi: 'Bước', en: 'Step', ja: 'ステップ', ko: '단계', zh: '步骤', fr: 'Étape', de: 'Schritt', es: 'Paso' };
  const o = Object.assign({ pause: 1300, typeDelay: 55, section: '', lang: 'vi', color: '#e11d48', requireHighlight: true }, opts || {});
  o.stepWord = o.stepWord || STEP_WORD[o.lang] || 'Step';
  const wait = (ms) => page.waitForTimeout(ms);
  let marked = false;   // a highlight is currently on screen — screenshots without one are refused (highlight is mandatory)

  const drawOverlay = async (boxes, caption) => {
    await page.evaluate(([boxes, caption, color]) => {
      document.getElementById('__ug_layer')?.remove();
      const L = document.createElement('div');
      L.id = '__ug_layer';
      L.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483646';
      // Attach to <html>, not <body>: a transformed/zoomed body turns position:fixed into "relative to body" (caption floats mid-page).
      document.documentElement.appendChild(L);
      for (const b of boxes) {
        const pad = 4;
        const r = document.createElement('div');
        r.style.cssText = `position:fixed;left:${b.x - pad}px;top:${b.y - pad}px;width:${b.w + pad * 2}px;height:${b.h + pad * 2}px;` +
          `border:3px solid ${color};border-radius:6px;box-shadow:0 0 0 4px ${color}2e`;
        L.appendChild(r);
        if (b.n != null) {
          const s = document.createElement('div');
          s.textContent = b.n;
          s.style.cssText = `position:fixed;left:${Math.max(2, b.x - pad - 14)}px;top:${Math.max(2, b.y - pad - 14)}px;min-width:26px;height:26px;padding:0 6px;` +
            `border-radius:13px;background:${color};color:#fff;font:700 14px/26px Arial,sans-serif;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,.35)`;
          L.appendChild(s);
        }
      }
      // Labels: try below / right / above / inside-top-right; keep the first spot that overlaps no other frame, label or the caption bar
      const placed = [];
      const hit = (a, c) => a.x < c.x + c.w && a.x + a.w > c.x && a.y < c.y + c.h && a.y + a.h > c.y;
      for (const b of boxes) {
        if (!b.label) continue;
        const t = document.createElement('div');
        t.textContent = b.label;
        t.style.cssText = 'position:fixed;left:0;top:0;max-width:360px;background:#111827;color:#fff;font:600 12px/1.35 Arial,sans-serif;' +
          'padding:5px 8px;border-radius:5px;box-shadow:0 1px 4px rgba(0,0,0,.3);visibility:hidden';
        L.appendChild(t);
        const w = t.offsetWidth, h = t.offsetHeight, gap = 8, bottomLimit = innerHeight - 52;
        const cands = [{ x: b.x - 4, y: b.y + b.h + gap }, { x: b.x + b.w + gap + 6, y: b.y }, { x: b.x - 4, y: b.y - h - gap - 10 }, { x: b.x + b.w - w - 8, y: b.y + 6 }];
        const others = boxes.filter(q => q !== b).map(q => ({ x: q.x - 6, y: q.y - 6, w: q.w + 12, h: q.h + 12 }));
        let pos = null;
        for (const c of cands) {
          const r = { x: Math.min(Math.max(4, c.x), innerWidth - w - 4), y: c.y, w, h };
          if (r.y < 4 || r.y + h > bottomLimit) continue;
          if (others.some(q => hit(r, q)) || placed.some(q => hit(r, q))) continue;
          pos = r; break;
        }
        if (!pos) pos = { x: Math.min(Math.max(4, b.x + b.w - w - 8), innerWidth - w - 4), y: Math.min(Math.max(4, b.y + 6), bottomLimit - h), w, h };
        placed.push(pos);
        t.style.left = pos.x + 'px'; t.style.top = pos.y + 'px'; t.style.visibility = 'visible';
      }
      if (caption) {
        const c = document.createElement('div');
        c.textContent = caption;
        c.style.cssText = `position:fixed;left:0;right:0;bottom:0;background:rgba(17,24,39,.92);color:#fff;font:600 15px/1.4 Arial,sans-serif;` +
          `padding:9px 16px;border-top:3px solid ${color};white-space:pre-wrap`;
        L.appendChild(c);
      }
    }, [boxes, caption, o.color]);
    marked = boxes.length > 0;
  };

  const boxOf = async (loc) => {
    await loc.scrollIntoViewIfNeeded({ timeout: 15000 }).catch(() => {});
    const b = await loc.boundingBox({ timeout: 15000 });
    if (!b) throw new Error('Cannot get the element position to highlight (hidden element? a native <option>?)');
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  };
  const cap = (n, text) => `${o.section ? o.section + ' · ' : ''}${n != null ? o.stepWord + ' ' + n + ' — ' : ''}${text}`;

  const UG = {
    set section(s) { o.section = s; },
    get options() { return o; },
    wait,
    clear: async () => { marked = false; await page.evaluate(() => document.getElementById('__ug_layer')?.remove()).catch(() => {}); },
    // Caption bar only (intro / transition). Not a highlight — shot() is refused while only a caption is shown.
    caption: async (text, ms) => { await drawOverlay([], cap(null, text)); await wait(ms || o.pause); },
    // One frame: loc = Locator, n = click-order number, text = step description, label = optional dark tag next to the frame
    mark: async (loc, n, text, label) => { await drawOverlay([{ ...(await boxOf(loc)), n, label }], cap(n, text)); },
    // Many frames at once (one page, several steps): items = [{ loc, n, label }].
    // Scrolls ONCE (middle item to the centre) and then measures all — measuring with a scroll per item misplaces earlier frames.
    marks: async (items, text) => {
      const mid = items[Math.floor((items.length - 1) / 2)].loc;
      await mid.evaluate(e => e.scrollIntoView({ block: 'center', inline: 'nearest' })).catch(() => {});
      await wait(250);
      const bs = [];
      const vp = page.viewportSize() || { width: 1e5, height: 1e5 };
      const off = [];
      for (const it of items) {
        const b = await it.loc.boundingBox({ timeout: 15000 });
        if (!b || b.y < 0 || b.y + b.height > vp.height - 48 || b.x < 0 || b.x + b.width > vp.width) { off.push(it.n != null ? it.n : (it.label || '?')); continue; }
        bs.push({ x: b.x, y: b.y, w: b.width, h: b.height, n: it.n, label: it.label });
      }
      // A frame outside the screen cannot be seen in the image/video → refuse instead of producing a half-highlighted shot
      if (off.length) throw new Error(`marks(): item(s) ${off.join(', ')} are outside the visible area — split into several marks() calls / screenshots`);
      await drawOverlay(bs, cap(null, text));
    },
    // Blur sensitive regions (other people's names, emails, amounts…) — applies to the video AND screenshots until the page navigates.
    blur: async (loc, px) => { await loc.evaluateAll((els, px) => els.forEach(e => { e.style.filter = `blur(${px}px)`; e.dataset.ugBlur = '1'; }), px || 6); },
    unblur: async () => { await page.evaluate(() => document.querySelectorAll('[data-ug-blur]').forEach(e => { e.style.filter = ''; delete e.dataset.ugBlur; })); },
    shot: async (file, fullPage) => {
      if (!o.imgDir || !file) return null;
      if (o.requireHighlight && !marked) throw new Error(`Screenshot "${file}" has no highlight — call mark()/marks()/look() first (highlight is mandatory in user guides)`);
      await page.screenshot({ path: o.imgDir + file, fullPage: !!fullPage });
      return file;
    },
    // Check/read step: frame stays longer, optional screenshot, no action
    look: async (loc, n, text, shot, label, ms) => { await UG.mark(loc, n, text, label); await wait(ms || o.pause * 1.6); if (shot) await UG.shot(shot); },
    click: async (loc, n, text, shot, label) => { await UG.mark(loc, n, text, label); await wait(o.pause); if (shot) await UG.shot(shot); await UG.clear(); await loc.click(); },
    // Type character by character so viewers see the text appear; frame again afterwards for the screenshot
    fill: async (loc, value, n, text, shot, label) => {
      await UG.mark(loc, n, text, label); await wait(o.pause * 0.7);
      await UG.clear(); await loc.click(); await loc.fill('');
      await loc.pressSequentially(String(value), { delay: o.typeDelay });
      await UG.mark(loc, n, text, label); await wait(o.pause * 0.6); if (shot) await UG.shot(shot); await UG.clear();
    },
  };

  // Generic form login, run in a NOT-recorded context so passwords never appear in a video.
  //   UG.formLogin({ url: env.APP_LOGIN_URL, user: env.APP_USER, pass: env.APP_PASS, userSel: '#email', passSel: '#password', submitSel: 'button[type=submit]' })
  UG.formLogin = (f) => async (p) => {
    await p.goto(f.url);
    await p.locator(f.userSel || 'input[type=email], input[name*=email], input[name*=user]').first().fill(f.user);
    await p.locator(f.passSel || 'input[type=password]').first().fill(f.pass);
    await Promise.all([p.waitForLoadState('networkidle').catch(() => {}), p.locator(f.submitSel || 'button[type=submit], input[type=submit]').first().click()]);
  };

  // Record one part: fn(rp, ug) runs on a page of a context with recordVideo; the video is saved as <videoDir>/<name>.webm.
  //   login: omitted  → reuse the MCP page's current session (sign in on the MCP page first, unrecorded)
  //          function → async (p, env) => {...} executed in an unrecorded context, then its storageState is reused
  UG.record = async (name, fn, rec) => {
    rec = rec || {};
    const browser = page.context().browser();
    const vp = o.viewport || page.viewportSize() || { width: 1600, height: 750 };
    let st;
    if (typeof rec.login === 'function') {
      const lc = await browser.newContext({ viewport: vp });
      const lp = await lc.newPage();
      await rec.login(lp, o.env);
      st = await lc.storageState();
      await lc.close();
    } else st = await page.context().storageState();
    const ctx = await browser.newContext({ storageState: st, viewport: vp, recordVideo: { dir: o.videoDir, size: vp } });
    const rp = await ctx.newPage();
    const ug = eval(o.__src)(rp, Object.assign({}, o, { section: name }));
    let err = null, res = null;
    try { res = await fn(rp, ug); } catch (e) { err = String(e).slice(0, 600); try { await rp.screenshot({ path: o.videoDir + name + '__error.png' }); } catch (_) {} }
    const v = rp.video();
    await ctx.close();
    if (v) await v.saveAs(o.videoDir + name + '.webm');
    return { name, err, res };
  };
  return UG;
}
