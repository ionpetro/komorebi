# Release review — November 13, 2026

## Scope and content

Audited Skepsis, Guanxi, Carpe and Gnothi before building. Three research/content subagents produced the course; separate passes reviewed u1–u4, u5–u8 and engine/UI behavior. The coordinating agent reviewed the Japanese strings, grammar and scenario keys in u9–u12 and integrated the full experience.

Final inventory: 12 chapters, 60 lessons, 480 lesson items (240 vocabulary entries, 60 sentence builds, 60 grammar, 60 culture, 60 contextual scenarios), 60 dialogues/missions and 24 separate assessment questions. Kana includes 208 symbols/combinations, of which 92 are the basic hiragana and katakana.

Culture is practiced in decisions and available in a journal. The source pass includes greetings/register, names, home entrances and visits, meals, messages, workplace address/farewells, local transport, festival participation, shrine/temple distinctions, regional food, tourist information and New Year contact. Universal personal-choice advice remains explicitly original/general. All teaching prose and dialogues are original.

## Corrections made during review

- Fixed room-number versus floor wording, missions asking for untaught actions, and unclear timing/clarification dialogue.
- Removed dialogue exposure from the intro and first-sitting result so a later first guess is not pre-revealed. The full conversation appears after the lesson is complete.
- Preserved long vowels in typed answers while accepting supported macron/keyboard variants.
- Repaired malformed imports, including null assessments, nonfinite statistics, invalid dates and prototype-key records.
- Made matching errors visible and prevented a corrected matching set from being scored as perfect on its first attempt.
- Made Monday streak display agree with the weekly freeze refill.
- Retained assessment exposure on partial attempts so a restart is not mislabeled a first attempt.
- Kept pending search/settings input intact when the browser voice list loads.
- Added speech playback-error fallback to ungraded practice.

## Verification

23 automated behavior tests cover the course across twenty random seeds, bounded sittings, valid choice and sentence keys, early-review invariants, streaks, state recovery, kana separation/scheduling, matching, no-voice listening, lesson continuation and held-out assessment isolation.

Browser verification used the actual local build, desktop and 390 × 844 / 320 × 740 mobile viewports. Checked onboarding, light/dark rendering, course path, a complete kana sitting, both sittings of a complete lesson, deliberate errors and one retry, typed recall, sentence tiles, culture/scenario feedback, badge/progress persistence, vocabulary search and the culture/stamp journal. Checked the narrow layout for horizontal overflow. No-voice behavior additionally has a stateful interaction test proving no accuracy or card-schedule mutation.

Sources, content validation and release build are included in the publication workflow. The new Site preserves owner-only access. It contains no source-project credentials, environment files, analytics setup or progress.

## Limits

This is a substantial beginner course, not an independently certified proficiency assessment. Editorial review was AI-assisted, not professional native-speaker review. Browser-provided Japanese audio is not a native recording, and pronunciation is not scored. Offline page caching is implemented, but audio/source links can require network access. Local progress requires export for backup or transfer to another browser.
