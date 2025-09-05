# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import json
import os
import base64
from email.mime.text import MIMEText

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_gmail_service():
    """Get Gmail service - handles login"""
    creds = None
    
    # Check if we already have login token
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    else:
        # First time - need to log in
        flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
        creds = flow.run_local_server(port=0)
        
        # Save token for next time
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    
    return build('gmail', 'v1', credentials=creds)

def extract_email_body(email_payload):
    """Extract the full text content from email"""
    body = ""
    
    # Check if email has parts (multipart)
    if 'parts' in email_payload:
        for part in email_payload['parts']:
            # Look for text/plain content
            if part['mimeType'] == 'text/plain':
                if 'data' in part['body']:
                    body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
                    break
            # If no text/plain, look for text/html
            elif part['mimeType'] == 'text/html' and not body:
                if 'data' in part['body']:
                    body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
    else:
        # Single part email
        if email_payload['mimeType'] == 'text/plain':
            if 'data' in email_payload['body']:
                body = base64.urlsafe_b64decode(email_payload['body']['data']).decode('utf-8')
        elif email_payload['mimeType'] == 'text/html':
            if 'data' in email_payload['body']:
                body = base64.urlsafe_b64decode(email_payload['body']['data']).decode('utf-8')
    
    return body

def get_5_emails():
    """Get 5 latest emails with full content"""
    service = get_gmail_service()
    
    # Get 5 latest emails
    results = service.users().messages().list(userId='me', maxResults=5).execute()
    messages = results.get('messages', [])
    
    emails = []
    
    for msg in messages:
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
    
    return emails

if __name__ == '__main__':
    print("Getting 5 latest emails with full content...")
    emails = get_5_emails()
    
    for i, email in enumerate(emails, 1):
        print(f"\n{'='*50}")
        print(f"Email {i}:")
        print(f"From: {email['from']}")
        print(f"Subject: {email['subject']}")
        print(f"Date: {email['date']}")
        print(f"Preview: {email['snippet']}")
        print(f"\nFull Content:")
        print("-" * 30)
        print(email['full_body'])
        print("-" * 30)