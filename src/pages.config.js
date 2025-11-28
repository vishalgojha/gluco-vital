import Home from './pages/Home';
import Profile from './pages/Profile';
import History from './pages/History';
import Achievements from './pages/Achievements';
import Reports from './pages/Reports';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Profile": Profile,
    "History": History,
    "Achievements": Achievements,
    "Reports": Reports,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};