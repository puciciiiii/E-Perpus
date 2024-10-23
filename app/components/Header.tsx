import Link from 'next/link'
import React from 'react'

export default function Header() {
    return (
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                <Link className="navbar-brand brand-logo" href="/">
                    <img src="/images/logo-perpus.jpg" alt="logo" />
                    <span><h3 style={{color: 'white'}}>E PERPUS</h3></span>
                </Link>
                {/* <Link className="navbar-brand brand-logo-mini" href="/">
                    <img src="/images/logo-perpus.jpg" alt="logo" />
                </Link> */}
            </div>
            <div className="navbar-menu-wrapper d-flex align-items-stretch">
                <button
                    className="navbar-toggler navbar-toggler align-self-center"
                    type="button"
                    data-toggle="minimize"
                >
                    <span className="mdi mdi-menu" />
                </button>
                    {/* <form className="d-flex align-items-center h-100" action="#">
                        <div className="input-group">
                            <div className="input-group-prepend bg-transparent">
                                <h2>E PERPUS</h2>
                            </div>
                        </div>
                    </form> */}

                {/* <ul className="navbar-nav navbar-nav-right">
                    <li className="nav-item nav-profile dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            id="profileDropdown"
                            href="#"
                            data-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <div className="nav-profile-img">
                                <img src="/images/faces/logo.jpg" alt="image" />
                            </div>
                            <div className="nav-profile-text">
                                <p className="mb-1 text-black">Options</p>
                            </div>
                        </a>
                        <div
                            className="dropdown-menu navbar-dropdown dropdown-menu-right p-0 border-0 font-size-sm"
                            aria-labelledby="profileDropdown"
                            data-x-placement="bottom-end"
                        >
                            <div className="p-3 text-center bg-primary">
                                <img
                                    className="img-avatar img-avatar48 img-avatar-thumb"
                                    src="/images/faces/logo.jpg"
                                    alt=""
                                />
                            </div>
                            <div className="p-2">
                                <h5 className="dropdown-header text-uppercase pl-2 text-dark">
                                    User Options
                                </h5>
                                <a
                                    className="dropdown-item py-1 d-flex align-items-center justify-content-between"
                                    href="#"
                                >
                                    <span>Inbox</span>
                                    <span className="p-0">
                                        <span className="badge badge-primary">3</span>
                                        <i className="mdi mdi-email-open-outline ml-1" />
                                    </span>
                                </a>
                                <a
                                    className="dropdown-item py-1 d-flex align-items-center justify-content-between"
                                    href="#"
                                >
                                    <span>Profile</span>
                                    <span className="p-0">
                                        <span className="badge badge-success">1</span>
                                        <i className="mdi mdi-account-outline ml-1" />
                                    </span>
                                </a> */}
                                {/* <a
                                    className="dropdown-item py-1 d-flex align-items-center justify-content-between"
                                    href="javascript:void(0)"
                                >
                                    <span>Settings</span>
                                    <i className="mdi mdi-settings" />
                                </a> */}
                                {/* <div role="separator" className="dropdown-divider" />
                                <h5 className="dropdown-header text-uppercase  pl-2 text-dark mt-2">
                                    Actions
                                </h5>
                                <a
                                    className="dropdown-item py-1 d-flex align-items-center justify-content-between"
                                    href="#"
                                >
                                    <span>Lock Account</span>
                                    <i className="mdi mdi-lock ml-1" />
                                </a>
                                <a
                                    className="dropdown-item py-1 d-flex align-items-center justify-content-between"
                                    href="#"
                                >
                                    <span>Log Out</span>
                                    <i className="mdi mdi-logout ml-1" />
                                </a>
                            </div>
                        </div>
                    </li>
                    
                </ul>
                <button
                    className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
                    type="button"
                    data-toggle="offcanvas"
                >
                    <span className="mdi mdi-menu" />
                </button> */}
            </div>
        </nav>

    )
}
