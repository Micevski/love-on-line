# Love Is On The Line

Static website for the audio guest book business. Macedonian is the default (`index.html`); English is at `en.html`. No build step: open `index.html` or upload the folder to any static host (Netlify, GitHub Pages, Cloudflare Pages).

## Editing

Everything you normally change is in `config.js`.

**Contact details** – fill in `email`, `phone`, `whatsapp`, `viber`, `instagram`, `area`. Empty values are hidden.

**Gallery** – copy photos into `assets/gallery/`, then list them:

```js
gallery: [
  { src: "ana-marko.jpg",    caption: { mk: "Ана и Марко · Свадба", en: "Ana & Marko · Wedding" }, tall: true },
  { src: "cabin-garden.jpg", caption: { mk: "Кабина во градина", en: "Garden cabin setup" }, wide: true },
  { src: "birthday-40.jpg",  caption: "Elena 40" }
]
```

`tall` / `wide` make a tile span two rows / two columns. Until the list has at least one photo, the page shows "Photos coming soon" tiles. Resize photos to about 1600px on the long side before uploading so the page stays fast.

A caption (and `area`) can be one text for both languages or `{ mk: "...", en: "..." }`.

**Text** – Macedonian wording is in `index.html`, English in `en.html`. Change both when you edit a section. The few texts set by code (form messages, contact labels) are at the top of `script.js`.

## Files

- `index.html` – Macedonian page (default)
- `en.html` – English page
- `styles.css` – design (colours are variables at the top)
- `script.js` – menu, gallery, photo viewer, booking form
- `config.js` – contact details and gallery list
- `assets/logo.jpg` – logo
