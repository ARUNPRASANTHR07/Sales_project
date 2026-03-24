import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Loginpage';
import Mainpage from './Pages/Mainpage';
import ViewCouponDetails from './Pages/influencer/ViewCouponDetails';
import InfluencerWiseView from './Pages/influencer/InfluencerWiseView';
import Report from './Pages/Report';
import "./index.css"; // ✅ Tailwind CSS
import KPIMaster from './Pages/KPI/KPIMaster';
import KPIProcessMaster from './Pages/KPI/KPIProcessMaster';
import KPI from './Pages/KPI';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Mainpage" element={<Mainpage />} />
        <Route path="/Report" element={<Report />} />
        <Route path="/KPIMaster" element={<KPIMaster />} />
        <Route path="/KPIProcessMaster" element={<KPIProcessMaster />} />
        <Route path="/KPI/*" element={<KPI />} />
        <Route path="/ViewCouponDetails" element={<ViewCouponDetails />} />
        <Route path="/InfluencerWiseView" element={<InfluencerWiseView />} />



      </Routes>
    </Router>
  );
};

export default App;
