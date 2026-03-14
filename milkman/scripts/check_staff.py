from staff.models import Staff
print('exists:', Staff.objects.filter(email='admin@example.com').exists())
