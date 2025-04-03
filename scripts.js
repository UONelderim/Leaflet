const mapWidth = 7168;
const mapHeight = 4096;
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -3.5,
  maxZoom: 2,
  zoomSnap: 0.1,
  zoomDelta: 0.1,
  zoom: -2,
  zoomControl: false // tylko to dodajemy
});

const bounds = [[0, 0], [mapHeight, mapWidth]];
L.imageOverlay('assets/mapa_serwera.png', bounds).addTo(map);
map.fitBounds(bounds);

const toggleGroup = (btnId, subgroupId, open) => {
  const btn = document.getElementById(btnId);
  const group = document.getElementById(subgroupId);

  btn.classList.toggle('open', open);
  group.style.overflow = 'hidden';
  group.style.transition = open
    ? 'height 1.0s ease, padding 1.0s ease, opacity 0.8s ease, margin-top 0.8s ease'
    : 'height 0.6s ease, padding 0.6s ease, opacity 0.4s ease, margin-top 0.4s ease';

  if (open) {
    group.style.height = group.scrollHeight + 'px';
    group.style.opacity = '1';
    group.style.paddingTop = '4px';
    group.style.paddingBottom = '4px';
    group.style.marginTop = '4px';

    group.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'height') {
        group.style.height = 'auto';
        group.removeEventListener('transitionend', handler);
      }
    });
  } else {
    group.style.height = group.scrollHeight + 'px';
    requestAnimationFrame(() => {
      group.style.height = '0';
      group.style.opacity = '0';
      group.style.paddingTop = '0';
      group.style.paddingBottom = '0';
      group.style.marginTop = '0';
    });
  }
};

const cityIcon = L.icon({ iconUrl: 'assets/Gump 40113.png', iconSize: [40, 40], iconAnchor: [20, 20] });
const dungeonIcon = L.icon({ iconUrl: 'assets/Gump 9804.png', iconSize: [27, 20], iconAnchor: [13, 10] });
const villageIcon = L.icon({ iconUrl: 'assets/Gump 40118.png', iconSize: [50, 50], iconAnchor: [25, 25] });
const healerIcon = L.icon({ iconUrl: 'assets/HealerIcon.png', iconSize: [20, 30], iconAnchor: [10, 30] });
const ankhIcon = L.icon({ iconUrl: 'assets/ankh.png', iconSize: [16, 26], iconAnchor: [8, 13] });

const cityData = {
  tasandora: [1418, 1872, "Tasandora"],
  garlan:    [1058, 592, "Garlan"],
  orod:      [658, 2009, "Orod"],
  lotharn:   [1875, 503, "Lotharn"],
  ldelmah:   [5742, 3307, "L'Delmah"],
  twierdza:  [2550, 1771, "Twierdza"],
  tirassa:   [2067, 2699, "Tirassa"]
};

const cityMarkers = {};
const citiesSubgroup = document.getElementById("citiesSubgroup");


const dungeonData = {
  alcala: [648, 1552, "Alcala"],
  baradDur: [1396, 1229, "Barad-dur"],
  doom: [955, 2888, "Doom"],
  elghinn: [5914, 3227, "Elghinn"],
  garth: [1170, 2898, "Garth"],
  hallTorech: [3614, 1989, "Hall Torech"],
  hurengrav: [1006, 2717, "Hurengrav"],
  jaskiniaBlyskow: [3384, 1955, "Jaskinia Błysków"],
  jaskiniaMelisande: [3284, 1895, "Jaskinia Melisande"],
  jaskiniaOrkow:[2250, 2262, "Jaskinia Orków"],
  kanalyTasandory: [1311, 2000, "Kanały Tasandory"],
  krolewskieKrypty: [823, 575, "Królewskie Krypty"],
  krysztalowaJaskinia: [3384, 1954, "Kryształowa Jaskinia"],
  labirynt: [2785, 1956, "Labirynt"],
  lezeKrysztalowychSmokow: [370, 1204, "Leże Kryształowych Smoków"],
  lezeLodowychSmokow: [394, 899, "Leże Lodowych Smoków"],
  lezeOgnistychSmokow: [2850, 1876, "Leże Ognistych Smoków"],
  lezePluskwy: [3942, 2299, "Leże Pluskwy"],
  lezeTrolli: [421, 1427, "Leże Trolli"],
  lochBagusa: [678, 1218, "Loch Bagusa"],
  lochBialegoWilka: [3769, 678, "Loch Białego Wilka"],
  lochOphidian: [2053, 3462, "Loch Ophidian"],
  loenTorech: [3409, 1629, "Loen Torech"],
  mechanicznaKrypta: [2472, 2886, "Mechaniczna Krypta"],
  piramida: [2407, 2383, "Piramida"],
  piaskoweKrypty: [2448, 2903, "Piaskowe Krypty"],
  podziemiaSaew: [1359, 645, "Podziemia Saew"],
  podziemiaSwiatyniSmierci: [1256, 1795, "Podziemia Świątyni Śmierci"],
  pokracznyLoch: [3972, 1047, "Pokraczny Loch"],
  ruinyElbrind: [1524, 827, "Ruiny Elbrind"],
  saleParoxysmusa: [6052, 2427, "Sale Paroxysmusa"],
  siedzibaDemonow: [3827, 1625, "Siedziba Demonów"],
  tylReviaren: [1386, 2491, "Tyl Reviaren"],
  twierdzaZwiednietejRozy: [2130, 1639, "Twierdza Zwiędniętej Róży"],
  ulnhyrOrbben: [1554, 2720, "Ulnhyr Orbben"],
  velkynAto: [5441, 3759, "Velkyn Ato"],
  wulkan: [579, 1284, "Wulkan"],
  mrowisko: [3678, 1679, "Mrowisko"],
  kryjowkaVoxPopuli: [4109, 3786, "Kryjówka Vox Populi"]
};


