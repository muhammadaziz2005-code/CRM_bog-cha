import { useState, useEffect } from "react";
import { Search, AlertCircle, RefreshCw, Warehouse as WarehouseIcon, Info, HelpCircle } from "lucide-react";
import { WarehouseStock } from "../types";
import { formatSom } from "../utils";

export default function Warehouse() {
  const [stock, setStock] = useState<WarehouseStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'low', 'normal'

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/warehouse/stock");
      const data = await res.json();
      setStock(data);
    } catch (err) {
      console.error("Zaxiralarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const filteredStock = stock.filter((item) => {
    const matchesSearch = item.mahsulot_nomi.toLowerCase().includes(searchQuery.toLowerCase());
    const isLow = item.joriy_miqdor <= item.minimal_zahira_chegarasi;
    
    if (statusFilter === "low") return matchesSearch && isLow;
    if (statusFilter === "normal") return matchesSearch && !isLow;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">Ombor Mahsulotlar Zahirasi</h1>
          <p className="text-sm text-gray-500">Mavjud joriy zaxira miqdorlari va kelgusi haftalarga avtomatik prognozlash</p>
        </div>
        <button
          onClick={fetchStock}
          className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition cursor-pointer"
        >
          <RefreshCw className="h-4.5 w-4.5" />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Forecasting logic Explanation Banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 shrink-0">
        <div className="flex gap-3">
          <HelpCircle className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-800 space-y-1.5 leading-relaxed">
            <p className="font-bold">Zaxira tahlili va kelgusi prognoz qanday hisoblanadi?</p>
            <p>
              1. <strong>O'rtacha haftamal sarf</strong>: Tarixiy yetkazib berish tranzaksiyalari hajmidan va standart haftalik normadan olingan o'rtacha qiymat. <br />
              2. <strong>Necha haftaga yetadi</strong>: <code className="bg-blue-100/70 px-1 py-0.2 rounded font-mono font-semibold">Joriy zaxira ÷ Haftalik sarf</code>. <br />
              3. <strong>Nechta bog'chaga yetadi</strong>: <code className="bg-blue-100/70 px-1 py-0.2 rounded font-mono font-semibold">Joriy zaxira ÷ Bitta bog'chaning o'rtacha haftalik me'yori</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mahsulot nomini yozib qidiring (masalan: guruch)..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-gray-500 uppercase block sm:inline">Holat filteri:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">Barchasi ({stock.length} ta)</option>
            <option value="low">Zahira kam qolganlar (Ogohlantirish)</option>
            <option value="normal">Meyorda bo'lganlar</option>
          </select>
        </div>
      </div>

      {/* Grid of forecasting cards */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-semibold text-gray-500">Ombor zaxiralari tahlil qilinmoqda...</p>
          </div>
        </div>
      ) : filteredStock.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-12 text-center text-gray-400">
          <WarehouseIcon className="h-12 w-12 text-gray-300 mb-2" />
          <p className="font-semibold text-gray-600">Mos mahsulot zaxiralari topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStock.map((item) => {
            const isLow = item.joriy_miqdor <= item.minimal_zahira_chegarasi;
            let statusBg = "border-green-100 bg-green-50/20";
            let txtColor = "text-green-700";
            let badgeBg = "bg-green-100 text-green-800";
            let badgeText = "Zaxira Yetarli";

            if (isLow) {
              statusBg = "border-red-100 bg-red-50/20";
              txtColor = "text-red-700";
              badgeBg = "bg-red-100 text-red-800";
              badgeText = "Kam qoldi (Tezda To'ldiring)";
            } else if (item.necha_haftaga_yetadi < 3) {
              statusBg = "border-yellow-100 bg-yellow-50/20";
              txtColor = "text-yellow-700";
              badgeBg = "bg-yellow-100 text-yellow-800";
              badgeText = "Hushyorlik";
            }

            return (
              <div 
                key={item.mahsulot_id} 
                className={`rounded-2xl border p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition ${statusBg}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-base">{item.mahsulot_nomi}</h3>
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5 inline-block bg-white px-2 py-0.5 rounded border border-gray-100">
                        {item.kategoriyasi}
                      </span>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold border ${badgeBg}`}>
                      {badgeText}
                    </span>
                  </div>

                  {/* Stock Metrics Display */}
                  <div className="mt-6 grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider">Joriy Zahira</span>
                      <span className="text-xl font-black text-gray-950 font-sans mt-1 block">
                        {item.joriy_miqdor.toLocaleString("uz-UZ")} <span className="text-sm font-semibold">{item.birligi}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider">Haftalik o'rtacha</span>
                      <span className="text-xl font-extrabold text-gray-950 font-sans mt-1 block">
                        {item.ortacha_haftalik_sarf.toLocaleString("uz-UZ")} <span className="text-xs font-medium">{item.birligi}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="font-medium">Oxirgi kelish narxi:</span>
                      <span className="font-bold text-gray-900">
                        {item.oxirgi_kelish_narxi > 0 ? formatSom(item.oxirgi_kelish_narxi) : "Kirim qilinmagan"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="font-medium">Minimal chegara:</span>
                      <span className="font-bold text-gray-700">
                        {item.minimal_zahira_chegarasi.toLocaleString("uz-UZ")} {item.birligi}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Forecast Outcome Panel */}
                <div className="mt-6 rounded-xl bg-white p-4 border border-gray-100 shadow-inner flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span>Prognoz tahlili:</span>
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed font-sans space-y-1">
                    <div>
                      Hozirgi zaxira tahminan <span className="font-black text-blue-700">{item.necha_haftaga_yetadi} haftaga</span> yetadi.
                    </div>
                    <div>
                      Bu taqsimot bilan <span className="font-black text-blue-700">{item.nechta_bogchaga_yetadi} ta bog'cha</span> ta'minotini to'liq yopish mumkin.
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
