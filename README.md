# Smart Prompt Notes for ChatGPT

Smart Prompt Notes is a lightweight Chrome extension that allows you to quickly take, format, and save notes while chatting with ChatGPT. It appears as a small, draggable, and collapsible widget directly on the ChatGPT interface.

---

## Features

- Starts collapsed with a floating notes icon
- Expandable notes box for quick access
- Auto-inserts bullet points when pressing Enter
- Heading formatting with H1, H2, H3 buttons
- Automatically removes bullet points when inserting headings
- Draggable and resizable anywhere on the screen
- Persistent note storage using localStorage
- Optional remove button to delete the widget from view

---

## Use Cases

- Save your favorite ChatGPT prompts
- Draft and revise prompt ideas during a session
- Keep track of useful answers or links
- Build your personal prompt library

---

## Installation

1. Clone or download this repository.
2. Open Chrome and go to: `chrome://extensions/`
3. Enable **Developer Mode** in the top-right corner.
4. Click **Load unpacked**.
5. Select the folder containing this extension.
6. Visit [https://chat.openai.com](https://chat.openai.com) and the widget will appear automatically.

---

## Supported URLs

By default, this extension activates on:

```json
"matches": [
  "*://chatgpt.com/*",
  "*://www.chatgpt.com/*",
  "*://chat.openai.com/*",
  "*://chat.openai.com/?model=auto*"
]


## Using With Other AI Chatbots

You can enable the Smart Notes extension on additional AI chatbot platforms like Claude, Gemini, Poe, or others by updating the `manifest.json` file.

## Steps:

1. Open the `manifest.json` file in the root of your extension directory.
2. Locate the `"matches"` array under the `"content_scripts"` section.
3. Add the domain of the chatbot site you want to support.

## Example: Enable Support for Claude and Gemini

Update your `"matches"` array like this:

```json
"matches": [
  "*://chat.openai.com/*",
  "*://claude.ai/*",
  "*://gemini.google.com/*"
]