const customDungeons = {};
const dungeonsSubgroup = document.getElementById("dungeonsSubgroup");

const villageData = {
  celendir: [2016, 2035, "Celendir"],
  ethrod: [808, 1520, "Ethrod"],
  talas: [1158, 1603, "Talas"],
  ferion: [999, 1144, "Ferion"],
  kryjowkaPrzemytnikow: [2085, 3377, "Kryjówka Przemytników"],
  noamuthQuortek: [5941, 2757, "Noamuth Quortek"],
  oaza: [2312, 2559, "Oaza"],
  podzamcze: [1472, 2125, "Podzamcze"],
  snieznaPrzystan: [992, 909, "Śnieżna Przystań"],
  tafroel: [965, 1424, "Tafroel"],
  tingref: [695, 1808, "Tingref"],
  uk: [243, 1458, "Uk"]
};

const customVillages = {};
const villagesSubgroup = document.getElementById("villagesSubgroup");

const healerData = {
  Healer1: [1511, 1515, "Chata Na Wodzie"],
  Healer2: [983, 1121, "Ferion"],
  Healer3: [2350, 2553, "Oaza"],
  Healer4: [1015, 693, "Garlan"],
  Healer5: [5874, 317, "Noamuth Quortek"],
  Healer6: [945, 1420, "Tafroel"],
  Healer7: [589, 2044, "Orod"],
  Healer8: [2067, 2002, "Celendir"],
  Healer9: [1167, 1607, "Talas"],
  Healer11: [5590, 1077, "Twierdza"],
  Healer12: [2062, 2685, "Tirassa"],
  Healer13: [5384, 2002, "L'Delmah"],
  Healer14: [1387, 2009, "Tasandora"],
  Healer15: [1433, 1824, "Tasandora Centrum"],
  Healer16: [1451, 1389, "Ruth"],
  Healer17: [5537, 2923, "Płytki Podmrok"],
  Healer18: [3795, 1922, "Arnad-I-Edhil"],
  Healer19: [1600, 2157, "Rozdroże Podzamcze"],
  Healer20: [1829, 3066, "Falas"],
  Healer21: [1028, 2202, "Belegost"],
  Healer22: [1612, 2715, "Falas Obok Ulnhyr Orbben"],
  Healer23: [1492, 842, "Elbrind"],
  Healer24: [2820, 1920, "Leże Ognistych Smoków"],
  Healer25: [277, 555, "Śnieżna Wyspa"],
  Healer26: [2082, 3207, "Falas Bagna"],
  Healer27: [1107, 2557, "Hurengrav"],
  Healer28: [420, 1300, "Wąwóz Przy Wulkanie"],
  Healer29: [1225, 678, "Geriador"],
  Healer30: [1935, 2461, "Falas Obóz Orków"],
  Healer31: [1190, 2823, "Garth"],
  Healer32: [2203, 1993, "Rozdroże Celendir"],
  Healer33: [2891, 2098, "Orda Kanion"],
  Healer34: [1392, 1307, "Barad-dur"],
  Healer35: [2214, 2363, "Orda Brama"],
  Healer36: [800, 1688, "Most Przy Rozdrożu"],
  Healer37: [1830, 2902, "Falas Ruiny"],
  Healer38: [560, 1850, "Rozdroże Orod"],
  Healer39: [1814, 2100, "Rozdroże Tasandora"],
  Healer40: [489, 1446, "Leże Troli"],
  Healer41: [664, 1033, "Brama Geriadoru"],
  Healer42: [852, 1451, "Granica Ethrod-Tafroel"],
  Healer43: [3150, 1894, "Brama Międzykontynentalna"],
  Healer44: [3534, 1985, "Brama Pedanin"],
  Healer45: [2772, 2485, "Most Pustynia Lalith"]
};
const customHealers = {};
const healersSubgroup = document.getElementById("healersSubgroup");

