import { PropsWithChildren, useCallback, useState } from "react";

export default function Spotlight({ children }: PropsWithChildren) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div onMouseMove={onMove} style={{ ['--spot-x' as any]: `${pos.x}px`, ['--spot-y' as any]: `${pos.y}px` }} className="relative spotlight">
      {children}
    </div>
  );
}
