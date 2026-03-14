from staff.models import Staff

email = 'admin@example.com'
pw = 'secret'

if Staff.objects.filter(email=email).exists():
    print('already exists')
else:
    s = Staff.objects.create(name='Admin', email=email, password=pw)
    print('created id', s.pk)

print('exists after:', Staff.objects.filter(email=email).exists())
