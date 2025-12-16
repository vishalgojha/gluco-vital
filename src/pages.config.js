import Achievements from './pages/Achievements';
import History from './pages/History';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Reports from './pages/Reports';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "History": History,
    "Home": Home,
    "Landing": Landing,
    "Profile": Profile,
    "Progress": Progress,
    "Reports": Reports,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};