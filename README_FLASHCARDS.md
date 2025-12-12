# Flashcards — Adding new decks

Folder structure:
- /assets/data/flashcards/<subject>/<deck>.json
- /flashcards/<subject>/<deck>.html (optional: you can use the player page and change data-json attribute)

JSON format:
[
  {"front":"Question or Word","back":"Answer or antonym"},
  {"front":"Word2","back":"Antonym2"}
]

To add a new deck:
1. Create JSON file `/assets/data/flashcards/english/newdeck.json`.
2. Create a deck page (copy antonyms.html) and change `data-json` to `/assets/data/flashcards/english/newdeck.json`.
3. Add a link to the subject index: `/flashcards/english/index.html`.
4. (Optional) Add thumbnail images or category text.

Notes:
- JSON must be a simple array of {front, back}.
- Keep filenames lowercase and avoid spaces.
- For large decks, browser memory might grow — consider paginating or using smaller decks.
