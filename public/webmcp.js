/**
 * WebMCP integration for gettitlescore.com
 * ---------------------------------------------------------------------------
 * Exposes the title scorer to an AI agent running in the visitor's browser,
 * via the W3C WebMCP draft (document.modelContext).
 *
 * CONTRACT (developer.chrome.com/docs/ai/webmcp/imperative-api):
 *   document.modelContext.registerTool({ name, description, inputSchema, execute })
 *   execute(args, { signal }) MUST resolve to a STRING - not an MCP
 *   {content:[{type:'text'}]} envelope. That is the server-side MCP shape.
 *
 * DESIGN RULE - read before adding a tool:
 * POST /api/score calls the Anthropic API on OUR key. Every tool call spends
 * real money. The endpoint rate-limits to 10 requests/minute/IP server-side and
 * this tool deliberately routes through it rather than around it, so an agent
 * cannot outrun the limit. Say so in the description too: an agent told the cost
 * is bounded will batch its thinking instead of brute-forcing variations.
 * Do NOT add a tool that scores a list of titles in one call - that multiplies
 * spend per request while looking like a single call to the rate limiter.
 */
(function () {
  'use strict';

  // --- origin trial ----------------------------------------------------------
  // The registered token is THIRD-PARTY (isThirdParty:true). Chrome requires
  // third-party tokens to be delivered from an external JavaScript file via a
  // <script> element - "Third-party tokens don't work in a meta tag, inline
  // script or HTTP header" - so injecting it here is the only valid path.
  // https://developer.chrome.com/docs/web-platform/third-party-origin-trials
  //
  // Injected BEFORE the API is probed: the feature only appears once a valid
  // token is registered, so probing first would always miss.
  // Expires 2026-11-17 (trial runs Chrome 149-156).
  var OT_TOKEN = 'A4YoPUWXnCn9Uo5woFnPCk1+w2/vFbkar/1RFdm/PQXoKh/MMyauq1oGQUB5bE7LrNZZOYeC4KIYAZfIhOe5kQsAAAB4eyJvcmlnaW4iOiJodHRwczovL2dldHRpdGxlc2NvcmUuY29tOjQ0MyIsImZlYXR1cmUiOiJXZWJNQ1AiLCJleHBpcnkiOjE3OTQ4NzM2MDAsImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9';

  try {
    var otMeta = document.createElement('meta');
    otMeta.httpEquiv = 'origin-trial';
    otMeta.content = OT_TOKEN;
    (document.head || document.documentElement).appendChild(otMeta);
  } catch (e) {
    console.warn('[webmcp] origin-trial token injection failed:', e);
  }

  var mc = (typeof document !== 'undefined' && document.modelContext) ||
           (typeof navigator !== 'undefined' && navigator.modelContext) ||
           null;

  var hasApi = !!(mc && typeof mc.registerTool === 'function');

  // Mirrors the server's own caps in functions/api/score.js.
  var MAX_TITLE_LENGTH = 200;
  var MAX_NICHE_LENGTH = 100;

  async function scoreTitle(args) {
    args = args || {};
    var title = String(args.title || '').trim();
    var niche = args.niche ? String(args.niche).trim() : '';

    if (!title) return 'title is required.';
    if (title.length > MAX_TITLE_LENGTH) {
      return 'title is too long (' + title.length + ' chars, max ' + MAX_TITLE_LENGTH + ').';
    }
    if (niche.length > MAX_NICHE_LENGTH) {
      return 'niche is too long (' + niche.length + ' chars, max ' + MAX_NICHE_LENGTH + ').';
    }

    var res;
    try {
      res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(niche ? { title: title, niche: niche } : { title: title })
      });
    } catch (e) {
      return 'Could not reach the scorer: ' + e.message;
    }

    // The server limits to 10/min/IP. Surface that plainly so the agent waits
    // instead of hammering - retries here cost real API spend.
    if (res.status === 429) {
      return 'Rate limit reached on gettitlescore.com (10 scores per minute). ' +
             'Wait a minute before scoring another title - do not retry immediately.';
    }
    if (!res.ok) {
      var msg = null;
      try { msg = (await res.json()).error; } catch (e) { /* non-JSON body */ }
      return 'Scoring failed: ' + (msg || ('HTTP ' + res.status));
    }

    var data = await res.json();
    var s = data && data.score;
    if (!s) return 'Scoring returned no result. Do not retry - report this to the visitor.';

    return JSON.stringify({
      title: title,
      niche: niche || undefined,
      total_score: s.total_score,
      grade: s.grade,
      breakdown: {
        curiosity: s.curiosity,
        emotion: s.emotion,
        clarity: s.clarity,
        search_browse: s.search_browse,
        packaging: s.packaging
      },
      note: 'Scored by gettitlescore.com. Each call costs the site money and is ' +
            'limited to 10/minute - score deliberately, not exhaustively.'
    }, null, 2);
  }

  var PUBLIC_TOOLS = [
    {
      name: 'score_youtube_title',
      description:
        'Score a YouTube video title for click-through potential using gettitlescore.com. ' +
        'Returns a 0-100 score, a letter grade, and a breakdown across curiosity, emotion, ' +
        'clarity, search/browse fit and packaging. Limited to 10 calls per minute - each ' +
        'call runs a real model, so pick candidate titles thoughtfully rather than ' +
        'brute-forcing variations.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'The YouTube title to score. Max ' + MAX_TITLE_LENGTH + ' characters.' },
          niche: { type: 'string', description: 'Optional channel niche for context, e.g. "personal finance". Max ' + MAX_NICHE_LENGTH + ' characters.' }
        },
        required: ['title']
      },
      execute: scoreTitle
    }
  ];

  var registered = [];

  async function register(tool) {
    try {
      await mc.registerTool(tool);
      registered.push(tool.name);
    } catch (e) {
      console.warn('[webmcp] failed to register ' + tool.name + ':', e);
    }
  }

  /**
   * Always exposed so "is the trial live?" is answerable from the console.
   * call() returns exactly what execute() returns - no unwrapping, or this
   * harness would diverge from what the browser actually receives.
   */
  window.__webmcp = {
    apiAvailable: hasApi,
    apiSurface: hasApi ? (document.modelContext ? 'document.modelContext' : 'navigator.modelContext') : null,
    registered: registered,
    tools: PUBLIC_TOOLS.map(function (t) { return t.name; }),
    call: async function (name, args) {
      var tool = PUBLIC_TOOLS.filter(function (t) { return t.name === name; })[0];
      if (!tool) throw new Error('No such tool: ' + name);
      return tool.execute(args || {});
    }
  };

  (async function boot() {
    if (!hasApi) {
      console.info('[webmcp] document.modelContext unavailable - site works normally. ' +
                   'Tools still callable for tests via window.__webmcp.call().');
      return;
    }
    for (var i = 0; i < PUBLIC_TOOLS.length; i++) await register(PUBLIC_TOOLS[i]);
    console.info('[webmcp] registered ' + registered.length + ' tools: ' + registered.join(', '));
  })();
})();
