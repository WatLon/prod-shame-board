(async function() {
  const res = await fetch("data/shame.json");
  let entries = await res.json();
  entries.sort((a, b) => b.date.localeCompare(a.date));

  const board = document.getElementById("board");
  const counter = document.getElementById("counter");
  const search = document.getElementById("search");

  /* ── цвета для аватарок и авторов в диалогах ── */
  const palette = [
    "#e74c3c",
    "#8e44ad",
    "#2980b9",
    "#16a085",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#27ae60",
    "#e91e63",
    "#9c27b0",
    "#3f51b5",
    "#009688",
    "#ff5722",
    "#795548",
    "#0ea5e9",
    "#eab308",
  ];

  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = str.charCodeAt(i) + ((h << 5) - h);
    }
    return Math.abs(h);
  }

  function colorFor(name) {
    return palette[hash(name) % palette.length];
  }

  /* ── XSS ── */
  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function escNl(s) {
    return esc(s).replace(/\n/g, "<br>");
  }

  /* ── аватарка ── */
  function avatarHTML(telegram) {
    const clean = telegram.replace("@", "");
    const letter = clean[0].toUpperCase();
    const color = colorFor(clean);

    return `
            <div class="entry-avatar" style="background:${color}">
                <img src="avatars/${clean}.webp"
                     alt="" loading="lazy"
                     onerror="this.remove()">
                ${letter}
            </div>`;
  }

  /* ── юзернейм ── */
  function usernameHTML(telegram) {
    const clean = telegram.replace("@", "");
    return `
            <div class="entry-username">
                <a href="https://t.me/${esc(clean)}" target="_blank">${esc(telegram)}</a>
            </div>`;
  }

  /* ── рендер картинок сообщения ── */
  function renderMsgImages(image) {
    if (!image) return "";
    const urls = Array.isArray(image) ? image : [image];
    return `
            <div class="quote-msg-images">
                ${urls
        .map(
          (url) =>
            `<img src="${esc(url)}" alt="" loading="lazy"
                          onclick="window.open(this.src,'_blank')">`,
        )
        .join("")}
            </div>`;
  }

  /* ── рендер отдельного блока картинок (вне диалога) ── */
  function renderImages(images) {
    if (!images) return "";
    const list = Array.isArray(images) ? images : [images];
    return `
            <div class="entry-images">
                ${list
        .map(
          (url) =>
            `<img src="${esc(url)}" alt="" loading="lazy"
                          onclick="window.open(this.src,'_blank')">`,
        )
        .join("")}
            </div>`;
  }

  /* ── рендер цитаты (три формата) ── */
  function renderQuote(quote) {
    /* Формат 1: строка */
    if (typeof quote === "string") {
      return `<span class="quote-single">${escNl(quote)}</span>`;
    }

    /* Формат 2: массив строк — несколько сообщений одного человека */
    if (typeof quote[0] === "string") {
      return quote
        .map((line) => `<div class="quote-line">${escNl(line)}</div>`)
        .join("");
    }

    /* Формат 3: диалог — массив {from, text, image} */
    return quote
      .map((msg) => {
        const color = colorFor(msg.from);
        const authorHTML = `<span class="quote-msg-author" style="color:${color}">${esc(msg.from)}</span>`;
        const imagesHTML = renderMsgImages(msg.image);
        const textHTML = msg.text
          ? `<span class="quote-msg-text">${escNl(msg.text)}</span>`
          : "";

        return `
                <div class="quote-msg">
                    ${authorHTML}
                    ${imagesHTML}
                    ${textHTML}
                </div>`;
      })
      .join("");
  }

  /* ── поиск внутри цитаты ── */
  function quoteIncludes(quote, q) {
    if (typeof quote === "string") {
      return quote.toLowerCase().includes(q);
    }
    return quote.some((item) =>
      typeof item === "string"
        ? item.toLowerCase().includes(q)
        : (item.text || "").toLowerCase().includes(q) ||
        item.from.toLowerCase().includes(q),
    );
  }

  /* ── счётчик ── */
  function renderCounter(data) {
    const people = new Set(data.map((e) => e.telegram)).size;
    counter.innerHTML =
      data.length === 0
        ? ""
        : `<strong>${data.length}</strong> позорных записей · <strong>${people}</strong> уникальных авторов`;
  }

  /* ── карточки ── */
  function renderBoard(data) {
    if (data.length === 0) {
      board.innerHTML = `
                <div class="empty">
                    <div class="empty-icon">😇</div>
                    <p>Ничего не найдено.</p>
                </div>`;
      return;
    }

    board.innerHTML = data
      .map((entry, i) => {
        const descHTML = entry.description
          ? `<div class="entry-desc">${esc(entry.description)}</div>`
          : "";

        const imagesHTML = renderImages(entry.images);

        const evidenceHTML = entry.evidence
          ? `<a href="${esc(entry.evidence)}" target="_blank" class="entry-evidence">📎 пруф</a>`
          : "";

        return `
                <div class="entry" style="animation-delay:${i * 0.04}s">
                    <div class="entry-header">
                        ${avatarHTML(entry.telegram)}
                        ${usernameHTML(entry.telegram)}
                    </div>
                    ${descHTML}
                    ${imagesHTML}
                    <div class="entry-quote">${renderQuote(entry.quote)}</div>
                    <div class="entry-footer">
                        <span class="entry-date">${entry.date}</span>
                        ${evidenceHTML}
                    </div>
                </div>`;
      })
      .join("");
  }

  /* ── поиск ── */
  function apply() {
    const q = search.value.toLowerCase().trim();
    const filtered = q
      ? entries.filter(
        (e) =>
          e.telegram.toLowerCase().includes(q) ||
          (e.description || "").toLowerCase().includes(q) ||
          quoteIncludes(e.quote, q),
      )
      : entries;

    renderBoard(filtered);
    renderCounter(filtered);
  }

  search.addEventListener("input", apply);

  /* ── старт ── */
  apply();
})();
