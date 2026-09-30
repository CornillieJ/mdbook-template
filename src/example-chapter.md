# HTTP Caching in 20 Minutes

<div class="level-tabs" data-levels>
  <button data-level="overview" aria-pressed="true">Overview</button>
  <button data-level="deep" data-short="Deep">Deep Understanding</button>
  <button data-level="drill">Drilling</button>
</div>

<div class="level overview">

Every fast website leans on HTTP caching: the browser, a CDN, or a proxy
keeps a copy of a response and reuses it instead of asking the server
again. It is controlled almost entirely by **one response header**,
`Cache-Control`, plus a validator (`ETag` or `Last-Modified`) that lets a
cache ask "has this changed?" cheaply.

**After this chapter you can:**

- read a `Cache-Control` header and say who may cache the response, and for how long;
- explain the difference between *fresh*, *stale* and *revalidated*;
- pick sensible headers for an HTML page versus a fingerprinted asset.

The two policies most sites need, side by side:

<div class="code-compare" data-code-compare data-labels="index.html|app.3f9a1c.js" data-subs="check every time|keep for a year">

```http
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: no-cache
ETag: "5d8c72a1"
```

```http
HTTP/1.1 200 OK
Content-Type: text/javascript
Cache-Control: public, max-age=31536000, immutable
ETag: "3f9a1c"
```

</div>

The HTML page may be stored, but the browser must check with the server
before reusing it, so a deploy shows up immediately. The script's file
name contains a hash of its content: a new version gets a new name, so the
old one can safely be cached for a year.

<div class="callout note">
<div class="callout-label">Using this chapter</div>

Pick a level with the tabs at the top (or press <kbd>1</kbd>, <kbd>2</kbd>,
<kbd>3</kbd>). **Deep Understanding** explains the mechanics, **Drilling**
is where the quiz, flashcards and hands-on tasks live.

</div>

</div>

<div class="level deep">

### Fresh, stale, revalidated

A cached response is **fresh** while its age is below its freshness
lifetime, usually `max-age` seconds. A fresh response is reused without
contacting the server at all. Once it is **stale**, the cache does not
throw it away: it *revalidates*, sending a conditional request with the
validator it has.

<div class="table-wrap">

| Validator from the response | Conditional request header | "Unchanged" answer |
|---|---|---|
| `ETag: "abc"` | `If-None-Match: "abc"` | `304 Not Modified`, no body |
| `Last-Modified: <date>` | `If-Modified-Since: <date>` | `304 Not Modified`, no body |

</div>

A `304` saves the bytes of the body, but still costs a round trip. Only
freshness (`max-age`) saves the round trip too.

### The directives that matter

<div class="table-wrap">

| Directive | Meaning |
|---|---|
| `max-age=N` | Fresh for N seconds after the response was generated |
| `s-maxage=N` | Like `max-age`, but only for shared caches (CDNs, proxies); overrides `max-age` there |
| `no-cache` | May be stored, but must be revalidated before **every** reuse |
| `no-store` | Must not be stored anywhere |
| `private` | Only the user's browser may store it, not a shared cache |
| `public` | Shared caches may store it, even when they normally would not (e.g. a request with `Authorization`) |
| `immutable` | Will not change while fresh: browsers that support it skip revalidation even when the user reloads |
| `stale-while-revalidate=N` | For N seconds after going stale, serve the stale copy and revalidate in the background |

</div>

<div class="callout danger">
<div class="callout-label">The classic mix-up</div>

`no-cache` does **not** mean "don't cache". It means "don't reuse without
checking". To keep a response out of every cache (a bank statement, say),
use `no-store`.

</div>

### Where the copies live

Follow a request for `/app.js` through the caches between the browser and
your server. Click a layer, or trace a request:

