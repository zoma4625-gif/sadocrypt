import { LOGO_MARK_SVG } from './header.js';
import { T } from '../i18n.js';

export function FOOTER(lang) { return `<footer style="width:100%;background:#ece6d6;border-top:1px solid rgba(60,55,48,.1)">
  <div style="max-width:700px;margin:0 auto;padding:40px 24px 0;text-align:center">
    <a href="/" style="text-decoration:none;display:inline-flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:32px"><div style="border-radius:6px;overflow:hidden;width:32px;height:32px;flex-shrink:0">${LOGO_MARK_SVG}</div><span class="brake-logo" style="font-size:2.4rem">Brake<span class="brake-dot">.</span></span><span style="font-family:'Noto Sans JP',sans-serif;font-size:12px;color:rgba(60,55,48,.55);letter-spacing:.06em">${T('footer.tagline', lang)}</span></a>
    <div style="display:flex;flex-wrap:wrap;gap:40px;justify-content:center;margin-bottom:40px">
      <a href="#top" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;" style="display:inline-flex;align-items:center;gap:6px;font-family:'Noto Sans JP',sans-serif;font-size:16px;color:#c9865e;text-decoration:none;transition:opacity .15s" onmouseover="this.style.opacity='.7'" onmouseout="this.style.opacity='1'"><svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 8L7 2L13 8" stroke="#c9865e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>${T('footer.back', lang)}</a>
      <a href="https://github.com/zoma4625-gif/sadocrypt" target="_blank" rel="noopener" style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:rgba(60,55,48,.7);text-decoration:none;transition:color .15s" onmouseover="this.style.color='#3c3a36';this.style.textDecoration='underline'" onmouseout="this.style.color='rgba(60,55,48,.7)';this.style.textDecoration='none'">GitHub</a>
      <a href="/terms" style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:rgba(60,55,48,.7);text-decoration:none;transition:color .15s" onmouseover="this.style.color='#3c3a36';this.style.textDecoration='underline'" onmouseout="this.style.color='rgba(60,55,48,.7)';this.style.textDecoration='none'">${T('footer.terms', lang)}</a>
      <a href="/privacy" style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:rgba(60,55,48,.7);text-decoration:none;transition:color .15s" onmouseover="this.style.color='#3c3a36';this.style.textDecoration='underline'" onmouseout="this.style.color='rgba(60,55,48,.7)';this.style.textDecoration='none'">${T('footer.privacy', lang)}</a>
      <a href="mailto:info@brake.run" style="font-family:'Noto Sans JP',sans-serif;font-size:16px;color:rgba(60,55,48,.7);text-decoration:none;transition:color .15s" onmouseover="this.style.color='#3c3a36';this.style.textDecoration='underline'" onmouseout="this.style.color='rgba(60,55,48,.7)';this.style.textDecoration='none'">${T('footer.contact', lang)}</a>
    </div>
  </div>
  <div style="max-width:700px;margin:0 auto;padding:24px 24px 40px;border-top:1px solid rgba(60,55,48,.08);display:flex;align-items:center;justify-content:center;gap:16px">
    <span style="font-family:'Noto Sans JP',sans-serif;font-size:12px;color:rgba(60,55,48,.45);letter-spacing:.08em">${T('footer.copy', lang)}</span>
    <button id="lang-switch-btn" style="background:none;border:1px solid rgba(60,55,48,.2);border-radius:999px;padding:2px 10px;font-size:11px;font-family:inherit;color:rgba(60,55,48,.5);cursor:pointer;letter-spacing:.06em;line-height:1.6" aria-label="Switch language">${T('nav.lang', lang)}</button>
  </div>
</footer>`; }
