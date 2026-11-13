# Komorebi — Japanese through everyday life

Original beginner Japanese course, in the Skepsis learning-app family. English UI; Japanese with kana readings and Hepburn romanization. 12 units, five lessons each. Culture is practiced inside scenes; no universal claims about Japanese people.

Files: `app/src/units/uN.js`. Format `(function(){const unit={...};if(typeof KOMOREBI_UNITS!=="undefined")KOMOREBI_UNITS.push(unit);if(typeof module!=="undefined")module.exports=unit;})();`.

Unit fields: id `uN`, title, blurb, place, focus, lessons, assessment (two separately held-out original scenarios).
Lesson fields: id `uNlM`, title, scene (fictional everyday situation), mission (concrete speak-aloud task), dialogue (2–4 original lines with speaker, ja, kana, romaji, meaning), items (8–10).
Every item: id `uN-M-X`, kind, say (concise useful explanation), src (verified URL or `Original teaching example; standard Japanese`), status (`general` or `sourced`).

Each lesson: four useful word/phrase items, one sentence build, one grammar card, one culture card, one scenario = eight items. No duplicate filler or oversold proficiency claims.

- word: ja, kana (reading in hiragana/katakana), romaji, meaning, distractors (3 distinct unambiguously wrong meanings), optional note and example {ja,kana,romaji,meaning}.
- sentence: ja, kana, romaji, meaning, tiles [{ja,romaji},...] (3–7 meaningful chunks), distractors [{ja,romaji}] (1–2), transfer:false. Concatenated correct tiles must equal ja ignoring punctuation/spaces. Explicitly teach new patterns before assessing them; the lesson engine teaches sentence builds.
- grammar: title, explanation, examples [{ja,kana,romaji,meaning}], quiz {q,options:[three distinct strings],answer:exact option,why}.
- culture: title, place, body, optional phrase {ja,kana,romaji,meaning}, quiz {q,options:[three distinct strings],answer:exact option,why}. Specific observations tied to source URLs. Personal choices/local instructions take precedence. If merely original practical advice mark general, no false source attribution.
- scenario: title, scene, q, options [{text,why},...] (three plausible choices), answer (index), transfer:true. Japanese text in ordinary prose has romaji and meaning where needed. Single best answer must follow explicit situation; avoid cartoonishly rude distractors.

Use desu/masu beginner register; explain alternatives in context. は particle romanizes wa, へ particle e, を o; kana reflects orthography. Preserve long vowels (ō, ū), small っ, mora timing. No Mandarin tone material. All dialogue and teaching text original, not copied from textbooks. No invented etymologies or native-review claims.

Sequence: u1 First connections (greetings, names, repair, preferences, thanks); u2 Café and meals (orders, requests, quantities, dietary questions, paying); u3 Finding your way (places, directions, trains, tickets, help); u4 Everyday shopping (demonstratives, numbers/prices, sizes, payment, polite choices); u5 A day in your life (time, routines, days, frequency, plans); u6 Visiting a home (arrival, shoes, permission, hosting, departure); u7 Making friends (interests, invitations, availability, declining, follow-up); u8 Work and study (roles, schedules, clarification, asking help, collaboration); u9 Seasons and celebrations (weather, seasons, invitations/events, shrine/temple context, festivals); u10 Exploring beyond Tokyo (trip plans, accommodation, local food, local differences, respectful travel); u11 When plans change (lost things, delays, basic help, symptoms as language only, problem repair); u12 Staying connected (past experiences, comparisons, recommendations, gratitude, return plans).

Each unit's assessment: two new scenes using taught language, excluded from normal lessons and review. Sources linked for context; no claim of JLPT or formal CEFR certification.