<div class="layer-explorer" data-layer-explorer data-entry="Browser requests `/app.js`" data-trace-label="Trace a request" data-return="The response travels back out. Each cache on the way stores a copy if `Cache-Control` allows it: `private` stops at the browser, `no-store` is stored nowhere.">
<div class="layer" data-name="Browser cache" data-tag="private cache" data-trace="Fresh copy here? Use it, no network at all. Stale? Send `If-None-Match` onwards.">
<p>Belongs to one user. May store <code>private</code> responses. <code>max-age</code> applies here.</p>
<p>DevTools shows hits as <em>(disk cache)</em> or <em>(memory cache)</em>.</p>
</div>
<div class="layer" data-name="CDN / proxy" data-tag="shared cache" data-trace="A shared cache near the user. Honours `s-maxage` before `max-age`; never stores `private`.">
<p>Shared by many users, so it must never store a <code>private</code> response.</p>
<p><code>s-maxage</code> lets you cache longer here than in browsers, because you can purge a CDN but not your users' browsers.</p>
</div>
<div class="layer" data-name="Origin server" data-tag="source of truth" data-trace="Builds the response, or answers `304 Not Modified` if the `ETag` still matches.">
<p>Sets <code>Cache-Control</code> and a validator (<code>ETag</code> or <code>Last-Modified</code>).</p>
<p>A cheap <code>304</code> here is the payoff for sending validators.</p>
</div>
</div>

### Busting the cache on deploy

You cannot recall a response that is already cached in someone's
browser. So instead of expiring old files, give new content a **new URL**:
build tools put a content hash in asset file names (`app.3f9a1c.js`).
The HTML that references them is `no-cache`, so the browser always learns
the new names immediately.

Setting that up in two common servers:

<div class="code-compare" data-code-compare>

```javascript
// Express: long-lived assets, always-revalidated HTML
app.use('/assets', express.static('dist/assets', {
  maxAge: '1y',
  immutable: true,
}));
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.sendFile('index.html', { root: 'dist' });
});
```

```nginx
# nginx: the same policy
location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
location = /index.html {
    add_header Cache-Control "no-cache";
}
```

</div>

### Two headers worth knowing

- `Vary: Accept-Encoding` tells caches the response depends on that
  request header, so a gzip copy is never served to a client that asked
  for Brotli (or none).
- `Age: 120` on a response means a shared cache has held it for 120
  seconds. Seeing it is a quick way to confirm a CDN hit.

</div>

<div class="level drill">

### Tasks

<ul class="checklist">
<li><label><input type="checkbox"><span>Open your browser's DevTools, <strong>Network</strong> tab, and load any site twice. Find a request answered from cache and one answered <code>304</code>.</span></label></li>
<li><label><input type="checkbox"><span>Run <code>curl -I https://&lt;a site you use&gt;/</code> and read its <code>Cache-Control</code>. Who may cache it, and for how long?</span></label></li>
<li><label><input type="checkbox"><span>Copy the <code>ETag</code> from that response and send it back: <code>curl -I -H 'If-None-Match: "&lt;etag&gt;"' https://&lt;same URL&gt;</code>. Did you get a <code>304</code>?</span></label></li>
<li><label><input type="checkbox"><span>Tick <strong>Disable cache</strong> in DevTools and reload. Compare the transferred size with the previous load.</span></label></li>
</ul>

### Quiz

<div class="quiz" data-quiz>
<p class="quiz-q">Which directive lets a cache <em>store</em> a response but forces it to check with the server before every reuse?</p>
<ol class="quiz-options">
<li><code>no-store</code></li>
<li data-correct><code>no-cache</code></li>
<li><code>private</code></li>
<li><code>max-age=0, immutable</code></li>
</ol>
<p class="quiz-explain"><code>no-cache</code> means "revalidate before use". <code>no-store</code> forbids storing at all, and <code>private</code> only limits <em>who</em> may store it.</p>
</div>

<div class="quiz" data-quiz>
<p class="quiz-q">A stale cached response carries <code>ETag: "abc"</code>. What does the browser send, and what comes back if nothing changed?</p>
<ol class="quiz-options">
<li><code>If-Modified-Since: "abc"</code>, then <code>200 OK</code> with the full body</li>
<li data-correct><code>If-None-Match: "abc"</code>, then <code>304 Not Modified</code> with no body</li>
<li><code>If-Match: "abc"</code>, then <code>204 No Content</code></li>
<li>Nothing: a response with an <code>ETag</code> never goes stale</li>
</ol>
<p class="quiz-explain"><code>ETag</code> pairs with <code>If-None-Match</code>; <code>Last-Modified</code> pairs with <code>If-Modified-Since</code>. A <code>304</code> has no body, so the cache reuses its stored copy.</p>
</div>

