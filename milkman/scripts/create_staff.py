from staff.models import Staff

email = 'admin@example.com'
pw = 'secret'

if Staff.objects.filter(email=email).exists():
    print('Staff with email already exists:', email)
else:
    Staff.objects.create(name='Admin', email=email, password=pw)
    print('Created staff:', email)
