import type { BestMoment, RankedPlayer } from './types';

interface ShareCardOptions {
  ranking: RankedPlayer[];
  bestMoment: BestMoment | null;
  totalRounds: number;
  playerCount: number;
}

const FONT_STACK = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
const MONO_STACK = 'SFMono-Regular, Consolas, monospace';

export function drawShareCard(
  canvas: HTMLCanvasElement,
  { ranking, bestMoment, totalRounds, playerCount }: ShareCardOptions,
): void {
  const context = canvas.getContext('2d');
  if (!context) return;

  const width = 600;
  const height = 400;
  const dpr = 2;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const ink = '#171512';
  const paper = '#FFF8E7';
  const yellow = '#FFD400';
  const pink = '#FF8EAE';
  const mint = '#8FF0C1';

  const rounded = (x: number, y: number, w: number, h: number, radius: number) => {
    const r = Math.min(radius, w / 2, h / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
  };

  const fitText = (
    text: string,
    maxWidth: number,
    startSize: number,
    weight = 900,
    family = FONT_STACK,
  ): number => {
    let size = startSize;
    do {
      context.font = `${weight} ${size}px ${family}`;
      if (context.measureText(text).width <= maxWidth || size <= 16) break;
      size -= 2;
    } while (size > 16);
    return size;
  };

  // Frame and background
  context.fillStyle = ink;
  context.fillRect(0, 0, width, height);
  context.fillStyle = yellow;
  rounded(10, 10, width - 20, height - 20, 19);
  context.fill();

  // Halftone + decorative blobs
  context.save();
  rounded(10, 10, width - 20, height - 20, 19);
  context.clip();
  context.fillStyle = 'rgba(23,21,18,.10)';
  for (let y = 20; y < height; y += 16) {
    for (let x = 20; x < width; x += 16) {
      context.beginPath();
      context.arc(x, y, 1.15, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.fillStyle = pink;
  context.beginPath();
  context.arc(548, 64, 65, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = mint;
  context.beginPath();
  context.arc(34, 355, 54, 0, Math.PI * 2);
  context.fill();
  context.restore();

  // Brand bar
  context.fillStyle = ink;
  rounded(30, 28, 177, 27, 13.5);
  context.fill();
  context.fillStyle = yellow;
  context.font = `700 10px ${MONO_STACK}`;
  context.textBaseline = 'middle';
  context.fillText('梗语者 · EMOJI DECODER', 43, 42);

  const now = new Date();
  const dateText = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  context.fillStyle = 'rgba(23,21,18,.66)';
  context.font = `700 9px ${MONO_STACK}`;
  context.textAlign = 'right';
  context.fillText(dateText, 566, 42);
  context.textAlign = 'left';

  // Champion
  const topScore = ranking[0]?.score ?? 0;
  const champions = ranking
    .filter((player) => player.score === topScore)
    .map((player) => player.name);
  const championLabel =
    champions.length > 2
      ? `${champions[0]} 等 ${champions.length} 人`
      : champions.join(' & ');
  const championFont = fitText(championLabel, 365, 42);

  context.fillStyle = ink;
  context.font = `800 11px ${FONT_STACK}`;
  context.fillText('本局梗王', 32, 84);
  context.font = `900 ${championFont}px ${FONT_STACK}`;
  context.fillText(championLabel, 30, 122);
  context.font = '42px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
  context.fillText('👑', 508, 119);

  // Score pill
  context.fillStyle = ink;
  rounded(30, 139, 132, 28, 14);
  context.fill();
  context.fillStyle = mint;
  context.font = `900 19px ${MONO_STACK}`;
  context.fillText(String(topScore), 47, 153);
  context.fillStyle = paper;
  context.font = `700 10px ${FONT_STACK}`;
  context.fillText('分 · 梗力值', 87, 154);

  // Ranking board
  const visibleRanking = ranking.slice(0, 6);
  const rowHeight = visibleRanking.length > 4 ? 24 : 30;
  const boardTop = 181;
  const boardHeight = 18 + visibleRanking.length * rowHeight;
  const boardBottom = boardTop + boardHeight;

  context.fillStyle = paper;
  rounded(30, boardTop, 540, boardHeight, 14);
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = ink;
  context.stroke();

  const rowTop = boardTop + 18 + rowHeight / 2;
  visibleRanking.forEach((player, index) => {
    const y = rowTop + index * rowHeight;
    const medal =
      index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

    context.fillStyle = ink;
    context.font =
      index < 3
        ? '15px "Apple Color Emoji", "Segoe UI Emoji", sans-serif'
        : `900 11px ${MONO_STACK}`;
    context.fillText(medal, 46, y);

    const nameFont = fitText(player.name, 238, 15, 900, FONT_STACK);
    context.fillStyle = ink;
    context.font = `900 ${nameFont}px ${FONT_STACK}`;
    context.fillText(player.name, 78, y);

    const barX = 330;
    const barW = 150;
    context.fillStyle = '#E8E0CC';
    rounded(barX, y - 4, barW, 8, 4);
    context.fill();
    context.strokeStyle = ink;
    context.lineWidth = 1.5;
    context.stroke();

    context.fillStyle = index === 0 ? mint : pink;
    rounded(
      barX + 1.5,
      y - 2.5,
      Math.max(5, (player.score / Math.max(topScore, 1)) * (barW - 3)),
      5,
      2.5,
    );
    context.fill();

    context.fillStyle = ink;
    context.font = `900 13px ${MONO_STACK}`;
    context.textAlign = 'right';
    context.fillText(String(player.score), 555, y);
    context.font = `700 8px ${FONT_STACK}`;
    context.fillText('分', 568, y + 1);
    context.textAlign = 'left';
  });

  // Best moment, when the board leaves enough room
  if (bestMoment && boardBottom <= 320) {
    const stripY = boardBottom + 9;
    const stripHeight = boardBottom <= 300 ? 44 : 36;

    context.fillStyle = ink;
    rounded(30, stripY, 540, stripHeight, 12);
    context.fill();

    context.fillStyle = pink;
    context.font = `900 9px ${FONT_STACK}`;
    context.fillText('⚡ 神来一笔', 44, stripY + 15);

    let quote = `“${bestMoment.text}”`;
    context.font = `800 12px ${FONT_STACK}`;
    while (quote.length > 3 && context.measureText(quote).width > 290) {
      quote = `${quote.slice(0, -2)}”`;
    }
    context.fillStyle = paper;
    context.fillText(quote, 128, stripY + (stripHeight > 40 ? 22 : 19));

    context.fillStyle = mint;
    context.font = `700 9px ${MONO_STACK}`;
    context.textAlign = 'right';
    const meta = `${bestMoment.playerName} · 第 ${bestMoment.round + 1} 题 · ${bestMoment.score} 分`;
    context.fillText(meta, 556, stripY + (stripHeight > 40 ? 22 : 19));
    context.textAlign = 'left';
  }

  // Footer
  context.fillStyle = 'rgba(23,21,18,.72)';
  context.font = `800 10px ${FONT_STACK}`;
  context.fillText('看 emoji，说人话。今日份的梗王就是你。', 31, 371);
  context.fillStyle = ink;
  context.font = `700 9px ${MONO_STACK}`;
  context.textAlign = 'right';
  context.fillText(`${totalRounds} 题 · ${playerCount} 人 · NO SERVER`, 569, 371);
  context.textAlign = 'left';
}
