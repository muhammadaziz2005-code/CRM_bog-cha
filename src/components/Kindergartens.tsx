import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, AlertCircle, Phone, MapPin, User, Users } from "lucide-react";
import { Kindergarten } from "../types";
import ConfirmationModal from "./ConfirmationModal";

export default function Kindergartens() {
  const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tumanFilter, setTumanFilter] = useState("all");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    nomi: "",
    manzili: "",
    tuman: "Yunusobod",
    bolalar_soni: 100,
    masul_shaxs: "",
    telefon_raqami: "+998 ",
    holati: "faol" as "faol" | "no_faol"
  });

  // Delete State
  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Tashkent Districts
  const tumans = ["Yunusobod", "Chilonzor", "Mirzo Ulug'bek", "Uchtepa", "Shayxontohur", "Yakkasaroy", "Sergeli", "Yashnobod", "Olmazor", "Mirobod", "Bektemir"];

  const fetchKindergartens = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kindergartens");
      const data = await res.json();
      setKindergartens(data);
    } catch (err) {
      console.error("Bog'cha ro'yxatini olishda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKindergartens();
  }, []);

  const handleOpenAddForm = () => {
    setFormData({
      id: "",
      nomi: "",
      manzili: "",
      tuman: "Yunusobod",
      bolalar_soni: 120,
      masul_shaxs: "",
      telefon_raqami: "+998 ",
      holati: "faol"
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (k: Kindergarten) => {
    setFormData({
      id: k.id,
      nomi: k.nomi,
      manzili: k.manzili,
      tuman: k.tuman,
      bolalar_soni: k.bolalar_soni,
      masul_shaxs: k.masul_shaxs,
      telefon_raqami: k.telefon_raqami,
      holati: k.holati
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomi || !formData.manzili || !formData.masul_shaxs) {
      setFormError("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }
    if (formData.bolalar_soni <= 0) {
      setFormError("Bolalar soni musbat son bo'lishi shart!");
      return;
    }

    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `/api/kindergartens/${formData.id}` : "/api/kindergartens";
      const method = isEdit ? "PUT" : "POST";

      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (r.ok) {
        setIsFormOpen(false);
        fetchKindergartens();
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
      const res = await fetch(`/api/kindergartens/${deleteId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDeleteId("");
        fetchKindergartens();
      }
    } catch (err) {
      console.error("Bog'chani o'chirishda xatolik:", err);
    }
  };

  // Searching and Filtering
  const filteredKindergartens = kindergartens.filter((k) => {
    const matchesSearch = 
      k.nomi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.masul_shaxs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.telefon_raqami.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.manzili.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTuman = tumanFilter === "all" || k.tuman === tumanFilter;
    
    return matchesSearch && matchesTuman;
  });

  // Pagination Logic
  const totalItems = filteredKindergartens.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKindergartens.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">Bog'chalar Tizimi</h1>
          <p className="text-sm text-gray-500">Ro'yxatga olingan {kindergartens.length} ta maktabgacha ta'lim muassasalari boshqaruvi</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm cursor-pointer transition"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi bog'cha qo'shish</span>
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
            placeholder="Nomi, mas'ul ism yoki telfon bo'yicha tezkor qidirish..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-gray-500 uppercase block sm:inline">Tuman filter:</label>
          <select
            value={tumanFilter}
            onChange={(e) => {
              setTumanFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">Barchasi (Barcha tumanlar)</option>
            {tumans.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm text-gray-500 font-medium">Katalog yuklanmoqda...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <Users className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-base font-semibold text-gray-600">Mos bog'chalar topilmadi</p>
            <p className="text-xs text-gray-400 max-w-sm mt-1">Qidiruv matni yoki tanlangan filtrlarni o'zgartirib qaytadan qidirib ko'ring.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="px-6 py-4">Nomi</th>
                  <th className="px-6 py-4">Tuman & Manzil</th>
                  <th className="px-6 py-4">Bolalar soni</th>
                  <th className="px-6 py-4">Mas'ul shaxs + Aloqa</th>
                  <th className="px-6 py-4">Holati</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-sm">
                {currentItems.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{k.nomi}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">ID: {k.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full font-semibold max-w-fit mb-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{k.tuman}</span>
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">{k.manzili}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{k.bolalar_soni}</div>
                      <div className="text-[11px] text-gray-400">nafar tarbiyalanuvchi</div>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <span>{k.masul_shaxs}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        <span>{k.telefon_raqami}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${
                        k.holati === "faol" 
                          ? "bg-green-50 text-green-700 border border-green-200" 
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}>
                        {k.holati === "faol" ? "Faol" : "No-faol"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditForm(k)}
                          className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(k.id)}
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

        {/* Pagination bar */}
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

      {/* Create / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-gray-100">
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 font-sans">
                {formData.id ? "Bog'cha ma'lumotlarini tahrirlash" : "Yangi bog'cha qo'shish"}
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
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">Bog'cha nomi *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomi}
                    onChange={(e) => setFormData({ ...formData, nomi: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Chilonzor tumani 45-sonli MTT"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">Tuman / Rayon *</label>
                  <select
                    value={formData.tuman}
                    onChange={(e) => setFormData({ ...formData, tuman: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {tumans.map((t) => (
                      <option key={t} value={t}>{t} tumani</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">Bolalar soni *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.bolalar_soni}
                    onChange={(e) => setFormData({ ...formData, bolalar_soni: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">Manzili (Ko'cha, uy) *</label>
                  <input
                    type="text"
                    required
                    value={formData.manzili}
                    onChange={(e) => setFormData({ ...formData, manzili: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Chilonzor 3-daha, 12a-uy"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">Mas'ul Shaxs (F.I.Sh) *</label>
                  <input
                    type="text"
                    required
                    value={formData.masul_shaxs}
                    onChange={(e) => setFormData({ ...formData, masul_shaxs: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Ism Familiya"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">Telefon raqami *</label>
                  <input
                    type="text"
                    required
                    value={formData.telefon_raqami}
                    onChange={(e) => setFormData({ ...formData, telefon_raqami: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">Holati *</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        name="holati"
                        value="faol"
                        checked={formData.holati === "faol"}
                        onChange={() => setFormData({ ...formData, holati: "faol" })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Faol</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        name="holati"
                        value="no_faol"
                        checked={formData.holati === "no_faol"}
                        onChange={() => setFormData({ ...formData, holati: "no_faol" })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span>No-faol (Nofaol)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none transition cursor-pointer"
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
        title="Bog'chani o'chirish"
        message="Haqiqatdan ham ushbu bog'chani o'chirmoqchimisiz? Ushbu yangilik bilan bog'liq barcha yetkazib berish tranzaksiyalari tarixi ham avtomatik ravishda tozalanadi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
