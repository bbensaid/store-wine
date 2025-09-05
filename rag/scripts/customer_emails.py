#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Sep  3 11:58:06 2025

@author: baba
"""

from get_more_emails import get_50_emails
import json

def find_customer_emails():
    """Find emails that look like customer inquiries"""
    emails = get_50_emails()
    
    customer_emails = []
    
    for email in emails:
        subject = email['subject'].lower()
        sender = email['from'].lower()
        
        # Look for customer-like emails
        if any(word in subject for word in ['question', 'help', 'support', 'order', 'return']):
            customer_emails.append(email)
        elif '@gmail.com' in sender or '@yahoo.com' in sender or '@hotmail.com' in sender:
            customer_emails.append(email)
    
    return customer_emails

def save_customer_emails():
    customer_emails = find_customer_emails()
    
    with open('customer_emails.json', 'w') as f:
        json.dump(customer_emails, f, indent=2)
    
    print(f"Found {len(customer_emails)} customer emails")
    print("Saved to customer_emails.json")

if __name__ == '__main__':
    save_customer_emails()