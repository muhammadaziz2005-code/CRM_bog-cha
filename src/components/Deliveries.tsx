import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { Plus, Search, Edit2, Trash2, X, AlertCircle, Truck, Calendar, User, Printer, PackagePlus } from "lucide-react";
import { Delivery, DeliveryItem, Kindergarten, Product, Vehicle, Worker, WarehouseStock } from "../types";
import { formatTashkentDate, getLocalDateInputVal, inputValToTashkentISO, getTashkentISO } from "../utils";
import ConfirmationModal from "./ConfirmationModal";

// Forma ichida ishlatiladigan mahsulot qatori (miqdor bo'sh bo'lishi mumkin, shuning uchun input string)
interface FormItem {
  mahsulot_id: string;
  miqdor: number;
}

=======
import { Plus, Search, Edit2, Trash2, X, AlertCircle, Truck, Calendar, ArrowRightCircle, User, CheckCircle2, Printer } from "lucide-react";
import { Delivery, Kindergarten, Product, Vehicle, Worker, WarehouseStock } from "../types";
import { formatTashkentDate, getLocalDateInputVal, inputValToTashkentISO, getTashkentISO } from "../utils";
import ConfirmationModal from "./ConfirmationModal";

>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
export default function Deliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stocks, setStocks] = useState<WarehouseStock[]>([]);
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
    bogcha_id: "",
<<<<<<< HEAD
    items: [{ mahsulot_id: "", miqdor: 0 }] as FormItem[],
