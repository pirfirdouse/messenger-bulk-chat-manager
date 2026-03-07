
# Messenger Bulk Chat Manager

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

A powerful browser console script that provides a modern user interface to bulk archive or delete your Facebook Messenger chats, saving you from the tedious process of handling them one by one.

---

### **[ HIGHLY RECOMMENDED: Insert a GIF of the script in action here ]**

*(A short screen recording showing the UI pop up, selecting a few chats, and clicking "Archive Selected" would be perfect.)*

![Script in Action](https://user-images.githubusercontent.com/username/repo/blob/main/demo.gif) <!-- Replace this with your actual GIF URL -->

## Overview

Manually archiving or deleting hundreds of Messenger chats is a slow and frustrating process. This script injects a feature-rich, interactive user interface directly into the Messenger webpage, allowing you to select multiple chats from a list and process them all with a single click.

It's built with safety and usability in mind, incorporating configurable delays to mimic human behavior and providing a detailed log of every action it performs.

## Features

- **Custom UI Popup:** A clean, modern, and user-friendly dialog box appears over the page.
- **Bulk Selection:** Scans your chat list and displays them with checkboxes for easy selection.
- **Archive & Delete:** Choose to either archive or permanently delete your selected chats.
- **Select All / Deselect All:** Quickly manage your selections with convenient helper buttons.
- **Live Selection Counter:** Instantly see how many chats you have selected.
- **Configurable Wait Time:** Set a custom delay between each action to avoid potential rate-limiting.
- **Live Action Log:** A detailed log appears on-screen, reporting every action taken.

## How to Use

1. Go to [[www.messenger.com](https://www.facebook.com/messages/)] and log in.
2. Scroll down your chat list to ensure all the chats you want to manage are loaded on the screen.
3. Open the Developer Tools in your browser:
    - **Chrome/Edge/Firefox:** `Ctrl` + `Shift` + `I` (or `Cmd` + `Opt` + `I` on Mac).
4. In the Developer Tools window, click on the **"Console"** tab.
5. Copy the **entire code** from the `messenger-bulk-manager.js` file.
6. Paste the code into the console and press **Enter**.
7. The custom UI will appear. Select the chats you want to process, choose your action, and let the script do the work!

## Configuration

You can easily change the wait time between each action to make the script faster or slower.

At the top of the script file, find the `CONFIGURATION` section:




Change the value of `DELAY_BETWEEN_ACTIONS` to your desired wait time in milliseconds.

## ⚠️ Important Notes & Disclaimer

- **Use at your own risk.** This script is provided as-is. Deleting chats is a permanent action that cannot be undone.
- **DOM Changes:** Facebook frequently updates its website's code. If the script suddenly stops working, it may be because the element selectors have changed.
- **For Personal Use Only.** This tool is intended for managing your own personal chat history.

## License

**Copyright (c) F zarrug. All Rights Reserved.**2026

This software is provided for personal, non-commercial use only. You may not copy, distribute, modify, or create derivative works of this software without the express written permission of the copyright holder.

