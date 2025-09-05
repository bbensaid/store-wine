# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

import os

# Check if credentials file exists
if os.path.exists('credentials.json'):
    print("✅ credentials.json found!")
    print("You're ready for Step 2 of the Gmail reader!")
else:
    print("❌ credentials.json not found")
    print("Make sure you downloaded it from Google Cloud Console")