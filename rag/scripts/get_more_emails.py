#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Sep  3 11:56:24 2025

@author: baba
"""

from simple_gmail_reader import get_gmail_service, extract_email_body
import json
import base64

def get_50_full_emails():
    """Get 50 latest emails with full content"""
    service = get_gmail_service()
    
    # Get 50 emails
    results = service.users().messages().list(userId='me', maxResults=50).execute()
    messages = results.get('messages', [])
    
    emails = []
    
    for i, msg in enumerate(messages):
        print(f"Processing email {i+1}/50...")
        
        try:
            # Get full email details
            email = service.users().messages().get(userId='me', id=msg['id'], format='full').execute()
            
            # Extract basic info
            headers = email['payload']['headers']
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
            sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
            date = next((h['value'] for h in headers if h['name'] == 'Date'), 'Unknown')
            
            # Extract full email body
            full_body = extract_email_body(email['payload'])
            
            emails.append({
                'id': msg['id'],
                'subject': subject,
                'from': sender,
                'date': date,
                'snippet': email['snippet'],
                'full_body': full_body
            })
            
        except Exception as e:
            print(f"Error processing email {i+1}: {e}")
            continue
    
    return emails

def save_50_full_emails():
    emails = get_50_full_emails()
    
    with open('full_50_emails.json', 'w', encoding='utf-8') as f:
        json.dump(emails, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved {len(emails)} emails with full content to full_50_emails.json")
    
    # Show summary
    total_chars = sum(len(email['full_body']) for email in emails)
    print(f"Total content: {total_chars:,} characters")
    
    # Show first few emails
    for i, email in enumerate(emails[:3], 1):
        print(f"\nEmail {i}:")
        print(f"  From: {email['from']}")
        print(f"  Subject: {email['subject']}")
        print(f"  Body length: {len(email['full_body'])} characters")

if __name__ == '__main__':
    save_50_full_emails()