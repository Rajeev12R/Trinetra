import React from "react"
import { useNavigate } from "react-router-dom"
const Navbar = () => {
  const navigate = useNavigate()
  return (
    <nav
      id="navbar"
      className="bg-white shadow-md fixed w-full top-0 left-0 z-50 opacity-0"
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <a
          href="/"
          className="text-teal-600 font-bold text-2xl flex items-center"
        >
          <i className="fa-solid fa-heart-pulse text-red-500 mr-2"></i> Serenity
        </a>
        <ul className="hidden md:flex space-x-10 text-gray-700 text-lg">
          <li>
            <a href="/" className="hover:text-teal-500 transition-all">
              Home
            </a>
          </li>
          <li>
            <a href="/#about" className="hover:text-teal-500 transition-all">
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                navigate("/mood-stats")
              }}
              className="hover:text-teal-500 transition-all"
            >
              Our Analysis
            </a>
          </li>
        </ul>
        <div className="flex items-center space-x-2">
          <a
            href="#"
            className="hidden md:block bg-teal-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-teal-700 transition-all"
          >
            Get Help Now
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
