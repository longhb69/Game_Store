import GameDetail from './pages/GameDetail'
import './index.css'
import Home from './pages/Home'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import CategoryGame from './pages/CategoryGame'
import Header from './components/Header'
import Login from './pages/Login'
import { createContext } from 'react'
import { LoginProvider } from './LoginContext'
import DLCDetail from './pages/DLCDetail'
import Cart from './pages/Cart'
import Success from './pages/Success'
import NotFound from './pages/NotFound'
import FilterPage from './pages/FilterPage'
import Search from './pages/Search'
import SignUp from './pages/SignUp'
import Library from './pages/Library'
import Account from './pages/Account'
import Transactions from './components/Transactions'
import Password from './components/Password'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import Payment from './pages/Payment'
export const UserContext = createContext()

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="" element={<Home />} />
            <Route path="/app/:slug" element={<GameDetail />} />
            <Route path="/app/dlc/:slug" element={<DLCDetail />} />
            <Route path="/category/:slug" element={<CategoryGame />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/libary" element={<Library />} />
            <Route path="/cart/success/:id" element={<Success />} />
            <Route path="fillter/:slug" element={<FilterPage />} />
            <Route path="search/:q" element={<Search />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<Account />}>
                <Route path="transactions" element={<Transactions />} />
                <Route path="password" element={<Password />} />
            </Route>
        </Routes>
    )
}

function App() {
    return (
        <LoginProvider>
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route 
                        path="/*"
                        element={
                            <>
                                <Header/>
                                <MainRoutes />
                                <Footer/>
                            </>
                        }
                    />
                    <Route path="/payment" element={<Payment />} />
                </Routes>
            </Router>
        </LoginProvider>
    )
}
export default App
