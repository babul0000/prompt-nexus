"use client";
import React, { useEffect } from 'react';

// This component runs only on the client side to set the initial theme based on localStorage
export default function ThemeInitializer() {
  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  return null;
}
