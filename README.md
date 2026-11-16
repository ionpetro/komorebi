# Komorebi · Japanese through everyday life

A Japanese language and culture course in Ion Petropoulos’s Skepsis learning family. **Komorebi (木漏れ日)** is sunlight filtering through trees.

The interface deliberately retains the family’s narrow frame, Nunito typography, dimensional buttons, mascot bubble, lesson stones, Learn / Words / Me navigation, daily goal and full-screen practice. Indigo, paper, a fox companion and chapter stamps give it its own character.

## Open source, and the family

Komorebi is free and open source (MIT). **If it helps you, please [star the repo](https://github.com/ionpetro/komorebi)**: a star helps other people find it. Corrections and pull requests are welcome.

**Play:** [komorebi.tryskepsis.com](https://komorebi.tryskepsis.com)

Komorebi is one of nine free, open-source learning apps built the same way (short daily lessons and spaced review):

| | App | What it teaches | Links |
|:-:|---|---|---|
| <img src="https://tryskepsis.com/icon-192.png" width="40" height="40" alt="Skepsis logo"> | **Skepsis** | the Greek hiding in everyday English | [Play](https://tryskepsis.com) · [GitHub](https://github.com/ionpetro/skepsis) |
| <img src="https://carpe.tryskepsis.com/icon.svg" width="40" height="40" alt="Carpe logo"> | **Carpe** | Latin for Greece's national exams | [Play](https://carpe.tryskepsis.com) · [GitHub](https://github.com/ionpetro/carpe) |
| <img src="https://gnothi.tryskepsis.com/icon.svg" width="40" height="40" alt="Gnothi logo"> | **Gnothi** | Ancient Greek for Greece's national exams | [Play](https://gnothi.tryskepsis.com) · [GitHub](https://github.com/ionpetro/gnothi) |
| <img src="https://objection.tryskepsis.com/icon.svg" width="40" height="40" alt="Objection logo"> | **Objection** | prep for the US bar exam (MBE) | [Play](https://objection.tryskepsis.com) · [GitHub](https://github.com/ionpetro/objection) |
| <img src="https://agora.tryskepsis.com/icon.svg" width="40" height="40" alt="Agora logo"> | **Agora** | sales and negotiation, with ethics | [Play](https://agora.tryskepsis.com) · [GitHub](https://github.com/ionpetro/agora) |
| <img src="https://oikos.tryskepsis.com/icon.svg" width="40" height="40" alt="Oikos logo"> | **Oikos** | economics and incentives | [Play](https://oikos.tryskepsis.com) · [GitHub](https://github.com/ionpetro/oikos) |
| <img src="https://guanxi.tryskepsis.com/icon.svg" width="40" height="40" alt="Guanxi logo"> | **Guanxi** | Mandarin and local culture | [Play](https://guanxi.tryskepsis.com) · [GitHub](https://github.com/ionpetro/guanxi) |
| <img src="https://ethics.tryskepsis.com/icon.svg" width="40" height="40" alt="Everyday Ethics logo"> | **Everyday Ethics** | everyday choices and ethical judgment | [Play](https://ethics.tryskepsis.com) · [GitHub](https://github.com/ionpetro/everyday-ethics) |
| <img src="https://komorebi.tryskepsis.com/icon.svg" width="40" height="40" alt="Komorebi logo"> | **Komorebi** (this one) | Japanese through everyday life | [Play](https://komorebi.tryskepsis.com) · [GitHub](https://github.com/ionpetro/komorebi) |

## Course

- 12 units, 60 original lessons and 480 lesson items.
- 240 vocabulary entries, 60 sentence builds, 60 grammar cards, 60 culture cards and 60 lesson scenarios. Entries can recur in new contexts; this is not a distinct-word count.
- 24 separate held-out scenario questions. Repeat attempts are labeled practice and never enter ordinary spaced review.
- 60 original dialogues and speak-aloud field missions.
- A parallel kana garden: 46 basic hiragana and 46 basic katakana, plus voiced sounds and contracted combinations, 208 symbols/combinations in total. Short sound-length explanations and playback pairs accompany the practice.

The pathway moves through first connections, meals, getting around, shops, daily routines, home visits, friendship, work/study, seasons, regional discovery, disrupted plans and staying connected. All chapters can be explored immediately; the recommended path builds foundations in order.

Culture changes the learner’s decision inside each scene. It is also browsable in a culture journal. Sources are linked beside relevant content; original scene advice is labeled as such. Local instructions, individual preferences and the actual conversation take precedence over broad etiquette advice.

## Learning and rewards

Guess without penalty, study a short card, retrieve, type a reading, build a sentence and apply language in a new situation. Lessons divide into two sittings of four items. A missed question returns once at the end, without inflating first-attempt accuracy.

The learning engine retains the established family invariants:

- Review intervals: 1, 3, 7, 14, 30 and 60 days. Early correct practice never postpones a review; a miss returns tomorrow.
- XP, daily targets, ranks, badges and chapter stamps. Weekends do not break streaks, and freezes protect missed weekdays. No hearts or lost lives.
- Daily drill, due review, Lantern sprint, listening, matching, sorting and a mistakes notebook.
- Kana progress and scheduling are separate from word/lesson progress.
- Japanese text, kana readings and optional romaji. Typing accepts displayed macrons and supported keyboard variants while retaining meaningful vowel length.

## Audio, privacy and limits

Audio uses an available Japanese browser/device voice, including slow replay. It is not a native recording or pronunciation grader. No Japanese voice—or a playback error—leads to ungraded read-and-say practice. The app does not record the microphone.

Progress stays in this browser under `komorebi-progress-v2`; export/import in Me provides a portable backup. No account, external AI API or learning analytics is built in. Browser voice services may use their own network connections. Clearing site data removes local progress unless exported.

The course is informed by Japan Foundation Can-do teaching, not endorsed by it. Original exercises are not copied textbook activities. AI-assisted editorial reviews do not constitute professional native-speaker review, JLPT certification or a fluency guarantee. Travel services and venue policies should be confirmed when used.

## Build and verify

Requires Node.js and Python for the optional preview; no runtime dependency installation.

```sh
npm run validate
npm test
npm run build
npm run preview
```

The build produces `dist/`, including the app, searchable glossary, About, source index, install manifest and service worker. After an online visit, course pages can be available offline; browser voices and linked sources may still require connectivity.

| Path | Purpose |
|---|---|
| `app/src/units/u1.js` … `u12.js` | Original course content |
| `CONTENT_SCHEMA.md` | Content and teaching contract |
| `app/src/engine.js` | Pure learning logic and state repair |
| `app/src/kana.js` | Script inventory and kana scheduling |
| `app/src/app.js`, `style.css`, `shell.html` | Family interface and Japanese adaptations |
| `app/test/` | Behavior and full-curriculum checks |
| `app/tools/validate.js` | Structural content validation |
| `research/reviews/` | Editorial and implementation review records |

## Provenance and license

Adapted from the user’s MIT-licensed Guanxi and Skepsis family code. The project and original lesson content are MIT licensed. Reference sites retain their respective rights; source links do not imply endorsement or relicense third-party material.

See [Skepsis](https://tryskepsis.com), [Guanxi](https://guanxi.tryskepsis.com), [Carpe](https://carpe.tryskepsis.com) and [Gnothi](https://gnothi.tryskepsis.com).
