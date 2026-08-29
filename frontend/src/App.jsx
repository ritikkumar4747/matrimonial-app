import { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import MutualMatches from "./pages/MutualMatches";
import Profile from "./pages/Profile";
import Sent from "./pages/Sent";
import Received from "./pages/Received";
import Chat from "./pages/Chat";
import DailyMatch from "./pages/DailyMatch";
import Gallery from "./pages/Gallery";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import PrivateLayout from "./layouts/PrivateLayout";
import PublicLayout from "./layouts/PublicLayout";
import Chatbot from "./components/Chatbot";
import FloatingChatButton from "./components/FloatingChatButton";

export default function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <PublicLayout>
                <Home />
              </PublicLayout>
            </PublicRoute>
          }
        />

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

        <Route
          path="/dashboard"
          element={<PrivateRoute><PrivateLayout><Dashboard /></PrivateLayout></PrivateRoute>}
        />

        <Route
          path="/matches"
          element={<PrivateRoute><PrivateLayout><Matches /></PrivateLayout></PrivateRoute>}
        />

        <Route
          path="/matches/mutual"
          element={<PrivateRoute><PrivateLayout><MutualMatches /></PrivateLayout></PrivateRoute>}
        />

        <Route
          path="/profile"
          element={<PrivateRoute><PrivateLayout><Profile /></PrivateLayout></PrivateRoute>}
        />

        <Route
          path="/profile/:id"
          element={<PrivateRoute><PrivateLayout><Profile /></PrivateLayout></PrivateRoute>}
        />

        <Route
          path="/gallery"
          element={<PrivateRoute><PrivateLayout><Gallery /></PrivateLayout></PrivateRoute>}
        />

        <Route
          path="/gallery/:id"
          element={<PrivateRoute><PrivateLayout><Gallery /></PrivateLayout></PrivateRoute>}
        />

        <Route
          path="/sent"
          element={<PrivateRoute><PrivateLayout><Sent /></PrivateLayout></PrivateRoute>}
        />

        <Route
          path="/received"
          element={<PrivateRoute><PrivateLayout><Received /></PrivateLayout></PrivateRoute>}
        />

        <Route
          path="/chat/:id"
          element={<PrivateRoute><PrivateLayout><Chat /></PrivateLayout></PrivateRoute>}
        />

        <Route
          path="/daily-match"
          element={<PrivateRoute><PrivateLayout><DailyMatch /></PrivateLayout></PrivateRoute>}
        />
      </Routes>

      {/* Floating Chat Button - Available on all pages */}
      <FloatingChatButton onClick={() => setIsChatbotOpen(true)} />
      
      {/* Chatbot Modal - Available on all pages */}
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
}
