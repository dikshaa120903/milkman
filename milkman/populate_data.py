import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milkman.settings')
django.setup()

from category.models import Category
from product.models import Product
from customer.models import Customer
from staff.models import Staff
from subscription.models import Subscription

def populate():
    print("Populating database with sample data...")

    # Categories
    milk_cat, _ = Category.objects.get_or_create(name="Milk", description="Fresh farm milk", is_active=True)
    cheese_cat, _ = Category.objects.get_or_create(name="Cheese", description="Various types of cheese", is_active=True)
    yogurt_cat, _ = Category.objects.get_or_create(name="Yogurt", description="Healthy probiotics", is_active=True)
    print("✓ Categories created")

    # Products
    cow_milk, _ = Product.objects.get_or_create(name="Cow Milk", description="Fresh whole cow milk", price=60.00, category=milk_cat, is_active=True)
    buffalo_milk, _ = Product.objects.get_or_create(name="Buffalo Milk", description="Rich buffalo milk", price=80.00, category=milk_cat, is_active=True)
    cheddar, _ = Product.objects.get_or_create(name="Cheddar Cheese", description="Aged cheddar", price=250.00, category=cheese_cat, is_active=True)
    greek_yogurt, _ = Product.objects.get_or_create(name="Greek Yogurt", description="Plain greek yogurt", price=120.00, category=yogurt_cat, is_active=True)
    print("✓ Products created")

    # Staff (already some in create_test_users.py)
    staff, _ = Staff.objects.get_or_create(name="Anuj", email="anuj@gmail.com", defaults={"phone": "9876543210", "address": "123 Main St", "password": "bittu2003", "is_active": True})
    print("✓ Staff verified")

    # Customer (already some in create_test_users.py)
    customer, _ = Customer.objects.get_or_create(name="Diksha", email="diksha@gmail.com", defaults={"phone": "9123456789", "address": "456 Oak Ave", "password": "bittu2003", "is_active": True})
    print("✓ Customer verified")

    # Subscriptions
    Subscription.objects.get_or_create(customer=customer, product=cow_milk, quantity=2, is_active=True)
    Subscription.objects.get_or_create(customer=customer, product=greek_yogurt, quantity=1, is_active=True)
    print("✓ Subscriptions created")

    print("\n✓ Database population complete!")

if __name__ == "__main__":
    populate()
