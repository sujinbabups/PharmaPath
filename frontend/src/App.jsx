import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'

import './App.css'
import Wholesaler from './pages/Wholesaler'
import HomePage from './pages/HomePage'
import Manufacture from './pages/Manufacture'
import Pharmacies from './pages/Pharmacies'
import Regulators from './pages/Regulators'


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
      <Route path='/' element={<HomePage/>} />

      <Route path='/manufacture' element={<Manufacture/>}/>
      <Route path='/wholesaler' element={<Wholesaler/>}/>
      <Route path='/pharmacies' element={<Pharmacies/>} />
      <Route path='/regulators' element={<Regulators/>}/>
       
      
      </>



    ))
  return (
    <>
   
    <RouterProvider router={router} />

      
    </>
  )
}

export default App
