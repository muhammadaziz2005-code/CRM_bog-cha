import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, AlertCircle, Users, Phone, ShieldCheck, Briefcase } from "lucide-react";
import { Worker } from "../types";
import ConfirmationModal from "./ConfirmationModal";

export default function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    f_i_sh: "",
    lavozimi: "Haydovchi",
    telefon_raqami: "+998 ",
    ish_holati: "faol" as "faol" | "no_faol"
  });

  // Delete State
  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const positions = ["Haydovchi", "Omborchi (Bosh)", "Omborchi", "Menejer", "Muntazam ishchi"];

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/workers");
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.error("Ishchilarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleOpenAddForm = () => {
    setFormData({
      id: "",
      f_i_sh: "",
      lavozimi: "Haydovchi",
      telefon_raqami: "+998 ",
      ish_holati: "faol"
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (w: Worker) => {
    setFormData({
      id: w.id,
      f_i_sh: w.f_i_sh,
      lavozimi: w.lavozimi,
      telefon_raqami: w.telefon_raqami,
      ish_holati: w.ish_holati
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.f_i_sh || !formData.telefon_raqami) {
      setFormError("Ism Familiyani va telefon raqamini kiritish shart!");
      return;
    }

    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `/api/workers/${formData.id}` : "/api/workers";
      const method = isEdit ? "PUT" : "POST";

      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (r.ok) {
        setIsFormOpen(false);
        fetchWorkers();
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
      const res = await fetch(`/api/workers/${deleteId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDeleteId("");
        fetchWorkers();
      }
    } catch (err) {
      console.error("Xodimni o'chirishda xatolik:", err);
    }
  };

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch = 
      w.f_i_sh.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.telefon_raqami.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || w.lavozimi === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination Logic
  const totalItems = filteredWorkers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWorkers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">Xodimlar Ro'yxati (Ishchilar)</h1>
          <p className="text-sm text-gray-500">Ombor, logistika, transport va moshinalarni boshqaradigan joriy ishchilar</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm cursor-pointer transition"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi xodim qo'shish</span>
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
            placeholder="Xodim ismi yoki telfon raqami bo'yicha qidiruv..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-gray-500 uppercase block sm:inline">Lavozim filteri:</label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">Barchasi ({workers.length} ta)</option>
            {positions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of workers Card */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-semibold text-gray-500">Xodimlar ro'yxati yuklanmoqda...</p>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 rounded-xl bg-white border border-dashed border-gray-200">
          <Users className="h-12 w-12 text-gray-300 mb-2" />
          <p className="text-base font-semibold text-gray-600">Mos xodimlar topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {currentItems.map((w) => {
            let activeBadge = "bg-green-50 text-green-700 border border-green-200";
            if (w.ish_holati !== "faol") {
              activeBadge = "bg-gray-100 text-gray-600 border border-gray-200";
            }
            return (
              <div key={w.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{w.f_i_sh}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>{w.lavozimi}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold leading-5 ${activeBadge}`}>
                    {w.ish_holati === "faol" ? "Ishlamoqda (Faol)" : "Nofaol"}
                  </span>

                  <div className="pt-2 border-t border-gray-50 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span>{w.telefon_raqami}</span>
                    </div>
                    <div className="text-[10px] text-gray-400">ID kodi: <code className="bg-gray-50 px-1 py-0.2 rounded">{w.id}</code></div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-50 shrink-0">
                  <button
                    onClick={() => handleOpenEditForm(w)}
                    className="flex-1 rounded-lg border border-slate-300 py-1.5 text-center text-xs font-semibold text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(w.id)}
                    className="rounded-lg border border-red-300 px-2.5 py-1.5 text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Workers Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-gray-100">
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 font-sans">
                {formData.id ? "Xodim ma'lumotlarini tahrirlash" : "Yangi xodim qo'shish"}
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
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Foydalanuvchi F.I.Sh *</label>
                  <input
                    type="text"
                    required
                    value={formData.f_i_sh}
                    onChange={(e) => setFormData({ ...formData, f_i_sh: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Masalan: Sardor Olimov"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Lavozimi *</label>
                  <select
                    value={formData.lavozimi}
                    onChange={(e) => setFormData({ ...formData, lavozimi: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-950 focus:border-blue-500 outline-none"
                  >
                    {positions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Telefon raqami *</label>
                  <input
                    type="text"
                    required
                    value={formData.telefon_raqami}
                    onChange={(e) => setFormData({ ...formData, telefon_raqami: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Ish holati *</label>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        name="ish_holati"
                        value="faol"
                        checked={formData.ish_holati === "faol"}
                        onChange={() => setFormData({ ...formData, ish_holati: "faol" })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 font-medium"
                      />
                      <span>Ishlamoqda (Faol)</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="radio"
                        name="ish_holati"
                        value="no_faol"
                        checked={formData.ish_holati === "no_faol"}
                        onChange={() => setFormData({ ...formData, ish_holati: "no_faol" })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 font-medium"
                      />
                      <span>Nofaol (No-faol)</span>
                    </label>
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
        title="Xodimni o'chirish"
        message="Haqiqatdan ham ushbu xodimni tizimdan o'chirmoqchimisiz? Ushbu amaldan keyin u o'chirib yuboriladi va transport vositasiga biriktirilgan bo'lsa munosabatlar avtomatik tozalanadi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
