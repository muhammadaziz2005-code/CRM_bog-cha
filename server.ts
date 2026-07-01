import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
<<<<<<< HEAD
import { Kindergarten, AdminUser, Product, StockIn, Delivery, DeliveryItem, Vehicle, Worker } from "./src/types";
=======
<<<<<<< HEAD
import { Kindergarten, AdminUser, Product, StockIn, Delivery, DeliveryItem, Vehicle, Worker } from "./src/types";
=======
import { Kindergarten, AdminUser, Product, StockIn, Delivery, Vehicle, Worker } from "./src/types";
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6

// Database File Path
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper to write database
function saveDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Helper to read database
function loadDB(): {
  kindergartens: Kindergarten[];
  admin_user: AdminUser;
  products: Product[];
  stock_in: StockIn[];
  deliveries: Delivery[];
  vehicles: Vehicle[];
  workers: Worker[];
} {
  if (!fs.existsSync(DB_FILE)) {
    // Generate Rich Seed Data
    const initialKindergartens: Kindergarten[] = Array.from({ length: 38 }, (_, i) => {
      const id = `k_${i + 1}`;
      const tumans = ["Chortoq", "Yangiqo'rg'on", "Mirzo Ulug'bek", "Uchtepa", "Shayxontohur", "Yakkasaroy", "Sergeli", "Yashnobod", "Olmazor", "Mirobod"];
      const tuman = tumans[i % tumans.length];
      const nomi = `${tuman} tumani ${i + 9}-sonli maktabgacha ta'lim tashkiloti`;
      const masul_shaxslar = ["Madina Karimoava", "Nilufar Dadajonova", "Dilnoza Ahmedova", "Aziza Raimova", "Shahnoza Sobirova", "Shohida Olimova", "Zuhra Aliyeva", "Nargiza Umarova"];
      const masul_shaxs = masul_shaxslar[i % masul_shaxslar.length];
      const bolalar_soni = Math.floor(Math.random() * (220 - 90 + 1) + 90); // 90 to 220 kids
      const telefon_raqami = `+998 90 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`;
      return {
        id,
        nomi,
        manzili: `${tuman} tumani, ${i + 12}-daha, ${i + 2}-uy`,
        tuman,
        bolalar_soni,
        masul_shaxs,
        telefon_raqami,
        holati: "faol"
      };
    });

    const initialAdmin: AdminUser = {
      id: "admin_1",
      f_i_sh: "Alisher Fayzullayev",
      login: "admin",
      parol: "admin", // simple credential
      telefon_raqami: "+998 90 123 45 67",
      email: "alisher@crm.uz",
      profil_rasmi: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    };

    const initialProducts: Product[] = [
      { id: "p_1", nomi: "Guruch", birligi: "kg", kategoriyasi: "Don mahsulotlari", minimal_zahira_chegarasi: 300, oxirgi_kelish_narxi: 16000 },
      { id: "p_2", nomi: "Go'sht (Qiyma)", birligi: "kg", kategoriyasi: "Go'sht mahsulotlari", minimal_zahira_chegarasi: 400, oxirgi_kelish_narxi: 85000 },
      { id: "p_3", nomi: "Un (1-nav)", birligi: "kg", kategoriyasi: "Un mahsulotlari", minimal_zahira_chegarasi: 500, oxirgi_kelish_narxi: 7200 },
      { id: "p_4", nomi: "O'simlik yog'i", birligi: "litr", kategoriyasi: "Yog' mahsulotlari", minimal_zahira_chegarasi: 200, oxirgi_kelish_narxi: 15500 },
      { id: "p_5", nomi: "Kartoshka", birligi: "kg", kategoriyasi: "Sabzavotlar", minimal_zahira_chegarasi: 600, oxirgi_kelish_narxi: 4800 },
      { id: "p_6", nomi: "Sabzi", birligi: "kg", kategoriyasi: "Sabzavotlar", minimal_zahira_chegarasi: 250, oxirgi_kelish_narxi: 3500 },
      { id: "p_7", nomi: "Piyoz", birligi: "kg", kategoriyasi: "Sabzavotlar", minimal_zahira_chegarasi: 200, oxirgi_kelish_narxi: 3000 },
      { id: "p_8", nomi: "Sut", birligi: "litr", kategoriyasi: "Sut mahsulotlari", minimal_zahira_chegarasi: 300, oxirgi_kelish_narxi: 9000 },
      { id: "p_9", nomi: "Shakar", birligi: "kg", kategoriyasi: "Shirinliklar", minimal_zahira_chegarasi: 250, oxirgi_kelish_narxi: 13200 },
      { id: "p_10", nomi: "Tuxum", birligi: "dona", kategoriyasi: "Tuxum", minimal_zahira_chegarasi: 1000, oxirgi_kelish_narxi: 1200 }
    ];


    const initialWorkers: Worker[] = [
      { id: "w_1", f_i_sh: "Bobur Karimov", lavozimi: "Haydovchi", telefon_raqami: "+998 93 111 22 33", ish_holati: "faol" },
      { id: "w_2", f_i_sh: "Sardor Olimov", lavozimi: "Haydovchi", telefon_raqami: "+998 94 444 55 66", ish_holati: "faol" },
      { id: "w_3", f_i_sh: "Jasur Rahimov", lavozimi: "Haydovchi", telefon_raqami: "+998 99 777 88 99", ish_holati: "faol" },
      { id: "w_4", f_i_sh: "Asror Ergashev", lavozimi: "Omborchi (Bosh)", telefon_raqami: "+998 90 222 33 44", ish_holati: "faol" },
      { id: "w_5", f_i_sh: "Zafar To'rayev", lavozimi: "Menejer", telefon_raqami: "+998 91 333 44 55", ish_holati: "faol" }
    ];

    const initialVehicles: Vehicle[] = [
      { id: "v_1", nomi: "Isuzu NPR", davlat_raqami: "01 777 AAA", sigimi: 3500, holati: "bosh", biriktirilgan_haydovchi_id: "w_1" },
      { id: "v_2", nomi: "Changan M-9", davlat_raqami: "01 123 BBB", sigimi: 1200, holati: "bosh", biriktirilgan_haydovchi_id: "w_2" },
      { id: "v_3", nomi: "Chevrolet Damas", davlat_raqami: "01 456 CCC", sigimi: 550, holati: "bosh", biriktirilgan_haydovchi_id: "w_3" },
      { id: "v_4", nomi: "Chevrolet Labo", davlat_raqami: "01 789 DDD", sigimi: 700, holati: "tamirda", biriktirilgan_haydovchi_id: "" }
    ];

    // Seed dates with UTC+5 Tashkent (say we write current year 2026 dates)
    const baseDateString = "2026-06-15T09:00:00+05:00";
    const baseDateString2 = "2026-06-18T14:30:00+05:00";
    const baseDateString3 = "2026-06-20T11:15:00+05:00";

    const initialStockIn: StockIn[] = [
      { id: "si_1", mahsulot_id: "p_1", miqdor: 2500, birlik_narxi: 15500, jami_narx: 38750000, sana: baseDateString, yetkazib_beruvchi: "Agro-Impex LLC", izoh: "Oliy nav guruch qabul qilindi" },
      { id: "si_2", mahsulot_id: "p_2", miqdor: 1800, birlik_narxi: 83000, jami_narx: 149400000, sana: baseDateString, yetkazib_beruvchi: "G'ishtko'prik Go'sht Cluster", izoh: "Taz go'sht kirimi" },
      { id: "si_3", mahsulot_id: "p_3", miqdor: 3000, birlik_narxi: 7000, jami_narx: 21000000, sana: baseDateString, yetkazib_beruvchi: "Toshkent Don Kombinati", izoh: "Asosiy un zaxirasi" },
      { id: "si_4", mahsulot_id: "p_4", miqdor: 1000, birlik_narxi: 15000, jami_narx: 15000000, sana: baseDateString2, yetkazib_beruvchi: "Yog'gar-Oltin", izoh: "Pista yog'i" },
      { id: "si_5", mahsulot_id: "p_5", miqdor: 4000, birlik_narxi: 4500, jami_narx: 18000000, sana: baseDateString2, yetkazib_beruvchi: "Bosh-Dehqon", izoh: "Kartoshka saralangan" },
      { id: "si_6", mahsulot_id: "p_6", miqdor: 1500, birlik_narxi: 3200, jami_narx: 4800000, sana: baseDateString2, yetkazib_beruvchi: "Sifat Agro", izoh: "Sariq sabzi" },
      { id: "si_7", mahsulot_id: "p_7", miqdor: 1200, birlik_narxi: 2800, jami_narx: 3360000, sana: baseDateString2, yetkazib_beruvchi: "Sifat Agro", izoh: "Piyoz" },
      { id: "si_8", mahsulot_id: "p_8", miqdor: 2000, birlik_narxi: 8800, jami_narx: 17600000, sana: baseDateString3, yetkazib_beruvchi: "Sergeli Sut Zavod", izoh: "Pasterizatsiyalangan sut" },
      { id: "si_9", mahsulot_id: "p_9", miqdor: 1500, birlik_narxi: 13000, jami_narx: 19500000, sana: baseDateString3, yetkazib_beruvchi: "Xorazm Shakar", izoh: "Qop shakarlar" },
      { id: "si_10", mahsulot_id: "p_10", miqdor: 12000, birlik_narxi: 1100, jami_narx: 13200000, sana: baseDateString3, yetkazib_beruvchi: "Uchqahramon Parranda", izoh: "1-nav tovuq tuxumi" }
    ];

<<<<<<< HEAD

    // Seed some deliveries to the first few kindergartens to show activity.
    // Endi bitta yetkazib berish (bitta moshina/haydovchi/sana/bog'cha) bir nechta
    // xil mahsulotni "items" massivi ichida saqlaydi.
    const initialDeliveries: Delivery[] = [
      {
        id: "d_1",
        bogcha_id: "k_1",
        items: [
          { mahsulot_id: "p_1", miqdor: 60 },
          { mahsulot_id: "p_2", miqdor: 45 }
        ],
        sana: "2026-06-18T08:00:00+05:00",
        moshina_id: "v_2",
        ishchi_id: "w_1",
        holati: "yetkazildi"
      },
      {
        id: "d_2",
        bogcha_id: "k_2",
        items: [
          { mahsulot_id: "p_1", miqdor: 50 },
          { mahsulot_id: "p_5", miqdor: 120 }
        ],
        sana: "2026-06-19T09:00:00+05:00",
        moshina_id: "v_3",
        ishchi_id: "w_2",
        holati: "yetkazildi"
      },
      {
        id: "d_3",
        bogcha_id: "k_3",
        items: [{ mahsulot_id: "p_3", miqdor: 80 }],
        sana: "2026-06-20T10:00:00+05:00",
        moshina_id: "v_1",
        ishchi_id: "w_3",
        holati: "yolda"
      },
      {
        id: "d_4",
        bogcha_id: "k_4",
        items: [{ mahsulot_id: "p_8", miqdor: 40 }],
        sana: "2026-06-21T07:30:00+05:00",
        moshina_id: "v_2",
        ishchi_id: "w_1",
        holati: "rejalashtirilgan"
      },
      {
        id: "d_5",
        bogcha_id: "k_5",
        items: [{ mahsulot_id: "p_10", miqdor: 300 }],
        sana: "2026-06-21T11:00:00+05:00",
        moshina_id: "v_1",
        ishchi_id: "w_3",
        holati: "yetkazildi"
      }
=======
<<<<<<< HEAD
    // Seed some deliveries to the first few kindergartens to show activity.
    // Endi bitta yetkazib berish (bitta moshina/haydovchi/sana/bog'cha) bir nechta
    // xil mahsulotni "items" massivi ichida saqlaydi.
    const initialDeliveries: Delivery[] = [
      {
        id: "d_1",
        bogcha_id: "k_1",
        items: [
          { mahsulot_id: "p_1", miqdor: 60 },
          { mahsulot_id: "p_2", miqdor: 45 }
        ],
        sana: "2026-06-18T08:00:00+05:00",
        moshina_id: "v_2",
        ishchi_id: "w_1",
        holati: "yetkazildi"
      },
      {
        id: "d_2",
        bogcha_id: "k_2",
        items: [
          { mahsulot_id: "p_1", miqdor: 50 },
          { mahsulot_id: "p_5", miqdor: 120 }
        ],
        sana: "2026-06-19T09:00:00+05:00",
        moshina_id: "v_3",
        ishchi_id: "w_2",
        holati: "yetkazildi"
      },
      {
        id: "d_3",
        bogcha_id: "k_3",
        items: [{ mahsulot_id: "p_3", miqdor: 80 }],
        sana: "2026-06-20T10:00:00+05:00",
        moshina_id: "v_1",
        ishchi_id: "w_3",
        holati: "yolda"
      },
      {
        id: "d_4",
        bogcha_id: "k_4",
        items: [{ mahsulot_id: "p_8", miqdor: 40 }],
        sana: "2026-06-21T07:30:00+05:00",
        moshina_id: "v_2",
        ishchi_id: "w_1",
        holati: "rejalashtirilgan"
      },
      {
        id: "d_5",
        bogcha_id: "k_5",
        items: [{ mahsulot_id: "p_10", miqdor: 300 }],
        sana: "2026-06-21T11:00:00+05:00",
        moshina_id: "v_1",
        ishchi_id: "w_3",
        holati: "yetkazildi"
      }
=======
    // Seed some deliveries to the first few kindergartens to show activity
    const initialDeliveries: Delivery[] = [
      { id: "d_1", bogcha_id: "k_1", mahsulot_id: "p_1", miqdor: 60, sana: "2026-06-18T08:00:00+05:00", moshina_id: "v_2", ishchi_id: "w_1", holati: "yetkazildi" },
      { id: "d_2", bogcha_id: "k_1", mahsulot_id: "p_2", miqdor: 45, sana: "2026-06-18T08:30:00+05:00", moshina_id: "v_2", ishchi_id: "w_1", holati: "yetkazildi" },
      { id: "d_3", bogcha_id: "k_2", mahsulot_id: "p_1", miqdor: 50, sana: "2026-06-19T09:00:00+05:00", moshina_id: "v_3", ishchi_id: "w_2", holati: "yetkazildi" },
      { id: "d_4", bogcha_id: "k_2", mahsulot_id: "p_5", miqdor: 120, sana: "2026-06-19T09:15:00+05:00", moshina_id: "v_3", ishchi_id: "w_2", holati: "yetkazildi" },
      { id: "d_5", bogcha_id: "k_3", mahsulot_id: "p_3", miqdor: 80, sana: "2026-06-20T10:00:00+05:00", moshina_id: "v_1", ishchi_id: "w_3", holati: "yolda" },
      { id: "d_6", bogcha_id: "k_4", mahsulot_id: "p_8", miqdor: 40, sana: "2026-06-21T07:30:00+05:00", moshina_id: "v_2", ishchi_id: "w_1", holati: "rejalashtirilgan" },
      { id: "d_7", bogcha_id: "k_5", mahsulot_id: "p_10", miqdor: 300, sana: "2026-06-21T11:00:00+05:00", moshina_id: "v_1", ishchi_id: "w_3", holati: "yetkazildi" }
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6
    ];

    const db = {
      kindergartens: initialKindergartens,
      admin_user: initialAdmin,
      products: initialProducts,
      stock_in: initialStockIn,
      deliveries: initialDeliveries,
      vehicles: initialVehicles,
      workers: initialWorkers
    };
    saveDB(db);
    return db;
  }
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6

  const db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));

  // MIGRATSIYA: Eski formatdagi (bitta mahsulotli, mahsulot_id/miqdor to'g'ridan-to'g'ri
  // delivery obyektida) yozuvlarni yangi "items" massiv formatiga o'tkazamiz.
  // Shunda mavjud db.json fayli o'chirilmasdan ham eski ma'lumotlar saqlanib qoladi.
  let migrated = false;
  if (Array.isArray(db.deliveries)) {
    db.deliveries = db.deliveries.map((d: any) => {
      if (!d.items) {
        migrated = true;
        const { mahsulot_id, miqdor, ...rest } = d;
        return {
          ...rest,
          items: mahsulot_id ? [{ mahsulot_id, miqdor: Number(miqdor) || 0 }] : []
        };
      }
      return d;
    });
  }
  if (migrated) {
    saveDB(db);
  }

  return db;
<<<<<<< HEAD
=======
=======
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(express.json());

  // Initialize DB and fetch
  const getDB = () => loadDB();

  // AUTH API
  app.post("/api/auth/login", (req, res) => {
    const { login, parol } = req.body;
    const db = getDB();
    if (db.admin_user.login === login && db.admin_user.parol === parol) {
      // Simple auth, send user data without password
      const { parol, ...userWithoutPassword } = db.admin_user;
      return res.json({ success: true, user: userWithoutPassword });
    }
    return res.status(401).json({ success: false, message: "Login yoki parol noto'g'ri!" });
  });

  app.get("/api/auth/profile", (req, res) => {
    const db = getDB();
    const { parol, ...userWithoutPassword } = db.admin_user;
    res.json(userWithoutPassword);
  });

  app.put("/api/auth/profile", (req, res) => {
    const { f_i_sh, telefon_raqami, email, profil_rasmi } = req.body;
    const db = getDB();
    db.admin_user.f_i_sh = f_i_sh || db.admin_user.f_i_sh;
    db.admin_user.telefon_raqami = telefon_raqami || db.admin_user.telefon_raqami;
    db.admin_user.email = email || db.admin_user.email;
    db.admin_user.profil_rasmi = profil_rasmi || db.admin_user.profil_rasmi;
    saveDB(db);
    const { parol, ...userWithoutPassword } = db.admin_user;
    res.json({ success: true, user: userWithoutPassword });
  });


  app.post("/api/auth/change-password", (req, res) => {
    const { joriy_parol, yangi_parol } = req.body;
    const db = getDB();
    if (db.admin_user.parol === joriy_parol) {
      db.admin_user.parol = yangi_parol;
      saveDB(db);
      return res.json({ success: true, message: "Parol muvaffaqiyatli o'zgartirildi!" });
    }
    return res.status(400).json({ success: false, message: "Amaldagi joriy parol noto'g'ri!" });
  });

  // KINDERGARTENS API (CRUD)
  app.get("/api/kindergartens", (req, res) => {
    const db = getDB();
    res.json(db.kindergartens);
  });

  app.post("/api/kindergartens", (req, res) => {
    const db = getDB();
    // MUHIM: id eng oxirida turishi shart — shunda req.body ichida
    // bo'sh "id" kelsa ham, u avtomatik generatsiya qilingan idni
    // ustidan yozib yubora olmaydi.
    const newK: Kindergarten = {
      ...req.body,
      id: "k_" + (Date.now())
    };
    db.kindergartens.push(newK);
    saveDB(db);
    res.json(newK);
  });

  app.put("/api/kindergartens/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const index = db.kindergartens.findIndex(k => k.id === id);
    if (index !== -1) {
      db.kindergartens[index] = { ...db.kindergartens[index], ...req.body, id };
      saveDB(db);
      res.json(db.kindergartens[index]);
    } else {
      res.status(404).json({ message: "Bog'cha topilmadi" });
    }
  });

  app.delete("/api/kindergartens/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    db.kindergartens = db.kindergartens.filter(k => k.id !== id);
    // clean up deliveries related?
    db.deliveries = db.deliveries.filter(d => d.bogcha_id !== id);
    saveDB(db);
    res.json({ success: true, id });
  });

  // PRODUCTS API (CRUD)
  app.get("/api/products", (req, res) => {
    const db = getDB();
    res.json(db.products);
  });

  app.post("/api/products", (req, res) => {
    const db = getDB();
    // MUHIM: id eng oxirida — req.body'dagi bo'sh id ustidan yozib yubormaydi
    const newP: Product = {
      oxirgi_kelish_narxi: 0,
      ...req.body,
      id: "p_" + (Date.now())
    };
    db.products.push(newP);
    saveDB(db);
    res.json(newP);
  });

  app.put("/api/products/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
      db.products[index] = { ...db.products[index], ...req.body, id };
      saveDB(db);
      res.json(db.products[index]);
    } else {
      res.status(404).json({ message: "Mahsulot topilmadi" });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    db.products = db.products.filter(p => p.id !== id);
    db.stock_in = db.stock_in.filter(s => s.mahsulot_id !== id);
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6
    // Yetkazib berishlar endi items massivi ichida bo'lgani uchun,
    // faqat shu mahsulot bo'lgan qatorni olib tashlaymiz. Agar shu
    // delivery ichida boshqa mahsulot qolmasa, delivery butunlay o'chiriladi.
    db.deliveries = db.deliveries
      .map(d => ({ ...d, items: d.items.filter(it => it.mahsulot_id !== id) }))
      .filter(d => d.items.length > 0);
<<<<<<< HEAD
=======
=======
    db.deliveries = db.deliveries.filter(d => d.mahsulot_id !== id);
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6
    saveDB(db);
    res.json({ success: true, id });
  });

  // STOCK IN API (Kirim)
  app.get("/api/stock-in", (req, res) => {
    const db = getDB();
    res.json(db.stock_in);
  });

  app.post("/api/stock-in", (req, res) => {
    const db = getDB();
    const { mahsulot_id, miqdor, birlik_narxi, sana, yetkazib_beruvchi, izoh } = req.body;
    
    const jami_narx = miqdor * birlik_narxi;
    const newStock: StockIn = {
      id: "si_" + (Date.now()),
      mahsulot_id,
      miqdor: Number(miqdor),
      birlik_narxi: Number(birlik_narxi),
      jami_narx,
      sana, // Client sends Uzbek date ISO
      yetkazib_beruvchi,
      izoh
    };

    db.stock_in.push(newStock);


    // Update oxirgi_kelish_narxi of the product
    const pIndex = db.products.findIndex(p => p.id === mahsulot_id);
    if (pIndex !== -1) {
      db.products[pIndex].oxirgi_kelish_narxi = Number(birlik_narxi);
    }

    saveDB(db);
    res.json(newStock);
  });

  app.put("/api/stock-in/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const index = db.stock_in.findIndex(s => s.id === id);
    if (index !== -1) {
      const original = db.stock_in[index];
      const merged = { ...original, ...req.body };
      merged.miqdor = Number(merged.miqdor);
      merged.birlik_narxi = Number(merged.birlik_narxi);
      merged.jami_narx = merged.miqdor * merged.birlik_narxi;

      db.stock_in[index] = merged;

      // Update oxirgi_kelish_narxi if updated
      const pIndex = db.products.findIndex(p => p.id === merged.mahsulot_id);
      if (pIndex !== -1) {
        db.products[pIndex].oxirgi_kelish_narxi = merged.birlik_narxi;
      }

      saveDB(db);
      res.json(db.stock_in[index]);
    } else {
      res.status(404).json({ message: "Kirim tranzaksiyasi topilmadi" });
    }
  });

  app.delete("/api/stock-in/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    db.stock_in = db.stock_in.filter(s => s.id !== id);
    saveDB(db);
    res.json({ success: true, id });
  });

  // DELIVERIES API (Chiqim / Yetkazib berishlar)
