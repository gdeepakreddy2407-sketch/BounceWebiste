# Android Screenshots Setup Instructions

## Required Files

Please save your 5 Android screenshots to this folder (`Bounce Website/Screenshots/`) with the following exact filenames:

### 1. android_dashboard.png
Your first image showing the Android Dashboard with:
- "Connected" status
- Active Features section showing:
  - SMS Forwarding (Active)
  - Notifications (Mirroring)
  - Calls (Ready)
  - Clipboard (Active)
  - File Transfer (Ready)
- Actions section with:
  - Disconnect button
  - Unpair Device button

### 2. android_clipboard.png  
Your second image showing the Clipboard feature modal:
- Clipboard icon
- "Clipboard - Active" title
- "Universal Clipboard: Copy on Mac, Paste on Android" description
- "How it works" section
- One-way sync explanation

### 3. android_file_transfer.png
Your third image showing the File Transfer feature modal:
- Share icon
- "File Transfer - Ready" title
- "Seamless file sharing between devices" description
- "How it works" section with:
  - Mac to Android: Drag & drop instructions
  - Android to Mac: Share menu instructions

### 4. android_sms.png
Your fourth image showing the SMS Forwarding feature modal:
- Message/envelope icon
- "SMS Forwarding - Active" title
- "View and reply to SMS messages directly from your Mac notifications" description

### 5. android_share.png
Your fifth image showing the Android share sheet:
- "All apps" header
- List of apps including:
  - Amazon Alexa
  - Kindle
  - Ask Claude
  - Apollo 247
  - Zomato
  - **Bounce Companion** (highlighted)
  - And other apps

## How to Add the Screenshots

1. Locate the 5 Android screenshots you want to use
2. Rename them to match the filenames listed above
3. Copy them to: `/Users/deepakg/Downloads/training/xcode/Bounce/Bounce Website/Screenshots/`
4. Refresh the landing page in your browser

The carousel will automatically display the images once they're in place!

## Alternative: Quick Command

If your screenshots are in your Downloads folder with different names, you can rename them like this:

```bash
cd "/Users/deepakg/Downloads/training/xcode/Bounce/Bounce Website/Screenshots/"

# Rename your screenshots to match. For example:
# mv ~/Downloads/your_dashboard_screenshot.png android_dashboard.png
# mv ~/Downloads/your_clipboard_screenshot.png android_clipboard.png
# mv ~/Downloads/your_file_transfer_screenshot.png android_file_transfer.png
# mv ~/Downloads/your_sms_screenshot.png android_sms.png
# mv ~/Downloads/your_share_screenshot.png android_share.png
```

## Verification

Run this script to check if all Android screenshots are in place:

```bash
python3 verify_android_screenshots.py
```
