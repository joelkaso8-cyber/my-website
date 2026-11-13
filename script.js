// Joel Kaso · departures board. EN/SQ, the scroll-driven split-flap board, Tirana clock,
// WhatsApp links, phone dock and copy-email. Copy and data live in content.js.
;(function () {
  'use strict'
  var S = window.SITE
  if (!S) return
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  var store = {
    get: function (k) { try { return localStorage.getItem(k) } catch (e) { return null } },
    set: function (k, v) { try { localStorage.setItem(k, v) } catch (e) {} }
  }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

  // ---------- Language ----------
  var urlLang = null
  try { urlLang = new URLSearchParams(location.search).get('lang') } catch (e) {}
  var lang = urlLang === 'sq' || urlLang === 'en' ? urlLang : (store.get('jk-lang') === 'sq' ? 'sq' : 'en')
  function t (k) { return (S.t[lang] && S.t[lang][k]) || S.t.en[k] || '' }

  function waHref () { return 'https://wa.me/' + S.wa + '?text=' + encodeURIComponent(t('wa.msg')) }

  function applyLang () {
    document.documentElement.lang = lang
    $$('[data-t]').forEach(function (el) { el.textContent = t(el.getAttribute('data-t')) })
    $$('[data-t-alt]').forEach(function (el) { el.alt = t(el.getAttribute('data-t-alt')) })
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)) })
    $$('[data-wa]').forEach(function (a) { a.href = waHref() })
    $$('[data-link]').forEach(function (a) {
      var base = S.links[a.getAttribute('data-link')]
      // The portfolio and PC Remote sites read ?lang=sq too.
      a.href = lang === 'sq' && /portfolio\/$|pcremote\/$/.test(base) ? base + '?lang=sq' : base
    })
    buildBoard()
  }

  // ---------- Split-flap board ----------
  // A real flap steps through its drum in order, so every letter travels from blank to its target.
  var DRUM = ' ABCDEFGHIJKLMNOPQRSTUVWXYZÇË0123456789·.-&:'
  var COLS = [['service', 14], ['to', 19], ['gate', 2], ['status', 15]]
  var cells = []   // { el, target, steps, start, span, shown }
  var progress = 0, introP = 0, lastShownP = -1

  function drumIndex (ch) { var i = DRUM.indexOf(ch); return i < 0 ? 0 : i }

  function makeCells (text, len, rowIndex, colOffset, host) {
    host.textContent = ''
    var padded = (text + ' '.repeat(len)).slice(0, len)
    for (var i = 0; i < len; i++) {
      var ch = padded[i]
      var c = document.createElement('span')
      c.className = 'f'
      var g = document.createElement('span')
      g.className = 'f__g'
      c.appendChild(g)
      host.appendChild(c)
      var k = colOffset + i
      cells.push({
        el: c, g: g, target: ch, steps: drumIndex(ch),
        // Row 1 settles during the load moment; rows 2 and 3 flip in as you scroll.
        start: [0, 0.3, 0.6][rowIndex] + k * 0.0026,
        span: rowIndex === 0 ? 0.16 : 0.2,
        shown: -1
      })
    }
  }

  function buildBoard () {
    var rowsHost = $('#board-rows')
    if (!rowsHost) return
    cells = []
    rowsHost.textContent = ''
    S.board[lang].forEach(function (row, r) {
      var rowEl = document.createElement('div')
      rowEl.className = 'board__row' + (row.live ? ' is-live' : '')
      rowEl.setAttribute('role', 'row')
      var offset = 0
      COLS.forEach(function (col) {
        var name = col[0], len = col[1]
        var cell = document.createElement('span')
        cell.className = 'col col--' + name
        cell.setAttribute('role', name === 'service' ? 'rowheader' : 'cell')
        var sr = document.createElement('span')
        sr.className = 'sr'
        sr.textContent = row[name].replace(/·/g, ', ')
        var fl = document.createElement('span')
        fl.className = 'flaps'
        fl.setAttribute('aria-hidden', 'true')
        cell.appendChild(sr); cell.appendChild(fl)
        makeCells(row[name], len, r, offset, fl)
        offset += len
        rowEl.appendChild(cell)
      })
      rowsHost.appendChild(rowEl)
    })
    lastShownP = -1
    render(true)
  }

  function render (force) {
    var p = reduce.matches ? 1 : progress
    if (!force && Math.abs(p - lastShownP) < 0.0005) return
    lastShownP = p
    for (var i = 0; i < cells.length; i++) {
      var c = cells[i]
      var q = Math.max(0, Math.min(1, (p - c.start) / c.span))
      var idx = Math.round(q * c.steps)
      if (idx !== c.shown) {
        var ch = idx >= c.steps ? c.target : DRUM[idx]
        c.g.textContent = ch === ' ' ? ' ' : ch
        if (c.shown !== -1 && !reduce.matches) {
          c.el.classList.remove('is-flip'); void c.el.offsetWidth; c.el.classList.add('is-flip')
        }
        c.shown = idx
        c.el.classList.toggle('is-set', idx >= c.steps && c.target !== ' ')
      }
    }
  }

  // Scroll drives the board: forward as you scroll down, backward as you scroll up.
  var REST = 0.32          // resting state at the top of the page: the first row has settled
  var hero = $('.hero')
  function holdDistance () {
    var cs = hero ? getComputedStyle(hero) : null
    var hold = cs ? parseFloat(cs.getPropertyValue('--hold')) : 0
    return hold > 0 ? hold : Math.min(560, window.innerHeight * 0.7)
  }
  function onScroll () {
    var s = Math.max(0, window.scrollY || 0)
    var scrollP = Math.min(1, s / holdDistance())
    progress = REST * introP + (1 - REST) * scrollP
    render(false)
  }
  var ticking = false
  window.addEventListener('scroll', function () {
    if (ticking) return
    ticking = true
    requestAnimationFrame(function () { ticking = false; onScroll() })
  }, { passive: true })
  window.addEventListener('resize', onScroll)

  // One authored moment on load: the board clatters to its resting state.
  function intro () {
    if (reduce.matches) { introP = 1; onScroll(); return }
    var t0 = null, dur = 1300
    function step (ts) {
      if (t0 === null) t0 = ts
      var x = Math.min(1, (ts - t0) / dur)
      introP = 1 - Math.pow(2, -10 * x)
      if (x >= 1) introP = 1
      onScroll()
      if (x < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  // ---------- Tirana clock ----------
  var clockCells = []
  function clockText () {
    var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Tirane', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date())
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value })
    return o.hour + ':' + o.minute
  }
  function buildClock () {
    var host = $('[data-clock]'); if (!host) return
    host.textContent = ''
    for (var i = 0; i < 5; i++) {
      var c = document.createElement('span'); c.className = 'f is-set'
      var g = document.createElement('span'); g.className = 'f__g'
      c.appendChild(g); host.appendChild(c); clockCells.push({ el: c, g: g, ch: '' })
    }
    tickClock()
    setInterval(tickClock, 15000)
  }
  function tickClock () {
    var txt = clockText()
    var sr = $('[data-clock-sr]'); if (sr) sr.textContent = txt
    clockCells.forEach(function (c, i) {
      if (c.ch === txt[i]) return
      c.g.textContent = txt[i]
      if (c.ch && !reduce.matches) { c.el.classList.remove('is-flip'); void c.el.offsetWidth; c.el.classList.add('is-flip') }
      c.ch = txt[i]
    })
  }

  // ---------- Controls ----------
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]')
    if (b) { lang = b.getAttribute('data-lang'); store.set('jk-lang', lang); applyLang(); return }
    if (e.target.closest('#copy-email')) {
      var btn = $('#copy-email')
      var done = function () { btn.textContent = t('contact.copied'); setTimeout(function () { btn.textContent = t('contact.copy') }, 1800) }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(S.email).then(done, function () {})
    }
  })

  // Phone dock: shows once the hero's WhatsApp button has left the screen, hides at the contact pass.
  var dock = $('.dock'), heroCta = $('#hero-cta'), contact = $('#contact')
  if (dock && 'IntersectionObserver' in window) {
    var seen = { cta: true, contact: false }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target === heroCta ? 'cta' : 'contact'] = en.isIntersecting })
      dock.classList.toggle('is-on', !seen.cta && !seen.contact)
    })
    heroCta && io.observe(heroCta); contact && io.observe(contact)
  }

  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()) })
  document.documentElement.classList.add('js')
  applyLang()
  buildClock()
  intro()
})()
