"use client"

import React, { useState, useEffect } from 'react'
import withAuth from '@/hoc/withAuth';

function DashBoard() {
  const slides = [
    {
      title: "Start Your Day Early",
      description: "Wake up 30 minutes earlier to have a peaceful morning routine and set yourself up for success",
      icon: "🌅",
    },
    {
      title: "Use the 2-Minute Rule",
      description: "If a task takes less than 2 minutes, do it immediately instead of adding it to your to-do list",
      icon: "⚡",
    },
    {
      title: "Take Regular Breaks",
      description: "Follow the 25-5 rule: 25 minutes of focused work followed by a 5-minute refreshing break",
      icon: "🧘",
    },
    {
      title: "Organize Your Workspace",
      description: "A clean and organized desk leads to a clear mind and dramatically better focus throughout the day",
      icon: "🎯",
    },
    {
      title: "Practice Deep Breathing",
      description: "Take 3 deep, slow breaths when feeling stressed or overwhelmed to reset your mental state",
      icon: "💨",
    }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length)
          setIsAnimating(false)
        }, 400)
      }
    }, 4000) // Auto-scroll every 4 seconds

    return () => clearInterval(interval)
  }, [isAnimating, slides.length])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setIsAnimating(false)
    }, 400)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setIsAnimating(false)
    }, 400)
  }

  return (
    <div className="h-full relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}>
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center justify-center py-2 px-32">
        <div className="w-full max-w-7xl mx-auto h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

            {/* Left side - Hero Text */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <h1 className="text-63l md:text-4xl lg:text-6xl xl:text-6xl font-black text-gray-900 leading-none tracking-tight">
                    Super App
                  </h1>
                  <div className="h-2 w-full bg-indigo-600 rounded-full mt-2"></div>
                </div>

              </div>

              <p className="text-xl md:text-2xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Transform your daily routine with powerful habits that drive success
              </p>
            </div>

            {/* Right side - Clean Card Carousel */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Navigation buttons */}
                <button
                  onClick={prevSlide}
                  disabled={isAnimating}
                  className="absolute left-6 bottom-2 -translate-y-1/2 z-20 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:scale-110 transition-all duration-300 disabled:opacity-50 shadow-md group"
                >
                  <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  disabled={isAnimating}
                  className="absolute right-6 bottom-2 -translate-y-1/2 z-20 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:scale-110 transition-all duration-300 disabled:opacity-50 shadow-md group"
                >
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>

                {/* Card container */}
                <div className="relative">
                  {/* Phone shadow */}
                  <div className="absolute inset-0 bg-black/20 blur-xl transform translate-y-4 scale-105 rounded-[3rem]"></div>

                  {/* Phone body */}
               <div className="relative w-[70vw] sm:w-[30vw] md:w-[22vw] lg:w-[19vw] h-[70vh] bg-black rounded-[3rem] p-2 shadow-2xl">


                    {/* Screen */}
                    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">

                      {/* Status bar */}
                      <div className="h-12 bg-white flex items-center justify-between px-8 text-black text-sm font-medium">
                        <span>9:41</span>
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-1 h-3 bg-black rounded-full"></div>
                            <div className="w-1 h-3 bg-black rounded-full"></div>
                            <div className="w-1 h-3 bg-black/40 rounded-full"></div>
                            <div className="w-1 h-3 bg-black/40 rounded-full"></div>
                          </div>
                          <div className="w-6 h-3 border border-black rounded-sm relative">
                            <div className="absolute right-0 top-0 w-4 h-full bg-black rounded-sm"></div>
                          </div>
                        </div>
                      </div>

                      {/* Main content area */}
                      <div className="flex-1 h-full pt-20 pb-32 px-8 flex flex-col justify-center">
                        <div className="space-y-8">
                        

                          {/* Animated title */}
                          <div className="overflow-hidden">
                            <h1 className={`text-3xl font-bold text-gray-900 text-center leading-tight transform transition-all duration-500 ${isAnimating ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'
                              }`}>
                              {slides[currentSlide].title}
                            </h1>
                          </div>

                          {/* Animated description */}
                          <div className="overflow-hidden">
                            <p className={`text-gray-600 text-center leading-relaxed text-lg px-4 transform transition-all duration-500 delay-100 ${isAnimating ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'
                              }`}>
                              {slides[currentSlide].description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress indicators */}
                      <div className="flex justify-center space-x-3 py-6">
                        {slides.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              if (!isAnimating && index !== currentSlide) {
                                setIsAnimating(true);
                                setTimeout(() => {
                                  setCurrentSlide(index);
                                  setIsAnimating(false);
                                }, 400);
                              }
                            }}
                            className={`transition-all duration-500 transform hover:scale-125 active:scale-95 ${index === currentSlide
                                ? 'w-8 h-2 bg-indigo-600 rounded-full shadow-md'
                                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full'
                              }`}
                          />
                        ))}
                      </div>

                      {/* Home indicator */}
                      <div className="flex justify-center pb-4">
                        <div className="w-32 h-1 bg-black rounded-full opacity-40"></div>
                      </div>
                    </div>

                    {/* Phone frame highlights */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full"></div>
                    <div className="absolute top-8 right-20 w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(DashBoard)