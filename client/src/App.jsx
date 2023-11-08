import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import About from "./pages/About"
import Profile from "./pages/Profile"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import UpdateListing from "./pages/UpdateListing"
import Listing from "./pages/Listing"

export default function SignOut() {
  return <BrowserRouter>
  <Header/>
  <Routes>
    <Route path="/" element={<Home/>}></Route>
    <Route path="/sign-in" element={<SignIn/>}></Route>
    <Route path="/sign-up" element={<SignUp/>}></Route>
    <Route path="/about" element={<About/>}></Route>
    <Route path="/listing/:listingId" element={<Listing/>}></Route>
    <Route element={<PrivateRoute/>}>
      <Route path="/profile" element={<Profile/>}></Route>
      <Route path="/create-listing" element={<CreateListing/>}></Route>
      <Route path="/update-listing/:listingId" element={<UpdateListing/>}></Route>
      
    </Route>
  </Routes>
  </BrowserRouter>
}