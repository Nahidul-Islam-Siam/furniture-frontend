// Bangladesh Divisions and All 64 Districts with Major Thanas for Furniture Delivery

export interface DistrictInfo {
  name: string;
  zone: "inside_dhaka" | "sub_dhaka" | "outside_dhaka";
  thanas: string[];
}

export const BANGLADESH_DISTRICTS: Record<string, DistrictInfo> = {
  Dhaka: {
    name: "Dhaka",
    zone: "inside_dhaka",
    thanas: [
      "Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur", "Mohammadpur",
      "Badda", "Bashundhara", "Motijheel", "Khilgaon", "Malibagh", "Rampura",
      "Paltan", "Shahbagh", "Tejgaon", "Mohakhali", "Baridhara", "Nikunja",
      "Lalbagh", "Jatrabari", "Demra", "Hazaribagh", "Kafrul", "Cantonment",
      "Adabor", "Shyamoli", "Khilkhet", "Wari", "Sutrapur", "Kotwali"
    ],
  },
  Gazipur: {
    name: "Gazipur",
    zone: "sub_dhaka",
    thanas: ["Gazipur Sadar", "Tongi", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj"],
  },
  Narayanganj: {
    name: "Narayanganj",
    zone: "sub_dhaka",
    thanas: ["Narayanganj Sadar", "Bandar", "Fatullah", "Siddhirganj", "Sonargaon", "Araihazar", "Rupganj"],
  },
  Chittagong: {
    name: "Chittagong",
    zone: "outside_dhaka",
    thanas: [
      "Agrabad", "GEC", "Nasirabad", "Panchlaish", "Kotwali", "Khulshi", "Halishahar",
      "Bakolia", "Chandgaon", "Pahartali", "Double Mooring", "Bayezid", "Patenga",
      "Hathazari", "Sitakunda", "Patiya", "Raozan", "Fatikchhari", "Anwara"
    ],
  },
  Sylhet: {
    name: "Sylhet",
    zone: "outside_dhaka",
    thanas: ["Sylhet Sadar", "Amberkhana", "Zindabazar", "South Surma", "Beanibazar", "Golapganj", "Zakiganj"],
  },
  Rajshahi: {
    name: "Rajshahi",
    zone: "outside_dhaka",
    thanas: ["Boalia", "Rajpara", "Motihar", "Shah Makhdum", "Paba", "Godagari", "Tanore", "Bagmara"],
  },
  Khulna: {
    name: "Khulna",
    zone: "outside_dhaka",
    thanas: ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali", "Rupsha", "Dumuria"],
  },
  Barisal: {
    name: "Barisal",
    zone: "outside_dhaka",
    thanas: ["Kotwali (Barisal)", "Airport", "Kawnia", "Bakerganj", "Babuganj", "Gournadi"],
  },
  Rangpur: {
    name: "Rangpur",
    zone: "outside_dhaka",
    thanas: ["Kotwali (Rangpur)", "Mahi Ganj", "Tajhat", "Pirgachha", "Badarganj", "Mithapukur"],
  },
  Mymensingh: {
    name: "Mymensingh",
    zone: "outside_dhaka",
    thanas: ["Kotwali (Mymensingh)", "Trishal", "Muktagachha", "Bhaluka", "Gafargaon", "Ishwarganj"],
  },
  Comilla: {
    name: "Comilla",
    zone: "outside_dhaka",
    thanas: ["Kotwali (Comilla)", "EPZ", "Sadar Dakshin", "Chandina", "Debidwar", "Burichang", "Laksam"],
  },
  Bogura: {
    name: "Bogura",
    zone: "outside_dhaka",
    thanas: ["Bogura Sadar", "Sherpur", "Shibganj", "Gabtali", "Shajahanpur", "Dhunat"],
  },
  CoxsBazar: {
    name: "Cox's Bazar",
    zone: "outside_dhaka",
    thanas: ["Cox's Bazar Sadar", "Chakaria", "Teknaf", "Ramu", "Ukhia", "Maheshkhali", "Pekua"],
  },
  Feni: {
    name: "Feni",
    zone: "outside_dhaka",
    thanas: ["Feni Sadar", "Daganbhuiyan", "Chhagalnaiya", "Parshuram", "Fulgazi", "Sonagazi"],
  },
  Noakhali: {
    name: "Noakhali",
    zone: "outside_dhaka",
    thanas: ["Sudharam (Noakhali Sadar)", "Begumganj", "Senbagh", "Chatkhil", "Companiganj", "Hatiya"],
  },
  Brahmanbaria: {
    name: "Brahmanbaria",
    zone: "outside_dhaka",
    thanas: ["Brahmanbaria Sadar", "Ashuganj", "Sarail", "Kasba", "Nabinagar", "Bancharampur"],
  },
  Tangail: {
    name: "Tangail",
    zone: "outside_dhaka",
    thanas: ["Tangail Sadar", "Mirzapur", "Kalihati", "Ghatail", "Sakhipur", "Madhupur"],
  },
  Jessore: {
    name: "Jessore",
    zone: "outside_dhaka",
    thanas: ["Kotwali (Jessore)", "Jhikargachha", "Sharsha", "Manirampur", "Abhaynagar", "Keshabpur"],
  },
  Kushtia: {
    name: "Kushtia",
    zone: "outside_dhaka",
    thanas: ["Kushtia Sadar", "Kumarkhali", "Bheramara", "Mirpur", "Daulatpur", "Khoksa"],
  },
  Pabna: {
    name: "Pabna",
    zone: "outside_dhaka",
    thanas: ["Pabna Sadar", "Ishwardi", "Sujanagar", "Chatmohar", "Bera", "Santhia"],
  },
  Dinajpur: {
    name: "Dinajpur",
    zone: "outside_dhaka",
    thanas: ["Dinajpur Sadar", "Birganj", "Birol", "Bochaganj", "Phulbari", "Parbatipur"],
  },
  Narsingdi: {
    name: "Narsingdi",
    zone: "sub_dhaka",
    thanas: ["Narsingdi Sadar", "Madhabdi", "Palash", "Shibpur", "Raipura", "Monohardi"],
  },
  Manikganj: {
    name: "Manikganj",
    zone: "sub_dhaka",
    thanas: ["Manikganj Sadar", "Saturia", "Singair", "Shivalaya", "Harirampur", "Daulatpur"],
  },
  Munshiganj: {
    name: "Munshiganj",
    zone: "sub_dhaka",
    thanas: ["Munshiganj Sadar", "Gazaria", "Tongibari", "Sirajdikhan", "Lohajang", "Sreenagar"],
  },
};

export const ALL_DISTRICT_NAMES = Object.keys(BANGLADESH_DISTRICTS);


