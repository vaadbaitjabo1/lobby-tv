# Lobby TV — מצב הפרויקט

## מה זה
מסך לובי לבניין ז׳בוטינסקי 1, אזור (76 דיירים). מוצג על 2 טלוויזיות חכמות.
`npm run dev` → http://localhost:517x/lobby-tv/
סימולציית שבת: `?sim=shabbat`

## Stack
React + Vite + Tailwind (ללא קלאסים — inline styles בלבד) + Supabase + GitHub Pages

## Layout (App.jsx)
```
┌─────────────────────────────────────┐
│  Gallery (right 50%) │ Info Panel   │
│                      │  (left 50%)  │
│                      │──────────────│
│                      │ [Header row] │
│                      │ IsraelFlag + │
│                      │ "ז׳בוטינסקי 1"│
│                      │ ClockDate +  │
│                      │ Weather      │
│                      │──────────────│
│                      │ FeaturedCard │ Announcements │
│                      │──────────────│
│                      │ ShabbatPanel/BusinessPromo │ QRBox │
├─────────────────────────────────────┤
│           NewsTicker (footer)        │
└─────────────────────────────────────┘
```
RTL: בגריד, הילד הראשון ב-DOM = ימין ויזואלית.

## קומפוננטות מרכזיות

| קובץ | תפקיד |
|------|--------|
| `src/components/FeaturedCard.jsx` | כרטיס מתחלף כל 8 שנ׳: ספורט/כלכלה/נולד היום. תמונה 145px + כותרת + תיאור + פס התקדמות |
| `src/components/Announcements.jsx` | הודעות לדיירים — כותרת ענבר, רקע שמנת |
| `src/components/ShabbatPanel.jsx` | שישי–שבת: נרות מהבהבים + זמנים + פרשה. כותרת טורקיז |
| `src/components/BusinessPromo.jsx` | ראשון–חמישי: מקום לעסקים. כותרת ירוק כהה |
| `src/components/QRBox.jsx` | עמודה ימנית 175px — QR לחברת הניהול. `MANAGEMENT_URL` בשורה 2 |
| `src/components/NewsTicker.jsx` | פס חדשות תחתון, גובה 4.5rem, פונט 1.3rem |
| `src/components/Gallery.jsx` | גלריה/וידאו, רקע #000 |
| `src/components/ClockDate.jsx` | שעה HH:MM (ללא שניות), תאריך. prop: `compact dark` |
| `src/components/Weather.jsx` | מזג אוויר, עיר: Azor. prop: `compact dark` |
| `src/components/IsraelFlag.jsx` | דגל, prop: `compact` |

## Hooks מרכזיים

### `useFeaturedContent.js`
מביא 3 מקורות במקביל ומערבב:
- **ספורט**: YNET `StoryRss3.xml` → rss2json
- **כלכלה**: YNET `StoryRss6.xml` → rss2json
- **נולדו היום**: Wikipedia REST API ישירות (CORS פתוח)
  `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/MM/DD`
  → 3 אנשים, פילטר: חייב `thumbnail.source` + `extract`
  → תיאור: 2 משפטים ראשונים מ-`extract` + `(נולד ב-YYYY)` בעברית

**חשוב**: `allorigins.win` השתמשנו בו בעבר כפרוקסי ל-Wikipedia — **לא עובד** (מחזיר HTML). Wikipedia REST API תומך CORS ישירות.

### `useShabbat.js`
- HebCal API: קו רוחב/אורך של אזור
- `show = true` ביום שישי/שבת, או `?sim=shabbat`
- לאחר קבלת שם הפרשה → שולף מוויקיפדיה עברית:
  `https://he.wikipedia.org/api/rest_v1/page/summary/פרשת_{name}`
  לפרשות כפולות (בהר בחקתי) → ניסיון עם שם ראשון בלבד אם 404
- מחזיר: `{ show, data: { candles, havdalah, parasha, parashaEn, memo, parashaDesc } }`

### `useNewsTicker.js`
- rss2json ראשון → fallback: allorigins + XML parse ידני
- YNET `StoryRss2.xml`
- מפריד: ` ` × 14 (רווח לא-שובר, לא מתמוטט ב-CSS)

## APIs שנבדקו

| API | סטטוס | הערות |
|-----|--------|--------|
| rss2json + YNET | ✅ | StoryRss3=ספורט, StoryRss6=כלכלה |
| Sport5 RSS | ❌ | חסום ב-rss2json |
| Globes RSS | ❌ | חסום ב-rss2json |
| Wikipedia EN onthisday | ✅ | CORS פתוח, ישירות |
| Wikipedia HE summary | ✅ | CORS פתוח, ישירות |
| allorigins.win | ⚠️ | לפעמים מחזיר HTML — לא לסמוך עליו |
| HebCal shabbat | ✅ | מחזיר שם פרשה עם מקף עברי U+05BE |
| qrserver.com | ✅ | QR code image |

## בעיות שנפתרו

**מקף עברי בפרשה**: HebCal מחזיר `"פרשת בהר־בחקתי"` עם U+05BE (MAQAF). פונקציית `normalizeParasha` ב-ShabbatPanel: מחליפה מקף ברווח *לפני* הסרת ניקוד (כי 0x05BE בטווח הניקוד).

**תמונות YNET ספורט**: `thumbnail` ריק ב-rss2json. תמונות מוטמעות ב-`content` HTML. `extractImage()` מחלץ עם regex על שדה `content`.

**רווחים בטיקר**: רווח רגיל מתמוטט ב-CSS. פתרון: ` ` (non-breaking space).

## מה נשאר / TODO
- [ ] `QRBox.jsx` שורה 2: `MANAGEMENT_URL` — לעדכן ל-URL האמיתי של חברת הניהול
- [ ] Gallery — עדיין placeholder, צריך Supabase + מחזור תמונות/וידאו
- [ ] Announcements — חיבור ל-Supabase (טבלת `announcements`)
- [ ] BusinessPromo — תוכן אמיתי (עסקים מהטבלה)
- [ ] Admin panel `/admin`
- [ ] GitHub Pages deploy
