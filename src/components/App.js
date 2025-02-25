import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ClubLogin from "./ClubLogin";
import GroupsPage from "./GroupsPage";
import AddGroupPage from "./AddGroupPage";
import GroupDetailPage from "./GroupDetailPage";
import EditGroupPage from "./EditGroupPage";
import TrainingHoursPage from "./TrainingHoursPage";
import EditTrainingHoursPage from "./EditTrainingHoursPage";
import ListPage from "./ListPage";
import FeePage from "./FeePage";
import AttendancePage from "./AttendancePage";
import PlayerRegisterPage from "./PlayerRegisterPage";
import KVKKPage from "./KVKKPage";
import PlayerDashboard from "./PlayerDashboard";
import PlayerAuthPage from "./PlayerAuthPage";
import "bootstrap/dist/css/bootstrap.min.css";
import PlayerFeePage from "./PlayerFeePage";
import PlayerAttendance from "./PlayerAttendance";
import PlayerTrainingHours from "./PlayerTrainingHours";
import PastAttendancePage from "./PastAttendancePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/club-login" element={<ClubLogin />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/edit-group/:id" element={<EditGroupPage />} />
        <Route path="/add-group" element={<AddGroupPage />} />
        <Route path="/group/:teamId" element={<GroupDetailPage />} />
        <Route path="/training-hours/:groupId" element={<TrainingHoursPage />} />
        <Route path="/edit-training-hours/:groupId/:day" element={<EditTrainingHoursPage />} />
        <Route path="/list-page/:groupId" element={<ListPage />} />
        <Route path="/fee/:groupId" element={<FeePage />} />
        <Route path="/attendance/:groupId" element={<AttendancePage />} />
        <Route path="/past-attendance/:groupId" element={<PastAttendancePage />} />{" "}


        <Route path="/playerAuth" element={<PlayerAuthPage />} />
        <Route path="/playerRegister" element={<PlayerRegisterPage />} />
        <Route path="/kvkk" element={<KVKKPage />} />
        <Route path="/playerDashboard" element={<PlayerDashboard />} />
        <Route path="/player-attendance/:team" element={<PlayerAttendance />} />
        <Route path="/player/fees" element={<PlayerFeePage />} />
        <Route path="/trainingHours/:team" element={<PlayerTrainingHours />} />{" "}
      </Routes>
    </Router>
  );
}
export default App;