=======
    mahsulot_id: "",
    miqdor: 0,
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
    sana: "", // YYYY-MM-DD
    moshina_id: "",
    ishchi_id: "", // driver
    holati: "yetkazildi" as "rejalashtirilgan" | "yolda" | "yetkazildi" | "bekor_qilindi"
  });

  // Delete State
  const [deleteId, setDeleteId] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [delRes, kRes, pRes, sRes, vRes, wRes] = await Promise.all([
        fetch("/api/deliveries"),
        fetch("/api/kindergartens"),
        fetch("/api/products"),
        fetch("/api/warehouse/stock"),
        fetch("/api/vehicles"),
        fetch("/api/workers")
      ]);

      setDeliveries(await delRes.json());
      setKindergartens(await kRes.json());
      setProducts(await pRes.json());
      setStocks(await sRes.json());
      setVehicles(await vRes.json());
      setWorkers(await wRes.json());
    } catch (err) {
      console.error("Yetkazib berish ma'lumotlarini yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenAddForm = () => {
    const nowTashkent = getTashkentISO();
    
    // Pick the first available values for dropdowns
    const firstK = kindergartens[0]?.id || "";
    const firstP = products[0]?.id || "";
    // Filter active drivers
    const activeDrivers = workers.filter(w => w.lavozimi === "Haydovchi" && w.ish_holati === "faol");
    const firstD = activeDrivers[0]?.id || "";
    // Filter free vehicles or any
    const firstV = vehicles[0]?.id || "";

    setFormData({
      id: "",
      bogcha_id: firstK,
<<<<<<< HEAD
      items: [{ mahsulot_id: firstP, miqdor: 20 }],
=======
      mahsulot_id: firstP,
      miqdor: 20,
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
      sana: getLocalDateInputVal(nowTashkent),
      moshina_id: firstV,
      ishchi_id: firstD,
      holati: "yetkazildi"
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (d: Delivery) => {
    setFormData({
      id: d.id,
      bogcha_id: d.bogcha_id,
<<<<<<< HEAD
      items: d.items.length > 0
        ? d.items.map(it => ({ mahsulot_id: it.mahsulot_id, miqdor: it.miqdor }))
        : [{ mahsulot_id: "", miqdor: 0 }],
=======
      mahsulot_id: d.mahsulot_id,
      miqdor: d.miqdor,
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
      sana: getLocalDateInputVal(d.sana),
      moshina_id: d.moshina_id,
      ishchi_id: d.ishchi_id,
      holati: d.holati
    });
    setFormError("");
    setIsFormOpen(true);
  };

<<<<<<< HEAD
  // --- Mahsulot qatorlari bilan ishlash ---
  const handleAddItemRow = () => {
    // Hali tanlanmagan (formadagi mavjud qatorlarda ishlatilmagan) birinchi mahsulotni taklif qilamiz
    const usedIds = formData.items.map(it => it.mahsulot_id);
    const nextProduct = products.find(p => !usedIds.includes(p.id));
    setFormData({
      ...formData,
      items: [...formData.items, { mahsulot_id: nextProduct?.id || "", miqdor: 0 }]
    });
  };

  const handleRemoveItemRow = (index: number) => {
    if (formData.items.length <= 1) return; // kamida bitta qator qolishi shart
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleItemChange = (index: number, field: "mahsulot_id" | "miqdor", value: string) => {
    const updatedItems = formData.items.map((it, i) => {
      if (i !== index) return it;
      if (field === "mahsulot_id") return { ...it, mahsulot_id: value };
      return { ...it, miqdor: Number(value) };
    });
    setFormData({ ...formData, items: updatedItems });
  };

  // Ombordagi joriy zaxira (shu mahsulot uchun)
  const getCurrentStock = (mahsulot_id: string) => {
    const stockObj = stocks.find(s => s.mahsulot_id === mahsulot_id);
    return stockObj ? stockObj.joriy_miqdor : 0;
  };

  // Tahrirlash vaqtida, shu delivery avval shu mahsulotdan qancha olib ketgan bo'lsa,
  // o'sha miqdorni joriy zaxiraga qaytarib qo'shib hisoblaymiz (chunki hali saqlanmagan)
  const getOriginalQtyForProduct = (mahsulot_id: string) => {
    if (!formData.id) return 0;
    const originalDel = deliveries.find(d => d.id === formData.id);
    if (!originalDel || originalDel.holati === "bekor_qilindi") return 0;
    return originalDel.items
      .filter(it => it.mahsulot_id === mahsulot_id)
      .reduce((sum, it) => sum + it.miqdor, 0);
  };

  // Forma ichida shu mahsulotdan jami nechta so'ralayotgani (bir nechta qatorda bo'lishi mumkin emas, lekin xavfsizlik uchun)
  const getRequestedQtyForProduct = (mahsulot_id: string) => {
    return formData.items
      .filter(it => it.mahsulot_id === mahsulot_id)
      .reduce((sum, it) => sum + (Number(it.miqdor) || 0), 0);
  };

  const isProductInsufficient = (mahsulot_id: string) => {
    if (!mahsulot_id) return false;
    const available = getCurrentStock(mahsulot_id) + getOriginalQtyForProduct(mahsulot_id);
    const requested = getRequestedQtyForProduct(mahsulot_id);
    return requested > available;
  };

  const hasAnyInsufficientStock = formData.items.some(it => it.mahsulot_id && isProductInsufficient(it.mahsulot_id));

  // Bitta chiqimda bir xil mahsulot ikki marta tanlanishining oldini olish uchun tekshiruv
  const hasDuplicateProducts = () => {
    const ids = formData.items.map(it => it.mahsulot_id).filter(Boolean);
    return new Set(ids).size !== ids.length;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bogcha_id || !formData.moshina_id || !formData.ishchi_id) {
      setFormError("Barcha tanlovlarni to'ldiring: Bog'cha, moshina va ishchi majburiy!");
      return;
    }

    const validItems = formData.items.filter(it => it.mahsulot_id);
    if (validItems.length === 0) {
      setFormError("Kamida bitta mahsulot tanlanishi shart!");
      return;
    }

    if (validItems.some(it => !it.miqdor || it.miqdor <= 0)) {
      setFormError("Har bir mahsulot uchun miqdor musbat son bo'lishi shart!");
      return;
    }

    if (hasDuplicateProducts()) {
      setFormError("Bitta mahsulot ro'yxatda faqat bir marta bo'lishi kerak. Miqdorni bitta qatorga jamlang!");
=======
  // Find selected product available stock
  const selectedProductStockObj = stocks.find(s => s.mahsulot_id === formData.mahsulot_id);
  const availableStock = selectedProductStockObj ? selectedProductStockObj.joriy_miqdor : 0;
  
  // Is stock enough warning boolean
  // If we are editing, we should add the original delivery quantity back to available for validation purposes
  let originalQty = 0;
  if (formData.id) {
    const originalDel = deliveries.find(d => d.id === formData.id);
    if (originalDel && originalDel.mahsulot_id === formData.mahsulot_id && originalDel.holati !== "bekor_qilindi") {
      originalQty = originalDel.miqdor;
    }
  }
  const isStockInsufficient = formData.miqdor > (availableStock + originalQty);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bogcha_id || !formData.mahsulot_id || !formData.moshina_id || !formData.ishchi_id) {
      setFormError("Barcha tanlovlarni to'ldiring: Bog'cha, mahsulot, moshina va ishchi majburiy!");
      return;
    }
    if (formData.miqdor <= 0) {
      setFormError("Yetkazib berish miqdori musbat son bo'lishi shart!");
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
      return;
    }

    try {
      const isEdit = !!formData.id;
      const url = isEdit ? `/api/deliveries/${formData.id}` : "/api/deliveries";
      const method = isEdit ? "PUT" : "POST";

      const submissionData = {
<<<<<<< HEAD
        bogcha_id: formData.bogcha_id,
        items: validItems.map(it => ({ mahsulot_id: it.mahsulot_id, miqdor: Number(it.miqdor) })),
        moshina_id: formData.moshina_id,
        ishchi_id: formData.ishchi_id,
        holati: formData.holati,
=======
        ...formData,
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
        sana: inputValToTashkentISO(formData.sana)
      };

      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData)
      });

      if (r.ok) {
        setIsFormOpen(false);
        loadAllData();
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
      const res = await fetch(`/api/deliveries/${deleteId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setDeleteId("");
        loadAllData();
      }
    } catch (err) {
      console.error("Yetkazib berishni o'chirishda xatolik:", err);
    }
  };

<<<<<<< HEAD
  // Print a delivery (bir nechta mahsulotli bo'lishi mumkin) as a "Yuk xati" (waybill) document in a new tab
  const handlePrint = (
    d: Delivery,
    school?: Kindergarten,
=======
  // Print a single delivery as a "Yuk xati" (waybill) document in a new tab
  const handlePrint = (
    d: Delivery,
    school?: Kindergarten,
    product?: Product,
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
    vehicle?: Vehicle,
    driver?: Worker
  ) => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;

<<<<<<< HEAD
    const rows = d.items.map((it, idx) => {
      const product = products.find(p => p.id === it.mahsulot_id);
      const birlikNarxi = (product as any)?.oxirgi_kelish_narxi as number | undefined;
      const jamiSumma = birlikNarxi ? birlikNarxi * it.miqdor : undefined;
      return `
              <tr>
                <td>${idx + 1}</td>
                <td>${product?.nomi ?? ""}</td>
                <td>${product?.birligi ?? ""}</td>
                <td>${it.miqdor.toLocaleString("uz-UZ")}</td>
                <td>${birlikNarxi ? birlikNarxi.toLocaleString("uz-UZ") : ""}</td>
                <td>${jamiSumma ? jamiSumma.toLocaleString("uz-UZ") : ""}</td>
              </tr>`;
    }).join("");

    const jamiUmumiySumma = d.items.reduce((sum, it) => {
      const product = products.find(p => p.id === it.mahsulot_id);
      const birlikNarxi = (product as any)?.oxirgi_kelish_narxi as number | undefined;
      return sum + (birlikNarxi ? birlikNarxi * it.miqdor : 0);
    }, 0);

    const emptyRowsCount = Math.max(0, 6 - d.items.length);
=======
    // Use price info if the product carries a last-known incoming price
    const birlikNarxi = (product as any)?.oxirgi_kelish_narxi as number | undefined;
    const jamiSumma = birlikNarxi ? birlikNarxi * d.miqdor : undefined;
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d

    printWindow.document.write(`
      <html>
        <head>
          <title>Yuk xati - ${d.id}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 13px; padding: 30px; color: #000; }
            h2 { text-align: center; margin-bottom: 18px; }
            .row { display: flex; margin: 8px 0; }
            .label { font-weight: bold; margin-right: 6px; white-space: nowrap; }
            .line { border-bottom: 1px solid #000; flex: 1; padding-bottom: 2px; }
            table { width: 100%; border-collapse: collapse; margin-top: 18px; }
            th, td { border: 1px solid #000; padding: 7px; text-align: center; font-size: 12px; }
            th { background: #f0f0f0; }
<<<<<<< HEAD
            tfoot td { font-weight: bold; text-align: right; }
=======
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
            .footer { display: flex; justify-content: space-between; margin-top: 50px; }
            .sign-line { border-bottom: 1px solid #000; display: inline-block; width: 60%; margin-left: 8px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="row"><span class="label">Korxona nomi:</span><span class="line">Bog'cha ta'minoti markaziy ombori</span></div>
          <h2>YUK XATI № ${d.id.slice(-6).toUpperCase()}</h2>
          <div class="row"><span class="label">Sana:</span><span class="line">${formatTashkentDate(d.sana)}</span></div>
          <div class="row"><span class="label">Qaerdan:</span><span class="line">Markaziy ombor</span></div>
          <div class="row"><span class="label">Qaerga:</span><span class="line">${school ? `${school.nomi} (${school.tuman} tumani)` : ""}</span></div>
          <div class="row"><span class="label">Kim orqali:</span><span class="line">${driver?.f_i_sh ?? ""} — ${vehicle ? `${vehicle.nomi} (${vehicle.davlat_raqami})` : ""}</span></div>

          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Maxsulot nomi</th>
                <th>O'lchov birligi</th>
                <th>Soni</th>
                <th>Narxi (so'm)</th>
                <th>Summasi (so'm)</th>
              </tr>
            </thead>
            <tbody>
<<<<<<< HEAD
              ${rows}
              ${Array.from({ length: emptyRowsCount })
                .map(() => "<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>")
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5">Jami summa:</td>
                <td>${jamiUmumiySumma ? jamiUmumiySumma.toLocaleString("uz-UZ") + " so'm" : ""}</td>
              </tr>
            </tfoot>
=======
              <tr>
                <td>1</td>
                <td>${product?.nomi ?? ""}</td>
                <td>${product?.birligi ?? ""}</td>
                <td>${d.miqdor.toLocaleString("uz-UZ")}</td>
                <td>${birlikNarxi ? birlikNarxi.toLocaleString("uz-UZ") : ""}</td>
                <td>${jamiSumma ? jamiSumma.toLocaleString("uz-UZ") : ""}</td>
              </tr>
              ${Array.from({ length: 8 })
                .map(() => "<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>")
                .join("")}
            </tbody>
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
          </table>

          <div class="footer">
            <div>Boshliq: <span class="sign-line"></span></div>
            <div>Bosh xisobchi: <span class="sign-line"></span></div>
          </div>
          <div class="footer" style="margin-top:30px;">
            <div>Berdim (${driver?.f_i_sh ?? ""}): <span class="sign-line"></span></div>
            <div>Oldim: <span class="sign-line"></span></div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Filter list
  const filteredDeliveries = deliveries.filter((d) => {
    const school = kindergartens.find(k => k.id === d.bogcha_id);
<<<<<<< HEAD
    const driver = workers.find(w => w.id === d.ishchi_id);
    const productNames = d.items
      .map(it => products.find(p => p.id === it.mahsulot_id)?.nomi || "")
      .join(" ");

    const searchableText = [
      school?.nomi || "",
      productNames,
=======
    const product = products.find(p => p.id === d.mahsulot_id);
    const driver = workers.find(w => w.id === d.ishchi_id);

    const searchableText = [
      school?.nomi || "",
      product?.nomi || "",
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
      driver?.f_i_sh || "",
      d.id
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.holati === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.sana).getTime() - new Date(a.sana).getTime());

  // Drivers Filter (only workers who are Drivers)
  const drivers = workers.filter(w => w.lavozimi === "Haydovchi");

  // Pagination Logic
  const totalItems = filteredDeliveries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDeliveries.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">Etkazib Berishlar jurnali (Chiqim)</h1>
          <p className="text-sm text-gray-500">38 ta bog'chaga oziq-ovqat mahsulotlarini rejalashtirish, transport va topshirish jurnali</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          disabled={kindergartens.length === 0 || products.length === 0}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm cursor-pointer transition disabled:opacity-50"
        >
          <Plus className="h-5 w-5" />
          <span>Yangi yetkazib berish (Chiqim)</span>
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
            placeholder="Bog'cha nomi, mahsulot yoki haydovchi ismi bilan qidirish..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-semibold text-gray-500 uppercase block sm:inline">Holat filteri:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">Barchasi ({deliveries.length} ta)</option>
            <option value="rejalashtirilgan">Rejalashtirilgan</option>
            <option value="yolda">Yo'lda</option>
            <option value="yetkazildi">Yetkazildi (Yakunlandi)</option>
            <option value="bekor_qilindi">Bekor qilingan</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-semibold text-gray-500">Yuk tashish jurnali yuklanmoqda...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <Truck className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-base font-semibold text-gray-600">Yetkazib berish yozuvlari topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="px-6 py-4">Bog'cha (Qabul qiluvchi)</th>
<<<<<<< HEAD
                  <th className="px-6 py-4">Mahsulotlar & Miqdorlar</th>
=======
                  <th className="px-6 py-4">Mahsulot & Miqdor</th>
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
                  <th className="px-6 py-4">Moshina & Haydovchi</th>
                  <th className="px-6 py-4">Ta'minot sanasi</th>
                  <th className="px-6 py-4">Yetkazib berish holati</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-sm">
                {currentItems.map((d) => {
                  const school = kindergartens.find(k => k.id === d.bogcha_id);
<<<<<<< HEAD
=======
                  const product = products.find(p => p.id === d.mahsulot_id);
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
                  const vehicle = vehicles.find(v => v.id === d.moshina_id);
                  const driver = workers.find(w => w.id === d.ishchi_id);

                  let statusBadge = "bg-gray-100 text-gray-800";
                  let statusText = d.holati;
                  if (d.holati === "yetkazildi") {
                    statusBadge = "bg-green-50 text-green-700 border border-green-200";
                    statusText = "Yetkazildi";
                  } else if (d.holati === "yolda") {
                    statusBadge = "bg-blue-50 text-blue-700 border border-blue-200";
                    statusText = "Yo'lda";
                  } else if (d.holati === "rejalashtirilgan") {
                    statusBadge = "bg-yellow-50 text-yellow-700 border border-yellow-200";
                    statusText = "Rejalashtirilgan";
                  } else if (d.holati === "bekor_qilindi") {
                    statusBadge = "bg-red-50 text-red-700 border border-red-200";
                    statusText = "Bekor qilindi";
                  }

                  return (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{school ? school.nomi : "Noma'lum bog'cha"}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{school ? `${school.tuman} tumani` : ""}</div>
                      </td>
                      <td className="px-6 py-4">
<<<<<<< HEAD
                        <div className="space-y-1 max-w-xs">
                          {d.items.map((it, idx) => {
                            const product = products.find(p => p.id === it.mahsulot_id);
                            return (
                              <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                                <span className="font-semibold text-gray-800 truncate">{product ? product.nomi : "Mahsulot"}</span>
                                <span className="font-bold text-orange-700 whitespace-nowrap">
                                  -{it.miqdor.toLocaleString("uz-UZ")} {product?.birligi || ""}
                                </span>
                              </div>
                            );
                          })}
=======
                        <div className="font-semibold text-gray-800">{product ? product.nomi : "Mahsulot"}</div>
                        <div className="text-xs font-bold text-orange-700 mt-0.5">
                          -{d.miqdor.toLocaleString("uz-UZ")} {product?.birligi || "kg"}
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                          <Truck className="h-3.5 w-3.5 text-gray-400" />
                          <span>{vehicle ? `${vehicle.nomi} (${vehicle.davlat_raqami})` : "Moshinasiz"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          <span>{driver ? driver.f_i_sh : "Haydovchisiz"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span>{formatTashkentDate(d.sana)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold leading-5 uppercase ${statusBadge}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
<<<<<<< HEAD
                            onClick={() => handlePrint(d, school, vehicle, driver)}
=======
                            onClick={() => handlePrint(d, school, product, vehicle, driver)}
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
                            className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                            title="Yuk xatini chop etish"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditForm(d)}
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(d.id)}
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

      {/* Deliveries Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
<<<<<<< HEAD
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-gray-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-100 shrink-0">
=======
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-gray-100">
            <div className="flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-100">
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
              <h3 className="text-lg font-bold text-gray-900 font-sans">
                {formData.id ? "Yuk varaqasini tahrirlash" : "Yangi ta'minot chiqimi yaratish"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

<<<<<<< HEAD
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto">
=======
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
              {formError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-xs font-semibold text-red-700 border border-red-100">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Muvofiq bog'cha (MTT) *</label>
                  <select
                    value={formData.bogcha_id}
                    onChange={(e) => setFormData({ ...formData, bogcha_id: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-950 focus:border-blue-500 outline-none"
                  >
                    <option value="">-- Bog'chani tanlang --</option>
                    {kindergartens.map((k) => (
                      <option key={k.id} value={k.id}>{k.nomi} ({k.bolalar_soni} ta bola)</option>
                    ))}
                  </select>
                </div>

                <div>
<<<<<<< HEAD
=======
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Taqsimlanadigan mahsulot *</label>
                  <select
                    value={formData.mahsulot_id}
                    onChange={(e) => setFormData({ ...formData, mahsulot_id: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-950 focus:border-blue-500 outline-none"
                  >
                    <option value="">-- Mahsulotni tanlang --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.nomi} ({p.birligi})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Yetkazib berish miqdori *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.miqdor || ""}
                    onChange={(e) => setFormData({ ...formData, miqdor: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                {/* Live Stock info check & Warnings */}
                <div className="sm:col-span-2 rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-1.5 flex flex-col justify-center">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider">Ombordagi mavjud joriy zaxira:</span>
                    <span className="font-black text-slate-900">
                      {availableStock.toLocaleString("uz-UZ")} {products.find(p => p.id === formData.mahsulot_id)?.birligi || ""}
                    </span>
                  </div>

                  {isStockInsufficient && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 p-2.5 text-[11px] font-bold text-red-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>Ogohlantirish: Kiritilgan miqdor joriy zaxiradan ko'p!</span>
                    </div>
                  )}
                </div>

                <div>
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Taqsimlovchi moshina *</label>
                  <select
                    value={formData.moshina_id}
                    onChange={(e) => setFormData({ ...formData, moshina_id: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-950 focus:border-blue-500 outline-none"
                  >
                    <option value="">-- Moshinani tanlang --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.nomi} — {v.davlat_raqami}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Haydovchi xodim *</label>
                  <select
                    value={formData.ishchi_id}
                    onChange={(e) => setFormData({ ...formData, ishchi_id: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-955 focus:border-blue-500 outline-none"
                  >
                    <option value="">-- Haydovchini tanlang --</option>
                    {drivers.map((w) => (
                      <option key={w.id} value={w.id}>{w.f_i_sh}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Yetkazib berish sanasi *</label>
                  <input
                    type="date"
                    required
                    value={formData.sana}
                    onChange={(e) => setFormData({ ...formData, sana: e.target.value })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Etkazish holati *</label>
                  <select
                    value={formData.holati}
                    onChange={(e) => setFormData({ ...formData, holati: e.target.value as any })}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-955 focus:border-blue-500 outline-none"
                  >
                    <option value="rejalashtirilgan">REJALASHTIRILGAN</option>
                    <option value="yolda">YO'LDA (Moshina yo'lda)</option>
                    <option value="yetkazildi">YETKAZILDI (Yetkazildi)</option>
                    <option value="bekor_qilindi">BEKOR QILINDI</option>
                  </select>
                </div>
              </div>

<<<<<<< HEAD
              {/* Mahsulotlar ro'yxati — bitta chiqimda bir nechta xil mahsulot */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2 mt-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Yetkaziladigan mahsulotlar *</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                  >
                    <PackagePlus className="h-3.5 w-3.5" />
                    Yana mahsulot qo'shish
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formData.items.map((item, index) => {
                    const product = products.find(p => p.id === item.mahsulot_id);
                    const available = getCurrentStock(item.mahsulot_id) + getOriginalQtyForProduct(item.mahsulot_id);
                    const insufficient = item.mahsulot_id && isProductInsufficient(item.mahsulot_id);

                    return (
                      <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <select
                              value={item.mahsulot_id}
                              onChange={(e) => handleItemChange(index, "mahsulot_id", e.target.value)}
                              className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-2.5 text-sm text-slate-950 focus:border-blue-500 outline-none"
                            >
                              <option value="">-- Mahsulotni tanlang --</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>{p.nomi} ({p.birligi})</option>
                              ))}
                            </select>
                          </div>
                          <div className="w-28">
                            <input
                              type="number"
                              min={1}
                              placeholder="Miqdor"
                              value={item.miqdor || ""}
                              onChange={(e) => handleItemChange(index, "miqdor", e.target.value)}
                              className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-2.5 text-sm text-slate-900 outline-none focus:border-blue-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(index)}
                            disabled={formData.items.length <= 1}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Qatorni olib tashlash"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {item.mahsulot_id && (
                          <div className="mt-2 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-semibold">
                              Ombordagi mavjud zaxira: <span className="text-slate-900 font-black">{available.toLocaleString("uz-UZ")} {product?.birligi || ""}</span>
                            </span>
                            {insufficient && (
                              <span className="flex items-center gap-1 font-bold text-red-600">
                                <AlertCircle className="h-3.5 w-3.5" />
                                Zaxiradan ko'p!
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {hasAnyInsufficientStock && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 p-2.5 text-[11px] font-bold text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Ogohlantirish: Ro'yxatdagi ba'zi mahsulotlar miqdori ombordagi joriy zaxiradan ko'p!</span>
                  </div>
                )}
              </div>

=======
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
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
                  Yukni tasdiqlash (Chiqim)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Yuk varaqasini o'chirish"
        message="Haqiqatdan ham ushbu yetkazib berish varaqasi yozuvini o'chirmoqchimisiz? O'chirilganda mahsulot miqdori qayta zaxiraning joriy hisobiga qaytariladi."
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}