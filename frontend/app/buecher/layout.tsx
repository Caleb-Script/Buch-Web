import SideNav from "@/components/sidenav";
import BootstrapClient from "@/components/BootstrapClient";
import RequireAuth from "../../components/RequireAut";

// Importing CSS for Bootstrap and Font Awesome in _app.tsx is recommended
// import "bootstrap/dist/css/bootstrap.css";
// import "@fortawesome/fontawesome-svg-core/styles.css";

export const metadata = {
  title: "Bücherverwaltung",
  description: "Bücherverwaltungssystem",
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
      <RequireAuth>
        <SideNav>
          <BootstrapClient />
          {children}
        </SideNav>
      </RequireAuth>
  );
};

export default Layout;
