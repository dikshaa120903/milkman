#!/usr/bin/env python
"""
Script to run Django migrations.
"""
import os
import sys
import django

# Add the project directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milkman.settings')

# Setup Django
django.setup()

# Run migrations
from django.core.management import call_command
call_command('migrate')