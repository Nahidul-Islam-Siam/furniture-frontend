import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import Collections from './pages/collections';
import Warranty from './pages/warranty';
import RootLayout from './pages/Layout';
import NotFound from './pages/not-found';
import About from './pages/about';
import Login from './pages/login';
import Signup from './pages/signup';
import Contact from './pages/contact';
import Blog from './pages/blog';
import ErrorPage from './pages/error';

export const router = createBrowserRouter([
  {
    path: '',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/collections',
        element: <Collections />,
      },
      {
        path: '/collections/:category',
        element: <Collections />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/pages/know-more-about-grid',
        element: <About />,
      },
      {
        path: '/pages/grid-studio',
        element: <Collections />,
      },
      {
        path: '/pages/warranty',
        element: <Warranty />,
      },
      {
        path: '/policies/terms-of-service',
        element: <Warranty />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/pages/contact-us',
        element: <Contact />,
      },
      {
        path: '/blog',
        element: <Blog />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);