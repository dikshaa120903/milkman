import os
import sys
import django

sys.path.append('c:\\Users\\Diksha\\Desktop\\milky\\milkman')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'milkman.settings')
django.setup()

from category.models import Category
from product.models import Product

def seed():
    print("Clearing all existing categories and products...")
    Category.objects.all().delete()
    
    # EXACT requested names from user and frontend UI
    category_data = {
        'Milk': [
            {'name': 'Full Cream Milk', 'price': 40, 'description': 'Rich full cream milk'},
            {'name': 'Toned Milk', 'price': 50, 'description': 'Healthy toned milk'},
            {'name': 'Double Toned Milk', 'price': 60, 'description': 'Double toned milk for fitness'},
            {'name': 'Skimmed Milk Organic Milk', 'price': 70, 'description': 'Pure organic skimmed milk'},
            {'name': 'Buffalo Milk', 'price': 50, 'description': 'Fresh buffalo milk'},
            {'name': 'Cow Milk', 'price': 40, 'description': 'Farm fresh cow milk'},
            {'name': 'Lactose-Free Milk', 'price': 100, 'description': 'Easy to digest lactose-free milk'},
        ],
        'Butter': [
            {'name': 'Salted Butter', 'price': 60, 'description': 'Classic salted butter'},
            {'name': 'Unsalted Butter', 'price': 80, 'description': 'Pure unsalted butter'},
            {'name': 'White Butter (Makkhan)', 'price': 90, 'description': 'Traditional white makkhan'},
            {'name': 'Ghee', 'price': 100, 'description': 'Pure desi ghee'},
            {'name': 'Flavored Butter', 'price': 50, 'description': 'Herb infused flavored butter'},
        ],
        'Cheese': [
            {'name': 'Cheddar', 'price': 110, 'description': 'Aged cheddar cheese'},
            {'name': 'Mozzarella', 'price': 150, 'description': 'Stretchy mozzarella block'},
            {'name': 'Paneer', 'price': 90, 'description': 'Fresh malai paneer'},
            {'name': 'Processed Cheese', 'price': 100, 'description': 'Processed cheese block'},
            {'name': 'Cheese Slices', 'price': 200, 'description': 'Convenient cheese slices'},
            {'name': 'Cheese Spread', 'price': 90, 'description': 'Creamy cheese spread'},
        ],
        'Yogurt': [
            {'name': 'Curd (Dahi)', 'price': 30, 'description': 'Thick natural curd'},
            {'name': 'Greek Yogurt', 'price': 50, 'description': 'High protein greek yogurt'},
            {'name': 'Flavored Yogurt', 'price': 50, 'description': 'Fruit flavored yogurt cup'},
            {'name': 'Buttermilk (Chaas)', 'price': 20, 'description': 'Refreshing spiced buttermilk'},
            {'name': 'Lassi', 'price': 40, 'description': 'Sweet cooling lassi'},
            {'name': 'Probiotic Drink', 'price': 50, 'description': 'Healthy probiotic milk drink'},
        ],
        'Flavoured Milk': [
            {'name': 'Chocolate Milk', 'price': 60, 'description': 'Rich chocolate milk'},
            {'name': 'Strawberry Milk', 'price': 70, 'description': 'Sweet strawberry milk'},
            {'name': 'Protein Milk', 'price': 60, 'description': 'High protein power milk'},
            {'name': 'Fortified Milk Drinks', 'price': 80, 'description': 'Vitamin fortified milk'},
            {'name': 'Mango Milk', 'price': 140, 'description': 'Refreshing mango flavored milk'},
        ],
    }
    
    for cat_name, products in category_data.items():
        print(f"Creating category: {cat_name}")
        category = Category.objects.create(name=cat_name, description=f"Fresh {cat_name} products")
        
        for prod in products:
            Product.objects.create(
                category=category,
                name=prod['name'],
                price=prod['price'],
                description=prod['description'],
                is_active=True
            )
            print(f"  - Added {prod['name']}")
            
    print("Database successfully seeded with categories and products!")

if __name__ == '__main__':
    seed()
