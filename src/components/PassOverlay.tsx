import type { PassOverlayData } from '../game/types';

interface PassOverlayProps {
  data: PassOverlayData | null;
}

export function PassOverlay({ data }: PassOverlayProps) {
  if (!data) return null;
  return (
    <div className="pass-flash show" role="status" aria-live="polite">
      <div className="pass-flash-inner">
        <div className="seal-mark" aria-hidden="true">🔒</div>
        <h3>{data.title}</h3>
        <p>{data.subtitle}</p>
        <div className="pass-next">
          {data.nextEmoji} {data.nextName} <span>→</span>
        </div>
      </div>
    </div>
  );
}
