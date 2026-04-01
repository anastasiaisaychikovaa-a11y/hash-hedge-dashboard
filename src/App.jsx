import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

/* ───────── DATA ───────── */
const channels = [
  'TG-канал','Email','Флеш сейл','Trustpilot','Launch',
  'Instagram','Яндекс','TG ADS RU','FB','Google Ads'
];

const feb = {
  sales:   [77, 333, 285, 8, 159, 0, 89, 24, 57, 44],
  revenue: [8725.14, 45109, 137171.25, 2169.95, 15892.25, 0, 14084.60, 3134.45, 8743.30, 9049.50],
  avg:     [113.31, 135.46, 481.30, 271.24, 174.64, 0, 158.25, 130.60, 153.39, 205.67],
  expense: { 'Закуп TG RU': 0, 'Яндекс': 5185.66, 'TG ADS RU': 1629.76, 'Facebook': 244.39, 'Google Ads': 8797.69 },
  totalRevenue: 244079.44,
  totalSales: 1008,
  totalAvg: 242.14,
  totalExpense: 15857.50,
  netRevenue: 228221.94
};

const mar = {
  sales:   [48, 259, 264, 5, 157, 0, 239, 5, 30, 139],
  revenue: [8918.10, 55169.14, 139018.50, 1042.95, 13285.50, 0, 44356.79, 605.50, 5763.60, 34510.36],
  avg:     [185.79, 213.01, 526.59, 208.59, 179.53, 0, 185.59, 121.10, 192.12, 248.28],
  expense: { 'Закуп TG RU': 9889, 'Яндекс': 2724.14, 'TG ADS RU': 881.67, 'Facebook': 836.30, 'Google Ads': 6473.12 },
  totalRevenue: 302670.44,
  totalSales: 1063,
  totalAvg: 284.73,
  totalExpense: 20804.23,
  netRevenue: 281866.21
};

const expenseChannels = ['Закуп TG RU', 'Яндекс', 'TG ADS RU', 'Facebook', 'Google Ads'];

const expenseMap = {
  'Яндекс': 'Яндекс', 'TG ADS RU': 'TG ADS RU', 'FB': 'Facebook', 'Google Ads': 'Google Ads'
};

/* ───────── HELPERS ───────── */
const fmt = (v) => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmt2 = (v) => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (cur, prev) => prev === 0 ? (cur > 0 ? 999 : 0) : ((cur - prev) / prev * 100);

const BLUE = '#3B82F6';
const GREEN = '#10B981';
const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#6B7280','#EC4899','#14B8A6','#F97316','#06B6D4'];

/* ───────── CHART DATA ───────── */
const revenueData = channels.map((ch, i) => ({
  name: ch, 'Февраль': feb.revenue[i], 'Март': mar.revenue[i]
}));

const donutData = channels
  .map((ch, i) => ({ name: ch, value: mar.revenue[i] }))
  .filter(d => d.value > 0);

const expenseData = expenseChannels.map(ch => ({
  name: ch, 'Февраль': feb.expense[ch], 'Март': mar.expense[ch]
}));

/* ───────── COMPONENTS ───────── */

function KpiCard({ title, value, prev, isCurrency = true }) {
  const change = pct(typeof value === 'number' ? value : 0, typeof prev === 'number' ? prev : 0);
  const up = change >= 0;
  return (
    <div className="bg-[#1E293B] rounded-xl p-5 shadow-lg">
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">
        {isCurrency ? fmt2(value) : typeof value === 'number' ? (value > 100 ? value.toLocaleString() : value.toFixed(1) + 'x') : value}
      </p>
      <p className={`text-sm mt-1 flex items-center gap-1 ${up ? 'text-emerald-400' : 'text-red-400'}`}>
        <span>{up ? '▲' : '▼'}</span>
        <span>{Math.abs(change).toFixed(1)}% vs Фев</span>
      </p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#1E293B] border border-slate-600 rounded-lg p-3 text-sm">
      <p className="text-white font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {fmt2(p.value)}</p>
      ))}
    </div>
  );
}

