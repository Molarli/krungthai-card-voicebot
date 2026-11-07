# Krungthai Voice Lab

Krungthai Voice Lab is an independent student prototype of a Thai and English banking voice assistant. Identity checks, card actions, delivery, and agent handoff use fictional data.

## Try the lost-card demo

1. Choose Thai or English and select **Try the demo**. To use the microphone, say “I lost my card. Please block it and issue a new one.”
2. Select **Use demo PIN** or **Simulate voice verification**.
3. Confirm the card block, order a replacement, and confirm delivery.
4. To see the agent handoff, start a new conversation and select **Simulate failed verification**. The sample card stays active and the demo displays a mock case number.

## Run locally

Open `index.html` in a browser for typed input and scenario buttons. For voice input, open the demo over HTTPS or serve the project directory on localhost with `python3 -m http.server`. Microphone input and spoken replies depend on browser support and permissions. Your browser may send audio to its speech recognition service. Use fictional information only.

## How it works

The browser transcribes speech and can read replies aloud. Bilingual rules select a scenario, and the conversation state controls the next actions. The card and replacement steps use in-page data, and refreshing the page starts a new session.

The site is built with HTML, CSS, and JavaScript. GitHub Pages can publish it from the root of `main` with no build step.
