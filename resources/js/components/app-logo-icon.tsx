import { ImgHTMLAttributes, useEffect, useState } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const match = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(match.matches);
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        match.addEventListener('change', handler);
        return () => match.removeEventListener('change', handler);
    }, []);

    const src = isDark ? '/images/logowhite.png' : '/images/logoreg.png';

    return (
        <img
            {...props}
            src={src}
            alt="App Logo"
            style={{ width: '100%', height: 'auto', ...props.style }}
        />
    );
}