const ankhData = {
  AnkhAlcala: [678, 1646, "Alcala"],
  AnkhAlcala2: [635, 1593, "Alcala Ogrody"],
  AnkhAlcala3: [737, 1455, "Alcala Ołtarz"],
  AnkhEdhil: [2941, 977, "Edhil"],
  AnkhEdhil2: [3565, 1173, "Edhil II"],
  AnkhFortMalvenAnnon: [2357, 1944, "Brama Malven-Annon"],
  AnkhGarlanArena: [1031, 685, "Garlan Arena"],
  AnkhGarthPodziemia: [5984, 41, "Garth Podziemia"],
  AnkhGeriador: [198, 863, "Geriador"],
  AnkhGrobowceLotharn: [1939, 600, "Grobowce Lotharn"],
  AnkhGrobowceNaurow: [2446, 2934, "Grobowce Naurów"],
  AnkhHurengrav: [1014, 2711, "Hurengrav"],
  AnkhImloth: [3056, 646, "Imloth"],
  AnkhJaskiniaBlyskow: [3388, 1955, "Jaskinia Błysków"],
  AnkhKrolwewskieKrypty: [832, 571, "Królewskie Krypty"],
  AnkhKryjowkaPrzemytnikow: [2082, 3425, "Kryjówka Przemytników"],
  AnkhKrysztalowaJaskinia: [3823, 1787, "Kryształowa Jaskinia"],
  AnkhLabirynt: [2786, 1952, "Labirynt"],
  AnkhLezeLodowychSmokow: [366, 887, "Leże Lodowych Smoków"],
  AnkhLezeOgnistychSmokow: [5717, 1994, "Leże Ognistych Smoków"],
  AnkhLezePluskwy: [5589, 244, "Leże Pluskwy"],
  AnkhLezekrysztalowychSmokow: [360, 1202, "Leże Kryształowych Smoków"],
  AnkhLochBaronowej: [5231, 208, "Loch Baronowej"],
  AnkhLochBialegoWilka: [3762, 680, "Loch Białego Wilka"],
  AnkhLochOphidian: [2786, 1952, "Loch Ophidian"],
  AnkhLDelmah: [5379, 1963, "Świątynia Loethe L'Delmah"],
  AnkhLoenTorech: [3403, 1631, "Loen Torech"],
  AnkhLotharn: [1891, 488, "Lotharn"],
  AnkhMrowisko: [3677, 1672, "Mrowisko"],
  AnkhNoamuthQuortek: [5943, 356, "Noamuth Quortek"],
  AnkhOkoliceBaraddur: [1322, 1106, "Okolice Barad-dur"],
  AnkhOrda: [2444, 2872, "Orda"],
  AnkhPedanin: [2941, 977, "Pedanin"],
  AnkhPiramida: [2428, 2387, "Piramida"],
  AnkhPlytkiPodmrok1: [5853, 2941, "Płytki Podmrok"],
  AnkhPlytkiPodmrok2: [5224, 2718, "Płytki Podmrok II"],
  AnkhPodmrok: [5389, 3921, "Głęboki Podmrok"],
  AnkhPodmrok2: [5914, 4028, "Głęboki Podmrok II"],
  AnkhPodmrok3: [5256, 3197, "Głęboki Podmrok III"],
  AnkhPodmrok4: [5944, 3652, "Głęboki Podmrok IV"],
  AnkhPodmrok5: [5449, 3546, "Głęboki Podmrok V"],
  AnkhPodmrok6: [6018, 3448, "Głęboki Podmrok VI"],
  AnkhPodziemiaSaew: [5208, 1632, "Podziemia Saew"],
  AnkhPokracznyLoch: [3964, 1046, "Pokraczny Loch"],
  AnkhPolnoc: [3373, 948, "Daleka Północ"],
  AnkhSaew: [1361, 637, "Saew"],
  AnkhSiedzibaDemonow: [3825, 1624, "Siedziba Demonów"],
  AnkhSwiatyniaHirneth: [5890, 1235, "Świątynia Matki - Hirneth"],
  AnkhSwiatyniaPanaGarlan: [1013, 523, "Świątynia Pana Garlan"],
  AnkhSwiatyniaPanaTasandora: [1295, 1841, "Świątynia Pana Tasandora"],
  AnkhSwiatyniaSmierciTasandora: [5408, 1468, "Światynia Śmierci Tasandora"],
  AnkhThila: [2967, 2658, "Thila"],
  AnkhTwierdza: [5597, 1077, "Twierdza"],
  AnkhTwierdzaLoch: [5505, 1441, "Twierdza Loch"],
  AnkhTwierdzaZwiednietejRozy: [2182, 1636, "Twierdza Zwiędniętej Rózy"],
  AnkhUlnhyrOrbben: [1557, 2716, "Ulnhyr Orbben"],
  AnkhVelkynAto: [5433, 3754, "Velkyn Ato"],
  AnkhWulkan: [576, 1280, "Wulkan"],
  AnkhWyspaGeriador: [210, 635, "Śnieżna Wyspa"],
  AnkhWyspaVoxPopuli: [4110, 3782, "Wyspa Vox Populi"],
  AnkhJaskiniaMelisande: [3279, 1897, "Jaskinia Melisande "]
};

const customAnkh = {};
const ankhSubgroup = document.getElementById("ankhSubgroup");

