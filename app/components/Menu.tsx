import Link from "next/link";

export default function Menu() {

    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className="nav-item nav-category">Daftar</li>
                <li className="nav-item">
                    <Link className="nav-link" href='/'>
                        <span className="icon-bg">
                            <i className="mdi mdi-cube menu-icon" />
                        </span>
                        <span className="menu-title">Dashboard</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" href="/pinjaman">
                        <span className="icon-bg">
                            <i className="mdi mdi-cart menu-icon" />
                        </span>
                        <span className="menu-title">Peminjaman</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" href="/pengunjung">
                        <span className="icon-bg">
                            <i className="mdi mdi-account menu-icon" />
                        </span>
                        <span className="menu-title">Pengunjung</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <a
                        className="nav-link"
                        data-toggle="collapse"
                        href="#master"
                        aria-expanded="false"
                        aria-controls="master"
                    >
                        <span className="icon-bg">
                            <i className="mdi mdi-keyboard-settings menu-icon" />
                        </span>
                        <span className="menu-title">Master</span>
                        <i className="menu-arrow" />
                    </a>
                    <div className="collapse" id="master">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item">
                                {" "}
                                <Link className="nav-link" href="/master/kategori">
                                    Kategori
                                </Link>
                            </li>
                            <li className="nav-item">
                                {" "}
                                <Link className="nav-link" href="/master/lemari">
                                    Lemari
                                </Link>
                            </li>
                            <li className="nav-item">
                                {" "}
                                <Link className="nav-link" href="/master/rak">
                                    Rak
                                </Link>
                            </li>
                            <li className="nav-item">
                                {" "}
                                <Link className="nav-link" href="/master/buku">
                                    Buku
                                </Link>
                            </li>
                            <li className="nav-item">
                                {" "}
                                <Link className="nav-link" href="/master/daftaranggota">
                                    Anggota
                                </Link>
                            </li>
                            <li className="nav-item">
                                {" "}
                                <Link className="nav-link" href="/master/pengunjung">
                                    pengunjung
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
               
                <li className="nav-item">
                    <Link className="nav-link" href="/laporan">
                        <span className="icon-bg">
                            <i className="  mdi mdi-chart-line menu-icon" />
                        </span>
                        <span className="menu-title">Laporan</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" href="/daftaranggota"> {/*belum ada isi*/}
                        <span className="icon-bg">
                            <i className=" mdi mdi-account-group menu-icon" />
                        </span>
                        <span className="menu-title">Anggota</span>
                    </Link>
                </li>
                {/* <li className="nav-item sidebar-user-actions">
                    <div className="sidebar-user-menu">
                    <Link className="nav-link" href="/">
                            <i className="mdi mdi-settings menu-icon" />
                            <span className="menu-title">Settings</span>
                        </Link>
                    </div>
                </li> */}
{/* 
                <li className="nav-item sidebar-user-actions">
                    <div className="sidebar-user-menu">
                    <Link className="nav-link" href="/">
                            <i className="mdi mdi-logout menu-icon" />
                            <span className="menu-title">Log Out</span>
                        </Link>
                    </div>
                </li> */}
            </ul>
        </nav>

    )
}
