import { Routes,Route } from "react-router-dom"
import IndexPage from "./Pages/IndexPage"
import LoginPage from "./Pages/LoginPage"
import LayoutPage from "./Pages/LayoutPage"
import RegisterPage from "./Pages/RegisterPage"
import axios from "axios"
import { UserContextProvider } from "./UserContext"
import ProfilePage from "./Pages/ProfilePage"
import PlacesPage from "./Pages/PlacesPage"
import PlacesFormPage from "./Pages/PlacesFormPage"
import PlacePage from "./Pages/PlacePage"
import BookingsPage from "./Pages/BookingsPage"
import BookingPage from "./Pages/BookingPage"

axios.defaults.baseURL ='http://localhost:4000'

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<LayoutPage />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
