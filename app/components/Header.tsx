import Link from "next/link";
import React from "react";
import Image from "next/image"; // Impor komponen Image

export default function Header() {
  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo" href="/">
          <Image
            src="/images/logo-perpus.jpg"
            alt="logo"
            width={100} // Ganti dengan lebar yang sesuai
            height={50} // Ganti dengan tinggi yang sesuai
          />
          <span>
            <h3 style={{ color: "white" }}>E PERPUS</h3>
          </span>
        </Link>
        {/* <Link className="navbar-brand brand-logo-mini" href="/">
                    <Image 
                        src="/images/logo-perpus.jpg" 
                        alt="logo" 
                        width={50} // Ganti dengan lebar yang sesuai
                        height={25} // Ganti dengan tinggi yang sesuai
                    />
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
        {/* Komponen lainnya */}
      </div>
    </nav>
  );
}
