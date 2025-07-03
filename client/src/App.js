import {Provider} from "react-redux";
import store from './utils/store';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";
import { Toaster } from 'react-hot-toast';

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";

import ProtectedRoute from "./components/ProtectedRoute";
import DailyChallengeForm from "./components/reflections/DailyChallengeForm";
import DailyReflectionForm from "./components/reflections/DailyReflectionForm";
import JournalForm from "./components/reflections/JournalForm";
import MoodForm from "./components/reflections/MoodForm";
import PhotoForm from "./components/reflections/PhotoForm";
import TaskPage from "./pages/TaskPage";
import AuthForm from "./pages/AuthForm";
import Splash from "./pages/Splash";

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:(
      <Splash/>
    )
  },

  {
    path:'/home',
    element: (
      <ProtectedRoute>
      <>
        <Navbar/>
        <Home/>
      </>
      </ProtectedRoute>
    ),
  },

  {
    path: '/profile',
    element: (
      <ProtectedRoute>
      <>
        <Navbar />
        <Profile />
      </>
      </ProtectedRoute>
    ),
  },

  {
    path: '/rewards',
    element: (
      <ProtectedRoute>
      <>
        <Navbar />
        <Rewards />
      </>
      </ProtectedRoute>
    ),
  },

  {
    path:'/login',
    element:<AuthForm/>
  },

  {
    path:'/register',
    element:<AuthForm/>
  },

  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
      <>
        <Navbar />
        <Dashboard />
      </>
      </ProtectedRoute>
    )
  },
  
  {
  path: '/task/daily-challenge',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <DailyChallengeForm />
      </>
    </ProtectedRoute>
  )
},
{
  path: '/task/daily-reflection',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <DailyReflectionForm />
      </>
    </ProtectedRoute>
  )
},
{
  path: '/task/journal',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <JournalForm />
      </>
    </ProtectedRoute>
  )
},
{
  path: '/task/photo',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <PhotoForm />
      </>
    </ProtectedRoute>
  )
},
{
  path: '/task/mood',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <MoodForm />
      </>
    </ProtectedRoute>
  )
},
{
  path: '/task/:type',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <TaskPage />
      </>
    </ProtectedRoute>
  ),
},
{
  path: '/reflection/photo/:id',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <PhotoForm />
      </>
    </ProtectedRoute>
  )
},
{
  path: '/reflection/journal/:id',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <JournalForm />
      </>
    </ProtectedRoute>
  )
},
{
  path: '/reflection/mood/:id',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <MoodForm />
      </>
    </ProtectedRoute>
  )
},
{
  path: '/reflection/daily/:id',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <DailyReflectionForm />
      </>
    </ProtectedRoute>
  )
},
{
  path: '/reflection/challenge/:id',
  element: (
    <ProtectedRoute>
      <>
        <Navbar />
        <DailyChallengeForm />
      </>
    </ProtectedRoute>
  )
},


])

const App= () =>{
  return (
    <Provider store={store}>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={appRouter} />
    </Provider>
  )
  
}
 export default App;