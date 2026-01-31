'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Github, Terminal } from 'lucide-react';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Show splash screen for 2.5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900 overflow-hidden"
                >
                    {/* Background Gradient Effects */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    <div className="relative z-10 text-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="mb-8 relative inline-block"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl">
                                <Terminal className="w-12 h-12 text-white -rotate-12" />
                            </div>
                            <div className="absolute -inset-4 bg-white/5 blur-xl -z-10 rounded-full"></div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="space-y-4"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Raghav Chawla
                            </h1>

                            <div className="flex items-center justify-center gap-3 text-gray-400">
                                <Github className="w-5 h-5" />
                                <span className="font-mono text-lg text-blue-400">@RCcoders</span>
                            </div>
                        </motion.div>

                        {/* Loading Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "linear" }}
                            className="h-1 bg-gradient-to-r from-blue-500 to-green-500 mt-12 rounded-full max-w-[200px] mx-auto"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
