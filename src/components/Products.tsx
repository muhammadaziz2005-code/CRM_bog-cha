import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, AlertCircle, Package } from "lucide-react";
import { Product } from "../types";
import { formatSom } from "../utils";
import ConfirmationModal from "./ConfirmationModal";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    nomi: "",
    birligi: "kg" as "kg" | "tonna" | "litr" | "dona",
    kategoriyasi: "Oziq-ovqatlar",
    minimal_zahira_chegarasi: 100
  });

  // Delete State
  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Categories helper
  const categories = [
    "Go'sht mahsulotlari",
    "Don mahsulotlari",
    "Un mahsulotlari",
    "Yog' mahsulotlari",
    "Sabzavotlar",
    "Sut mahsulotlari",
    "Shirinliklar",
    "Oziq-ovqatlar",
    "Mevalar"
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Mahsulotlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddForm = () => {
    setFormData({
      id: "",
      nomi: "",
      birligi: "kg",
      kategoriyasi: "Oziq-ovqatlar",
      minimal_zahira_chegarasi: 100
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (p: Product) => {
    setFormData({
      id: p.id,
      nomi: p.nomi,
      birligi: p.birligi,
      kategoriyasi: p.kategoriyasi,
      minimal_zahira_chegarasi: p.minimal_zahira_chegarasi
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomi || !formData.kategoriyasi) {
      setFormError("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }
    if (formData.minimal_zahira_chegarasi < 0) {
      setFormError("Minimal zaxira miqdori manfiy bo'lishi mumkin emas!");
      return;
    }

    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `/api/products/${formData.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (r.ok) {
        setIsFormOpen(false);
        fetchProducts();
      } else {
        const errData = await r.json();
        setFormError(errData.message || "Saqlashda xatolik yuz berdi.");
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
      const res = await fetch(`/api/products/${deleteId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDeleteId("");
        fetchProducts();
      }
    } catch (err) {
      console.error("Mahsulotni o'chirishda xatolik:", err);
    }
  };

  // Searching and Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nomi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.kategoriyasi === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">Mahsulotlar Katalogi</h1>
          <p className="text-sm text-gray-500">Omborda muomalada bo'ladigan barcha oziq-ovqat turlari va me'yoriy o'lchovlari</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm cursor-pointer transition"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi mahsulot qo'shish</span>
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
            placeholder="Mahsulot nomini yozib qidiring..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-gray-500 uppercase block sm:inline">Kategoriya b-cha:</label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">Barchasi (Barcha toifalar)</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm text-gray-500">Mahsulotlar yuklanmoqda...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <Package className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-base font-semibold text-gray-600">Mahsulotlar topilmadi</p>
            <p className="text-xs text-gray-400 mt-1">Siz izlagan nom bo'yicha mahsulot ro'yxatda mavjud emas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="px-6 py-4">Mahsulot nomi</th>
                  <th className="px-6 py-4">Kategoriyasi</th>
                  <th className="px-6 py-4">O'lchov birligi</th>
                  <th className="px-6 py-4">Ogohlantirish chegarasi (Min)</th>
                  <th className="px-6 py-4">Oxirgi kelish narxi</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-sm">
                {currentItems.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <div>{p.nomi}</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">KOD: {p.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {p.kategoriyasi}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">{p.birligi}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {p.minimal_zahira_chegarasi.toLocaleString("uz-UZ")} {p.birligi}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-700">
                      {p.oxirgi_kelish_narxi > 0 ? formatSom(p.oxirgi_kelish_narxi) : "Kirim qilinmagan"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditForm(p)}
                          className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(p.id)}
                          className="rounded p-1.5 text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="O'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-gray-100">
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 font-sans">
                {formData.id ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
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

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Mahsulot nomi *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomi}
                    onChange={(e) => setFormData({ ...formData, nomi: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Masalan: Go'sht, Guruch, Un, Sut"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">O'lchov birligi *</label>
                  <select
                    value={formData.birligi}
                    onChange={(e) => setFormData({ ...formData, birligi: e.target.value as any })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="kg">kg (Kilogramm)</option>
                    <option value="tonna">tonna (Tonna)</option>
                    <option value="litr">litr (Litr)</option>
                    <option value="dona">dona (Dona)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Kategoriyasi *</label>
                  <select
                    value={formData.kategoriyasi}
                    onChange={(e) => setFormData({ ...formData, kategoriyasi: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-955 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Minimal Zahira Chegarasi *</label>
                  <span className="text-[11px] text-slate-400 block mb-1">Omborda ushbu miqdordan kam qolsa qizil ogohlantirish beriladi</span>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.minimal_zahira_chegarasi}
                      onChange={(e) => setFormData({ ...formData, minimal_zahira_chegarasi: Number(e.target.value) })}
                      className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 pr-12 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs text-slate-400 font-semibold uppercase">
                      {formData.birligi}
                    </div>
                  </div>
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
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Mahsulotni o'chirish"
        message="Haqiqatdan ham ushbu mahsulotni tizimdan o'chirmoqchimisiz? Buning barcha kirim va taqsimot tranzaksiyalari tarixi ham o'chib ketadi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