const customPinIcons = [
  L.icon({ iconUrl: 'assets/RedPin.png', iconSize: [12, 27], iconAnchor: [6, 27] }),     
  L.icon({ iconUrl: 'assets/OrangePin.png', iconSize: [12, 27], iconAnchor: [6, 27] }),   
  L.icon({ iconUrl: 'assets/YellowPin.png', iconSize: [12, 27], iconAnchor: [6, 27] }),  
  L.icon({ iconUrl: 'assets/GreenPin.png', iconSize: [12, 27], iconAnchor: [6, 27] }),   
  L.icon({ iconUrl: 'assets/BluePin.png', iconSize: [12, 27], iconAnchor: [6, 27] }),     
  L.icon({ iconUrl: 'assets/DarkBluePin.png', iconSize: [12, 27], iconAnchor: [6, 27] }),  
  L.icon({ iconUrl: 'assets/PinkPin.png', iconSize: [12, 27], iconAnchor: [6, 27] })       
];

const categories = [
  { data: cityData, markers: cityMarkers, icon: cityIcon, subgroup: citiesSubgroup, className: 'city-toggle' },
  { data: dungeonData, markers: customDungeons, icon: dungeonIcon, subgroup: dungeonsSubgroup, className: 'dungeon-toggle' },
  { data: villageData, markers: customVillages, icon: villageIcon, subgroup: villagesSubgroup, className: 'village-toggle' },
  { data: healerData, markers: customHealers, icon: healerIcon, subgroup: healersSubgroup, className: 'healer-toggle' },
  { data: ankhData, markers: customAnkh, icon: ankhIcon, subgroup: ankhSubgroup, className: 'ankh-toggle' },
  { data: {}, markers: {}, icon: L.icon({ iconUrl: 'assets/PinkPin.png', iconSize: [12, 27], iconAnchor: [5, 27] }), subgroup: document.getElementById("customPinsSubgroup"), className: 'custom-pin-toggle' }

  
];

categories.forEach(({ data, markers, icon, subgroup, className }) => {
  Object.entries(data)
    .sort((a, b) => a[1][2].localeCompare(b[1][2]))
    .forEach(([id, [x, y, name]]) => {
      const marker = L.marker([mapHeight - y, x], { icon }).bindPopup(name);
      markers[id] = marker;

      const label = document.createElement("label");
      label.innerHTML = `<input type="checkbox" class="${className}" data-id="${id}"> ${name}`;
      subgroup.appendChild(label);
    });
});

const toggleConfigs = [
  { selector: '.city-toggle', markers: cityMarkers },
  { selector: '.dungeon-toggle', markers: customDungeons },
  { selector: '.village-toggle', markers: customVillages },
  { selector: '.healer-toggle', markers: customHealers },
  { selector: '.ankh-toggle', markers: customAnkh }
];

toggleConfigs.push({
  selector: '.custom-pin-toggle',
  markers: categories[categories.length - 1].markers
});

toggleConfigs.forEach(({ selector, markers }) => {
  document.querySelectorAll(selector).forEach(cb => {
    cb.addEventListener('change', e => {
      const id = e.target.dataset.id;
      const marker = markers[id];

      if (e.target.checked) {
        marker.addTo(map);
        const el = marker.getElement();
        if (el) el.classList.add('fade-in');
      } else {
        const el = marker.getElement();
        if (el) {
          el.classList.remove('fade-in');
          el.classList.add('fade-out');
          setTimeout(() => {
            map.removeLayer(marker);
            el.classList.remove('fade-out');
          }, 300); // tyle trwa fade-out
        } else {
          map.removeLayer(marker);
        }
      }
    });
  });
});


const subgroupStates = {
  toggleCitiesBtn: { groupId: 'citiesSubgroup' },
  toggleVillagesBtn: { groupId: 'villagesSubgroup' },
  toggleDungeonsBtn: { groupId: 'dungeonsSubgroup' },
  toggleHealersBtn: { groupId: 'healersSubgroup' },
  toggleAnkhBtn: { groupId: 'ankhSubgroup' },
  toggleCustomPinsBtn: { groupId: 'customPinsSubgroup' }

};

