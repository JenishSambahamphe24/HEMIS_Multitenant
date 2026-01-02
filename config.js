const commonConfig = {
  isUGC: "true",
  apiKey: 1,
  universityId: "0",
  backendUrl: "https://hemisapi.ugcnepal.edu.np/api",
  baseUrl: "https://hemisapi.ugcnepal.edu.np/Uploads",
  uploadUrl: "https://hemisapi.ugcnepal.edu.np/Uploads",
};

const campusConfigurations = {
  testCampus: {
    isUGC: "true",
    apiKey: 1,
    universityId: "0",
    backendUrl: "https://apiheims.dibugsoft.com/api",
    baseUrl: "https://apiheims.dibugsoft.com/Uploads",
    uploadUrl: "https://apiheims.dibugsoft.com/Uploads",
    campusId: 12,
    acLink: "https://administration.dibugsoft.com/",
  },
  test2Campus: {
    isUGC: "true",
    apiKey: 1,
    universityId: "0",
    backendUrl: "https://apiheims.dibugsoft.com/api",
    baseUrl: "https://apiheims.dibugsoft.com/Uploads",
    uploadUrl: "https://apiheims.dibugsoft.com/Uploads",
    campusId: 44,
    acLink: "https://administration.dibugsoft.com/",
  },
  shitalCampus: {
    ...commonConfig,
    campusId: 40,
    acLink: "https://shitalcampus.dibugsoft.com",
  },
  shivajan: {
    ...commonConfig,
    campusId: 37,
    acLink: "https://shivajan.dibugsoft.com",
  },
  aathabis: {
    ...commonConfig,
    campusId: 51,
    acLink: "https://aathabis.dibugsoft.com",
  },
  baneshworCampus: {
    ...commonConfig,
    campusId: 12,
    acLink: "https://baneshworcampus.dibugsoft.com",
  },
  radijyula: {
    ...commonConfig,
    campusId: 15,
    acLink: "https://radijyula.dibugsoft.com",
  },
  gyanodaya: {
    ...commonConfig,
    campusId: 16,
    acLink: "https://gyanodaya.dibugsoft.com",
  },
  shadananda: {
    ...commonConfig,
    campusId: 17,
    acLink: "https://shadananda.dibugsoft.com",
  },
  ghodaghodi: {
    ...commonConfig,
    campusId: 18,
    acLink: "https://ghodaghodi.dibugsoft.com",
  },
  ramraja: {
    ...commonConfig,
    campusId: 19,
    acLink: "https://ramraja.dibugsoft.com",
  },
  sukuna: {
    ...commonConfig,
    campusId: 25,
    acLink: "https://sukuna.dibugsoft.com",
  },
  sanibheri: {
    ...commonConfig,
    campusId: 27,
    acLink: "https://sanibheri.dibugsoft.com",
  },
  araniko: {
    ...commonConfig,
    campusId: 29,
    acLink: "https://araniko.dibugsoft.com",
  },
  bdCollege: {
    ...commonConfig,
    campusId: 30,
    acLink: "https://bdcollege.dibugsoft.com",
  },
  jmcRautahat: {
    ...commonConfig,
    campusId: 31,
    acLink: "https://jmcrautahat.dibugsoft.com",
  },
  dronachal: {
    ...commonConfig,
    campusId: 34,
    acLink: "https://dronachal.dibugsoft.com",
  },
  kanchan: {
    ...commonConfig,
    campusId: 38,
    acLink: "https://kanchan.dibugsoft.com",
  },
  rjctarahara: {
    ...commonConfig,
    campusId: 39,
    acLink: "https://rjctarahara.dibugsoft.com",
  },
  achham: {
    ...commonConfig,
    campusId: 48,
    acLink: "https://achham.dibugsoft.com",
  },
  jjmc: {
    ...commonConfig,
    campusId: 49,
    acLink: "https://jjmc.dibugsoft.com",
  },
  lmckailali: {
    ...commonConfig,
    campusId: 66,
    acLink: "https://lmckailali.dibugsoft.com",
  },
  mbmc: {
    ...commonConfig,
    campusId: 78,
    acLink: "https://mbmc.dibugsoft.com",
  },
  srCampus: {
    ...commonConfig,
    campusId: 20,
    acLink: "https://srcampus.dibugsoft.com",
  },
  phulbari: {
    ...commonConfig,
    campusId: 21,
    acLink: "https://phulbari.dibugsoft.com",
  },
  pumc: {
    ...commonConfig,
    campusId: 23,
    acLink: "https://pumc.dibugsoft.com",
  },
  shreekot: {
    ...commonConfig,
    campusId: 24,
    acLink: "https://shreekot.dibugsoft.com",
  },
  chureCampus: {
    ...commonConfig,
    campusId: 26,
    acLink: "https://churecampus.dibugsoft.com",
  },
  asmc: {
    ...commonConfig,
    campusId: 28,
    acLink: "https://asmc.dibugsoft.com",
  },
  bajhangdeep: {
    ...commonConfig,
    campusId: 32,
    acLink: "https://bajhangdeep.dibugsoft.com",
  },
  chamunda: {
    ...commonConfig,
    campusId: 33,
    acLink: "https://chamunda.dibugsoft.com",
  },
  hsmc: {
    ...commonConfig,
    campusId: 36,
    acLink: "https://hsmc.dibugsoft.com",
  },
  simrutuCampus: {
    ...commonConfig,
    campusId: 41,
    acLink: "https://simrutucampus.dibugsoft.com",
  },
  simtaCampus: {
    ...commonConfig,
    campusId: 42,
    acLink: "https://simtacampus.dibugsoft.com",
  },
  syarpu: {
    ...commonConfig,
    campusId: 43,
    acLink: "https://syarpu.dibugsoft.com",
  },
  bangadCampus: {
    ...commonConfig,
    campusId: 44,
    acLink: "https://bangadcampus.dibugsoft.com",
  },
  nishibhuji: {
    ...commonConfig,
    campusId: 45,
    acLink: "https://nishibhuji.dibugsoft.com",
  },
  mahakaliCampus: {
    ...commonConfig,
    campusId: 46,
    acLink: "https://mahakalicampus.dibugsoft.com",
  },
  budhinanda: {
    ...commonConfig,
    campusId: 47,
    acLink: "https://budhinanda.dibugsoft.com",
  },
  hileCampus: {
    ...commonConfig,
    campusId: 50,
    acLink: "https://hilecampus.dibugsoft.com",
  },
  guransCampus: {
    ...commonConfig,
    campusId: 62,
    acLink: "https://guranscampus.dibugsoft.com",
  },
  jkCampus: {
    ...commonConfig,
    campusId: 63,
    acLink: "https://jkcampus.dibugsoft.com",
  },
  halesiCampus: {
    ...commonConfig,
    campusId: 22,
    acLink: "https://halesicampus.dibugsoft.com",
  },
  nalgadCampus: {
    ...commonConfig,
    campusId: 35,
    acLink: "https://nalgadcampus.dibugsoft.com",
  },
  hanumanteshwor: {
    ...commonConfig,
    campusId: 59,
    acLink: "https://hanumanteshwor.dibugsoft.com",
  },
  rukumeliCampus: {
    ...commonConfig,
    campusId: 52,
    acLink: "https://rukumelicampus.dibugsoft.com",
  },
  janashiksha: {
    ...commonConfig,
    campusId: 53,
    acLink: "https://janashiksha.dibugsoft.com",
  },
  farulaCampus: {
    ...commonConfig,
    campusId: 54,
    acLink: "https://farulacampus.dibugsoft.com",
  },
  bulbuleCampus: {
    ...commonConfig,
    campusId: 55,
    acLink: "https://bulbulecampus.dibugsoft.com",
  },
  djmc: {
    ...commonConfig,
    campusId: 56,
    acLink: "https://djmc.dibugsoft.com",
  },
  sisneCampus: {
    ...commonConfig,
    campusId: 57,
    acLink: "https://sisnecampus.dibugsoft.com",
  },
  bhawaniCampus: {
    ...commonConfig,
    campusId: 58,
    acLink: "https://bhawanicampus.dibugsoft.com",
  },
  sharadaCampus: {
    ...commonConfig,
    campusId: 60,
    acLink: "https://sharadacampus.dibugsoft.com",
  },
  janatCampus: {
    ...commonConfig,
    campusId: 61,
    acLink: "https://janatacampus.dibugsoft.com",
  },
  bhanu: {
    ...commonConfig,
    campusId: 64,
    acLink: "https://bhanu.dibugsoft.com",
  },
  damakCampus: {
    ...commonConfig,
    campusId: 65,
    acLink: "https://damakcampus.dibugsoft.com",
  },
  gmsCampus: {
    ...commonConfig,
    campusId: 67,
    acLink: "https://gmscampus.dibugsoft.com",
  },
  setiCampus: {
    ...commonConfig,
    campusId: 68,
    acLink: "https://seticampus.dibugsoft.com",
  },
  thalaraCampus: {
    ...commonConfig,
    campusId: 69,
    acLink: "https://thalaracampus.dibugsoft.com",
  },
  rastriyaCollege: {
    ...commonConfig,
    campusId: 70,
    acLink: "https://rastriyacollege.dibugsoft.com",
  },
  chaumala: {
    ...commonConfig,
    campusId: 71,
    acLink: "https://chaumala.dibugsoft.com",
  },
  tnkBmc: {
    ...commonConfig,
    campusId: 72,
    acLink: "https://tnkbmc.dibugsoft.com",
  },
  amcDhangadhi: {
    ...commonConfig,
    campusId: 73,
    acLink: "https://amcdhangadhi.dibugsoft.com",
  },
  dhmc: {
    ...commonConfig,
    campusId: 75,
    acLink: "https://dhmc.dibugsoft.com",
  },
  resungaCampus: {
    ...commonConfig,
    campusId: 76,
    acLink: "https://resungacampus.dibugsoft.com",
  },
  gsm: {
    ...commonConfig,
    campusId: 77,
    acLink: "https://gsm.dibugsoft.com",
  },
  mahunyal: {
    ...commonConfig,
    campusId: 100,
    acLink: "https://mahunyal.dibugsoft.com",
  },
  bardiyAmc: {
    ...commonConfig,
    campusId: 101,
    acLink: "https://bardiyamc.dibugsoft.com",
  },
  sadaShiva: {
    ...commonConfig,
    campusId: 136,
    acLink: "https://sadashiva.dibugsoft.com",
  },
  mtsCampus: {
    ...commonConfig,
    campusId: 135,
    acLink: "https://mtscampus.dibugsoft.com",
  },
  msmc: {
    ...commonConfig,
    campusId: 137,
    acLink: "https://msmc.dibugsoft.com",
  },
  bmCampus: {
    ...commonConfig,
    campusId: 138,
    acLink: "https://bmcampus.dibugsoft.com",
  },
  gmChatiya: {
    ...commonConfig,
    campusId: 102,
    acLink: "https://gmchatiya.dibugsoft.com",
  },
};

