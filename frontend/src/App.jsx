import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { MainLayout } from "./layouts/MainLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Accounts } from "./pages/Accounts";
import Backup from "./pages/Backup";
import { AccountForm } from "./components/AccountForm";
import { Recovery } from "./pages/Recovery";
import { NotFound } from "./pages/NotFound";
import { getToken } from "./utils/auth";

function PublicRoot() {
  if (getToken()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

function App() {
  return (<BrowserRouter>
    <Routes>
      <Route element={<PublicRoot />}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/new" element={<AccountForm />} />
            <Route path="/accounts/:id/edit" element={<AccountForm />} />
            <Route path="/recovery/:id" element={<Recovery />} />
            <Route path="/backup" element={<Backup />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
