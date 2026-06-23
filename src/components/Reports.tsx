import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Legend 
} from "recharts";
import { Calendar, Download, RefreshCw, BarChart3, Coins, Database, Printer, Sparkles } from "lucide-react";
import { Product, StockIn } from "../types";
import { formatSom, formatTashkentDate, getLocalDateInputVal } from "../utils";

export default function Reports() {
  const [stockInList, setStockInList] = useState<StockIn[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Date range filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [siRes, pRes] = await Promise.all([
        fetch("/api/stock-in"),
        fetch("/api/products")
      ]);
      const siData = await siRes.json();
      const pData = await pRes.json();
      setStockInList(siData);
      setProducts(pData);
      
      // Set default date ranges: all index
      if (siData.length > 0) {
        // Find min and max dates
        const dates = siData.map((s: any) => s.sana.split("T")[0]);
        dates.sort();
        setStartDate(dates[0]);
        // default end date is today/tomorrow
        const todayStr = getLocalDateInputVal(new Date().toISOString());
        setEndDate(todayStr || dates[dates.length - 1]);
      } else {
        const todayStr = getLocalDateInputVal(new Date().toISOString());
        setStartDate(todayStr);
        setEndDate(todayStr);
      }
    } catch (err) {
      console.error("Xarajat moduli hisobotlar yuklash xatosi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pre-set Date Filters helpers
  const handleSetPreset = (preset: "today" | "week" | "month" | "year" | "all") => {
    const today = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    if (preset === "today") {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const startStr = `${weekAgo.getFullYear()}-${pad(weekAgo.getMonth() + 1)}-${pad(weekAgo.getDate())}`;
      setStartDate(startStr);
      setEndDate(todayStr);
    } else if (preset === "month") {
      const startStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-01`;
      setStartDate(startStr);
      setEndDate(todayStr);
    } else if (preset === "year") {
      const startStr = `${today.getFullYear()}-01-01`;
      setStartDate(startStr);
      setEndDate(todayStr);
    } else if (preset === "all") {
      if (stockInList.length > 0) {
        const dates = stockInList.map((s: any) => s.sana.split("T")[0]);
        dates.sort();
        setStartDate(dates[0]);
        setEndDate(todayStr);
      }
    }
  };

  // Filter tranzactions by date range
  const filteredStockIns = stockInList.filter((si) => {
    const sDateOnly = si.sana.split("T")[0];
    const isAfterStart = !startDate || sDateOnly >= startDate;
    const isBeforeEnd = !endDate || sDateOnly <= endDate;
    return isAfterStart && isBeforeEnd;
  });

  // METRICS & ANALYSIS
  const totalSpentFiltered = filteredStockIns.reduce((sum, s) => sum + s.jami_narx, 0);

  // Group by Product for selected span
  const productExpensesMap: { [key: string]: { nomi: string; kategoriyasi: string; summa: number; miqdor: number; birligi: string } } = {};
  filteredStockIns.forEach((si) => {
    const p = products.find(prod => prod.id === si.mahsulot_id);
    const pName = p ? p.nomi : "Noma'lum";
    const pBirlik = p ? p.birligi : "kg";
    if (!productExpensesMap[si.mahsulot_id]) {
      productExpensesMap[si.mahsulot_id] = {
        nomi: pName,
        kategoriyasi: p ? p.kategoriyasi : "Boshqalar",
        summa: 0,
        miqdor: 0,
        birligi: pBirlik
      };
    }
    productExpensesMap[si.mahsulot_id].summa += si.jami_narx;
    productExpensesMap[si.mahsulot_id].miqdor += si.miqdor;
  });

  const productChartData = Object.values(productExpensesMap).sort((a, b) => b.summa - a.summa);

  // Group by Category
  const categoryExpensesMap: { [key: string]: number } = {};
  filteredStockIns.forEach((si) => {
    const p = products.find(prod => prod.id === si.mahsulot_id);
    const cat = p ? p.kategoriyasi : "Boshqalar";
    categoryExpensesMap[cat] = (categoryExpensesMap[cat] || 0) + si.jami_narx;
  });

  const categoryChartData = Object.keys(categoryExpensesMap).map((catName) => ({
    name: catName,
    value: categoryExpensesMap[catName]
  })).sort((a, b) => b.value - a.value);

  // Colors for charts
  const CHART_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#14b8a6"];

  // Group by Date for line chart
  const dateExpensesMap: { [key: string]: number } = {};
  filteredStockIns.forEach((si) => {
    const sDate = si.sana.split("T")[0];
    dateExpensesMap[sDate] = (dateExpensesMap[sDate] || 0) + si.jami_narx;
  });

  const timelineChartData = Object.keys(dateExpensesMap).sort().map((dStr) => {
    // format to simple DD.MM for xAxix
    const pts = dStr.split("-");
    const label = pts.length === 3 ? `${pts[2]}.${pts[1]}` : dStr;
    return {
      FullDate: dStr,
      Sana: label,
      Xarajat: dateExpensesMap[dStr]
    };
  });

  // Client Side CSV Export helper
  const handleExportCSV = () => {
    if (filteredStockIns.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    // CSV Header split by comma
    csvContent += "Tranzaksiya ID,Mahsulot nomi,Miqdor,Birligi,Birlik narxi (so'm),Jami xarajat (so'm),Sana,Yetkazib beruvchi,Izoh\n";

    filteredStockIns.forEach((si) => {
      const p = products.find(prod => prod.id === si.mahsulot_id);
      const row = [
        si.id,
        p ? p.nomi : "Noma'lum",
        si.miqdor,
        p ? p.birligi : "kg",
        si.birlik_narxi,
        si.jami_narx,
        formatTashkentDate(si.sana),
        `"${(si.yetkazib_beruvchi || "").replace(/"/g, '""')}"`,
        `"${(si.izoh || "").replace(/"/g, '""')}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hisobot_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Client Side Print triggering
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in print:p-8 print:bg-white print:text-black">
      {/* Intro section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">Moliyaviy Hisobotlar (Xarajatlar)</h1>
          <p className="text-sm text-gray-500">Ombor kirim tranzaksiyalari asosida umumiy va davr bayonidagi buxgalteriya hisoboti</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            <Download className="h-4.5 w-4.5" />
            <span>Excel / CSV eksport</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer shadow-sm"
          >
            <Printer className="h-4.5 w-4.5" />
            <span>Hisobotni Chop etish (Print)</span>
          </button>
        </div>
      </div>

      {/* Date Span selectors - hide on print */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm print:hidden">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span>Davr Presetlari:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleSetPreset("today")} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200">Bugun</button>
          <button onClick={() => handleSetPreset("week")} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200">Shu Hafta</button>
          <button onClick={() => handleSetPreset("month")} className="rounded-lg bg-blue-50 text-blue-700 px-3 py-1.5 text-xs font-bold hover:bg-blue-100">Shu Oy</button>
          <button onClick={() => handleSetPreset("year")} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200">Shu Yil</button>
          <button onClick={() => handleSetPreset("all")} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200">Hammasi</button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Boshlanish sanasi:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Tugash sanasi:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Budget Card Summary */}
      <div className="rounded-2xl border border-gray-100 bg-gradient-to-r from-blue-900 to-slate-900 p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider block">Belgilangan oraliqdagi jami xarajat</span>
          <span className="text-3xl font-black block mt-1 tracking-tight font-sans">
            {formatSom(totalSpentFiltered)}
          </span>
          <p className="text-xs text-blue-200 mt-2 font-mono flex items-center gap-1">
            <span>Sana oralig'i:</span>
            <span className="bg-blue-950/40 px-2 py-0.5 rounded text-white font-semibold">{startDate ? formatTashkentDate(startDate) : "Asl"}</span>
            <span>dan</span>
            <span className="bg-blue-950/40 px-2 py-0.5 rounded text-white font-semibold">{endDate ? formatTashkentDate(endDate) : "Joriy"}</span>
            <span>gacha</span>
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 text-white shrink-0">
          <Coins className="h-10 w-10 text-blue-300" />
        </div>
      </div>

      {/* Loading Block */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-semibold text-gray-500">Analitika tahlillanmoqda...</p>
          </div>
        </div>
      ) : filteredStockIns.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 border border-dashed rounded-xl bg-white">
          <Database className="h-12 w-12 text-gray-300 mb-2" />
          <p className="text-base font-semibold text-gray-650">Ushbu sana oralig'ida hech qanday kirim tranzaksiyalari topilmadi</p>
          <p className="text-xs mt-1">Filtrlashni kattaroq vaqt mezonlariga o'tkazib sinab ko'ring.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Charts section - hide on mobile, split into layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-2">
            {/* Area Line Chart for Timeline */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-150 pb-3 mb-4 flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-blue-600" />
                <span>Kirim xarajatlari dinamikasi (Kunlik)</span>
              </h3>
              <div className="h-64 w-full">
                {timelineChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="Sana" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip formatter={(value) => [formatSom(Number(value)), "Xarajat"]} />
                      <Line type="monotone" dataKey="Xarajat" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400 text-xs">Statistika yetarli emas</div>
                )}
              </div>
            </div>

            {/* Pie Chart for categories share */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-150 pb-3 mb-4 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-blue-600" />
                <span>Kategoriyalar ulushi (Foizda)</span>
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatSom(Number(value)), "Summa"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 overflow-y-auto max-h-56 select-none pl-4 text-xs space-y-1.5 border-l border-gray-50">
                  {categoryChartData.map((item, idx) => (
                    <div key={item.name} className="flex items-start gap-1.5">
                      <span className="inline-block h-3 w-3 shrink-0 rounded mt-0.5" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-gray-700 truncate block">{item.name}</span>
                        <span className="text-gray-400 block">{((item.value / totalSpentFiltered) * 100).toFixed(1)}% ({formatSom(item.value)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Table for products expenditure */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-150 pb-3 mb-4">
              Mahsulotlar kesimida jami xarajat hisoboti
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                    <th className="px-6 py-3">Mahsulot nomi</th>
                    <th className="px-6 py-3">Kategoriyasi</th>
                    <th className="px-6 py-3">Sotib olingan jami miqdor</th>
                    <th className="px-6 py-3">O'rtacha birlik narxi</th>
                    <th className="px-6 py-3 text-right">Jami sarflangan summa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {productChartData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-3.5 font-bold text-gray-900">{item.nomi}</td>
                      <td className="px-6 py-3.5">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                          {item.kategoriyasi}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-blue-700">
                        {item.miqdor.toLocaleString("uz-UZ")} {item.birligi}
                      </td>
                      <td className="px-6 py-3.5 text-gray-600 font-medium">
                        {formatSom(Math.round(item.summa / item.miqdor))} / {item.birligi}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-slate-900 text-right">
                        {formatSom(item.summa)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
