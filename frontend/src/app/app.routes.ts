import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    title: 'CartifyX - Everyday Style, Everyday Savings',
    data: { animation: 'HomePage' }
  },
  {
    path: 'about',
    loadComponent: () => import('./core/pages/about.component').then(m => m.AboutComponent),
    title: 'About Us',
    data: { animation: 'AboutPage' }
  },
  {
    path: 'contact',
    loadComponent: () => import('./core/pages/contact.component').then(m => m.ContactComponent),
    title: 'Contact Us',
    data: { animation: 'ContactPage' }
  },
  {
    path: 'blog',
    loadComponent: () => import('./core/pages/blog.component').then(m => m.BlogComponent),
    title: 'CartifyX Blog',
    data: { animation: 'BlogPage' }
  },
  {
    path: 'faq',
    loadComponent: () => import('./core/pages/faq.component').then(m => m.FaqComponent),
    title: 'FAQ',
    data: { animation: 'FaqPage' }
  },
  {
    path: 'privacy',
    loadComponent: () => import('./core/pages/privacy.component').then(m => m.PrivacyComponent),
    title: 'Privacy Policy',
    data: { animation: 'PrivacyPage' }
  },
  {
    path: 'terms',
    loadComponent: () => import('./core/pages/terms.component').then(m => m.TermsComponent),
    title: 'Terms & Conditions',
    data: { animation: 'TermsPage' }
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    data: { animation: 'AuthPage' }
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then(m => m.PRODUCT_ROUTES),
    data: { animation: 'ProductsPage' }
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent),
    title: 'Shopping Cart',
    data: { animation: 'CartPage' }
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard],
    title: 'Checkout',
    data: { animation: 'CheckoutPage' }
  },
  {
    path: 'checkout/success/:orderId',
    loadComponent: () => import('./checkout/order-success.component').then(m => m.OrderSuccessComponent),
    canActivate: [authGuard],
    title: 'Order Confirmed',
    data: { animation: 'OrderSuccessPage' }
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.routes').then(m => m.PROFILE_ROUTES),
    canActivate: [authGuard],
    data: { animation: 'ProfilePage' }
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./wishlist/wishlist.component').then(m => m.WishlistComponent),
    title: 'My Wishlist',
    data: { animation: 'WishlistPage' }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, adminGuard],
    title: 'Admin Dashboard',
    data: { animation: 'AdminPage' }
  },
  {
    path: '**',
    loadComponent: () => import('./core/pages/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found'
  }
];