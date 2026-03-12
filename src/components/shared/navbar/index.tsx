"use client"
import Container from "../container"
import Link from "next/link";
import { useState } from "react";
import { Menu, X, TrendingUp, Clock, PenSquare, User } from "lucide-react";
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
                    <div className="md:hidden absolute left-0 right-0 top-full">
                        {/* Backdrop */}
                        <div
                            onClick={() => setIsMenuOpen(false)}
                            className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-200 ease-out ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                        />

                        {/* Panel */}
                        <div
                            className={`relative mx-4 mt-2 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden transition-all duration-200 ease-out origin-top ${isMenuOpen ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto" : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"}`}
                        >
                            {isLoggedIn && (
                                <div className="flex items-center gap-3 px-5 py-4 bg-gray-50/80 border-b border-gray-100">
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="h-11 w-11 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-[#2E2E2E] truncate">{user?.name || session?.user?.name || "Profile"}</p>
                                        <Link href="/profile" onClick={toggleMenu} className="text-sm text-gray-500 hover:text-[#2E2E2E]">
                                            View profile
                                        </Link>
                                    </div>
                                </div>
                            )}
                            <div className="py-3 px-2">
                                <ul className="flex flex-col">
                                    <li>
                                        <Link href="/trending-stories" onClick={toggleMenu} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#2E2E2E] font-medium hover:bg-gray-100 active:bg-gray-100 transition-colors">
                                            <TrendingUp className="w-5 h-5 text-gray-500" />
                                            Trending Stories
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/latest-stories" onClick={toggleMenu} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#2E2E2E] font-medium hover:bg-gray-100 active:bg-gray-100 transition-colors">
                                            <Clock className="w-5 h-5 text-gray-500" />
                                            Latest Stories
                                        </Link>
                                    </li>
                                    {isLoggedIn && (
                                        <li>
                                            <Link href="/profile" onClick={toggleMenu} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#2E2E2E] font-medium hover:bg-gray-100 active:bg-gray-100 transition-colors">
                                                <User className="w-5 h-5 text-gray-500" />
                                                Profile
                                            </Link>
                                        </li>
                                    )}
                                    {!isLoggedIn && (
                                        <li>
                                            <Link href="/signup" onClick={toggleMenu} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#2E2E2E] font-medium hover:bg-gray-100 active:bg-gray-100 transition-colors">
                                            <User className="w-5 h-5 text-gray-500" />
                                                Signin
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                                <div className="mx-2 mt-2 pt-2 border-t border-gray-100">
                                    <Link
                                        href={isLoggedIn ? "/create-story" : "/"}
                                        onClick={toggleMenu}
                                        className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-[#2E2E2E] text-white font-semibold hover:bg-[#404040] active:scale-[0.98] transition-all"
                                    >
                                        <PenSquare className="w-5 h-5" />
                                        {isLoggedIn ? "Create Story" : "Get Started"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </nav>
    )
}
export default Navbar