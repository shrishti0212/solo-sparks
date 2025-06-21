import {Provider} from "react-redux";
import store from './utils/store';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Quests from "./pages/Quests";
import Rewards from "./pages/Rewards";
import MoodCheckin from "./pages/MoodCheckin";

import UploadAudioReflection from "./components/UploadAudioReflection";
import UploadPhotoReflection from "./components/UploadPhotoReflection";
import ProtectedRoute from "./components/ProtectedRoute";

const appRouter = createBrowserRouter([
  {
    path:'/',
    element: (
      <>
        <Navbar/>,
        <Home/>
      </>
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
    element:<Login/>
  },

  {
    path:'/register',
    element:<Register/>
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
    path: '/quests',
    element: (
      <ProtectedRoute>
      <>
        <Navbar />
        <Quests />
      </>
      </ProtectedRoute>
    ),
  },

  {
    path:'/mood-checkin',
    element:(
      <ProtectedRoute>
        <>
        <Navbar/>
        <MoodCheckin/>
        </>
      </ProtectedRoute>
    )
  },
  {
    path:'/upload/audio',
    element:(
      <ProtectedRoute>
        <>
        <Navbar/>
        <UploadAudioReflection/>
        </>
      </ProtectedRoute>
    )
  },
  {
    path:'/upload/photo',
    element:(
      <ProtectedRoute>
        <>
        <Navbar/>
        <UploadPhotoReflection/>
        </>
      </ProtectedRoute>
    )
  },

])

const App= () =>{
  return (
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  )
  
}
 export default App;