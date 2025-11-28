import Home from './pages/Home';
import Profile from './pages/Profile';
import History from './pages/History';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Profile": Profile,
    "History": History,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};