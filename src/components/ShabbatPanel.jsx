import { useShabbat } from '../hooks/useShabbat'

const PARASHA_DESC = {
  'בראשית':       'בריאת העולם בששה ימים ומנוחת השבת. גן עדן, חטא אדם וחוה, גירוש מגן עדן, קין והבל.',
  'נח':            'נח איש צדיק בונה תיבה. המבול ארבעים יום. קשת בענן — ברית עם האנושות לדורות.',
  'לך לך':        'אברהם יוצא מחרן לכנען. ברית בין הבתרים, הבטחת הארץ לזרעו, לידת ישמעאל.',
  'וירא':          'שלושה מלאכים אצל אברהם. הבשורה על לידת יצחק, הפיכת סדום, עקדת יצחק.',
  'חיי שרה':      'פטירת שרה וקבורתה במערת המכפלה. שידוך רבקה ליצחק על ידי עבד אברהם.',
  'תולדות':       'לידת עשו ויעקב. מכירת הבכורה. יצחק מברך את יעקב במקום עשו.',
  'ויצא':          'יעקב חולם על סולם שמימה. שנות עבודתו אצל לבן, נישואיו לרחל ולאה.',
  'וישלח':        'יעקב מאבק עם המלאך ושמו משתנה לישראל. פגישת האחים המפוייסת.',
  'וישב':          'יוסף נמכר לישמעאלים. בכותנת הפסים. יהודה ותמר. יוסף בבית פוטיפר.',
  'מקץ':           'יוסף פותר חלומות פרעה — שבע שנות שובע ושבע רעב. עולה למשנה לפרעה.',
  'ויגש':          'יהודה מתעמת עם יוסף למען בנימין. יוסף מתגלה לאחיו. יעקב יורד למצרים.',
  'ויחי':          'יעקב מברך את שנים עשר שבטי ישראל. מצווה להיקבר במערת המכפלה ונפטר.',
  'שמות':          'לידת משה ושמירתו בין הסוף. הסנה הבוער. שליחת משה להוציא את ישראל ממצרים.',
  'וארא':          'שבע מכות ראשונות — דם, צפרדע, כינים, ערוב, דבר, שחין, ברד. פרעה מסרב.',
  'בא':            'מכות ארבה, חושך ומכת בכורות. ציווי על קורבן פסח וקידוש החודש.',
  'בשלח':         'יציאת ישראל ממצרים. קריעת ים סוף ושירת הים. המן, השליו ומי מרה.',
  'יתרו':          'יתרו מגיע אל משה. מינוי שרי אלפים ומאות. מעמד הר סיני ועשרת הדיברות.',
  'משפטים':       'מגוון חוקים — עבד עברי, נזיקין, שמיטה. "נעשה ונשמע" — קבלת התורה.',
  'תרומה':        'ציווי על בניית המשכן. הארון, השולחן, המנורה — כלי הקודש.',
  'תצוה':         'בגדי הכהונה לאהרן ובניו. מילוי ידי הכהנים. קטורת ועולת התמיד.',
  'כי תשא':       'מחצית השקל. חטא העגל הזהב. שבירת הלוחות ועשיית הלוחות השניות.',
  'ויקהל':        'משה מקהיל את ישראל לבניית המשכן בידי בצלאל ואהליאב ונדיבי הלב.',
  'פקודי':        'חשבון חומרי המשכן. הקמתו ביום ראשון בניסן — עמוד הענן שורה עליו.',
  'ויקהל פקודי':  'בניית המשכן על פרטיו, חשבון החומרים והקמתו — ועמוד הענן שכן עליו.',
  'ויקרא':        'קרבנות עולה, מנחה, שלמים, חטאת ואשם — כיצד מביאים קורבן לה׳.',
  'צו':            'ציווי לכוהנים על הקרבת הקרבנות, אש המזבח ואיסורי חלב ודם.',
  'שמיני':        'חנוכת המשכן ביום שמיני. מות נדב ואביהוא. חוקי כשרות מזון.',
  'תזריע':       'טהרת האישה לאחר לידה. דיני נגעי הצרעת ובדיקת הכהן.',
  'מצורע':       'טהרת המצורע בשמן ובדם. נגעי בגדים ובתים. טבילה וטהרה.',
  'תזריע מצורע': 'דיני צרעת — אדם, בגד ובית — ותהליך הטהרה מהנגע.',
  'אחרי מות':   'עבודת יום הכיפורים — הכהן הגדול בקודש הקודשים. איסורי עריות.',
  'קדושים':      '"קדושים תהיו" — מצוות בין אדם לחברו. ואהבת לרעך כמוך.',
  'אחרי מות קדושים': 'עבודת יום הכיפורים, איסורי עריות ומצוות קדושה בחיי היום-יום.',
  'אמור':         'קדושת הכוהנים. מועדי ה׳ — שבת, פסח, שבועות, ראש השנה, יום כיפור, סוכות.',
  'בהר':          'שנת השמיטה — שנה שביעית מנוחה לאדמה. שנת היובל חמישים שנה. גאולת קרקעות.',
  'בחקתי':       '"אם בחוקותי תלכו" — ברכות לשומרי התורה ותוכחה קשה לעוברים עליה.',
  'בהר בחקתי':   'שמיטה ויובל וגאולת קרקעות — ולאחריהם הברכה הגדולה והתוכחה.',
  'במדבר':       'מניין בני ישראל לשבטיהם. סדר המחנה — דגלי המחנות סביב המשכן.',
  'נשא':          'משא הלוויים. סוטה ונזיר. ברכת כהנים: "יברכך ה׳ וישמרך". חנוכת המזבח.',
  'בהעלתך':     'הדלקת המנורה. חגיגת פסח שני. תלונת העם על המן. מרים ואהרן מדברים במשה.',
  'שלח':          'שנים עשר המרגלים. דו"ח המרגלים ועונש המדבר — ארבעים שנה. מצוות ציצית.',
  'קרח':          'מרד קורח ועדתו נגד משה ואהרן. הארץ פוצה פיה. מטה אהרן הפורח.',
  'חקת':          'פרה אדומה ומי נידה. מות מרים. מי מריבה. נחש הנחושת.',
  'בלק':          'בלק מלך מואב שוכר את בלעם לקלל את ישראל — ובלעם מברך שלוש פעמים.',
  'פינחס':       'פינחס עוצר המגפה. מניין שני. בנות צלפחד. יהושע ממשיך את משה.',
  'מטות':        'דיני נדרים. מלחמת מידין. חלוקת עבר הירדן לשבטי גד וראובן.',
  'מסעי':        'ארבעים ושניים מסעות ישראל במדבר. גבולות הארץ. ערי מקלט.',
  'מטות מסעי':  'נדרים, מלחמת מידין, חלוקת עבר הירדן ומסעות בני ישראל.',
  'דברים':       'משה מסכם את ארבעים שנות המדבר לפני כניסה לארץ.',
  'ואתחנן':      'משה מתחנן להיכנס לארץ ונדחה. שמע ישראל. עשרת הדיברות שנית.',
  'עקב':          'שכר שמירת המצוות. ארץ שבעת המינים. "לא על הלחם לבדו יחיה האדם".',
  'ראה':          '"ראה אנוכי נותן לפניכם ברכה וקללה." מקום המקדש. הרגלים.',
  'שופטים':     'מינוי שופטים: "צדק צדק תרדוף." מלך, כוהנים, נביאות, ערי מקלט.',
  'כי תצא':     'שבעים ושתיים מצוות חברתיות, משפחתיות וצבאיות. שילוח הקן.',
  'כי תבוא':    'ביכורים וקריאתם. וידוי מעשר. ברכה וקללה בהר גריזים ועיבל.',
  'נצבים':       'כל ישראל ניצבים לפני ה׳ לחידוש הברית. "בחרת בחיים."',
  'וילך':         'משה מסיים מנהיגותו. יהושע מוסמך. מצוות הקהל.',
  'נצבים וילך': 'חידוש הברית עם ה׳ לדורות ופרידת משה מהעם.',
  'האזינו':      'שירת האזינו — עדות לדורות. משה עולה להר נבו לפני מותו.',
  'וזאת הברכה': 'ברכת משה לשנים עשר השבטים. משה עולה על הר נבו ורואה את הארץ ונפטר.',
}

