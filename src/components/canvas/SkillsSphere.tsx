'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, TrackballControls } from '@react-three/drei';
import * as THREE from 'three';

function Word({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<typeof Text>) {
    const color = new THREE.Color();
    const fontProps = { font: '/fonts/Inter-Bold.woff', fontSize: 2.5, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false };
    const ref = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const over = (e: ThreeEvent<PointerEvent>) => (e.stopPropagation(), setHovered(true));
    const out = () => setHovered(false);

    useEffect(() => {
        if (hovered) document.body.style.cursor = 'pointer';
        return () => { document.body.style.cursor = 'auto'; };
    }, [hovered]);

    useFrame(({ camera }) => {
        if (ref.current) {
            ref.current.quaternion.copy(camera.quaternion);
            // @ts-expect-error - material color type issue
            ref.current.material.color.lerp(color.set(hovered ? '#38BDF8' : 'white'), 0.1);
        }
    });

    return (
        <Text ref={ref} onPointerOver={over} onPointerOut={out} {...props} {...fontProps}>
            {children}
        </Text>
    );
}

function Cloud({ count = 4, radius = 20 }) {
    // Create a count x count random words with spherical distribution
    const words = useMemo(() => {
        const temp: [THREE.Vector3, string][] = [];
        const spherical = new THREE.Spherical();
        const phiSpan = Math.PI / (count + 1);
        const thetaSpan = (Math.PI * 2) / count;
        const skills = [
            'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL',
            'Tailwind', 'Three.js', 'Git', 'SQL', 'NoSQL', 'Redux', 'Framer Motion', 'AI/ML'
        ];

        for (let i = 1; i < count + 1; i++)
            for (let j = 0; j < count; j++)
                temp.push([new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)), skills[(i * j) % skills.length]]);
        return temp;
    }, [count, radius]);
    return words.map(([pos, word], index) => <Word key={index} position={pos}>{word}</Word>);
}

export default function SkillsSphere() {
    return (
        <div className="h-[500px] w-full cursor-grab active:cursor-grabbing">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
                <fog attach="fog" args={['#020617', 0, 80]} />
                <Cloud count={8} radius={20} />
                <TrackballControls />
            </Canvas>
        </div>
    );
}
