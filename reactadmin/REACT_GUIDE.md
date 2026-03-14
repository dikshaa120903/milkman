# React Usage Guide for Milkman Dairy App

## 🎯 How to Use React in Your Project

Your `_category_data.js` file contains static data. Here's how to transform it into dynamic React components:

### 1. **Basic React Component Structure**

```jsx
import React from 'react';

const MyComponent = () => {
  return (
    <div>
      <h1>Hello React!</h1>
    </div>
  );
};

export default MyComponent;
```

### 2. **Using Your Category Data in React**

```jsx
import React from 'react';
import CATEGORY_DATA from './_category_data';

const ProductList = () => {
  const categories = Object.keys(CATEGORY_DATA);

  return (
    <div>
      {categories.map(category => (
        <div key={category}>
          <h2>{category}</h2>
          {CATEGORY_DATA[category].map(product => (
            <div key={product.name}>
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

### 3. **React Hooks for State Management**

```jsx
import React, { useState, useEffect } from 'react';

const InteractiveComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState('Milk');
  const [cart, setCart] = useState([]);

  // useEffect for side effects
  useEffect(() => {
    console.log('Component mounted or selectedCategory changed');
  }, [selectedCategory]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {/* options */}
      </select>

      <button onClick={() => addToCart(someProduct)}>
        Add to Cart
      </button>
    </div>
  );
};
```

### 4. **Available Routes in Your App**

- `/react-demo` - Interactive React concepts demo
- `/dashboard` - Customer dashboard
- `/category` - Admin category management
- `/login` - Staff login

### 5. **Using the UI Components**

```jsx
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const MyPage = () => {
  return (
    <Card shadow="md" padding="lg">
      <h2>My Content</h2>
      <Input
        label="Name"
        placeholder="Enter your name"
        icon="👤"
      />
      <Button variant="primary" onClick={() => alert('Clicked!')}>
        Submit
      </Button>
    </Card>
  );
};
```

### 6. **Key React Concepts Demonstrated**

- **Components**: Reusable UI pieces
- **Props**: Passing data to components
- **State**: Managing component data with `useState`
- **Effects**: Handling side effects with `useEffect`
- **Event Handling**: Responding to user interactions
- **Conditional Rendering**: Showing content based on state
- **Lists**: Rendering arrays of data
- **Forms**: Handling user input

### 7. **Your App Structure**

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API calls
└── styles/        # CSS files
```

### 8. **Next Steps**

1. Visit `/react-demo` to see React concepts in action
2. Modify the components to add your own features
3. Create new components for additional functionality

### 9. **Development Commands**

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

Your React app is now running with modern UI components and demonstrates key React patterns! 🚀