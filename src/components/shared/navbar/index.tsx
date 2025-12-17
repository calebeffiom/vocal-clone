"use client"
import Container from "../container"
import Link from "next/link";
import { useState } from "react";
import { User } from "lucide-react";

const Navbar = () => {
    const [isloggedIn, setIsLoggedIn] = useState(true);
    return (
        <nav className="sticky top-0 z-50 bg-white border-b-[1px] border-[#2E2E2E]/30">
            <Container>
                <div className="flex justify-between items-center py-[15px]">
                    <div className="logo-cont text-[30px] font-[600] text-[#2E2E2E]">
                        <h2>Ink Labs</h2>
                    </div>
                    <div className="nav-search-profile-cont flex items-center">
                        <div className="nav-links-cont flex items-center justify-between">
                            <ul className="flex gap-[30px] items-center text-[#2E2E2E]">
                                <li><Link href="/trending-stories">Trending Stories</Link></li>
                                <li><Link href="/latest-stories">Latest Stories </Link></li>
                                {isloggedIn === false &&<li> <Link href="#">Signin</Link> </li>}
                                <li className="rounded-[10px] bg-[#2E2E2E] text-[#fff]">{isloggedIn === false ? <Link href="/" className="py-[8px] px-[30px] block">Get Started</Link> : <Link href="/create-story" className="py-[8px] px-[30px] block">Create Story</Link>}</li>
                                {isloggedIn === true && <li> <Link href="/profile"><User className="text-[30px]"/></Link></li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        </nav>
    )
}
export default Navbar