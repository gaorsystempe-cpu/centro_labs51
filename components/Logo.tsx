import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={className}>
            <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#41D1C0" />
                        <stop offset="100%" stopColor="#5B3DA8" />
                    </linearGradient>
                </defs>
                <path
                    d="M 45,20 H 115 C 120,20 125,25 125,30 L 140,130 C 140,135 135,140 130,140 H 30 C 25,140 20,135 20,130 L 35,30 C 35,25 40,20 45,20 Z"
                    fill="url(#logoGradient)"
                    stroke="#805ad5"
                    strokeWidth="4"
                />
                <path
                    d="M120,30 L130,130"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>
        </div>
    );
}

export default Logo;
