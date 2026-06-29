import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, AlertCircle, ArrowDownCircle, Info, Calendar } from "lucide-react";
import { StockIn, Product } from "../types";
import { formatSom, formatTashkentDate, getLocalDateInputVal, inputValToTashkentISO, getTashkentISO } from "../utils";
import ConfirmationModal from "./ConfirmationModal";

export default function StockInModule() {
  const [stockIns, setStockIns] = useState<StockIn[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState("all");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    mahsulot_id: "",
    miqdor: 0,
    birlik_narxi: 0,
    sana: "", // input format YYYY-MM-DD
    yetkazib_beruvchi: "",
    izoh: ""
  });

  // Delete State
  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    try {
      setLoading(true);
      const [sRes, pRes] = await Promise.all([
        fetch("/api/stock-in"),
        fetch("/api/products")
      ]);
      const sData = await sRes.json();
      const pData = await pRes.json();

      setStockIns(sData);
      setProducts(pData);
    } catch (err) {
      console.error("Kirim ma'lumotlarini yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddForm = () => {
    // Current date in Tashkent
    const nowTashkent = getTashkentISO();
    setFormData({
      id: "",
      mahsulot_id: products[0]?.id || "",
      miqdor: 100,
      birlik_narxi: products[0]?.oxirgi_kelish_narxi || 1000,
      sana: getLocalDateInputVal(nowTashkent),
      yetkazib_beruvchi: "",
      izoh: ""
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (si: StockIn) => {
    setFormData({
      id: si.id,
      mahsulot_id: si.mahsulot_id,
      miqdor: si.miqdor,
      birlik_narxi: si.birlik_narxi,
      sana: getLocalDateInputVal(si.sana),
      yetkazib_beruvchi: si.yetkazib_beruvchi || "",
      izoh: si.izoh || ""
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleProductChangeInForm = (pId: string) => {
    const selectedP = products.find(p => p.id === pId);
    setFormData(prev => ({
      ...prev,
      mahsulot_id: pId,
      birlik_narxi: selectedP?.oxirgi_kelish_narxi || prev.birlik_narxi
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mahsulot_id || formData.miqdor <= 0 || formData.birlik_narxi <= 0) {
      setFormError("Barcha maydonlarni, miqdor va birlik narxini to'g'ri kiriting!");
      return;
    }

    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `/api/stock-in/${formData.id}` : "/api/stock-in";
      const method = isEdit ? "PUT" : "POST";

      const submissionData = {
        ...formData,
        // Convert YYYY-MM-DD back to Asia/Tashkent ISO with current hours
        sana: inputValToTashkentISO(formData.sana)
      };

      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData)
      });

      if (r.ok) {
        setIsFormOpen(false);
        loadData();
      } else {
        const errData = await r.json();
        setFormError(errData.message || "Saqlashda xatolik.");
      }
    } catch (err) {
      setFormError("Server bilan bog'lanishda xatolik.");
    }
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/stock-in/${deleteId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDeleteId("");
        loadData();
      }
    } catch (err) {
      console.error("Kirim tranzaksiyasini o'chirishda xatolik:", err);
    }
  };

  // Searching and Filtering
  const filteredStockIns = stockIns.filter((si) => {
    const product = products.find(p => p.id === si.mahsulot_id);
    const pName = product ? product.nomi : "";
    const matchesSearch = 
      pName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (si.yetkazib_beruvchi && si.yetkazib_beruvchi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (si.izoh && si.izoh.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesProduct = productFilter === "all" || si.mahsulot_id === productFilter;
    
    return matchesSearch && matchesProduct;
  }).sort((a, b) => new Date(b.sana).getTime() - new Date(a.sana).getTime()); // Latest first

  // Pagination Logic
  const totalItems = filteredStockIns.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStockIns.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Auto Calculations in form
  const computedTotal = formData.miqdor * formData.birlik_narxi;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">Kirim Amallari (Oziq-ovqat qabul qilish)</h1>
          <p className="text-sm text-gray-500">Omborga yetkazib berilgan mahsulotlar logistikasi va moliyaviy kirim hisobi</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          disabled={products.length === 0}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm cursor-pointer transition disabled:opacity-50"
        >
          <ArrowDownCircle className="h-5 w-5" />
          <span>Yangi kirim qilish</span>
        </button>
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Yetkazib beruvchi, izoh yoki kalit so'z qidiruvi..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-gray-500 uppercase block sm:inline">Mahsulot tanlovi:</label>
          <select
            value={productFilter}
            onChange={(e) => {
              setProductFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">Barcha mahsulotlar ({products.length} ta)</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.nomi}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-medium text-gray-500">Logistika jurnali yuklanmoqda...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <ArrowDownCircle className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-base font-semibold text-gray-600">Kirim xujjatlari topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="px-6 py-4">Mahsulot</th>
                  <th className="px-6 py-4">Miqdor</th>
                  <th className="px-6 py-4">Birlik narxi</th>
                  <th className="px-6 py-4">Jami summa</th>
                  <th className="px-6 py-4">Sana (Toshkent vaqti)</th>
                  <th className="px-6 py-4">Yetkazib beruvchi / Izoh</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-sm">
                {currentItems.map((si) => {
                  const product = products.find(p => p.id === si.mahsulot_id);
                  return (
                    <tr key={si.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {product ? product.nomi : "Noma'lum mahsulot"}
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">KOD: {si.mahsulot_id}</div>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-blue-800">
                        +{si.miqdor.toLocaleString("uz-UZ")} {product?.birligi || "kg"}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">
                        {formatSom(si.birlik_narxi)} / {product?.birligi || "kg"}
                      </td>
                      <td className="px-6 py-4 font-black text-blue-700">
                        {formatSom(si.jami_narx)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
                          <Calendar className="h-3.5 w-3.5 text-gray-500" />
                          <span>{formatTashkentDate(si.sana)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-semibold text-gray-800 truncate">{si.yetkazib_beruvchi || "—"}</div>
                        <div className="text-xs text-gray-400 italic truncate">{si.izoh || "Izohsiz"}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditForm(si)}
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(si.id)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="O'chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-150 bg-gray-50 px-6 py-4">
            <span className="text-xs text-gray-500">
              Jami <span className="font-semibold text-gray-900">{totalItems}</span> tadan <span className="font-semibold">{indexOfFirstItem + 1}</span>-{Math.min(indexOfLastItem, totalItems)} gachasi ko'rsatilmoqda
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer"
              >
                Oldingi
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition cursor-pointer"
              >
                Keyingi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stock In Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-gray-100">
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 font-sans">
                {formData.id ? "Kirim varaqasini tahrirlash" : "Yangi mahsulot qabul qilish (Kirim)"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-xs font-semibold text-red-700 border border-red-100">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Qabul qilinayotgan mahsulot *</label>
                  <select
                    value={formData.mahsulot_id}
                    onChange={(e) => handleProductChangeInForm(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.nomi} ({p.birligi})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Kirim miqdori *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.miqdor || ""}
                    onChange={(e) => setFormData({ ...formData, miqdor: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Birlik kelish narxi (Somda) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.birlik_narxi || ""}
                    onChange={(e) => setFormData({ ...formData, birlik_narxi: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Live total display */}
                <div className="sm:col-span-2 rounded-xl bg-blue-50/50 border border-blue-100 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Info className="h-4.5 w-4.5 text-blue-600" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jami hisoblangan summa:</span>
                  </div>
                  <span className="text-base font-black text-blue-700">{formatSom(computedTotal)}</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Kirim sanasi *</label>
                  <input
                    type="date"
                    required
                    value={formData.sana}
                    onChange={(e) => setFormData({ ...formData, sana: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Yetkazib beruvchi kontragent</label>
                  <input
                    type="text"
                    value={formData.yetkazib_beruvchi}
                    onChange={(e) => setFormData({ ...formData, yetkazib_beruvchi: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Masalan: Agro-Cluster MChJ"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Kirim varaqasi haqida izoh/shartlar</label>
                  <textarea
                    value={formData.izoh}
                    onChange={(e) => setFormData({ ...formData, izoh: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-16 resize-none"
                    placeholder="Masalan: To'lov varaqasi ilova qilindi..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none transition cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none transition cursor-pointer"
                >
                  Kirimni tasdiqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Kirimni o'chirish"
        message="Haqiqatdan ham ushbu kirim tranzaksiyasi varaqasini o'chirmoqchimisiz? O'chirilganda ushbu mahsulot miqdori umumiy ombor zaxirasidan avtomatik ayiriladi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
