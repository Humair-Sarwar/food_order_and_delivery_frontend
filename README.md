# 🍔 Online Food Ordering & Delivery System — Frontend

A modern and responsive frontend for an **Online Food Ordering & Delivery System**, built with React, TypeScript, Tailwind CSS, and React Query.

The application allows customers to browse restaurants and food items, search and filter products, view product details, manage their cart, and proceed through checkout.

---

## 🚀 Features

### 👤 Customer Features

* User registration and login
* Authentication with protected routes
* Customer dashboard
* Browse food items
* Browse restaurants
* Browse food categories
* Search food items
* Filter food items by:

  * Price range
  * Restaurant
  * Category
  * Availability
  * Sale status
* Food item detail page
* Related food items
* Latest food items
* Add food items to cart
* Cart management
* Checkout
* Order-related functionality
* Responsive design for desktop, tablet, and mobile

### 🛒 Cart Features

* Add food items to cart
* Cart side drawer/modal
* Add-to-cart confirmation toast
* Cart persistence using `localStorage`
* Cart ID handling
* Checkout navigation

### 🔐 Authentication

* Login
* Registration
* Protected routes
* Role-based route protection
* Customer authentication
* Admin authentication
* Redirect handling after authentication

### 🛠️ Admin Features

* Admin authentication
* Admin dashboard
* Admin protected routes
* Role-based access control
* Admin management interface

---

## 🧰 Tech Stack

| Technology           | Purpose                     |
| -------------------- | --------------------------- |
| React                | Frontend UI                 |
| TypeScript           | Type safety                 |
| Vite                 | Development & build tool    |
| Tailwind CSS         | Styling                     |
| React Router         | Routing                     |
| TanStack React Query | Server state management     |
| Redux Toolkit        | Authentication/global state |
| Axios                | API communication           |
| Lucide React         | Icons                       |
| React Toastify       | Notifications               |

---

## 📁 Project Structure

```text
src/
├── assets/
│   └── images/
│
├── components/
│   ├── common/
│   ├── routes/
│   └── website/
│
├── hooks/
│   ├── auth/
│   ├── redux/
│   └── website/
│
├── layouts/
│   └── WebsiteLayout.tsx
│
├── pages/
│   ├── auth/
│   ├── website/
│   └── admin/
│
├── routes/
│   ├── AppRoutes.tsx
│   ├── AuthRoutes.tsx
│   ├── ProtectedRoute.tsx
│   ├── PublicRoute.tsx
│   ├── AdminRoutes.tsx
│   ├── CustomerRoutes.tsx
│   └── WebsiteRoutes.tsx
│
├── services/
│   ├── auth/
│   ├── website/
│   └── api/
│
├── store/
│   └── slices/
│
├── App.tsx
└── main.tsx
```

---

## 🔗 Frontend Routes

### Website

```text
/
```

Home page.

```text
/restaurants
```

Restaurant listing.

```text
/food-items/All
```

All food items.

```text
/food-items/:slug
```

Food items by category.

```text
/food-item/:category/:title/:id
```

Food item detail page.

Example:

```text
/food-item/fast-food/zinger-burger/01a00b64-8792-71d8-a2b4-830460601ce1
```

```text
/cart
```

Shopping cart.

```text
/checkout
```

Checkout page.

```text
/about
```

About page.

```text
/contact
```

Contact page.

---

## 🔐 Authentication Routes

```text
/login
```

Customer login.

```text
/register
```

Customer registration.

Authentication state is maintained using Redux and the authentication token.

---

## 🛡️ Protected Routes

Protected routes are handled using a reusable `ProtectedRoute` component.

Example:

```tsx
<Route element={<ProtectedRoute allowedRole="user" />}>
  {CustomerRoutes()}
</Route>
```

Admin routes use:

```tsx
<Route element={<ProtectedRoute allowedRole="admin" />}>
  {AdminRoutes()}
</Route>
```

---

## 🌐 API Configuration

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Update the URL according to your backend environment.

For example:

```text
http://127.0.0.1:8000
```

or your production API URL.

---

## 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Go to the project directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```text
.env
```

Add:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🏗️ Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 🔄 API & Server State

API requests are organized into service files.

Example:

```text
services/
└── website/
    └── foodItemService.ts
```

React Query hooks are used to consume API services.

Example:

```tsx
export const useLatestFoodItems = () => {
  return useQuery({
    queryKey: ["latest-food-items"],
    queryFn: LatestFoodItems,
  });
};
```

This approach separates:

```text
UI
 ↓
React Hook
 ↓
Service
 ↓
API
```

---

## 🍔 Food Item URL Structure

Food item URLs follow this structure:

```text
/food-item/:category/:product-slug/:id
```

Example:

```text
/food-item/fast-food/zinger-burger/01a00b64-8792-71d8-a2b4-830460601ce1
```

Where:

* `category` → food category slug
* `product-slug` → food item slug
* `id` → unique food item ID

---

## 🛒 Add to Cart Flow

The frontend uses the following flow:

```text
User clicks "Add"
        ↓
Add To Cart API
        ↓
Cart ID received
        ↓
Cart ID stored in localStorage
        ↓
AddToCartToast displayed
        ↓
User can view cart or checkout
```

The cart ID is stored in:

```text
localStorage
```

using:

```tsx
localStorage.setItem("cart_id", cartId);
```

---

## 🎨 UI & Design

The frontend uses:

* Tailwind CSS
* Responsive layouts
* Reusable components
* Mobile-friendly navigation
* Skeleton loading states
* Toast notifications
* Modal/drawer components
* Responsive product carousels

The primary UI style uses an orange-based food ordering theme.

---

## 📱 Responsive Design

The application is designed for:

* 📱 Mobile
* 📲 Tablet
* 💻 Desktop
* 🖥️ Large screens

Tailwind responsive utilities are used throughout the application.

---

## 🔔 Notifications

React Toastify is used for success and error notifications.

Example:

```tsx
toast.success("Product added to cart");
```

and:

```tsx
toast.error("Failed to add product to cart");
```

---

## 🧪 Development

Recommended development workflow:

```text
Create Component
      ↓
Create Service
      ↓
Create React Query Hook
      ↓
Connect API
      ↓
Add Loading State
      ↓
Add Error Handling
      ↓
Add Responsive UI
      ↓
Test
```

---

## 📌 Environment Variables

| Variable            | Description          |
| ------------------- | -------------------- |
| `VITE_API_BASE_URL` | Backend API base URL |

Never commit sensitive environment variables or secrets to GitHub.

---

## 🧹 Code Quality

The project follows a component-based architecture with separation between:

* Pages
* Components
* Hooks
* Services
* Redux state
* Routes
* Layouts

Reusable components should be preferred over duplicating UI logic.

---

## 👨‍💻 Development Team

**Frontend Developer**

Muhammad Humair Sarwar

---

## 📄 License

This project is developed for educational and project purposes.

---

## ⭐ Project

**Online Food Ordering & Delivery System**

A complete web-based food ordering platform designed to connect customers with restaurants and provide a convenient online ordering experience.
