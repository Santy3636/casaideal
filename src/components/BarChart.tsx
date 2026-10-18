export default function BarChart({ data, keys }: { data: { label: string; a: number; b: number }[]; keys: [string, string] }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.a, d.b])); const w = 100 / data.length;
  return (<div><svg viewBox="0 0 400 140" className="w-full" role="img" aria-label="Actividad últimos 14 días">
    {data.map((d, i) => { const x = i * (400 / data.length) + 2, bw = (400 / data.length - 4) / 2;
      return <g key={i}><rect x={x} y={120 - (d.a / max) * 110} width={bw} height={(d.a / max) * 110} rx="3" fill="#0F0F30"><title>{`${d.label}: ${d.a} ${keys[0]}`}</title></rect>
        <rect x={x + bw} y={120 - (d.b / max) * 110} width={bw} height={(d.b / max) * 110} rx="3" fill="#FB454C"><title>{`${d.label}: ${d.b} ${keys[1]}`}</title></rect>
        {i % 2 === 0 && <text x={x + bw} y="136" fontSize="8" textAnchor="middle" fill="#595970">{d.label}</text>}</g>; })}</svg>
    <div className="mt-2 flex gap-4 text-xs"><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-navy" />{keys[0]}</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-brand" />{keys[1]}</span></div></div>);
}
