# Pastastic

Order site for Pastastic. Plain HTML/CSS/JS, hosted on GitHub Pages. Orders go to the group's Google Form (and its linked Sheet) in the background.

## Quick edits
All settings are in the `CONFIG` object at the top of `js/main.js`:

- `messageUrl`: the Messenger / Instagram / Facebook link for every "Message us" button (**still a placeholder**)
- `groupLabel`, `scheduleText`: section/group line and pickup schedule (leave `""` to hide)
- `DISHES`: names, prices, descriptions, photos. `formLabel` must match the Google Form choice text exactly.
- `FORM_ID` and `ENTRY`: the Google Form ids. If questions in the form change, re-check these.

## Photos
Drop new photos into `assets/` with the same filenames (`hero.jpg`, `dish-garlic-parmesan.jpg`, `dish-cajun-penne.jpg`, `dish-tuna-salpicao.jpg`, `gallery-1.jpg` to `gallery-6.jpg`, `logo.jpg`, `logo-wide.jpg`, `gcash-qr.jpg`). Keep them under about 300 KB each so phones load fast.

## How orders map to the form
The form has one flavor question and one "How many?" question, so:
- A single-dish order picks that flavor. A mixed order uses the flavor's "Other" box, e.g. `2x Garlic Parmesan Chicken Pasta, 1x Creamy Cajun Sausage Penne`.
- 1 to 5 bowls picks the matching choice. More than 5 uses "Other".
- The "Special requests" answer holds the order, total, contact and notes.

## Google Form must stay
- Accepting responses: ON
- Restrict to school domain: OFF, Collect email addresses: OFF
- No file upload questions