<div class="quiz" data-quiz>
<p class="quiz-q">Which header suits a fingerprinted file like <code>app.3f9a1c.js</code>?</p>
<ol class="quiz-options">
<li><code>Cache-Control: no-cache</code></li>
<li><code>Cache-Control: no-store</code></li>
<li data-correct><code>Cache-Control: public, max-age=31536000, immutable</code></li>
<li><code>Cache-Control: private, max-age=60</code></li>
</ol>
<p class="quiz-explain">The name changes whenever the content does, so any given URL never changes: cache it for a year and skip revalidation with <code>immutable</code>.</p>
</div>

<div class="quiz" data-quiz>
<p class="quiz-q">A response says <code>Cache-Control: private, max-age=600</code>. Who may reuse it without asking the server?</p>
<ol class="quiz-options">
<li>The CDN, for 10 minutes</li>
<li data-correct>Only the user's browser, for 10 minutes</li>
<li>Nobody: <code>private</code> disables caching</li>
<li>The browser and the CDN, for 600 minutes</li>
</ol>
<p class="quiz-explain"><code>private</code> excludes shared caches such as CDNs and proxies; <code>max-age</code> is in seconds, so 600 is 10 minutes.</p>
</div>

### Flashcards

<div class="flashcards" data-flashcards data-front-label="Header / directive" data-back-label="What it means">
<div class="card"><div class="front"><code>max-age=3600</code></div><div class="back">Fresh for one hour; reused with no request at all</div></div>
<div class="card"><div class="front"><code>no-cache</code></div><div class="back">Store it, but revalidate before every reuse</div></div>
<div class="card"><div class="front"><code>no-store</code></div><div class="back">Never store it, in any cache</div></div>
<div class="card"><div class="front"><code>private</code></div><div class="back">Browser only; shared caches (CDN, proxy) must not store it</div></div>
<div class="card"><div class="front"><code>s-maxage</code></div><div class="back">Freshness for shared caches only; overrides <code>max-age</code> there</div></div>
<div class="card"><div class="front"><code>immutable</code></div><div class="back">Won't change while fresh: skip revalidation even on reload</div></div>
<div class="card"><div class="front"><code>304 Not Modified</code></div><div class="back">"Your copy is still good": no body, saves bytes but not the round trip</div></div>
</div>

### Self-checks

<details class="qa">
<summary>Self-check: what is the difference between <code>no-cache</code> and <code>no-store</code>?</summary>
<div class="ans">
<code>no-cache</code> allows storing but requires revalidation before each
reuse, so you still get cheap <code>304</code>s. <code>no-store</code>
forbids keeping a copy at all: every request downloads the full
response. Use it for sensitive data, not for "always fresh".
<div class="mark"><button type="button">Mark as known</button></div>
</div>
</details>

<details class="qa">
<summary>Self-check: why can <code>app.3f9a1c.js</code> be cached for a year, but <code>index.html</code> cannot?</summary>
<div class="ans">
The hash in the file name changes whenever the content changes, so the
URL <code>app.3f9a1c.js</code> always means exactly the same bytes.
<code>index.html</code> keeps its URL across deploys; if it were cached
for a year, readers would keep loading old HTML pointing at old assets.
<div class="mark"><button type="button">Mark as known</button></div>
</div>
</details>

<details class="qa">
<summary>Self-check: what does a <code>304</code> save, and what does it not?</summary>
<div class="ans">
It saves transferring the body. It does not save the round trip: the
browser still had to ask. Only a fresh response (within
<code>max-age</code>) avoids the request entirely.
<div class="mark"><button type="button">Mark as known</button></div>
</div>
</details>

<button type="button" data-mark-done>Mark this chapter done</button>

</div>
