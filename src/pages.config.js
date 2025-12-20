import About from './pages/About';
import Achievements from './pages/Achievements';
import CareHub from './pages/CareHub';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorFeedback from './pages/DoctorFeedback';
import DoctorMessages from './pages/DoctorMessages';
import DoctorShare from './pages/DoctorShare';
import History from './pages/History';
import Home from './pages/Home';
import Landing from './pages/Landing';
import PatientDetail from './pages/PatientDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Reports from './pages/Reports';
import Terms from './pages/Terms';
import AdminDashboard from './pages/AdminDashboard';
import MarketingContent from './pages/MarketingContent';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Achievements": Achievements,
    "CareHub": CareHub,
    "DoctorDashboard": DoctorDashboard,
    "DoctorFeedback": DoctorFeedback,
    "DoctorMessages": DoctorMessages,
    "DoctorShare": DoctorShare,
    "History": History,
    "Home": Home,
    "Landing": Landing,
    "PatientDetail": PatientDetail,
    "PrivacyPolicy": PrivacyPolicy,
    "Profile": Profile,
    "Progress": Progress,
    "Reports": Reports,
    "Terms": Terms,
    "AdminDashboard": AdminDashboard,
    "MarketingContent": MarketingContent,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};