Object.entries(subgroupStates).forEach(([btnId, state]) => {
  const btn = document.getElementById(btnId);
  const group = document.getElementById(state.groupId);

  let currentTransitionEnd = null;


  btn.addEventListener('click', (e) => {
  e.stopPropagation(); //  zatrzymuje kliknięcie, by nie leciało dalej

  const isNowOpen = !btn.classList.contains('open');
  btn.classList.toggle('open', isNowOpen);

    // Przerwij bieżącą animację
    group.style.transition = 'none';
    group.style.height = getComputedStyle(group).height;
    void group.offsetHeight;

    // Usuń poprzedni handler transitionend jeśli istnieje
    if (currentTransitionEnd) {
      group.removeEventListener('transitionend', currentTransitionEnd);
      currentTransitionEnd = null;
    }

    // Włącz ponownie przejścia
    group.style.transition = `
      height ${isNowOpen ? '1.0s' : '0.7s'} ease,
      padding ${isNowOpen ? '1.0s' : '0.7s'} ease,
      opacity ${isNowOpen ? '0.8s' : '0.4s'} ease,
      margin-top ${isNowOpen ? '0.8s' : '0.4s'} ease
    `;

    if (isNowOpen) {
      group.style.opacity = '1';
      group.style.paddingTop = '4px';
      group.style.paddingBottom = '4px';
      group.style.marginTop = '4px';
      group.style.height = group.scrollHeight + 'px';
    } else {
      group.style.height = group.scrollHeight + 'px';
      void group.offsetHeight;
      group.style.height = '0';
      group.style.opacity = '0';
      group.style.paddingTop = '0';
      group.style.paddingBottom = '0';
      group.style.marginTop = '0';
    }

    // Ustaw nowy handler
    currentTransitionEnd = (e) => {
      if (e.propertyName === 'height') {
        group.removeEventListener('transitionend', currentTransitionEnd);
        if (isNowOpen) group.style.height = 'auto';
        currentTransitionEnd = null;
      }
    };

    group.addEventListener('transitionend', currentTransitionEnd);
  });
});

document.querySelectorAll('.control-row').forEach(row => {
  row.addEventListener('click', (e) => {
    if (
      e.target.tagName === 'INPUT' ||
      e.target.classList.contains('toggle-button')
    ) return;

    const toggleBtn = row.querySelector('.toggle-button');
    if (!toggleBtn) return;

    toggleBtn.click(); // Nie dispatch, zwykły click – masz już pełną animację
  });
});


const groupToggles = [
  { groupId: 'toggleCitiesGroup', className: '.city-toggle' },
  { groupId: 'toggleDungeonsGroup', className: '.dungeon-toggle' },
  { groupId: 'toggleVillagesGroup', className: '.village-toggle' },
  { groupId: 'toggleHealersGroup', className: '.healer-toggle' },
  { groupId: 'toggleAnkhGroup', className: '.ankh-toggle' },
  { groupId: 'toggleCustomPinsGroup', className: '.custom-pin-toggle' }
];

groupToggles.forEach(({ groupId, className }) => {
  const groupCheckbox = document.getElementById(groupId);
  if (!groupCheckbox) return;

  groupCheckbox.addEventListener('change', (e) => {
    const checked = e.target.checked;
    document.querySelectorAll(className).forEach(cb => {
      cb.checked = checked;
      cb.dispatchEvent(new Event('change'));
    });
  });
});


map.on('mousemove', e => {
  const x = Math.round(e.latlng.lng);
  const y = Math.round(mapHeight - e.latlng.lat);
  document.getElementById('coordsDisplay').innerHTML = `
  <div class="coords-inline">
    <span class="coord-x">X: ${x}</span>
    <span class="coord-y">Y: ${y}</span>
  </div>
`;
});

// Zapamiętywanie stanu checkboxów
const saveState = () => {
  const states = {};
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    states[cb.dataset.id || cb.id] = cb.checked;
  });
  localStorage.setItem('checkboxStates', JSON.stringify(states));
};

const loadState = () => {
  const saved = JSON.parse(localStorage.getItem('checkboxStates') || '{}');
  Object.entries(saved).forEach(([key, value]) => {
    const el = document.querySelector(`[data-id="${key}"], #${key}`);
    if (el) {
      el.checked = value;
      el.dispatchEvent(new Event('change'));
    }
  });
};


window.addEventListener('load', function () {
  loadCustomPins();
  loadState();

  document.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
    cb.addEventListener('change', saveState);
  });
});


window.addEventListener('DOMContentLoaded', () => {
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');

  if (zoomInBtn && zoomOutBtn) {
    zoomInBtn.addEventListener('click', () => map.zoomIn());
    zoomOutBtn.addEventListener('click', () => map.zoomOut());
  }
});

const allSubgroups = [
  { btn: 'toggleCitiesBtn', group: 'citiesSubgroup' },
  { btn: 'toggleVillagesBtn', group: 'villagesSubgroup' },
  { btn: 'toggleDungeonsBtn', group: 'dungeonsSubgroup' },
  { btn: 'toggleHealersBtn', group: 'healersSubgroup' },
  { btn: 'toggleAnkhBtn', group: 'ankhSubgroup' },
  { btn: 'toggleCustomPinsBtn', group: 'customPinsSubgroup' }
];

document.getElementById('searchBox').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const input = this.value.trim();
    this.value = '';
    this.dispatchEvent(new Event('input')); // <-- tu resetujemy filtrację!
    const parts = input.split(";");

    if (parts.length >= 3) {
      const name = parts[0];
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const description = parts.slice(3).join(";");

      if (!isNaN(x) && !isNaN(y)) {
        const id = 'pin-' + Date.now();
        const marker = L.marker([mapHeight - y, x], {
          icon: categories[categories.length - 1].icon
        }).bindPopup(createPopupContent(id, name));

        marker.addTo(map);
        categories[categories.length - 1].markers[id] = marker;
        addCustomPinToSidebar(id, name, true);
        saveCustomPins();

        const groupCheckbox = document.getElementById('toggleCustomPinsGroup');
        if (groupCheckbox && !groupCheckbox.checked) {
          groupCheckbox.checked = true;
          groupCheckbox.dispatchEvent(new Event('change'));
        }

        const toggleBtn = document.getElementById('toggleCustomPinsBtn');
        if (toggleBtn && !toggleBtn.classList.contains('open')) {
          toggleBtn.click();
        }

        map.flyTo([mapHeight - y, x], 1, {
          animate: true,
          duration: 4.0,      // wolniejsze przybliżanie
          easeLinearity: 0.2  // łagodniejsze tempo
        });
      }
    }
  }
});

