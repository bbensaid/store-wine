#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Sep  3 11:54:01 2025

@author: baba
"""

from simple_gmail_reader import get_5_emails
import json

def save_full_emails_to_file():
    """Get emails with full content and save to JSON file"""
    emails = get_5_emails()
    
    # Save to file
    with open('full_emails.json', 'w', encoding='utf-8') as f:
        json.dump(emails, f, indent=2, ensure_ascii=False)
    
    print(f"Saved {len(emails)} emails with full content to full_emails.json")
    
    # Show summary
    for i, email in enumerate(emails, 1):
        print(f"\nEmail {i}:")
        print(f"  From: {email['from']}")
        print(f"  Subject: {email['subject']}")
        print(f"  Body length: {len(email['full_body'])} characters")

if __name__ == '__main__':
    save_full_emails_to_file()