function detectCampus() {
  const hostname = window.location.hostname;
  const domainMap = {
    "collegehemis.dibugsoft.com": "testCampus",
    "campushemis.dibugsoft.com": "test2Campus",
    "hemis.shitalcampus.edu.np": "shitalCampus",
    "hemis.shivajancampus.edu.np": "shivajan",
    "hemis.aathabiscampus.edu.np": "aathabis",
    "hemis.baneshworcampus.edu.np": "baneshworCampus",
    "hemis.radijyula.edu.np": "radijyula",
    "hemis.gyanodayampc.edu.np": "gyanodaya",
    "hemis.shadanandacampus.edu.np": "shadananda",
    "hemis.ghodaghodicampus.edu.np": "ghodaghodi",
    "hemis.ramraja.edu.np": "ramraja",
    "hemis.sukuna.edu.np": "sukuna",
    "hemis.sanibhericampus.edu.np": "sanibheri",
    "hemis.aranikocollege.edu.np": "araniko",
    "hemis.bdcollege.edu.np": "bdCollege",
    "hemis.jmcrautahat.edu.np": "jmcRautahat",
    "hemis.dronachalcampus.edu.np": "dronachal",
    "hemis.kanchancampus.edu.np": "kanchan",
    "hemis.rjctarahara.edu.np": "rjctarahara",
    "hemis.achhamcampus.edu.np": "achham",
    "hemis.jjmc.edu.np": "jjmc",
    "hemis.lmckailali.edu.np": "lmckailali",
    "hemis.mbmc.edu.np": "mbmc",
    "hemis.srcampus.edu.np": "srCampus",
    "hemis.phulbaricampus.edu.np": "phulbari",
    "hemis.pumc.edu.np": "pumc",
    "hemis.sm-campus.edu.np": "shreekot",
    "hemis.churecampus.edu.np": "chureCampus",
    "hemis.asmc.edu.np": "asmc",
    "hemis.bajhangdeep.edu.np": "bajhangdeep",
    "hemis.chamundacollege.edu.np": "chamunda",
    "hemis.hsmc.edu.np": "hsmc",
    "hemis.simrutucampus.edu.np": "simrutuCampus",
    "hemis.simtacampus.edu.np": "simtaCampus",
    "hemis.syarpumultiplecampus.edu.np": "syarpu",
    "hemis.bangadcampus.edu.np": "bangadCampus",
    "hemis.nishibhuji.edu.np": "nishibhuji",
    "hemis.mahakalicampus.edu.np": "mahakaliCampus",
    "hemis.budhinandacampus.edu.np": "budhinanda",
    "hemis.hilecampus.edu.np": "hileCampus",
    "hemis.guranscampus.edu.np": "guransCampus",
    "hemis.jkcampus.edu.np": "jkCampus",
    "hemis.halesicampus.edu.np": "halesiCampus",
    "hemis.nalgadcampus.edu.np": "nalgadCampus",
    "hemis.hanumanteshwarcampus.edu.np": "hanumanteshwor",
    "hemis.rukumelicampus.edu.np": "rukumeliCampus",
    "hemis.janashikhacampus.edu.np": "janashiksha",
    "hemis.farulacampus.edu.np": "farulaCampus",
    "hemis.bulbulecampus.edu.np": "bulbuleCampus",
    "hemis.djmc.edu.np": "djmc",
    "hemis.sisnecampus.edu.np": "sisneCampus",
    "hemis.bmcpalungtar.edu.np": "bhawaniCampus",
    "hemis.sharadacampussalyan.edu.np": "sharadaCampus",
    "hemis.janatacampusrangeli.edu.np": "janatCampus",
    "hemis.bhanumultiplecampus.edu.np": "bhanu",
    "hemis.damakcampus.edu.np": "damakCampus",
    "hemis.gmscampus.edu.np": "gmsCampus",
    "hemis.seticampus.edu.np": "setiCampus",
    "hemis.thalaramultiplecampus.edu.np": "thalaraCampus",
    "hemis.rastriyacollege.edu.np": "rastriyaCollege",
    "hemis.chaumalacampus.edu.np": "chaumala",
    "hemis.tnkbmc.edu.np": "tnkBmc",
    "hemis.amcdhangadhi.edu.np": "amcDhangadhi",
    "hemis.dhmc.edu.np": "dhmc",
    "hemis.resungacampus.edu.np": "resungaCampus",
    "hemisgsm.dibugsoft.com": "gsm",
    "hemis.mahunyalcampus.edu.np": "mahunyal",
    "hemisbmc.dibugsoft.com": "bardiyAmc",
    "hemis.smcbardiya.edu.np": "sadaShiva",
    "hemis.mtscampus.edu.np": "mtsCampus",
    "hemis.msmc.edu.np": "msmc",
    "hemis.bmcampus.edu.np": "bmCampus",
    "hemisgalkot.dibugsoft.com": "gmChatiya",
  };

  if (domainMap[hostname]) {
    return domainMap[hostname];
  }

  const subdomain = hostname.split(".")[0];
  if (campusConfigurations[subdomain]) {
    return subdomain;
  }
  return "testCampus";
}

let currentConfig = null;
export function getCampusConfig() {
  if (!currentConfig) {
    const campusKey = detectCampus();
    currentConfig = campusConfigurations[campusKey];
  }
  return currentConfig;
}

export const config = {
  get VITE_BACKEND_URL() {
    return getCampusConfig().backendUrl;
  },
  get VITE_BASE_URL() {
    return getCampusConfig().baseUrl;
  },
  get VITE_UPLOAD_URL() {
    return getCampusConfig().uploadUrl;
  },
  get VITE_AC_LINK() {
    return getCampusConfig().acLink;
  },
  get VITE_CAMPUSID() {
    return getCampusConfig().campusId;
  },
  get VITE_UNIVERSITYID() {
    return getCampusConfig().universityId;
  },
  get VITE_API_KEY() {
    return getCampusConfig().apiKey;
  },
  get VITE_ISUGC() {
    return getCampusConfig().isUGC;
  },
};