//Wyszukiwarka
document.getElementById('searchBox').addEventListener('input', function () {
  const query = this.value.toLowerCase();

  if (query === '') {
    // 1. Pokaż wszystkie etykiety
    document.querySelectorAll('#controls label').forEach(label => {
      label.style.display = 'flex';
    });

    // 2. ZWIŃ wszystkie grupy na sztywno
    allSubgroups.forEach(({ btn, group }) => {
      const btnEl = document.getElementById(btn);
      const groupEl = document.getElementById(group);

      // Wymuszone zwinięcie grupy – bez animacji
      btnEl.classList.remove('open');
      groupEl.style.transition = 'none'; // usuń animację
      groupEl.style.height = '0';
      groupEl.style.opacity = '0';
      groupEl.style.paddingTop = '0';
      groupEl.style.paddingBottom = '0';
      groupEl.style.marginTop = '0';
      groupEl.style.overflow = 'hidden';
    });

    return;
  }

  // FILTROWANIE wyników
  document.querySelectorAll('#controls label').forEach(label => {
    const text = label.textContent.toLowerCase();
    label.style.display = text.includes(query) ? 'flex' : 'none';
  });

  // ROZWIŃ tylko grupy z wynikami
  allSubgroups.forEach(({ btn, group }) => {
    const groupEl = document.getElementById(group);
    const visibleLabels = [...groupEl.querySelectorAll('label')].filter(label =>
      window.getComputedStyle(label).display !== 'none'
    );

    const shouldExpand = visibleLabels.length > 0;
    toggleGroup(btn, group, shouldExpand);
    document.getElementById(btn).classList.toggle('open', shouldExpand);
  });
});


//Sidebar
const sidebar = document.getElementById('controls');
const toggleBtn = document.getElementById('sidebarToggle');

// Przywróć stan zapisany wcześniej
if (localStorage.getItem('sidebarCollapsed') === 'true') {
  sidebar.classList.add('collapsed');
  toggleBtn.classList.add('collapsed');
}

// Obsługa kliknięcia
toggleBtn.addEventListener('click', () => {
  const collapsed = sidebar.classList.toggle('collapsed');
  toggleBtn.classList.toggle('collapsed', collapsed);
  localStorage.setItem('sidebarCollapsed', collapsed);
  setTimeout(() => map.invalidateSize(), 400);

  if (collapsed) {
    // Przy zwinięciu – zamknij wszystkie podgrupy
    allSubgroups.forEach(({ btn, group }) => {
      const btnEl = document.getElementById(btn);
      const groupEl = document.getElementById(group);

      btnEl.classList.remove('open');

      groupEl.style.transition = 'none';
      groupEl.style.height = '0';
      groupEl.style.opacity = '0';
      groupEl.style.paddingTop = '0';
      groupEl.style.paddingBottom = '0';
      groupEl.style.marginTop = '0';
      groupEl.style.overflow = 'hidden';
    });
  }
});


//NEXT SCRIPT

