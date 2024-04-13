import React, { Suspense } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  IoChatboxOutline,
  IoCloudUploadOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { Loading } from "@/components";

const appRoutes: RouteData[] = [
  { path: "/", icon: <IoChatboxOutline /> },
  { path: "/load", icon: <IoCloudUploadOutline /> },
  { path: "/settings", icon: <IoSettingsOutline /> },
];

interface RouteData {
  path: string;
  label?: string;
  icon?: React.ReactNode;
  children?: RouteData[];
}

interface NavItemProp {
  route: RouteData;
}

const NavItem: React.FC<NavItemProp> = ({ route }) => {
  return (
    <NavLink
      to={route.path}
      className="transition-all p-3 rounded hover:bg-slate-200 [&.active]:bg-slate-200"
    >
      {route.label && <div>{route.label}</div>}
      {route.icon && <div className="text-2xl">{route.icon}</div>}
    </NavLink>
  );
};

export default function Layout() {
  return (
    <div className="w-screen h-screen flex justify-start bg-white">
      <nav className="w-16 h-full border-r">
        <div className="flex flex-col items-center justify-center text-center h-16 w-full text-lg font-extrabold">
          PDFI
        </div>
        <div className="flex flex-col items-center justify-center py-2">
          {appRoutes.map((route, idx) => {
            return <NavItem route={route} key={idx} />;
          })}
        </div>
      </nav>
      <main className="flex flex-1">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
