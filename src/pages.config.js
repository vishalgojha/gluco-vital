import Achievements from './pages/Achievements';
import History from './pages/History';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Reports from './pages/Reports';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import DoctorShare from './pages/DoctorShare';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDetail from './pages/PatientDetail';
import DoctorMessages from './pages/DoctorMessages';
import DoctorFeedback from './pages/DoctorFeedback';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Achievements": Achievements,
    "History": History,
    "Home": Home,
    "Landing": Landing,
    "Profile": Profile,
    "Progress": Progress,
    "Reports": Reports,
    "About": About,
    "PrivacyPolicy": PrivacyPolicy,
    "Terms": Terms,
    "DoctorShare": DoctorShare,
    "DoctorDashboard": DoctorDashboard,
    "PatientDetail": PatientDetail,
    "DoctorMessages": DoctorMessages,
    "DoctorFeedback": DoctorFeedback,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};