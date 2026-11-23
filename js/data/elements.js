/* Dane pierwiastków (PL). Format wiersza: Z|Symbol|Nazwa|poziom|wzór|zastosowania|ciekawostka|ostrzeżenie
 * Część projektu Kolbatorium. Ładowany jako zwykły <script> (bez modułów), więc działa też po otwarciu index.html z dysku.
 */
/* Kolbatorium — dane gry
   Pierwiastki: Z|Symbol|Nazwa|poziom|wzór (puste = symbol)|zastosowania (emoji tekst;...)|ciekawostka|ostrzeżenie
   Poziomy: 1 = Podstawowy, 2 = Średniozaawansowany, 3 = Ekspercki */
const ELEMENT_DATA = `
1|H|Wodór|1|H₂|🚀 paliwo rakietowe;🚌 autobusy wodorowe;🎈 dawniej sterowce|Najlżejszy i najpowszechniejszy pierwiastek we Wszechświecie. Występuje jako cząsteczka H₂.|
2|He|Hel|2||🎈 balony;🩻 chłodzenie magnesów w rezonansie MRI;🤿 mieszanki do nurkowania|Gaz szlachetny — praktycznie nie tworzy związków. Odkryto go najpierw w widmie Słońca.|
3|Li|Lit|2||🔋 akumulatory litowo-jonowe;💊 leki stabilizujące nastrój;🛢️ smary litowe|Najlżejszy metal — pływa nawet po oleju.|
4|Be|Beryl|3||🔭 lustra teleskopu Jamesa Webba;✈️ lekkie stopy lotnicze;🩻 okienka lamp rentgenowskich|Lekki i bardzo sztywny metal, przezroczysty dla promieni X.|Pył berylu i jego związków jest bardzo toksyczny.
5|B|Bor|2||🧪 szkło żaroodporne;🌱 mikroelement dla roślin;🧲 magnesy neodymowe|Półmetal, którego związki dają zielony płomień.|
6|C|Węgiel|1||✏️ grafit w ołówkach;💎 diament;🔥 węgiel drzewny do grilla|Podstawa chemii organicznej i życia. Ten sam pierwiastek tworzy miękki grafit i najtwardszy diament.|
7|N|Azot|1|N₂|🌬️ 78% powietrza;🍟 gaz w paczkach chipsów;🧊 ciekły azot w laboratorium|Bardzo mało reaktywny, bo atomy w N₂ łączy potrójne wiązanie.|
8|O|Tlen|1|O₂|🫁 oddychanie;🏥 butle tlenowe w szpitalu;🔥 podtrzymuje spalanie|Stanowi około 21% powietrza. Wytwarzają go rośliny w fotosyntezie.|
9|F|Fluor|2|F₂|🦷 fluorki w paście do zębów;🍳 teflon na patelniach;❄️ czynniki chłodnicze|Najbardziej elektroujemny i najbardziej reaktywny pierwiastek.|Fluor jest skrajnie żrący i trujący.
10|Ne|Neon|2||💡 reklamy neonowe;🔬 lasery helowo-neonowe;⚡ wskaźniki napięcia|Świeci czerwono-pomarańczowo w lampach wyładowczych. Nie tworzy trwałych związków.|
11|Na|Sód|1||💡 żółte lampy uliczne;🧂 składnik soli kuchennej;🧪 przechowywany w nafcie|Miękki metal, który można kroić nożem. Gwałtownie reaguje z wodą.|Nigdy nie wrzucaj sodu do wody poza pracownią — reakcja jest gwałtowna.
12|Mg|Magnez|1||🚲 lekkie stopy w rowerach;🎆 jasne światło w fajerwerkach;💊 suplementy diety|Pali się oślepiająco białym płomieniem. Jest w centrum cząsteczki chlorofilu.|
13|Al|Glin|1||🥫 puszki;✈️ konstrukcje samolotów;🍫 folia aluminiowa|Najczęstszy metal w skorupie ziemskiej. Chroni go cienka warstwa tlenku.|
14|Si|Krzem|1||💻 procesory i układy scalone;☀️ panele słoneczne;🏖️ składnik piasku|Półmetal, bez którego nie byłoby elektroniki. Dolina Krzemowa wzięła od niego nazwę.|
15|P|Fosfor|2|P₄|🔥 draska pudełka zapałek;🌱 nawozy;🧬 DNA i ATP|Fosfor biały świeci w ciemności i zapala się na powietrzu, czerwony jest znacznie bezpieczniejszy.|Fosfor biały jest silnie trujący i samozapalny.
16|S|Siarka|1||🔥 główki zapałek;🛞 wulkanizacja opon;🌋 złoża przy wulkanach|Żółte kryształy. Polska ma duże złoża siarki rodzimej koło Tarnobrzega.|
17|Cl|Chlor|1|Cl₂|🏊 dezynfekcja basenów;🚰 uzdatnianie wody;🧴 produkcja PCV|Żółtozielony, trujący gaz o ostrym zapachu.|Chlor jest trujący. W domu nie mieszaj środków chlorowych z kwasowymi.
18|Ar|Argon|2||💡 wypełnienie żarówek;🔧 spawanie w osłonie argonu;🪟 szyby zespolone|Około 1% powietrza. Jego nazwa po grecku znaczy „leniwy”, bo nie reaguje.|
19|K|Potas|1||🍌 banany (jony potasu);🌱 nawozy;❤️ praca serca i mięśni|Jeszcze bardziej reaktywny niż sód. W organizmie odpowiada za przewodzenie impulsów nerwowych.|
20|Ca|Wapń|1||🦴 kości i zęby;🥛 mleko i sery;🏗️ cement i wapno|Piąty najczęstszy pierwiastek w skorupie ziemskiej. W organizmie jest go ponad kilogram.|
21|Sc|Skand|3||🚲 stopy aluminium ze skandem w rowerach;💡 lampy metalohalogenkowe na stadionach|Przewidział go Mendelejew jako „ekabor”, zanim został odkryty.|
22|Ti|Tytan|2||🦴 implanty i protezy;✈️ samoloty i rakiety;🎨 biel tytanowa|Wytrzymały jak stal, a prawie o połowę lżejszy. Nie koroduje w organizmie.|
23|V|Wanad|3||🔧 stal narzędziowa (klucze Cr-V);🔋 akumulatory przepływowe;⚗️ katalizatory|Nazwany od Vanadis — skandynawskiej bogini, ze względu na barwne związki.|
24|Cr|Chrom|2||✨ chromowane powierzchnie;🍴 stal nierdzewna;🎨 zielone i żółte pigmenty|Od greckiego „chroma” — barwa. Nadaje rubinowi czerwony kolor.|
25|Mn|Mangan|2||🏗️ stal manganowa w szynach;🔋 baterie alkaliczne;🌱 mikroelement|Ważny dla fotosyntezy — w roślinach pomaga rozkładać wodę.|
26|Fe|Żelazo|1||🏗️ stal w budownictwie;🩸 hemoglobina we krwi;🧲 magnesy|Najważniejszy metal w historii techniki. Jądro Ziemi składa się głównie z żelaza.|
27|Co|Kobalt|2||🔵 błękit kobaltowy;🔋 akumulatory;💉 witamina B₁₂|Nazwa pochodzi od kobolda — złośliwego ducha z niemieckich kopalni.|
28|Ni|Nikiel|2||🪙 monety;🍴 stal nierdzewna;🔋 akumulatory NiMH|Jeden z trzech metali (obok żelaza i kobaltu) silnie przyciąganych przez magnes.|Częsty alergen kontaktowy.
29|Cu|Miedź|1||🔌 przewody elektryczne;🎺 mosiądz w instrumentach;🪙 monety|Świetnie przewodzi prąd. Polska (KGHM) jest jednym z największych producentów miedzi w Europie.|
30|Zn|Cynk|2||🛡️ cynkowanie stali;🧴 kremy z filtrem;💊 suplementy odporności|Ocynkowane rynny i barierki nie rdzewieją, bo cynk utlenia się zamiast żelaza.|
31|Ga|Gal|3||💡 diody LED;🌡️ topi się w dłoni (29,8°C);🛰️ ogniwa słoneczne|Mendelejew przewidział jego właściwości jako „ekaglin”.|
32|Ge|German|3||📡 światłowody;🔭 soczewki na podczerwień;💻 pierwsze tranzystory|Pierwszy tranzystor z 1947 roku zbudowano właśnie z germanu.|
33|As|Arsen|3||💻 półprzewodniki;🪵 dawniej impregnaty drewna;💊 lek na białaczkę|Półmetal znany z kryminalnej historii trucizn.|Związki arsenu są silnie trujące.
34|Se|Selen|3||🧴 szampony przeciwłupieżowe;📷 dawniej kserografia;💊 mikroelement|Przewodzi prąd lepiej w świetle niż w ciemności.|
35|Br|Brom|2|Br₂|🔥 środki zmniejszające palność;🏊 dezynfekcja wody;📷 fotografia|Jedyny niemetal, który w temperaturze pokojowej jest cieczą.|Opary bromu są żrące i trujące.
36|Kr|Krypton|3||💡 lampy błyskowe;🪟 wypełnienie szyb zespolonych;🔬 lasery|Od 1960 do 1983 roku metr definiowano przez długość fali światła kryptonu.|
37|Rb|Rubid|3||⏱️ zegary atomowe w GPS;🔬 badania naukowe;💡 fotokomórki|Topi się w temperaturze 39°C — w gorący dzień byłby prawie cieczą.|
38|Sr|Stront|3||🎆 czerwone fajerwerki;🌌 farby świecące w ciemności;🦷 pasty na nadwrażliwość|Nazwany od szkockiej wioski Strontian, gdzie znaleziono jego minerał.|
39|Y|Itr|3||📺 czerwone luminofory;🔬 lasery YAG;🔌 nadprzewodniki|Jeden z czterech pierwiastków nazwanych od szwedzkiej wioski Ytterby.|
40|Zr|Cyrkon|3||☢️ koszulki paliwa w reaktorach;💎 cyrkonie w biżuterii;🦷 korony dentystyczne|Prawie nie pochłania neutronów, dlatego trafia do reaktorów jądrowych.|
41|Nb|Niob|3||🧲 nadprzewodzące magnesy;🏗️ stal na rurociągi;💍 biżuteria|Magnesy z niobu i tytanu pracują w Wielkim Zderzaczu Hadronów.|
42|Mo|Molibden|3||🔧 stal szybkotnąca;🛢️ smary;🌱 mikroelement dla roślin|Bakterie wiążące azot potrzebują molibdenu w swoich enzymach.|
43|Tc|Technet|3||🩻 diagnostyka medyczna (scyntygrafia)|Pierwszy pierwiastek otrzymany sztucznie. Wszystkie jego izotopy są promieniotwórcze.|Promieniotwórczy.
44|Ru|Ruten|3||💾 dyski twarde;⚗️ katalizatory;✒️ końcówki stalówek|Nazwany od Rusi. Należy do platynowców.|
45|Rh|Rod|3||🚗 katalizatory samochodowe;💍 rodowanie biżuterii;🔦 reflektory|Jeden z najdroższych metali świata.|
46|Pd|Pallad|3||🚗 katalizatory samochodowe;🦷 stopy dentystyczne;🔌 elektronika|Pochłania wodór w ilości 900 razy większej niż własna objętość.|
47|Ag|Srebro|2||💍 biżuteria;📷 fotografia;🦠 opatrunki antybakteryjne|Najlepszy przewodnik prądu i ciepła spośród wszystkich metali.|
48|Cd|Kadm|3||🔋 akumulatory NiCd;🎨 żółte pigmenty;☀️ ogniwa słoneczne|Jego obecność w ryżu wywołała w Japonii chorobę itai-itai.|Kadm i jego związki są toksyczne.
49|In|Ind|3||📱 ekrany dotykowe;🔧 luty niskotopliwe;☀️ ogniwa słoneczne|Tak miękki, że można go zarysować paznokciem, a zginany „piszczy”.|
50|Sn|Cyna|2||🥫 puszki (blacha ocynowana);🔧 lutowie;🔔 brąz|Stop miedzi z cyną — brąz — dał nazwę całej epoce w historii ludzkości.|
51|Sb|Antymon|3||🔥 uniepalniacze;🔋 stopy ołowiu w akumulatorach;🎆 pirotechnika|Znany od starożytności jako składnik kosmetyków do oczu.|Związki antymonu są trujące.
52|Te|Tellur|3||☀️ ogniwa słoneczne;💿 płyty DVD-RW;🔧 stopy stali|Spożyty w małych ilościach daje oddech o zapachu czosnku.|
53|I|Jod|2|I₂|🩹 jodyna do dezynfekcji;🧂 sól jodowana;🦋 hormony tarczycy|Ogrzewany przechodzi od razu z ciała stałego w fioletowe pary — sublimuje.|
54|Xe|Ksenon|3||🚗 reflektory ksenonowe;🛰️ napęd jonowy satelitów;💉 znieczulenie|Pierwszy gaz szlachetny, dla którego otrzymano związek chemiczny (1962).|
55|Cs|Cez|3||⏱️ zegary atomowe (definicja sekundy);🛢️ płuczki wiertnicze;🔬 fotokomórki|Sekunda to 9 192 631 770 drgań promieniowania atomu cezu-133.|Reaguje z wodą wybuchowo.
56|Ba|Bar|2||🩻 kontrast rentgenowski;🎆 zielone fajerwerki;🥂 szkło optyczne|Nazwa od greckiego „barys” — ciężki.|Rozpuszczalne związki baru są trujące.
57|La|Lantan|3||📷 obiektywy aparatów;🔋 akumulatory NiMH;⚗️ katalizatory rafinacji|Dał nazwę całej grupie lantanowców.|
58|Ce|Cer|3||🔥 kamienie do zapalniczek;🪟 polerowanie szkła;🚗 katalizatory|Najczęstszy z lantanowców — wcale nie taki „rzadki”.|
59|Pr|Prazeodym|3||🥽 okulary spawalnicze;🧲 magnesy;🏺 żółte szkliwa|Nazwa znaczy „zielony bliźniak” — długo mylono go z neodymem.|
60|Nd|Neodym|3||🧲 najsilniejsze magnesy;🎧 słuchawki i głośniki;🔬 lasery|Magnesy neodymowe napędzają silniki aut elektrycznych.|
61|Pm|Promet|3||🔋 baterie jądrowe;🔬 badania naukowe|Jedyny lantanowiec bez trwałych izotopów. Nazwany od Prometeusza.|Promieniotwórczy.
62|Sm|Samar|3||🧲 magnesy samarowo-kobaltowe;💊 leczenie bólu w nowotworach kości|Pierwszy pierwiastek nazwany (pośrednio) od człowieka — od minerału samarskitu.|
63|Eu|Europ|3||💶 zabezpieczenia banknotów euro;📺 luminofory;💡 świetlówki|Świecące w ultrafiolecie elementy banknotów euro zawierają związki europu.|
64|Gd|Gadolin|3||🩻 kontrast w rezonansie MRI;☢️ pręty kontrolne reaktorów|Silnie pochłania neutrony.|
65|Tb|Terb|3||💡 zielone luminofory;🔊 materiały magnetostrykcyjne|Kolejny pierwiastek nazwany od wioski Ytterby.|
66|Dy|Dysproz|3||🧲 magnesy do aut elektrycznych;🌬️ turbiny wiatrowe;💡 lampy|Po grecku „trudno dostępny” — długo nie umiano go wyodrębnić.|
67|Ho|Holm|3||🔬 lasery medyczne;🧲 nabiegunniki silnych magnesów|Nazwany od łacińskiej nazwy Sztokholmu.|
68|Er|Erb|3||📡 wzmacniacze światłowodowe;🕶️ różowe szkło;🔬 lasery dermatologiczne|Bez erbu internet światłowodowy wymagałby znacznie więcej przekaźników.|
69|Tm|Tul|3||🩻 przenośne aparaty RTG;🔬 lasery|Jeden z najrzadszych lantanowców.|
70|Yb|Iterb|3||⏱️ zegary optyczne;🔬 lasery;🔧 stal nierdzewna|Zegary iterbowe należą do najdokładniejszych na świecie.|
71|Lu|Lutet|3||🩻 tomografia PET;⚗️ katalizatory;💊 terapia nowotworów|Nazwany od Lutecji — łacińskiej nazwy Paryża.|
72|Hf|Hafn|3||☢️ pręty kontrolne reaktorów;💻 izolatory w procesorach|Nazwany od Hafnii — łacińskiej nazwy Kopenhagi.|
73|Ta|Tantal|3||📱 kondensatory w telefonach;🦴 implanty;🔬 narzędzia chirurgiczne|Nazwany od mitycznego Tantala, bo „nie pije” — nie reaguje z kwasami.|
74|W|Wolfram|3||💡 włókna żarówek;🔩 wiertła;🎯 lotki do darta|Ma najwyższą temperaturę topnienia spośród metali — 3422°C.|
75|Re|Ren|3||✈️ łopatki turbin silników odrzutowych;⚗️ katalizatory|Ostatni odkryty pierwiastek stabilny (1925).|
76|Os|Osm|3||🖋️ końcówki piór wiecznych;🔌 styki elektryczne|Najgęstszy pierwiastek — litr osmu waży 22,6 kg.|
77|Ir|Iryd|3||🔌 świece zapłonowe;📏 dawny wzorzec metra (stop Pt-Ir)|Warstwa irydu w skałach sprzed 66 mln lat świadczy o upadku planetoidy, która zakończyła erę dinozaurów.|
78|Pt|Platyna|3||🚗 katalizatory samochodowe;💍 biżuteria;💊 leki przeciwnowotworowe|Szlachetny metal odporny na prawie wszystkie kwasy — z wyjątkiem wody królewskiej.|
79|Au|Złoto|3||💍 biżuteria;💻 styki w elektronice;🏦 rezerwy banków|Całe wydobyte dotąd złoto zmieściłoby się w sześcianie o boku około 22 metrów.|
80|Hg|Rtęć|2||🌡️ dawne termometry;💡 świetlówki;🦷 dawne plomby amalgamatowe|Jedyny metal ciekły w temperaturze pokojowej.|Pary rtęci są trujące.
81|Tl|Tal|3||🩻 badania serca (izotop Tl-201);🔬 fotokomórki|Nazwa od greckiego „thallos” — zielona gałązka (kolor linii widmowej).|Tal jest bardzo toksyczny.
82|Pb|Ołów|2||🔋 akumulatory samochodowe;🩻 osłony przed promieniowaniem;🎣 ciężarki|Rzymianie robili z ołowiu rury wodociągowe — stąd angielskie „plumber”.|Ołów i jego związki są toksyczne.
83|Bi|Bizmut|3||💊 leki na dolegliwości żołądka;🔧 stopy niskotopliwe;💄 perłowe kosmetyki|Jego kryształy mają tęczowe, schodkowe kształty.|
84|Po|Polon|3||⚡ eliminatory ładunków statycznych;🔬 badania naukowe|Odkryty w 1898 r. przez Marię Skłodowską-Curie i nazwany na cześć Polski.|Silnie promieniotwórczy.
85|At|Astat|3||💊 badania nad terapią nowotworów|Najrzadszy naturalny pierwiastek — w całej skorupie ziemskiej jest go poniżej grama.|Promieniotwórczy.
86|Rn|Radon|3||🏠 pomiary w piwnicach i kopalniach;🔬 badania geologiczne|Promieniotwórczy gaz wydobywający się z gleby. Gromadzi się w nieprzewietrzanych piwnicach.|Promieniotwórczy — dlatego wietrzymy piwnice.
87|Fr|Frans|3||🔬 badania naukowe|Bardzo nietrwały — najdłużej żyjący izotop ma okres półtrwania 22 minuty.|Promieniotwórczy.
88|Ra|Rad|3||🔬 historyczne badania promieniotwórczości;💊 terapia nowotworów kości|Odkryty przez Marię i Piotra Curie w 1898 roku.|Silnie promieniotwórczy.
89|Ac|Aktyn|3||💊 terapia celowana nowotworów|Świeci w ciemności bladoniebieskim światłem. Dał nazwę aktynowcom.|Promieniotwórczy.
90|Th|Tor|3||⚡ potencjalne paliwo jądrowe;🔦 dawniej koszulki lamp gazowych|Nazwany od Thora, nordyckiego boga piorunów.|Promieniotwórczy.
91|Pa|Protaktyn|3||🔬 datowanie osadów oceanicznych|Jeden z najrzadszych i najdroższych naturalnych pierwiastków.|Promieniotwórczy.
92|U|Uran|3||☢️ paliwo jądrowe;🪨 datowanie skał;🎨 dawniej zielone szkło uranowe|Nazwany od planety Uran, odkrytej kilka lat wcześniej.|Promieniotwórczy.
93|Np|Neptun|3||☢️ produkt uboczny w reaktorach;🔬 detektory neutronów|Pierwszy pierwiastek cięższy od uranu, nazwany od kolejnej planety.|Promieniotwórczy.
94|Pu|Pluton|3||🛰️ zasilanie sond kosmicznych;☢️ paliwo jądrowe|Ciepło z rozpadu plutonu zasila sondy Voyager i łaziki marsjańskie.|Promieniotwórczy i toksyczny.
95|Am|Ameryk|3||🚨 czujniki dymu;🔬 źródła promieniowania|Znajduje się w milionach domów — w czujnikach dymu.|Promieniotwórczy.
96|Cm|Kiur|3||🛰️ spektrometry na łazikach marsjańskich|Nazwany na cześć Marii i Piotra Curie.|Promieniotwórczy.
97|Bk|Berkel|3||🔬 synteza cięższych pierwiastków|Nazwany od Berkeley w Kalifornii.|Promieniotwórczy.
98|Cf|Kaliforn|3||⛏️ źródło neutronów do wykrywania złóż;🩻 badania materiałów|Jeden z najdroższych materiałów świata.|Promieniotwórczy.
99|Es|Einstein|3||🔬 badania naukowe|Odkryty w pyle po pierwszym wybuchu termojądrowym. Nazwany od Alberta Einsteina.|Promieniotwórczy.
100|Fm|Ferm|3||🔬 badania naukowe|Nazwany od Enrica Fermiego, twórcy pierwszego reaktora jądrowego.|Promieniotwórczy.
101|Md|Mendelew|3||🔬 badania naukowe|Nazwany na cześć Dmitrija Mendelejewa, twórcy układu okresowego.|Promieniotwórczy.
102|No|Nobel|3||🔬 badania naukowe|Nazwany od Alfreda Nobla, fundatora Nagrody Nobla.|Promieniotwórczy.
103|Lr|Lorens|3||🔬 badania naukowe|Nazwany od Ernesta Lawrence'a, wynalazcy cyklotronu.|Promieniotwórczy.
104|Rf|Rutherford|3||🔬 badania naukowe|Nazwany od Ernesta Rutherforda, odkrywcy jądra atomowego.|Promieniotwórczy, istnieje tylko sekundy.
105|Db|Dubn|3||🔬 badania naukowe|Nazwany od Dubnej — rosyjskiego ośrodka badań jądrowych.|Promieniotwórczy.
106|Sg|Seaborg|3||🔬 badania naukowe|Glenn Seaborg był pierwszą osobą, która za życia dostała „swój” pierwiastek.|Promieniotwórczy.
107|Bh|Bohr|3||🔬 badania naukowe|Nazwany od Nielsa Bohra, twórcy modelu atomu.|Promieniotwórczy.
108|Hs|Has|3||🔬 badania naukowe|Nazwany od Hesji, niemieckiego landu z ośrodkiem GSI w Darmstadt.|Promieniotwórczy.
109|Mt|Meitner|3||🔬 badania naukowe|Nazwany od Lise Meitner, współodkrywczyni rozszczepienia jądra.|Promieniotwórczy.
110|Ds|Darmsztadt|3||🔬 badania naukowe|Nazwany od miasta Darmstadt, gdzie go otrzymano.|Promieniotwórczy.
111|Rg|Roentgen|3||🔬 badania naukowe|Nazwany od Wilhelma Röntgena, odkrywcy promieni X.|Promieniotwórczy.
112|Cn|Kopernik|3||🔬 badania naukowe|Nazwany na cześć Mikołaja Kopernika — polskiego astronoma.|Promieniotwórczy.
113|Nh|Nihon|3||🔬 badania naukowe|Pierwszy pierwiastek odkryty w Azji — „Nihon” to po japońsku Japonia.|Promieniotwórczy.
114|Fl|Flerow|3||🔬 badania naukowe|Nazwany od Laboratorium Reakcji Jądrowych im. Flerowa w Dubnej.|Promieniotwórczy.
115|Mc|Moskow|3||🔬 badania naukowe|Nazwany od obwodu moskiewskiego.|Promieniotwórczy.
116|Lv|Liwermor|3||🔬 badania naukowe|Nazwany od Lawrence Livermore National Laboratory w USA.|Promieniotwórczy.
117|Ts|Tenes|3||🔬 badania naukowe|Nazwany od stanu Tennessee w USA.|Promieniotwórczy.
118|Og|Oganeson|3||🔬 badania naukowe|Najcięższy znany pierwiastek, nazwany od fizyka Jurija Oganiesiana.|Promieniotwórczy.
`;

