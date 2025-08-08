import React from 'react'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MyProfile from './pages/MyProfile'
import Navbar from './components/Navbar'
import History from './pages/History'
import Report from './pages/Report';
// import SignIn from './pages/SignIn'
// import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlantSegmentationInterface from './pages/Segment'

const App = () => {
 return (
       <div>
        <ToastContainer/>
         <Routes>
          <Route path="/" element={
            <>
              <Navbar isDarkBackground={true} />
              <Home />
            </>
          } />
          <Route path="/my-profile" element={
            <>
              <Navbar isDarkBackground={false} />
              <MyProfile />
            </>
          } />
          <Route path="/history" element={
            <>
              <Navbar isDarkBackground={false} />
              <History />
            </>
          } />
          <Route path="/report/:id" element={
            <>
              <Navbar isDarkBackground={false} />
              <Report />
            </>
          } />
          <Route path="/login" element={
            <>
              <Login />
            </>
          } />
          <Route path="/segment" element={
            <>
              <PlantSegmentationInterface />
            </>
          } />
        </Routes>
       </div>
     
   )
 }

 export default App