<<<<<<< HEAD
  // Endi bitta yetkazib berish bir nechta xil mahsulotni ("items" massivi)
  // bitta bog'chaga, bitta moshina/haydovchi va sana bilan yetkazishi mumkin.
=======
<<<<<<< HEAD
  // Endi bitta yetkazib berish bir nechta xil mahsulotni ("items" massivi)
  // bitta bog'chaga, bitta moshina/haydovchi va sana bilan yetkazishi mumkin.
=======
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6
  app.get("/api/deliveries", (req, res) => {
    const db = getDB();
    res.json(db.deliveries);
  });

  app.post("/api/deliveries", (req, res) => {
    const db = getDB();
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6
    const { bogcha_id, items, sana, moshina_id, ishchi_id, holati } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Kamida bitta mahsulot qo'shilishi shart!" });
    }

    const cleanItems: DeliveryItem[] = items
      .filter((it: any) => it && it.mahsulot_id)
      .map((it: any) => ({
        mahsulot_id: it.mahsulot_id,
        miqdor: Number(it.miqdor)
      }));

    if (cleanItems.length === 0) {
      return res.status(400).json({ message: "Kamida bitta mahsulot qo'shilishi shart!" });
    }
<<<<<<< HEAD
=======

    const newDelivery: Delivery = {
      id: "d_" + (Date.now()),
      bogcha_id,
      items: cleanItems,
      sana, // Client sends Uzbek date ISO
=======
    const { bogcha_id, mahsulot_id, miqdor, sana, moshina_id, ishchi_id, holati } = req.body;
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6

    const newDelivery: Delivery = {
      id: "d_" + (Date.now()),
      bogcha_id,
<<<<<<< HEAD
      items: cleanItems,
      sana, // Client sends Uzbek date ISO
=======
      mahsulot_id,
      miqdor: Number(miqdor),
      sana,
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6
      moshina_id,
      ishchi_id,
      holati: holati || "rejalashtirilgan"
    };

    db.deliveries.push(newDelivery);

    // Update vehicle state if 'yolda' or similar
    const vIndex = db.vehicles.findIndex(v => v.id === moshina_id);
    if (vIndex !== -1) {
      if (newDelivery.holati === "yolda") {
        db.vehicles[vIndex].holati = "band";
      } else {
        db.vehicles[vIndex].holati = "bosh";
      }
    }

    saveDB(db);
    res.json(newDelivery);
  });

  app.put("/api/deliveries/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const index = db.deliveries.findIndex(d => d.id === id);
    if (index !== -1) {
      const original = db.deliveries[index];
      const merged = { ...original, ...req.body };
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6

      if (Array.isArray(req.body.items)) {
        merged.items = req.body.items
          .filter((it: any) => it && it.mahsulot_id)
          .map((it: any) => ({
            mahsulot_id: it.mahsulot_id,
            miqdor: Number(it.miqdor)
          }));
      }

      if (!merged.items || merged.items.length === 0) {
        return res.status(400).json({ message: "Kamida bitta mahsulot qo'shilishi shart!" });
      }
<<<<<<< HEAD
=======
=======
      merged.miqdor = Number(merged.miqdor);
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6

      db.deliveries[index] = merged;

      // Update vehicle state
      db.vehicles.forEach(v => {
        if (v.biriktirilgan_haydovchi_id === merged.ishchi_id || v.id === merged.moshina_id) {
          if (merged.holati === "yolda") {
            v.holati = "band";
          } else {
            v.holati = "bosh";
          }
        }
      });


      saveDB(db);
      res.json(db.deliveries[index]);
    } else {
      res.status(404).json({ message: "Yetkazib berish tranzaksiyasi topilmadi" });
    }
  });

  app.delete("/api/deliveries/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    db.deliveries = db.deliveries.filter(d => d.id !== id);
    saveDB(db);
    res.json({ success: true, id });
  });

  // VEHICLES API (Moshinalar)
  app.get("/api/vehicles", (req, res) => {
    const db = getDB();
    res.json(db.vehicles);
  });

  app.post("/api/vehicles", (req, res) => {
    const db = getDB();
    // MUHIM: id eng oxirida — req.body'dagi bo'sh id ustidan yozib yubormaydi
    const newV: Vehicle = {
      ...req.body,
      id: "v_" + (Date.now()),
      sigimi: req.body.sigimi ? Number(req.body.sigimi) : undefined
    };
    db.vehicles.push(newV);
    saveDB(db);
    res.json(newV);
  });

  app.put("/api/vehicles/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const index = db.vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      db.vehicles[index] = { 
        ...db.vehicles[index], 
        ...req.body,
        id,
        sigimi: req.body.sigimi ? Number(req.body.sigimi) : db.vehicles[index].sigimi
      };
      saveDB(db);
      res.json(db.vehicles[index]);
    } else {
      res.status(404).json({ message: "Moshina topilmadi" });
    }
  });

  app.delete("/api/vehicles/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    db.vehicles = db.vehicles.filter(v => v.id !== id);
    saveDB(db);
    res.json({ success: true, id });
  });

  // WORKERS API (Ishchilar)
  app.get("/api/workers", (req, res) => {
    const db = getDB();
    res.json(db.workers);
  });

  app.post("/api/workers", (req, res) => {
    const db = getDB();
    // MUHIM: id eng oxirida — req.body'dagi bo'sh id ustidan yozib yubormaydi
    const newW: Worker = {
      ...req.body,
      id: "w_" + (Date.now())
    };
    db.workers.push(newW);
    saveDB(db);
    res.json(newW);
  });

  app.put("/api/workers/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    const index = db.workers.findIndex(w => w.id === id);
    if (index !== -1) {
      db.workers[index] = { ...db.workers[index], ...req.body, id };
      saveDB(db);
      res.json(db.workers[index]);
    } else {
      res.status(404).json({ message: "Ishchi topilmadi" });
    }
  });

  app.delete("/api/workers/:id", (req, res) => {
    const db = getDB();
    const { id } = req.params;
    db.workers = db.workers.filter(w => w.id !== id);
    // Clear biriktirilgan_haydovchi_id from vehicles
    db.vehicles.forEach(v => {
      if (v.biriktirilgan_haydovchi_id === id) {
        v.biriktirilgan_haydovchi_id = "";
      }
    });
    saveDB(db);
    res.json({ success: true, id });
  });

  // WAREHOUSE STOCK STATUS & FORECASTS (Zahira hisoblash va prognoz)
  // This calculates dynamic stock summaries using actual DB stock_in and deliveries
  app.get("/api/warehouse/stock", (req, res) => {
    const db = getDB();
    
    // Baselines for average weekly usage in kg/liters per kindergarten (or total)
    // to fallback when there is no historical delivery transaction.
    const baselineWeeklyTotals: { [key: string]: number } = {
      p_1: 150,  // Guruch (150 kg/haftasiga)
      p_2: 120,  // Go'sht (120 kg/haftasiga)
      p_3: 200,  // Un (200 kg/haftasiga)
      p_4: 80,   // O'simlik yog'i (80 litr/haftasiga)
      p_5: 250,  // Kartoshka (250 kg/haftasiga)
      p_6: 100,  // Sabzi (100 kg/haftasiga)
      p_7: 80,   // Piyoz (80 kg/haftasiga)
      p_8: 150,  // Sut (150 litr/haftasiga)
      p_9: 90,   // Shakar (90 kg/haftasiga)
      p_10: 500  // Tuxum (500 dona/haftasiga)
    };

    const stockSummary = db.products.map(p => {
      // Total Kirim
      const totalIn = db.stock_in
        .filter(s => s.mahsulot_id === p.id)
        .reduce((sum, s) => sum + s.miqdor, 0);


      // Total Chiqim (delivered or on-the-way counts as deducted from stock)
<<<<<<< HEAD
      // Har bir delivery endi bir nechta mahsulotni o'z ichiga olgani uchun,
      // "items" massivi ichidan shu mahsulotga tegishli miqdorlarni yig'amiz.
      const totalOut = db.deliveries
        .filter(d => d.holati !== "bekor_qilindi")
        .reduce((sum, d) => {
          const productItems = d.items.filter(it => it.mahsulot_id === p.id);
          return sum + productItems.reduce((s, it) => s + it.miqdor, 0);
        }, 0);
=======
<<<<<<< HEAD
      // Har bir delivery endi bir nechta mahsulotni o'z ichiga olgani uchun,
      // "items" massivi ichidan shu mahsulotga tegishli miqdorlarni yig'amiz.
      const totalOut = db.deliveries
        .filter(d => d.holati !== "bekor_qilindi")
        .reduce((sum, d) => {
          const productItems = d.items.filter(it => it.mahsulot_id === p.id);
          return sum + productItems.reduce((s, it) => s + it.miqdor, 0);
        }, 0);
=======
      const totalOut = db.deliveries
        .filter(d => d.mahsulot_id === p.id && d.holati !== "bekor_qilindi")
        .reduce((sum, d) => sum + d.miqdor, 0);
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6

      const joriy_miqdor = Math.max(0, totalIn - totalOut);

      // Average Weekly Usage (from deliveries in the last 4 weeks or fallback to baseline)
      // Let's compute average weekly consumption
<<<<<<< HEAD
      const productDeliveryAmounts = db.deliveries
        .filter(d => d.holati !== "bekor_qilindi")
        .flatMap(d => d.items.filter(it => it.mahsulot_id === p.id).map(it => it.miqdor));
=======
<<<<<<< HEAD
      const productDeliveryAmounts = db.deliveries
        .filter(d => d.holati !== "bekor_qilindi")
        .flatMap(d => d.items.filter(it => it.mahsulot_id === p.id).map(it => it.miqdor));
      
      let ortacha_haftalik_sarf = baselineWeeklyTotals[p.id] || 100;

      if (productDeliveryAmounts.length > 0) {
        // Calculate weeks span, or count deliveries
        // Let's calculate total delivered and divide by actual weeks or fallback to a standard factor if too few weeks.
        const dAmounts = productDeliveryAmounts.reduce((sum, m) => sum + m, 0);
=======
      const productDeliveries = db.deliveries.filter(d => d.mahsulot_id === p.id && d.holati !== "bekor_qilindi");
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6
      
      let ortacha_haftalik_sarf = baselineWeeklyTotals[p.id] || 100;

      if (productDeliveryAmounts.length > 0) {
        // Calculate weeks span, or count deliveries
        // Let's calculate total delivered and divide by actual weeks or fallback to a standard factor if too few weeks.
<<<<<<< HEAD
        const dAmounts = productDeliveryAmounts.reduce((sum, m) => sum + m, 0);
=======
        const dAmounts = productDeliveries.reduce((sum, d) => sum + d.miqdor, 0);
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6
        // If we have history, we can take average
        // Let's take the greater of the baseline and actual deliveries sum (or adjust to represent weekly average)
        // Since we loaded a few sample deliveries, let's treat actual deliveries as the last week's worth of usage,
        // average it with baseline for a very realistic smooth dynamic graph!
        ortacha_haftalik_sarf = Math.round((baselineWeeklyTotals[p.id] || 100) * 0.7 + dAmounts * 0.3);
      }

      // Safeguard against zero
      if (ortacha_haftalik_sarf <= 0) ortacha_haftalik_sarf = 10;

      // Calculations:
      // 3. Necha haftaga yetadi = joriy_zahira ÷ ortacha_haftalik_sarf
      const necha_haftaga_yetadi = Number((joriy_miqdor / ortacha_haftalik_sarf).toFixed(1));
      
      // 4. Nechta bog'chaga yetadi = joriy_zahira ÷ (bitta bog'chaga o'rtacha kerak bo'ladigan miqdor)
      // bitta bog'chaga o'rtacha haftalik ehtiyoj = ortacha_haftalik_sarf / 38
      const bitta_bogchaga_haftalik = ortacha_haftalik_sarf / 38;
      const nechta_bogchaga_yetadi = bitta_bogchaga_haftalik > 0 
        ? Math.round(joriy_miqdor / bitta_bogchaga_haftalik)
        : 0;

      return {
        mahsulot_id: p.id,
        mahsulot_nomi: p.nomi,
        birligi: p.birligi,
        kategoriyasi: p.kategoriyasi,
        joriy_miqdor,
        minimal_zahira_chegarasi: p.minimal_zahira_chegarasi,
        oxirgi_kelish_narxi: p.oxirgi_kelish_narxi,
        ortacha_haftalik_sarf,
        necha_haftaga_yetadi,
        nechta_bogchaga_yetadi
      };
    });

    res.json(stockSummary);
  });

  // ALL EXPENSES / STATISTICS (Kun/Hafta/Oy/Yil)
  app.get("/api/reports/finances", (req, res) => {
    const db = getDB();
    const stockIn = db.stock_in;

    // We can group stockIn transactions by month or categories
    // For general stats:
    const totalSpent = stockIn.reduce((sum, s) => sum + s.jami_narx, 0);

    // Group by category
    const expensesByCategory: { [key: string]: number } = {};
    db.products.forEach(p => {
      const pStockIn = stockIn.filter(s => s.mahsulot_id === p.id);
      const sum = pStockIn.reduce((acc, s) => acc + s.jami_narx, 0);
      if (sum > 0) {
        expensesByCategory[p.kategoriyasi] = (expensesByCategory[p.kategoriyasi] || 0) + sum;
      }
    });

    // Group by product
    const expensesByProduct = db.products.map(p => {
      const pStockIn = stockIn.filter(s => s.mahsulot_id === p.id);
      const sum = pStockIn.reduce((acc, s) => acc + s.jami_narx, 0);
      return {
        mahsulot_nomi: p.nomi,
        kategoriyasi: p.kategoriyasi,
        summa: sum,
        miqdor: pStockIn.reduce((acc, s) => acc + s.miqdor, 0),
        birligi: p.birligi
      };
    }).filter(item => item.summa > 0);


    // Group by date (daily or monthly)
    const expensesByDate: { [key: string]: number } = {};
    stockIn.forEach(s => {
      // Get Date string (YYYY-MM-DD)
      const dateKey = s.sana.split("T")[0];
      expensesByDate[dateKey] = (expensesByDate[dateKey] || 0) + s.jami_narx;
    });

    const datesArray = Object.keys(expensesByDate).sort().map(date => ({
      sana: date,
      summa: expensesByDate[date]
    }));

    res.json({
      totalSpent,
      expensesByCategory,
      expensesByProduct,
      expensesByDate: datesArray
    });
  });

  // Serve Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve Static Build in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
