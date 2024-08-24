import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import NotFoundScreen from './screens/NotFoundScreen.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import { Provider } from 'react-redux'
import store from './store'
import RegisterScreen from './screens/RegisterScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen.jsx'
import UpdatePasswordScreen from './screens/UpdatePasswordScreen.jsx'
import CreatePostScreen from './screens/CreatePostScreen.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AllPostsScreen from './screens/AllPostsScreen.jsx'
import SinglePostScreen from './screens/SinglePostScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route path='/' element={<HomeScreen />} />
      <Route path='*' element={<NotFoundScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/forgotpassword' element={<ForgotPasswordScreen />} />
      <Route path='/update' element={<UpdatePasswordScreen />} />
      <Route path='/post/:id' element={<SinglePostScreen />} />
      <Route path='/allposts' element={<AllPostsScreen />} />
      <Route path='' element={<PrivateRoute />} >
       <Route path='/createpost' element={<CreatePostScreen />} />
       <Route path='/profile/:id' element={<ProfileScreen />} />
       
       
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider  router={router}/>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
)
