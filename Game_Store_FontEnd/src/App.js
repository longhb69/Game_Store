import GameDeatail from './pages/GameDeatail';
import './index.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryGame from './pages/CategoryGame';
import Header from './components/Header';
import Login from './pages/Login';
import { createContext} from 'react';
import { LoginProvider } from './LoginContext';
import DLCDeatail from './pages/DLCDeatail';
import Cart from './pages/Cart';
import Success from './pages/Success';
import NotFound from './pages/NotFound';
import FillterPage from './pages/FilterPage';
import Search from './pages/Search';
import SignUp from './pages/SignUp';
import Libary from './pages/Libary';
import Account from './pages/Account';
import Transactions from './components/Transactions';
import Password from './components/Password';
import ScrollToTop from './components/ScrollToTop';
export const UserContext = createContext();

function App() {
  return (
    <LoginProvider>
        <Router>
         <ScrollToTop />
            <Header>
              <Routes>
                  <Route path="" element={<Home/>}/>
                  <Route path="/app/:slug" element={<GameDeatail/>}/>
                  <Route path="/app/dlc/:slug" element={<DLCDeatail/>}/>
                  <Route path="/category/:slug" element={<CategoryGame/>}/>
                  <Route path="/cart" element={<Cart/>}/>
                  <Route path="/libary" element={<Libary/>}/>
                  <Route path="/cart/success/:id" element={<Success/>}/>
                  <Route path="fillter/:slug" element={<FillterPage/>}/>
                  <Route path="search/:q" element={<Search/>}/>
                  <Route path="/404" element={<NotFound/>}/>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/signup" element={<SignUp/>}/>
                  <Route path="/account" element={<Account/>}>
                        <Route path='transactions' element={<Transactions/>}/>
                        <Route path="password" element={<Password/>} />
                  </Route>
              </Routes>
            </Header>
        </Router>
    </LoginProvider>
  );
}
export default App;
