import About from './pages/About';
import Achievements from './pages/Achievements';
import AdminDashboard from './pages/AdminDashboard';
import CancellationRefund from './pages/CancellationRefund';
import CareHub from './pages/CareHub';
import CaregiverDashboard from './pages/CaregiverDashboard';
import ContactUs from './pages/ContactUs';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorFeedback from './pages/DoctorFeedback';
import DoctorMessages from './pages/DoctorMessages';
import DoctorShare from './pages/DoctorShare';
import DoctorSummary from './pages/DoctorSummary';
import Documentation from './pages/Documentation';
import History from './pages/History';
import Home from './pages/Home';
import Landing from './pages/Landing';
import MarketingContent from './pages/MarketingContent';
import PatientDetail from './pages/PatientDetail';
import PatientFeedback from './pages/PatientFeedback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import Reports from './pages/Reports';
import Terms from './pages/Terms';
import Subscription from './pages/Subscription';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "Achievements": Achievements,
    "AdminDashboard": AdminDashboard,
    "CancellationRefund": CancellationRefund,
    "CareHub": CareHub,
    "CaregiverDashboard": CaregiverDashboard,
    "ContactUs": ContactUs,
    "DoctorDashboard": DoctorDashboard,
    "DoctorFeedback": DoctorFeedback,
    "DoctorMessages": DoctorMessages,
    "DoctorShare": DoctorShare,
    "DoctorSummary": DoctorSummary,
    "Documentation": Documentation,
    "History": History,
    "Home": Home,
    "Landing": Landing,
    "MarketingContent": MarketingContent,
    "PatientDetail": PatientDetail,
    "PatientFeedback": PatientFeedback,
    "PrivacyPolicy": PrivacyPolicy,
    "Profile": Profile,
    "Progress": Progress,
    "Reports": Reports,
    "Terms": Terms,
    "Subscription": Subscription,
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};