// U+05BE = מקף עברי (maqaf). מנקה ניקוד, מקף עברי ו"פרשת"
function normalizeParasha(s) {
  return (s ?? '')
    .replace(/־/g, ' ')           // מקף עברי → רווח
    .replace(/[֑-ֽֿ-ׇ]/g, '')  // ניקוד
    .replace(/^פרשת\s+/u, '')          // הסרת קידומת
    .replace(/\s+/g, ' ')
    .trim()
}

function getDesc(parasha) {
  const key = normalizeParasha(parasha)
  return PARASHA_DESC[key]
    ?? PARASHA_DESC[key.replace(/\s.*/, '').trim()]  // רק מילה ראשונה (בהר מתוך "בהר בחקתי")
    ?? null
}

function Candle() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: '24px', height: '48px',
        background: 'radial-gradient(ellipse at 50% 85%, #fff 0%, #fde68a 35%, #f97316 70%, rgba(249,115,22,0) 100%)',
        borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
        animation: 'flicker 2s ease-in-out infinite',
        filter: 'drop-shadow(0 0 12px #fbbf24) drop-shadow(0 0 24px #f97316)',
        transformOrigin: 'bottom center',
      }} />
      <div style={{
        width: '26px', height: '90px',
        background: 'linear-gradient(to left, #e2e8f0 0%, #fff 50%, #f1f5f9 100%)',
        borderRadius: '3px',
        boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.07)',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '8px', background: '#78716c', borderRadius: '1px' }} />
      </div>
      <div style={{ width: '34px', height: '8px', background: 'linear-gradient(to left, #cbd5e1, #f8fafc, #cbd5e1)', borderRadius: '0 0 4px 4px' }} />
      <style>{`
        @keyframes flicker {
          0%,100% { transform: scaleX(1) scaleY(1) rotate(-1deg); }
          20%      { transform: scaleX(0.88) scaleY(1.07) rotate(1.5deg); }
          40%      { transform: scaleX(1.07) scaleY(0.93) rotate(-2deg); }
          60%      { transform: scaleX(0.92) scaleY(1.05) rotate(1deg); }
          80%      { transform: scaleX(1.05) scaleY(0.97) rotate(-0.5deg); }
        }
      `}</style>
    </div>
  )
}

