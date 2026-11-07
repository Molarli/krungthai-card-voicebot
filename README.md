# Krungthai Card VoiceBot

Krungthai Card VoiceBot is an independent demo of a Thai and English voice assistant for reporting a lost debit card, blocking it, and requesting a replacement. Identity checks, card actions, delivery, and agent handoff use fictional data.

## Try the lost-card demo

1. Choose Thai or English and select **Try the demo**. To use the microphone, say “I lost my card. Please block it and issue a new one.”
2. Select **Approve in demo app**.
3. Review the sample debit card ending in **4821** and the effect of blocking it. Tap **Confirm block** on screen, then choose whether to order a replacement and confirm delivery. A spoken or typed reply cannot block the card.
4. To see the agent handoff, start a new conversation and select **Simulate failed verification**. The sample card stays active and the demo displays a mock case number.

## Run locally

Open `index.html` in a browser for typed input and scenario buttons. For voice input, open the demo over HTTPS or serve the project directory on localhost with `python3 -m http.server`. Microphone input and spoken replies depend on browser support and permissions. Your browser may send audio to its speech recognition service. Use fictional information only.

## How it works

The browser transcribes speech and can read replies aloud. Bilingual rules select a scenario, and the conversation state controls the next actions. The card and replacement steps use in-page data, and refreshing the page starts a new session.

The site is built with HTML, CSS, and JavaScript. GitHub Pages can publish it from the root of `main` with no build step.
