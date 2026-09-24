import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function TopNavigationBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Products', path: '/Products' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'How it Works', path: '/how-it-works' },
    ];
 
    const isActive = (path) => location.pathname === path;

    return ( 
        <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
            <nav className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-2xl px-6 py-3 flex items-center justify-between transition-all">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-1 group">
                    <span className="text-2xl font-black tracking-tight text-purple-600 transition-transform group-hover:scale-105">
                        Ip<span className="text-gray-900">s</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-100">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                isActive(link.path)
                                    ? 'bg-white text-purple-600 shadow-xs font-semibold'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Call to Actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        to="/login"
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm hover:shadow transition-all active:scale-95"
                    >
                        Start For Free
                    </Link>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </nav>

            {/* Mobile Sidebar / Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar Content */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <span className="text-xl font-black text-purple-600">
                            Ip<span className="text-gray-900">s</span>
                        </span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive(link.path)
                                        ? 'bg-purple-50 text-purple-600 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-6 border-t border-gray-100">
                    <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full py-2.5 text-center text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full py-2.5 text-center text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-all"
                    >
                        Start For Free
                    </Link>
                </div>
            </div>
        </header>
    );
}