const cursors = {
    n:  { file: 'assets/glove-n.png',  hotspot: [7, 1] },
    ne: { file: 'assets/glove-ne.png', hotspot: [28, 2] },
    e:  { file: 'assets/glove-e.png',  hotspot: [41, 9] },
    se: { file: 'assets/glove-se.png', hotspot: [35, 24] },
    s:  { file: 'assets/glove-s.png',  hotspot: [14, 32] },
    sw: { file: 'assets/glove-sw.png', hotspot: [2, 26] },
    w:  { file: 'assets/glove-w.png',  hotspot: [1, 9] },
    nw: { file: 'assets/glove-nw.png', hotspot: [1, 1] }
  };
  
  const clickStages = [
    { file: 'click1st_stage.png', hotspot: [1, 1] },
    { file: 'click2nd_stage.png', hotspot: [1, 7] },
    { file: 'assets/click3rd_stage.png', hotspot: [4, 4] }
  ];
  
  let currentDirection = 'nw';
  let clickTimeout = null;
  let clickHoldTimeout = null;
  let isClicking = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  const radius = 50;
  
  // Domyślny kursor
  const { file, hotspot } = cursors['nw'];
  document.body.style.cursor = `url(${file}) ${hotspot[0]} ${hotspot[1]}, auto`;
  
  // Obsługa kierunku
  document.addEventListener('mousemove', (e) => {
    if (clickTimeout) return;
  
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
    let dir = 'nw';
    if (angle >= -10 && angle < 10) dir = 'e';
    else if (angle >= 10 && angle < 60) dir = 'se';
    else if (angle >= 60 && angle < 120) dir = 's';
    else if (angle >= 120 && angle < 170) dir = 'sw';
    else if (angle >= 170 || angle < -170) dir = 'w';
    else if (angle >= -170 && angle < -120) dir = 'nw';
    else if (angle >= -120 && angle < -60) dir = 'n';
    else if (angle >= -60 && angle < -10) dir = 'ne';
  
    if (dir !== currentDirection) {
      currentDirection = dir;
      const { file, hotspot } = cursors[dir];
      document.body.style.cursor = `url(${file}) ${hotspot[0]} ${hotspot[1]}, auto`;
    }
  
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });
  
  document.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // tylko LPM
  
    const dx = Math.abs(e.clientX - lastMouseX);
    const dy = Math.abs(e.clientY - lastMouseY);
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    const radius = 500; // możesz zmienić np. na 20
  
    if (distance > radius) {
      // zablokuj klik
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  
    // jeśli w promieniu – pozwól kliknąć (np. checkbox działa)
    isClicking = true;
  
    // animacja – tylko jeśli LPM trzymany ≥ 500ms
    clickHoldTimeout = setTimeout(() => {
      if (!isClicking) return;
  
      const stage1 = clickStages[0];
      const stage2 = clickStages[1];
      const stage3 = clickStages[2];
  
      document.body.style.cursor = `url(${stage1.file}) ${stage1.hotspot[0]} ${stage1.hotspot[1]}, auto`;
  
      clickTimeout = setTimeout(() => {
        document.body.style.cursor = `url(${stage2.file}) ${stage2.hotspot[0]} ${stage2.hotspot[1]}, auto`;
  
        clickTimeout = setTimeout(() => {
          document.body.style.cursor = `url(${stage3.file}) ${stage3.hotspot[0]} ${stage3.hotspot[1]}, auto`;
        }, 70);
      }, 70);
  
    }, 300);
  });
  
  document.addEventListener('mouseup', () => {
    isClicking = false;
  
    if (clickHoldTimeout) {
      clearTimeout(clickHoldTimeout);
      clickHoldTimeout = null;
    }
  
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
    }
  
    const { file, hotspot } = cursors[currentDirection];
    document.body.style.cursor = `url(${file}) ${hotspot[0]} ${hotspot[1]}, auto`;
  });
  
  map.on('contextmenu', function (e) {
    const selector = document.getElementById('pinIconSelector');
    const iconsContainer = document.getElementById('pinIcons');
    iconsContainer.innerHTML = ''; // wyczyść poprzednie
  
    customPinIcons.forEach((icon, index) => {
      const img = document.createElement('img');
      img.src = icon.options.iconUrl;
      img.style.width = '15px';
      img.style.height = 'auto';
      img.style.cursor = 'pointer';
      img.title = `Ikona ${index + 1}`;
      img.addEventListener('click', () => {
        selector.style.display = 'none';
        createCustomPin(e.latlng, icon, index);
      });
      iconsContainer.appendChild(img);
    });
  
    selector.style.left = e.containerPoint.x + 'px';
    selector.style.top = e.containerPoint.y + 'px';
    selector.style.display = 'block';
  });
  
  function createCustomPin(latlng, icon, iconIndex) {
    const name = prompt("Podaj nazwę lokacji:");
    if (!name) return;
  
    const id = 'pin-' + Date.now();
  
    const marker = L.marker(latlng, { icon: icon });
    marker.bindPopup(createPopupContent(id, name));
    marker.addTo(map);
    marker.options.iconIndex = iconIndex;
  
    categories[categories.length - 1].markers[id] = marker;
    addCustomPinToSidebar(id, name, true);
    saveCustomPins();
  
    const groupCheckbox = document.getElementById('toggleCustomPinsGroup');
    if (groupCheckbox && !groupCheckbox.checked) {
      groupCheckbox.checked = true;
      groupCheckbox.dispatchEvent(new Event('change'));
    }
  
    const toggleBtn = document.getElementById('toggleCustomPinsBtn');
    if (toggleBtn && !toggleBtn.classList.contains('open')) {
      toggleBtn.click();
    }
  }
  
  function createPopupContent(id, name) {
    return (
      '<strong>' + name + '</strong><br>' +
      '<div class="popup-btn-group">' +
        '<button class="popup-btn" onclick="editPin(\'' + id + '\')">✏️ Edytuj</button>' +
        '<button class="popup-btn" onclick="deletePin(\'' + id + '\')">🗑️ Usuń</button>' +
        '<button class="popup-btn" onclick="sharePin(\'' + id + '\')">🔗 Udostępnij</button>' +
      '</div>'
    );
  }
  
  function addCustomPinToSidebar(id, name, checked) {
    const label = document.createElement('label');
    label.innerHTML = '<input type="checkbox" class="custom-pin-toggle" data-id="' + id + '"' + (checked ? ' checked' : '') + '> ' + name;
    document.getElementById('customPinsSubgroup').appendChild(label);
  
    label.querySelector('input').addEventListener('change', function (e) {
      const marker = categories[categories.length - 1].markers[id];
      if (e.target.checked) {
        marker.addTo(map);
        const el = marker.getElement();
        if (el) el.classList.add('fade-in');
      } else {
        const el = marker.getElement();
        if (el) {
          el.classList.remove('fade-in');
          el.classList.add('fade-out');
          setTimeout(function () {
            map.removeLayer(marker);
            el.classList.remove('fade-out');
          }, 300);
        } else {
          map.removeLayer(marker);
        }
      }
      saveCustomPins();
    });
  }
  
  function editPin(id) {
    const newName = prompt("Nowa nazwa pinezki:");
    if (!newName) return;
  
    const marker = categories[categories.length - 1].markers[id];
    if (!marker) return;
  
    marker.setPopupContent(createPopupContent(id, newName));
  
    const input = document.querySelector('.custom-pin-toggle[data-id="' + id + '"]');
    if (input) {
      const checked = input.checked;
      const label = input.parentElement;
      label.innerHTML = '<input type="checkbox" class="custom-pin-toggle" data-id="' + id + '"' + (checked ? ' checked' : '') + '> ' + newName;
      addCustomPinListeners();
    }
  
    saveCustomPins();
  }
  
  function deletePin(id) {
    const marker = categories[categories.length - 1].markers[id];
    if (marker) {
      map.removeLayer(marker);
    }
    delete categories[categories.length - 1].markers[id];
  
    const checkbox = document.querySelector('.custom-pin-toggle[data-id="' + id + '"]');
    if (checkbox && checkbox.parentElement) {
      checkbox.parentElement.remove();
    }
  
    saveCustomPins();
  }
  
  function sharePin(id) {
    const marker = categories[categories.length - 1].markers[id];
    if (!marker) return;
  
    const popup = marker.getPopup();
    const nameMatch = popup.getContent().match(/<strong>(.*?)<\/strong>/);
    const name = nameMatch ? nameMatch[1] : 'Pinezka';
    const latlng = marker.getLatLng();
    const x = Math.round(latlng.lng);
    const y = Math.round(mapHeight - latlng.lat);
  
    const pinText = `${name};${x};${y};`;
    navigator.clipboard.writeText(pinText).then(() => {
      alert('📌 Dane pinezki skopiowane do schowka:\n' + pinText);
  });
  
  }
  
  function addCustomPinListeners() {
    document.querySelectorAll('.custom-pin-toggle').forEach(function (cb) {
      cb.addEventListener('change', function (e) {
        const id = e.target.dataset.id;
        const marker = categories[categories.length - 1].markers[id];
  
        if (e.target.checked) {
          marker.addTo(map);
          const el = marker.getElement();
          if (el) el.classList.add('fade-in');
        } else {
          const el = marker.getElement();
          if (el) {
            el.classList.remove('fade-in');
            el.classList.add('fade-out');
            setTimeout(function () {
              map.removeLayer(marker);
              el.classList.remove('fade-out');
            }, 300);
          } else {
            map.removeLayer(marker);
          }
        }
      });
    });
  }
  
  function saveCustomPins() {
    const pins = [];
    const markers = categories[categories.length - 1].markers;
  
    Object.entries(markers).forEach(function ([id, marker]) {
      const latlng = marker.getLatLng();
      const popup = marker.getPopup();
      const match = popup.getContent().match(/<strong>(.*?)<\/strong>/);
      const name = match ? match[1] : id;
      const visible = map.hasLayer(marker);
  
      pins.push({
        id: id,
        name: name,
        lat: latlng.lat,
        lng: latlng.lng,
        visible: visible,
        iconIndex: marker.options.iconIndex ?? 0
      });
  
    });
  
    localStorage.setItem('customPins', JSON.stringify(pins));
  }
  
  function loadCustomPins() {
    const saved = JSON.parse(localStorage.getItem('customPins') || '[]');
  
    saved.forEach(function (pin) {
      const marker = L.marker([pin.lat, pin.lng], {
        icon: customPinIcons[pin.iconIndex] || customPinIcons[0]
      }).bindPopup(createPopupContent(pin.id, pin.name));
  
      marker.options.iconIndex = pin.iconIndex;
  
      if (pin.visible) marker.addTo(map);
      categories[categories.length - 1].markers[pin.id] = marker;
  
      addCustomPinToSidebar(pin.id, pin.name, pin.visible);
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sel = document.getElementById('pinIconSelector');
      sel.style.display = 'none';
    }
  });
  
  document.getElementById('closePinSelector').addEventListener('click', () => {
    document.getElementById('pinIconSelector').style.display = 'none';
  });
  
  document.addEventListener('click', function (e) {
    const selector = document.getElementById('pinIconSelector');
    if (!selector) return;
  
    // jeśli kliknięto poza selektorem i nie był to prawy klik (który otwiera go znowu)
    if (selector.style.display === 'block' && !selector.contains(e.target)) {
      selector.style.display = 'none';
    }
  });