export default function ShabbatPanel() {
  const { data } = useShabbat()
  const parshaName = normalizeParasha(data?.parasha)
  const desc = data?.parashaDesc ?? getDesc(data?.parasha)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', height: '100%', overflow: 'hidden' }}>
      {/* כותרת — תכלת/טורקיז */}
      <div style={{
        background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
        padding: '0.55rem 1.1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>שבת שלום</span>
        <span style={{ fontSize: '1.2rem' }}>✡️</span>
      </div>

      {/* גוף — אנכי: זמנים למעלה, פרשה למטה */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

        {/* חלק עליון — נרות + זמנים (50% מגובה הפאנל) */}
        <div style={{
          background: 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%)',
          flex: '0 0 50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '1.5rem', padding: '1rem 1.4rem',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'flex-end', flexShrink: 0 }}>
            <Candle /><Candle />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#92400e' }}>שבת שלום ✨</div>
            {data ? (
              <>
                <TimeRow label="הדלקת נרות" value={data.candles} />
                <TimeRow label="צאת שבת"    value={data.havdalah} />
              </>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#92400e', opacity: 0.6 }}>טוען…</div>
            )}
          </div>
        </div>

        {/* חלק תחתון — פרשת השבוע */}
        <div style={{
          flex: 1, background: '#f0f9ff',
          padding: '0.8rem 1rem',
          display: 'flex', flexDirection: 'column', gap: '0.45rem',
          overflow: 'hidden',
        }}>
          <div style={{ fontSize: '0.7rem', color: '#0891b2', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            פרשת השבוע
          </div>
          {parshaName ? (
            <>
              {(() => {
                const len      = Math.min(desc?.length || 80, 160)
                const nameSize = Math.max(1.4, Math.min(1.9, 160 / Math.max(len, 50))) + 'rem'
                const descSize = Math.max(0.95, Math.min(1.2, 110 / Math.max(len, 50))) + 'rem'
                return (
                  <>
                    <div style={{ fontSize: nameSize, fontWeight: 800, color: '#0c4a6e', lineHeight: 1.25 }}>
                      {parshaName}
                    </div>
                    {desc ? (
                      <div style={{ fontSize: descSize, color: '#075985', lineHeight: 1.65, flex: 1, overflow: 'hidden' }}>
                        {desc}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>טוען פרטי פרשה…</div>
                    )}
                  </>
                )
              })()}
            </>
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>טוען…</div>
          )}
        </div>
      </div>
    </div>
  )
}

function TimeRow({ label, value }) {
  if (!value) return null
  const clean = value
    .replace(/Havdalah[^:]*:\s*/i, '')
    .replace(/Candle lighting:\s*/i, '')
    .trim()
  return (
    <div style={{
      background: 'rgba(255,255,255,0.75)', borderRadius: '0.4rem',
      padding: '0.28rem 0.55rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontSize: '1rem', color: '#78350f' }}>{label}</span>
      <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#92400e' }}>{clean}</span>
    </div>
  )
}
