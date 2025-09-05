#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Sep  3 11:56:24 2025

@author: baba
"""

from simple_gmail_reader import get_gmail_service
import json

def get_50_emails():
    """Get 50 latest emails"""
    service = get_gmail_service()
    
    # Get 50 emails
    results = service.users().messages().list(userId='me', maxResults=50).execute()
    messages = results.get('messages', [])
    
    emails = []
    
    for msg in messages:
        email = service.users().messages().get(userId='me', id=msg['id']).execute()
        
        headers = email['payload']['headers']
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
        sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
        
        emails.append({
            'id': msg['id'],
            'subject': subject,
            'from': sender,
            'snippet': email['snippet']
        })
    
    return emails

def save_50_emails():
    emails = get_50_emails()
    
    with open('my_50_emails.json', 'w') as f:
        json.dump(emails, f, indent=2)
    
    print(f"Saved {len(emails)} emails to my_50_emails.json")

if __name__ == '__main__':
    save_50_emails()