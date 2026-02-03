"use client"
import Container from "../container"
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/utils/states/userAtom";

const Navbar = () => {
    const { data: session, status } = useSession();
    const user = useRecoilValue(userAtom);
    const isLoggedIn = status === "authenticated";
    const profileImage =
        user?.image || session?.user?.image || "/images/profile.png";
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="sticky top-0 z-50 bg-white border-b-[1px] border-[#2E2E2E]/30">
            <Container>
                <div className="flex justify-between items-center py-[15px] relative">
                    <div className="logo-cont text-[24px] md:text-[30px] font-[600] text-[#2E2E2E]">
                        <Link href="/">Ink Labs</Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        {isLoggedIn && (
                            <Link href="/profile" className="text-[#2E2E2E]">
                                <img
                                    src={profileImage}
                                    loading="eager"
                                    alt="Profile"
                                    className="h-9 w-9 rounded-full object-cover border border-gray-200"
                                />
                            </Link>
                        )}
                        <button
                            onClick={toggleMenu}
                            className="relative text-[#2E2E2E] focus:outline-none p-1"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            {/* Animated icon swap */}
                            <span
                                className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out ${isMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-90"}`}
                            >
                                <X className="w-7 h-7" />
                            </span>
                            <span
                                className={`flex items-center justify-center transition-all duration-200 ease-out ${isMenuOpen ? "opacity-0 rotate-90 scale-90" : "opacity-100 rotate-0 scale-100"}`}
                            >
                                <Menu className="w-7 h-7" />
                            </span>
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                        <ul className="flex gap-[30px] items-center text-[#2E2E2E]">
                            <li><Link href="/trending-stories" className="hover:text-gray-600 transition-colors">Trending Stories</Link></li>
                            <li><Link href="/latest-stories" className="hover:text-gray-600 transition-colors">Latest Stories</Link></li>
                            {isLoggedIn === false && <li> <Link href="/signup" className="hover:text-gray-600 transition-colors">Signin</Link> </li>}
                            <li className="rounded-[10px] bg-[#2E2E2E] text-[#fff] hover:bg-[#404040] transition-colors">
                                {isLoggedIn === false ?
                                    <Link href="/" className="py-[8px] px-[30px] block">Get Started</Link> :
                                    <Link href="/create-story" className="py-[8px] px-[30px] block">Create Story</Link>
                                }
                            </li>
                            {isLoggedIn === true &&
                                <li>
                                    <Link href="/profile" className="hover:text-gray-600 transition-colors">
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                        />
                                    </Link>
                                </li>
                            }
                        </ul>
                    </div>

                    {/* Mobile Menu + Backdrop (mounted for smooth transitions) */}
                    <div className="md:hidden absolute left-0 top-full w-full">
                        {/* Backdrop */}
                        <div
                            onClick={() => setIsMenuOpen(false)}
                            className={`fixed inset-0 bg-black/20 transition-opacity duration-200 ease-out ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                        />

                        {/* Panel */}
                        <div
                            className={`w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-200 ease-out origin-top ${isMenuOpen ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto" : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"}`}
                        >
                            <div className="py-6 px-4 flex flex-col gap-6">
                                <ul className="flex flex-col gap-5 text-lg font-medium text-[#2E2E2E]">
                                    <li><Link href="/trending-stories" onClick={toggleMenu}>Trending Stories</Link></li>
                                    <li><Link href="/latest-stories" onClick={toggleMenu}>Latest Stories</Link></li>
                                    {isLoggedIn === false && <li><Link href="/signup" onClick={toggleMenu}>Signin</Link></li>}
                                    <li>
                                        <Link
                                            href={isLoggedIn ? "/create-story" : "/"}
                                            onClick={toggleMenu}
                                            className="inline-block bg-[#2E2E2E] text-white py-3 px-8 rounded-xl text-center w-full transition-transform duration-200 active:scale-[0.98]"
                                        >
                                            {isLoggedIn ? "Create Story" : "Get Started"}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </nav>
    )
}
export default Navbar