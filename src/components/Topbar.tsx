interface TopbarProps {
  soundOn: boolean;
  onToggleSound: () => void;
}

export function Topbar({ soundOn, onToggleSound }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="brand" aria-label="梗语者 Emoji Decoder">
        <span className="brand-mark" aria-hidden="true">
          梗
        </span>
        <span className="brand-copy">
          <strong>梗语者</strong>
          <small>EMOJI DECODER</small>
        </span>
      </div>
      <div className="top-actions">
        <span className="live-pill">
          <i aria-hidden="true" />
          PARTY MODE
        </span>
        <button
          className="icon-btn"
          type="button"
          aria-label={soundOn ? '关闭音效' : '开启音效'}
          aria-pressed={soundOn}
          title={soundOn ? '音效：开' : '音效：关'}
          onClick={onToggleSound}
        >
          {soundOn ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  );
}
