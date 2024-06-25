import React from "react";
import SideNav from "../../components/SideNav";
import BootstrapClient from "@/components/BootstrapClient";
import RequireAuth from "../../components/RequireAut";


export const metadata = {
    title: "Login",
    description: "Anmelden",
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
};

export default Layout;
