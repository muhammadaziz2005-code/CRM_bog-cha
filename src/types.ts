export interface Kindergarten {
  id: string;
  nomi: string;
  manzili: string;
  tuman: string;
  bolalar_soni: number;
  masul_shaxs: string;
  telefon_raqami: string;
  holati: 'faol' | 'no_faol';
}

export interface AdminUser {
  id: string;
  f_i_sh: string;
  login: string;
  parol: string; // Plaintext or hashed for this applet
  telefon_raqami: string;
  email?: string;
  profil_rasmi?: string;
}

export interface Product {
  id: string;
  nomi: string;
  birligi: 'kg' | 'tonna' | 'litr' | 'dona';
  kategoriyasi: string;
  minimal_zahira_chegarasi: number;
  oxirgi_kelish_narxi: number; // dynamically updated from stock_in
}

export interface StockIn {
  id: string;
  mahsulot_id: string;
  miqdor: number;
  birlik_narxi: number; // 1 kg/ton/l for the incoming stock in sum
  jami_narx: number; // miqdor * birlik_narxi
  sana: string; // ISO 8601 with Tashkent timezone
  yetkazib_beruvchi?: string;
  izoh?: string;
}

<<<<<<< HEAD
// Bitta yetkazib berish (chiqim) ichidagi har bir mahsulot qatori
export interface DeliveryItem {
  mahsulot_id: string;
  miqdor: number;
}

// Bitta moshina/haydovchi bitta bog'chaga bir nechta xil mahsulotni
// bir vaqtda olib borishi mumkin, shuning uchun "items" massiv qilib saqlanadi.
export interface Delivery {
  id: string;
  bogcha_id: string;
  items: DeliveryItem[];
=======
export interface Delivery {
  id: string;
  bogcha_id: string;
  mahsulot_id: string;
  miqdor: number;
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
  sana: string; // ISO 8601 with Tashkent timezone
  moshina_id: string;
  ishchi_id: string; // driver
  holati: 'rejalashtirilgan' | 'yolda' | 'yetkazildi' | 'bekor_qilindi';
}

export interface Vehicle {
  id: string;
  nomi: string; // Markasi, e.g., Isuzu, Damas, Labo
  davlat_raqami: string;
  sigimi?: number; // in kg
  holati: 'bosh' | 'band' | 'tamirda';
  biriktirilgan_haydovchi_id?: string;
}

export interface Worker {
  id: string;
  f_i_sh: string;
  lavozimi: string; // haydovchi, omborchi, menejer, etc.
  telefon_raqami: string;
  ish_holati: 'faol' | 'no_faol';
}

// Derived states calculated on server/client
export interface WarehouseStock {
  mahsulot_id: string;
  mahsulot_nomi: string;
  birligi: string;
  kategoriyasi: string;
  joriy_miqdor: number;
  minimal_zahira_chegarasi: number;
  oxirgi_kelish_narxi: number;
  ortacha_haftalik_sarf: number;
  necha_haftaga_yetadi: number;
  nechta_bogchaga_yetadi: number;
<<<<<<< HEAD
}
=======
}
>>>>>>> 08b11818d07b20af74c0652e730ec080e8f8051d