function TableSection() {
  const rows = channels.map((ch, i) => {
    const febExp = feb.expense[expenseMap[ch]] || 0;
    const marExp = mar.expense[expenseMap[ch]] || 0;
    const marRoi = marExp > 0 ? ((mar.revenue[i] - marExp) / marExp * 100) : (mar.revenue[i] > 0 ? Infinity : 0);
    const revChange = pct(mar.revenue[i], feb.revenue[i]);
    return { ch, febSales: feb.sales[i], marSales: mar.sales[i], febRev: feb.revenue[i], marRev: mar.revenue[i], febAvg: feb.avg[i], marAvg: mar.avg[i], febExp, marExp, marRoi, revChange };
  });

  return (
    <div className="bg-[#1E293B] rounded-xl shadow-lg overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-600 text-slate-400">
            <th className="p-3">Канал</th>
            <th className="p-3 text-right">Продажи (Фев)</th>
            <th className="p-3 text-right">Продажи (Мар)</th>
            <th className="p-3 text-right">Выручка (Фев)</th>
            <th className="p-3 text-right">Выручка (Мар)</th>
            <th className="p-3 text-right">Ср. чек (Мар)</th>
            <th className="p-3 text-right">Расход (Мар)</th>
            <th className="p-3 text-right">ROI (Мар)</th>
            <th className="p-3 text-right">Δ Выручка</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-700 hover:bg-slate-800/50">
              <td className="p-3 font-medium text-white">{r.ch}</td>
              <td className="p-3 text-right text-slate-300">{r.febSales}</td>
              <td className="p-3 text-right text-white">{r.marSales}</td>
              <td className="p-3 text-right text-slate-300">{fmt2(r.febRev)}</td>
              <td className="p-3 text-right text-white">{fmt2(r.marRev)}</td>
              <td className="p-3 text-right text-white">{fmt2(r.marAvg)}</td>
              <td className="p-3 text-right text-white">{r.marExp > 0 ? fmt2(r.marExp) : '—'}</td>
              <td className="p-3 text-right text-white">
                {r.marRoi === Infinity ? '∞' : r.marExp > 0 ? r.marRoi.toFixed(0) + '%' : '—'}
              </td>
              <td className={`p-3 text-right font-semibold ${r.revChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {r.revChange >= 0 ? '+' : ''}{r.revChange.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Insights() {
  const growthByChannel = channels.map((ch, i) => ({
    ch, growth: pct(mar.revenue[i], feb.revenue[i]), marRev: mar.revenue[i]
  })).filter(d => d.marRev > 0);

  const best = growthByChannel.reduce((a, b) => a.growth > b.growth ? a : b);
  const worst = growthByChannel.reduce((a, b) => a.growth < b.growth ? a : b);

  const roiByChannel = expenseChannels
    .map(ch => {
      const idx = channels.indexOf(ch === 'Facebook' ? 'FB' : ch === 'Закуп TG RU' ? 'TG-канал' : ch);
      const rev = idx >= 0 ? mar.revenue[idx] : 0;
      const exp = mar.expense[ch];
      return { ch, roi: exp > 0 ? (rev - exp) / exp : 0 };
    })
    .filter(d => d.roi > 0);
  const bestRoi = roiByChannel.reduce((a, b) => a.roi > b.roi ? a : b);

  const totalGrowth = pct(mar.totalRevenue, feb.totalRevenue);

  return (
    <div className="bg-[#1E293B] rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4">Ключевые инсайты</h3>
      <ul className="space-y-3 text-slate-300">
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 text-lg">●</span>
          <span><strong className="text-white">Лучший рост выручки:</strong> {best.ch} — +{best.growth.toFixed(0)}% к февралю</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 text-lg">●</span>
          <span><strong className="text-white">Лучший ROI:</strong> {bestRoi.ch} — {(bestRoi.roi * 100).toFixed(0)}% возврат на вложения</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 text-lg">●</span>
          <span><strong className="text-white">Наибольшее падение:</strong> {worst.ch} — {worst.growth.toFixed(0)}% к февралю</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 text-lg">●</span>
          <span><strong className="text-white">Общий тренд:</strong> выручка выросла на {totalGrowth.toFixed(1)}% ({fmt(feb.totalRevenue)} → {fmt(mar.totalRevenue)}), расходы увеличились на {pct(mar.totalExpense, feb.totalExpense).toFixed(1)}%. Чистая выручка: +{pct(mar.netRevenue, feb.netRevenue).toFixed(1)}%.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 text-lg">●</span>
          <span><strong className="text-white">Яндекс и Google Ads</strong> показали взрывной рост: Яндекс +{pct(mar.revenue[6], feb.revenue[6]).toFixed(0)}%, Google Ads +{pct(mar.revenue[9], feb.revenue[9]).toFixed(0)}%. Это основные драйверы роста марта.</span>
        </li>
      </ul>
    </div>
  );
}

/* ───────── MAIN APP ───────── */
export default function App() {
  const febRoas = feb.totalRevenue / feb.totalExpense;
  const marRoas = mar.totalRevenue / mar.totalExpense;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Hash Hedge — Marketing Dashboard — Март 2026</h1>
        <p className="text-slate-400 mt-1">Сравнение февраля и марта 2026</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <KpiCard title="Общая выручка" value={mar.totalRevenue} prev={feb.totalRevenue} />
        <KpiCard title="Кол-во продаж" value={mar.totalSales} prev={feb.totalSales} isCurrency={false} />
        <KpiCard title="Средний чек" value={mar.totalAvg} prev={feb.totalAvg} />
        <KpiCard title="Общие расходы" value={mar.totalExpense} prev={feb.totalExpense} />
        <KpiCard title="Чистая выручка" value={mar.netRevenue} prev={feb.netRevenue} />
        <KpiCard title="ROAS" value={marRoas} prev={febRoas} isCurrency={false} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Bar */}
        <div className="lg:col-span-2 bg-[#1E293B] rounded-xl p-5 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Выручка по каналам</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fill: '#94A3B8' }} tickFormatter={v => '$' + (v / 1000).toFixed(0) + 'k'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#fff' }} />
              <Bar dataKey="Февраль" fill={BLUE} radius={[4,4,0,0]} />
              <Bar dataKey="Март" fill={GREEN} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="bg-[#1E293B] rounded-xl p-5 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Доля каналов (Март)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: '#94A3B8' }}>
                {donutData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmt2(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 — Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#1E293B] rounded-xl p-5 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Расходы по каналам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} angle={-25} textAnchor="end" />
              <YAxis tick={{ fill: '#94A3B8' }} tickFormatter={v => '$' + (v / 1000).toFixed(1) + 'k'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#fff' }} />
              <Bar dataKey="Февраль" fill={BLUE} radius={[4,4,0,0]} />
              <Bar dataKey="Март" fill={GREEN} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <Insights />
      </div>

      {/* Detailed Table */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Детализация по каналам</h3>
        <TableSection />
      </div>

      <footer className="text-center text-slate-500 text-sm py-4">
        Hash Hedge &copy; 2026 — Marketing Analytics
      </footer>
    </div>
  );
}
