import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milkman.settings')
django.setup()

from staff.models import Staff
from customer.models import Customer

print("Updating user credentials...\n")

# Update or create Staff user
staff_email = 'anuj@gmail.com'
staff_password = 'bittu2003'
if Staff.objects.filter(email=staff_email).exists():
    staff = Staff.objects.get(email=staff_email)
    staff.password = staff_password
    staff.save()
    print(f'✓ Staff updated: {staff_email} / {staff_password}')
else:
    Staff.objects.create(
        name='Anuj',
        email=staff_email,
        phone='9876543210',
        address='123 Main St',
        password=staff_password,
        is_active=True
    )
    print(f'✓ Staff created: {staff_email} / {staff_password}')

# Update or create Customer user
customer_email = 'diksha@gmail.com'
customer_password = 'bittu2003'
if Customer.objects.filter(email=customer_email).exists():
    customer = Customer.objects.get(email=customer_email)
    customer.password = customer_password
    customer.save()
    print(f'✓ Customer updated: {customer_email} / {customer_password}')
else:
    Customer.objects.create(
        name='Diksha',
        email=customer_email,
        phone='9123456789',
        address='456 Oak Ave',
        password=customer_password,
        is_active=True
    )
    print(f'✓ Customer created: {customer_email} / {customer_password}')

print('\n✓ All credentials updated successfully!')
