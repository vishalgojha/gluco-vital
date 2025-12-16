import Achievements from './pages/Achievements';
import History from './pages/History';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Progress from './pages/Progress';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "History": History,
    "Home": Home,
    "Landing": Landing,
    "Profile": Profile,
    "Reports": Reports,
    "Progress": Progress,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};