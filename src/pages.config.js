import About from './pages/About';
import Achievements from './pages/Achievements';
import AdminDashboard from './pages/AdminDashboard';
import CareHub from './pages/CareHub';
import CaregiverDashboard from './pages/CaregiverDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorFeedback from './pages/DoctorFeedback';
import DoctorMessages from './pages/DoctorMessages';
import DoctorShare from './pages/DoctorShare';
import History from './pages/History';
import Home from './pages/Home';
import MarketingContent from './pages/MarketingContent';
import PatientDetail from './pages/PatientDetail';
import PatientFeedback from './pages/PatientFeedback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Reports from './pages/Reports';
import Terms from './pages/Terms';
import Landing from './pages/Landing';
import ContactUs from './pages/ContactUs';
import CancellationRefund from './pages/CancellationRefund';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Achievements": Achievements,
    "AdminDashboard": AdminDashboard,
    "CareHub": CareHub,
    "CaregiverDashboard": CaregiverDashboard,
    "DoctorDashboard": DoctorDashboard,
    "DoctorFeedback": DoctorFeedback,
    "DoctorMessages": DoctorMessages,
    "DoctorShare": DoctorShare,
    "History": History,
    "Home": Home,
    "MarketingContent": MarketingContent,
    "PatientDetail": PatientDetail,
    "PatientFeedback": PatientFeedback,
    "PrivacyPolicy": PrivacyPolicy,
    "Profile": Profile,
    "Progress": Progress,
    "Reports": Reports,
    "Terms": Terms,
    "Landing": Landing,
    "ContactUs": ContactUs,
    "CancellationRefund": CancellationRefund,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};