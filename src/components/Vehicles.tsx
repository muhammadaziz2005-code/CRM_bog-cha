import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X, AlertCircle, Truck, UserCheck, ShieldAlert } from "lucide-react";
import { Vehicle, Worker } from "../types";
import ConfirmationModal from "./ConfirmationModal";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    nomi: "",
    davlat_raqami: "",
    sigimi: 1000,
    holati: "bosh" as "bosh" | "band" | "tamirda",
    biriktirilgan_haydovchi_id: ""
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
      const [vRes, wRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/workers")
      ]);
      setVehicles(await vRes.json());
      setWorkers(await wRes.json());
    } catch (err) {
      console.error("Moshinalarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddForm = () => {
    setFormData({
      id: "",
      nomi: "",
      davlat_raqami: "",
      sigimi: 1000,
      holati: "bosh",
      biriktirilgan_haydovchi_id: ""
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (v: Vehicle) => {
    setFormData({
      id: v.id,
      nomi: v.nomi,
      davlat_raqami: v.davlat_raqami,
      sigimi: v.sigimi || 1000,
      holati: v.holati,
      biriktirilgan_haydovchi_id: v.biriktirilgan_haydovchi_id || ""
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomi || !formData.davlat_raqami) {
      setFormError("Nomi va davlat raqamini kiritish majburiy!");
      return;
    }
    if (formData.sigimi <= 0) {
      setFormError("Sig'imi musbat son bo'lishi shart!");
      return;
    }

    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `/api/vehicles/${formData.id}` : "/api/vehicles";
      const method = isEdit ? "PUT" : "POST";

      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
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
      const res = await fetch(`/api/vehicles/${deleteId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDeleteId("");
        loadData();
      }
    } catch (err) {
      console.error("Moshina o'chirishda xatolik:", err);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      v.nomi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.davlat_raqami.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || v.holati === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter Drivers to assign
  const drivers = workers.filter(w => w.lavozimi === "Haydovchi");

  // Pagination Logic
  const totalItems = filteredVehicles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">Transport Floti (Moshinalar)</h1>
          <p className="text-sm text-gray-500">Bog'chalarga oziq-ovqat yetkazib berishda band bo'lgan moshinalar va ularning holati</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm cursor-pointer transition"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi transport qo'shish</span>
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
            placeholder="Moshina markasi yoki davlat raqami bo'yicha qidiruv..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-gray-500 uppercase block sm:inline">Holat filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">Barchasi ({vehicles.length} ta)</option>
            <option value="bosh">Bo'sh (Turibdi)</option>
            <option value="band">Yo'lda (Band)</option>
            <option value="tamirda">Ta'mirda</option>
          </select>
        </div>
      </div>

      {/* Grid of Vehicles Card */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-semibold text-gray-500">Transportlar yuklanmoqda...</p>
        </div>
      ) : currentItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 rounded-xl bg-white border border-dashed border-gray-200">
          <Truck className="h-12 w-12 text-gray-300 mb-2" />
          <p className="text-base font-semibold text-gray-600">Mos transportlar topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {currentItems.map((v) => {
            const driver = workers.find(w => w.id === v.biriktirilgan_haydovchi_id);
            
            // Status color configs
            let statusBadge = "bg-green-50 text-green-700 border border-green-200";
            let statusTxt = "Bo'sh (Rasmda)";
            if (v.holati === "band") {
              statusBadge = "bg-blue-50 text-blue-700 border border-blue-200";
              statusTxt = "Yo'lda (Band)";
            } else if (v.holati === "tamirda") {
              statusBadge = "bg-red-50 text-red-700 border border-red-200 animate-pulse";
              statusTxt = "Ta'mirda";
            }

            return (
              <div key={v.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{v.nomi}</h4>
                      <span className="text-xs font-mono text-gray-400 block mt-0.5">{v.davlat_raqami}</span>
                    </div>
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                      <Truck className="h-5 w-5" />
                    </span>
                  </div>

                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${statusBadge}`}>
                    {statusTxt}
                  </span>

                  <div className="pt-2 border-t border-gray-50 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Yuk sig'imi:</span>
                      <span className="font-bold text-gray-900">{v.sigimi ? `${v.sigimi.toLocaleString("uz-UZ")} kg` : "Noma'lum"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Haydovchi:</span>
                      <span className="font-semibold text-gray-800">
                        {driver ? driver.f_i_sh : "Haydovchi biriktirilmagan"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-50 shrink-0">
                  <button
                    onClick={() => handleOpenEditForm(v)}
                    className="flex-1 rounded-lg border border-slate-300 py-1.5 text-center text-xs font-semibold text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(v.id)}
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

      {/* Transport Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-gray-100">
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 font-sans">
                {formData.id ? "Transportni tahrirlash" : "Yangi transport qo'shish"}
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
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Moshina markasi / nomi *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomi}
                    onChange={(e) => setFormData({ ...formData, nomi: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Chevrolet Damas, Isuzu, Labo"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Davlat ro'yxat raqami *</label>
                  <input
                    type="text"
                    required
                    value={formData.davlat_raqami}
                    onChange={(e) => setFormData({ ...formData, davlat_raqami: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="01 777 AAA"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Maksimal yuk sig'imi (kg da)</label>
                  <input
                    type="number"
                    value={formData.sigimi}
                    onChange={(e) => setFormData({ ...formData, sigimi: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Moshina joriy holati *</label>
                  <select
                    value={formData.holati}
                    onChange={(e) => setFormData({ ...formData, holati: e.target.value as any })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="bosh">BO'SH (Ishga tayyor)</option>
                    <option value="band">BAND (Safarda / Yo'lda)</option>
                    <option value="tamirda">TA'MIRDA (Remontda)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Biriktirilgan haydovchi</label>
                  <select
                    value={formData.biriktirilgan_haydovchi_id}
                    onChange={(e) => setFormData({ ...formData, biriktirilgan_haydovchi_id: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-955 focus:border-blue-500 outline-none"
                  >
                    <option value="">-- Haydovchi tanlanmagan --</option>
                    {drivers.map((w) => (
                      <option key={w.id} value={w.id}>{w.f_i_sh}</option>
                    ))}
                  </select>
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
        title="Transportni o'chirish"
        message="Haqiqatdan ham ushbu moshinani o'chirmoqchimisiz? Ushbu amaldan keyin transport vositalari ro'yxatidan butunlay yo'qoladi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
