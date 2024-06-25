"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { refreshToken } from "../api/auth";

export default function SideNav({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let username = "";

    if (typeof window !== "undefined") {
        username = localStorage.getItem("user") || "";
    }

    const [expiresIn, setExpiresIn] = useState<number | null>(null);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    useEffect(() => {
        const tokenExpiresIn = parseInt(
            localStorage.getItem("expires_in") || "0",
            10,
        );
        setExpiresIn(tokenExpiresIn);

        const interval = setInterval(() => {
            setExpiresIn((prevExpiresIn) =>
                prevExpiresIn && prevExpiresIn > 0 ? prevExpiresIn - 1 : 0,
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container-fluid overflow-hidden bg-white">
            <div className="row vh-100 overflow-auto">
                <div className="col-12 col-sm-3 col-xl-2 px-sm-2 px-0 bg d-flex sticky-top shadow">
                    <div className="d-flex flex-sm-column flex-row flex-grow-1 align-items-center align-items-sm-start px-3 pt-2 text-white">
                        <a
                            href="/"
                            className="d-flex align-items-center pb-sm-3 mb-md-0 me-md-auto text-white text-decoration-none"
                        >
                            <span className="fs-5">
                                HKA
                                <span className="d-none d-sm-inline text-danger">
                                    {" "}
                                    Bücherverwaltung
                                </span>
                            </span>
                        </a>
                        <ul
                            className="nav nav-pills flex-sm-column flex-row flex-nowrap flex-shrink-1 flex-sm-grow-0 flex-grow-1 mb-sm-auto mb-0 justify-content-center align-items-center align-items-sm-start"
                            id="menu"
                        >
                            <li className="nav-item">
                                <Link
                                    href="/buecher"
                                    className="nav-link px-sm-0 px-2"
                                >
                                    <i className="fs-5 bi-house"></i>
                                    <span className="ms-1 d-none d-sm-inline link-dark">
                                        Home
                                    </span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    href="/buecher/create"
                                    className="nav-link px-sm-0 px-2"
                                >
                                    <span className="ms-1 d-none d-sm-inline link-dark">
                                        Create
                                    </span>
                                </Link>
                            </li>
                        </ul>
                        <div className="dropdown py-sm-4 mt-sm-auto ms-auto ms-sm-0 flex-shrink-1">
                            <a
                                href="#"
                                className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                                id="dropdownUser1"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <Image
                                    src="/profil.jpg"
                                    alt="hugenerd"
                                    width="28"
                                    height="28"
                                    className="rounded-circle"
                                />
                                <span className="d-none d-sm-inline mx-1 text-dark">
                                    {username}
                                </span>
                            </a>
                            <ul
                                className="dropdown-menu dropdown-menu-dark text-small shadow"
                                aria-labelledby="dropdownUser1"
                            >
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <p className="dropdown-item-text">
                                        {(expiresIn !== null && expiresIn !== 0) ? (
                                            <>
                                                Token läuft ab in:{" "}
                                                {formatTime(expiresIn)}
                                                <br />
                                            </>
                                        ) : (
                                            "Token ist abgelaufen!"
                                        )}
                                    </p>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <Link
                                        className="dropdown-item"
                                        href={"#"}
                                        onClick={async () => {
                                            await refreshToken();
                                            alert("Token wurde erneuert");
                                            window.location.href = "/";
                                        }}
                                    >
                                        Token Erneuern
                                    </Link>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <Link
                                        className="dropdown-item"
                                        onClick={() => {
                                            if (typeof window !== "undefined") {
                                                localStorage.removeItem(
                                                    "token",
                                                );
                                                localStorage.removeItem("user");
                                            }
                                            //signOut();
                                        }}
                                        href={"/"}
                                    >
                                        Abmelden
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col d-flex flex-column h-sm-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
