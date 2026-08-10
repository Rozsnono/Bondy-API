'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WebLottieViewerProps {
    src: string;
    className?: string;
}

export const WebLottieViewer: React.FC<WebLottieViewerProps> = ({ src, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let anim: any = null;
        if (!containerRef.current || !src) return;

        import('lottie-web')
            .then((lottie) => {
                try {
                    if (containerRef.current) {
                        containerRef.current.innerHTML = '';
                        anim = lottie.default.loadAnimation({
                            container: containerRef.current,
                            renderer: 'svg',
                            loop: true,
                            autoplay: true,
                            path: src,
                        });
                    }
                } catch {
                    setError(true);
                }
            })
            .catch(() => setError(true));

        return () => {
            if (anim) anim.destroy();
        };
    }, [src]);

    if (error) {
        return <div className="text-slate-500 text-[10px]">No Lottie Cover</div>;
    }

    return <div ref={containerRef} className={className || 'w-16 h-16'} />;
};