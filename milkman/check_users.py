import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milkman.settings')
django.setup()

from customer.models import Customer
from staff.models import Staff

print("=== CUSTOMERS ===")
customers = Customer.objects.all()
for c in customers:
    print(f"ID: {c.id}, Email: {c.email}, Password: {c.password}, Name: {c.name}")

print("\n=== STAFF ===")
staff_list = Staff.objects.all()
for s in staff_list:
    print(f"ID: {s.id}, Email: {s.email}, Password: {s.password}, Name: {s.name}")
