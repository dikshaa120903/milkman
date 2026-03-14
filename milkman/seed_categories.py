import os
import sys
import django

sys.path.append('c:\\Users\\Diksha\\Desktop\\milky\\milkman')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milkman.settings')
django.setup()

from category.models import Category
from product.models import Product

def seed():
    # Clear existing categories (this will cascade and delete products too)
    print("Clearing old categories and products...")
    Category.objects.all().delete()
    
    # Define exact categories the frontend expects
    categories_to_create = [
        {'name': 'Milk', 'description': 'Fresh dairy milk'},
        {'name': 'Butter & Spreads', 'description': 'Rich butter and spreads'},
        {'name': 'Cheese', 'description': 'Various types of cheese'},
        {'name': 'Yogurt & Fermented Products', 'description': 'Healthy probiotics'},
        {'name': 'Flavored & Value-Added Dairy', 'description': 'Delicious flavored milk'},
    ]
    
    print("Creating specific categories...")
    category_map = {}
    for cat_data in categories_to_create:
        cat = Category.objects.create(**cat_data)
        category_map[cat.name] = cat
        
    print("Categories created successfully!")
    
    # 3. Add back "Mango Milk"
    if 'Flavored & Value-Added Dairy' in category_map:
        print("Adding Mango Milk...")
        Product.objects.create(
            name='Mango Milk',
            description='Refreshing mango flavored milk',
            price=140.00,
            category=category_map['Flavored & Value-Added Dairy'],
            is_active=True
        )
        print("Mango Milk added successfully!")

if __name__ == '__main__':
    seed()
