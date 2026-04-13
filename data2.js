const data2 = [
  // --- İsimler ---
  { id: 81, category: 'isimler', germanWord: 'der Ansatz /"e', pronunciation: 'der an-zats', germanSentence: 'Wir sollten einen neuen Ansatz probieren.', turkishWord: 'yaklaşım, metod', turkishSentence: 'Yeni bir yaklaşım denemeliyiz.' },
  { id: 82, category: 'isimler', germanWord: 'die Anziehungskraft', pronunciation: 'di an-tsi-ungs-kraft', germanSentence: 'Der Ort hat eine magische Anziehungskraft.', turkishWord: 'çekim gücü, cazibe', turkishSentence: 'Mekanın büyülü bir cazibesi/çekim gücü var.' },
  { id: 83, category: 'isimler', germanWord: 'die Aufklärung', pronunciation: 'di auf-kley-rung', germanSentence: 'Wir fordern eine lückenlose Aufklärung.', turkishWord: 'aydınlanma, aydınlatma', turkishSentence: 'Eksiksiz bir aydınlatma (açıklık) talep ediyoruz.' },
  { id: 84, category: 'isimler', germanWord: 'der Aufwand', pronunciation: 'der auf-vant', germanSentence: 'Der Aufwand hat sich definitiv gelohnt.', turkishWord: 'harcama, emek, çaba', turkishSentence: 'Verilen emeğe kesinlikle değdi.' },
  { id: 85, category: 'isimler', germanWord: 'das Ausrufezeichen /-', pronunciation: 'das aus-ru-fı-tsay-hın', germanSentence: 'Am Ende des Satzes steht ein Ausrufezeichen.', turkishWord: 'ünlem işareti', turkishSentence: 'Cümlenin sonunda bir ünlem işareti var.' },
  { id: 86, category: 'isimler', germanWord: 'die Beschwerde /-n', pronunciation: 'di be-şve-rdı', germanSentence: 'Er reichte eine offizielle Beschwerde ein.', turkishWord: 'şikayet', turkishSentence: 'O resmi bir şikayet sundu.' },
  { id: 87, category: 'isimler', germanWord: 'der Beweis /-e', pronunciation: 'der be-vays', germanSentence: 'Liegt dafür ein eindeutiger Beweis vor?', turkishWord: 'kanıt, delil', turkishSentence: 'Bunun için net bir kanıt var mı?' },
  { id: 88, category: 'isimler', germanWord: 'die Botschaft /-en', pronunciation: 'di bot-şaft', germanSentence: 'Das ist die zentrale Botschaft des Films.', turkishWord: 'mesaj, büyükelçilik', turkishSentence: 'Filmin ana/merkezi mesajı budur.' },
  { id: 89, category: 'isimler', germanWord: 'das Defizit /-e', pronunciation: 'das de-fi-tsit', germanSentence: 'Es gibt ein großes Defizit an Fachkräften.', turkishWord: 'açık, eksiklik', turkishSentence: 'Büyük bir uzman/kalifiye eleman açığı var.' },
  { id: 90, category: 'isimler', germanWord: 'die Einsicht /-en', pronunciation: 'di ayn-ziht', germanSentence: 'Zur Einsicht ist es nie zu spät.', turkishWord: 'anlayış, idrak, hatasını anlama', turkishSentence: 'Hatasını idrak etmek için asla çok geç değildir.' },
  
  // --- Fiiller ---
  { id: 91, category: 'fiiller', germanWord: 'beseitigen', pronunciation: 'be-zay-ti-gın', germanSentence: 'Die Probleme wurden umgehend beseitigt.', turkishWord: 'gidermek, ortadan kaldırmak', turkishSentence: 'Sorunlar derhal giderildi.' },
  { id: 92, category: 'fiiller', germanWord: 'einbringen (sich)', pronunciation: 'ayn-brin-gın', germanSentence: 'Er bringt sich intensiv in das Projekt ein.', turkishWord: 'katılım sağlamak, kendini katmak', turkishSentence: 'Projeye yoğun bir şekilde katılım sağlıyor.' },
  { id: 93, category: 'fiiller', germanWord: 'entziffern', pronunciation: 'ent-tsi-fırn', germanSentence: 'Ich konnte seine Handschrift kaum entziffern.', turkishWord: 'şifresini çözmek, zor okunan bir şeyi sökmek', turkishSentence: 'El yazısını zar zor sökebildim.' },
  { id: 94, category: 'fiiller', germanWord: 'untersagen', pronunciation: 'un-ter-za-gın', germanSentence: 'Das Rauchen ist hier strengstens untersagt.', turkishWord: 'yasaklamak', turkishSentence: 'Burada sigara içmek kesinlikle yasaktır.' },
  { id: 95, category: 'fiiller', germanWord: 'verschwenden', pronunciation: 'fer-şven-dın', germanSentence: 'Du verschwendest nur deine Zeit.', turkishWord: 'ziyan etmek, israf etmek', turkishSentence: 'Sadece zamanını ziyan ediyorsun.' },
  { id: 96, category: 'fiiller', germanWord: 'wahrnehmen', pronunciation: 'vaar-ney-mın', germanSentence: 'Ich konnte ein leises Geräusch wahrnehmen.', turkishWord: 'algılamak, farkına varmak', turkishSentence: 'Hafif bir ses/gürültü algılayabildim.' },
  { id: 97, category: 'fiiller', germanWord: 'überfordern', pronunciation: 'ü-bır-for-dırn', germanSentence: 'Die Aufgaben sollten die Schüler nicht überfordern.', turkishWord: 'fazla yüklenmek, kaldıramayacağı yük vermek', turkishSentence: 'Görevler öğrencilere fazla yüklenmemeli.' },
  { id: 98, category: 'fiiller', germanWord: 'beauftragen', pronunciation: 'be-auf-tra-gın', germanSentence: 'Wir haben eine Anwältin damit beauftragt.', turkishWord: 'görevlendirmek', turkishSentence: 'Bununla (ilgilenmesi için) bir avukat görevlendirdik.' },
  { id: 99, category: 'fiiller', germanWord: 'entkräften', pronunciation: 'ent-kref-tın', germanSentence: 'Die Vorwürfe konnten jedoch entkräftet werden.', turkishWord: 'çürütmek (iddia), gücünü zayıflatmak', turkishSentence: 'Ancak suçlamalar çürütülebildi.' },
  { id: 100, category: 'fiiller', germanWord: 'überwiegen', pronunciation: 'ü-bır-vii-gın', germanSentence: 'Die Vorteile überwiegen ganz klar.', turkishWord: 'ağır basmak, üstün gelmek', turkishSentence: 'Avantajlar açıkça ağır basıyor.' },

  // --- Sıfatlar ---
  { id: 101, category: 'sıfatlar', germanWord: 'auffällig', pronunciation: 'auf-fe-lik', germanSentence: 'Sein Verhalten war heute sehr auffällig.', turkishWord: 'göze çarpan, dikkat çekici', turkishSentence: 'Hareketleri bugün oldukça dikkat çekiciydi.' },
  { id: 102, category: 'sıfatlar', germanWord: 'bescheiden', pronunciation: 'be-şay-dın', germanSentence: 'Trotz seines Reichtums blieb er bescheiden.', turkishWord: 'mütevazı', turkishSentence: 'Zenginliğine rağmen mütevazı kaldı.' },
  { id: 103, category: 'sıfatlar', germanWord: 'empfindlich', pronunciation: 'emp-fint-lih', germanSentence: 'Meine Haut ist sehr empfindlich.', turkishWord: 'hassas, duyarlı', turkishSentence: 'Cildim çok hassastır.' },
  { id: 104, category: 'sıfatlar', germanWord: 'nachhaltig', pronunciation: 'nah-hal-tik', germanSentence: 'Wir brauchen eine nachhaltige Lösung.', turkishWord: 'sürdürülebilir, kalıcı', turkishSentence: 'Sürdürülebilir bir çözüme ihtiyacımız var.' },
  { id: 105, category: 'sıfatlar', germanWord: 'prägnant', pronunciation: 'prek-nant', germanSentence: 'Bitte formulieren Sie den Satz etwas prägnanter.', turkishWord: 'kısa ve öz', turkishSentence: 'Lütfen cümleyi biraz daha kısa ve öz ifade edin.' },
  
  // --- Bağlaçlar / Zarflar ---
  { id: 106, category: 'bağlaçlar', germanWord: 'folglich', pronunciation: 'folk-lih', germanSentence: 'Es gab keinen Strom, folglich fiel alles aus.', turkishWord: 'sonuç olarak', turkishSentence: 'Elektrik yoktu, sonuç olarak her şey kesildi/dondu.' },
  { id: 107, category: 'bağlaçlar', germanWord: 'ferner', pronunciation: 'fer-nır', germanSentence: 'Ferner möchte ich darauf hinweisen, dass...', turkishWord: 'bundan başka, ayrıca', turkishSentence: 'Ayrıca şuna da işaret etmek isterim ki...' },
  { id: 108, category: 'bağlaçlar', germanWord: 'soweit', pronunciation: 'zo-vayt', germanSentence: 'Soweit ich weiß, kommt sie morgen.', turkishWord: 'kadarıyla', turkishSentence: 'Bildiğim kadarıyla o yarın geliyor.' },
  { id: 109, category: 'bağlaçlar', germanWord: 'womöglich', pronunciation: 'vo-möö-glih', germanSentence: 'Womöglich haben sie den Zug verpasst.', turkishWord: 'ihtimal, belki de', turkishSentence: 'İhtimal o ki treni kaçırdılar.' },
  { id: 110, category: 'bağlaçlar', germanWord: 'indem', pronunciation: 'in-deym', germanSentence: 'Man lernt, indem man übt.', turkishWord: '-erek, -arak', turkishSentence: 'İnsan pratik yaparak (yapmak suretiyle) öğrenir.' }
];

export default data2;
