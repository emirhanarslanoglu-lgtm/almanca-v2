const data8 = [
    // --- İsimler ---
    { id: 331, category: 'isimler', germanWord: 'der Akzent /-e', pronunciation: 'der ak-tsent', germanSentence: 'Sie spricht Deutsch mit einem charmanten Akzent.', turkishWord: 'aksan, vurgu', turkishSentence: 'Almancayı çekici bir aksanla konuşuyor.' },
    { id: 332, category: 'isimler', germanWord: 'die Anleitung /-en', pronunciation: 'di an-lay-tung', germanSentence: 'Lies die Anleitung sorgfältig durch.', turkishWord: 'kılavuz, talimat', turkishSentence: 'Kılavuzu (talimatı) dikkatlice oku.' },
    { id: 333, category: 'isimler', germanWord: 'das Asyl', pronunciation: 'das a-züül', germanSentence: 'Sie hat politisches Asyl beantragt.', turkishWord: 'sığınma, iltica', turkishSentence: 'Siyasi sığınma talebinde bulundu.' },
    { id: 334, category: 'isimler', germanWord: 'das Attentat /-e', pronunciation: 'das a-tın-taat', germanSentence: 'Das Attentat auf den Präsidenten schlug fehl.', turkishWord: 'suikast', turkishSentence: 'Başkan\'a yönelik suikast başarısız oldu.' },
    { id: 335, category: 'isimler', germanWord: 'der Aufbau', pronunciation: 'der auf-bau', germanSentence: 'Der Aufbau der Maschine dauert zwei Stunden.', turkishWord: 'kurulum, inşa, yapı', turkishSentence: 'Makinenin kurulumu iki saat sürüyor.' },
    { id: 336, category: 'isimler', germanWord: 'die Ausstattung /-en', pronunciation: 'di aus-şta-tung', germanSentence: 'Das Hotel hat eine luxuriöse Ausstattung.', turkishWord: 'donanım, teçhizat', turkishSentence: 'Otelin lüks bir donanımı var.' },
    { id: 337, category: 'isimler', germanWord: 'der Bedarf', pronunciation: 'der be-darf', germanSentence: 'Bei Bedarf können Sie sich an mich wenden.', turkishWord: 'gerek, ihtiyaç', turkishSentence: 'İhtiyaç halinde bana başvurabilirsiniz.' },
    { id: 338, category: 'isimler', germanWord: 'die Befragung /-en', pronunciation: 'di be-fra-gung', germanSentence: 'Die polizeiliche Befragung dauerte Stunden.', turkishWord: 'sorgulama, anket, ifade alma', turkishSentence: 'Polis sorgulaması saatler sürdü.' },
    { id: 339, category: 'isimler', germanWord: 'der Bestand', pronunciation: 'der be-ştant', germanSentence: 'Der Bestand an seltenen Tieren geht zurück.', turkishWord: 'mevcut (miktar), varlık', turkishSentence: 'Nadir hayvanların mevcudu(varlığı) azalıyor.' },
    { id: 340, category: 'isimler', germanWord: 'der Betrug', pronunciation: 'der be-truuk', germanSentence: 'Ihm wird finanzieller Betrug vorgeworfen.', turkishWord: 'dolandırıcılık, hile', turkishSentence: 'Mali dolandırıcılıkla suçlanıyor.' },

    // --- Fiiller ---
    { id: 341, category: 'fiiller', germanWord: 'absorbieren', pronunciation: 'ap-zor-bii-rın', germanSentence: 'Dunkle Farben absorbieren das Licht.', turkishWord: 'emmek, içine çekmek', turkishSentence: 'Koyu renkler ışığı emer.' },
    { id: 342, category: 'fiiller', germanWord: 'akklimatisieren (sich)', pronunciation: 'a-kli-ma-ti-zii-rın', germanSentence: 'Er musste sich erst an die Hitze akklimatisieren.', turkishWord: 'iklime alışmak, uyum sağlamak', turkishSentence: 'Önce sıcağa uyum sağlaması gerekti.' },
    { id: 343, category: 'fiiller', germanWord: 'argumentieren', pronunciation: 'ar-gu-men-tii-rın', germanSentence: 'Er argumentierte sehr überzeugend für den Plan.', turkishWord: 'argüman sunmak, tartışmak', turkishSentence: 'Plan için çok ikna edici argümanlar sundu.' },
    { id: 344, category: 'fiiller', germanWord: 'arrangieren', pronunciation: 'a-ran-jii-rın', germanSentence: 'Wer hat dieses Treffen arrangiert?', turkishWord: 'ayarlamak, düzenlemek', turkishSentence: 'Bu toplantıyı kim ayarladı?' },
    { id: 345, category: 'fiiller', germanWord: 'boykottieren', pronunciation: 'boy-ko-tii-rın', germanSentence: 'Die Verbraucher boykottieren die Marke.', turkishWord: 'boykot etmek', turkishSentence: 'Tüketiciler markayı boykot ediyor.' },
    { id: 346, category: 'fiiller', germanWord: 'delegieren', pronunciation: 'de-le-gii-rın', germanSentence: 'Du musst lernen, Aufgaben zu delegieren.', turkishWord: 'devretmek (yetki/görev)', turkishSentence: 'Görevleri devretmeyi öğrenmelisin.' },
    { id: 347, category: 'fiiller', germanWord: 'eskalieren', pronunciation: 'es-ka-lii-rın', germanSentence: 'Die Situation droht zu eskalieren.', turkishWord: 'kızışmak, tırmanmak, çığrından çıkmak', turkishSentence: 'Durum çığrından çıkma(tırmanma) tehlikesi taşıyor.' },
    { id: 348, category: 'fiiller', germanWord: 'faszinieren', pronunciation: 'fas-tsi-nii-rın', germanSentence: 'Diese Kultur hat mich schon immer fasziniert.', turkishWord: 'büyülemek', turkishSentence: 'Bu kültür beni her zaman büyülemiştir.' },
    { id: 349, category: 'fiiller', germanWord: 'kooperieren', pronunciation: 'ko-ope-rii-rın', germanSentence: 'Wir kooperieren mit mehreren Unis.', turkishWord: 'işbirliği yapmak', turkishSentence: 'Birçok üniversiteyle işbirliği yapıyoruz.' },
    { id: 350, category: 'fiiller', germanWord: 'manipulieren', pronunciation: 'ma-ni-pu-lii-rın', germanSentence: 'Die Wahlergebnisse wurden manipuliert.', turkishWord: 'manipüle etmek', turkishSentence: 'Seçim sonuçları manipüle edildi.' },

    // --- Sıfatlar ---
    { id: 351, category: 'sıfatlar', germanWord: 'authentisch', pronunciation: 'au-ten-tiş', germanSentence: 'Die Schauspieler wirkten sehr authentisch.', turkishWord: 'otantik, sahici, aslına uygun', turkishSentence: 'Oyuncular oldukça sahici görünüyordu.' },
    { id: 352, category: 'sıfatlar', germanWord: 'lukrativ', pronunciation: 'luk-ra-tiif', germanSentence: 'Er bekam ein lukratives Angebot aus dem Ausland.', turkishWord: 'kazançlı, kârlı', turkishSentence: 'Yurtdışından kazançlı bir teklif aldı.' },
    { id: 353, category: 'sıfatlar', germanWord: 'monoton', pronunciation: 'mo-no-toon', germanSentence: 'Diese Arbeit ist auf Dauer zu monoton.', turkishWord: 'tekdüze, monoton', turkishSentence: 'Bu iş uzun vadede fazla tekdüze (monoton).' },
    { id: 354, category: 'sıfatlar', germanWord: 'optimistisch', pronunciation: 'op-ti-mis-tiş', germanSentence: 'Ich bin optimistisch, dass wir eine Lösung finden.', turkishWord: 'iyimser', turkishSentence: 'Bir çözüm bulacağımız konusunda iyimserim.' },
    { id: 355, category: 'sıfatlar', germanWord: 'pessimistisch', pronunciation: 'pes-i-mis-tiş', germanSentence: 'Er sieht die Dinge immer so pessimistisch.', turkishWord: 'kötümser', turkishSentence: 'O olaylara her zaman çok kötümser bakar.' },
    { id: 356, category: 'sıfatlar', germanWord: 'profitabel', pronunciation: 'pro-fi-taa-bıl', germanSentence: 'Das Unternehmen ist momentan nicht profitabel.', turkishWord: 'kârlı', turkishSentence: 'Şirket şu an kârlı (getirili) değil.' },
    { id: 357, category: 'sıfatlar', germanWord: 'provokant', pronunciation: 'pro-vo-kant', germanSentence: 'Seine Äußerungen waren extrem provokant.', turkishWord: 'kışkırtıcı', turkishSentence: 'Sözleri aşırı derecede kışkırtıcıydı.' },
    { id: 358, category: 'sıfatlar', germanWord: 'radikal', pronunciation: 'ra-di-kaal', germanSentence: 'Sie fordern einen radikalen Wandel.', turkishWord: 'köklü, radikal', turkishSentence: 'Köklü bir değişim talep ediyorlar.' },
    { id: 359, category: 'sıfatlar', germanWord: 'rational', pronunciation: 'ra-tsio-naal', germanSentence: 'Lass uns versuchen, rational zu bleiben.', turkishWord: 'akılcı, mantıklı', turkishSentence: 'Mantıklı (akılcı) kalmaya çalışalım.' },
    { id: 360, category: 'sıfatlar', germanWord: 'skurril', pronunciation: 'sku-riil', germanSentence: 'Er erzählte eine sehr skurrile Geschichte.', turkishWord: 'tuhaf, gülünç, acayip', turkishSentence: 'O çok acayip(gülünç) bir hikaye anlattı.' },

    // --- Bağlaçlar / Zarflar ---
    { id: 361, category: 'bağlaçlar', germanWord: 'zwar', pronunciation: 'tsvaar', germanSentence: 'Das Auto ist zwar alt, aber sehr zuverlässig.', turkishWord: 'gerçi, aslında', turkishSentence: 'Araba gerçi eski, ama çok güvenilirdir.' },
    { id: 362, category: 'bağlaçlar', germanWord: 'hingegen', pronunciation: 'hin-gey-gın', germanSentence: 'Er ist laut, sein Bruder hingegen ist ruhig.', turkishWord: 'buna karşın, oysa', turkishSentence: 'O gürültücüdür, ağabeyi ise buna karşın sakindir.' },
    { id: 363, category: 'bağlaçlar', germanWord: 'folglich', pronunciation: 'folk-lih', germanSentence: 'Ich war krank, folglich blieb ich im Bett.', turkishWord: 'bunun neticesinde', turkishSentence: 'Hastaydım, bunun neticesinde yatakta kaldım.' },
    { id: 364, category: 'bağlaçlar', germanWord: 'gegebenenfalls (ggf.)', pronunciation: 'ge-gey-be-nın-fals', germanSentence: 'Ggf. rufen wir Sie später zurück.', turkishWord: 'icabında, gerekirse', turkishSentence: 'Gerekirse sizi daha sonra tekrar ararız.' },
    { id: 365, category: 'bağlaçlar', germanWord: 'vielmehr', pronunciation: 'fiil-meer', germanSentence: 'Ich war nicht wütend, vielmehr war ich enttäuscht.', turkishWord: 'daha doğrusu', turkishSentence: 'Öfkeli değildim, daha doğrusu hayal kırıklığına uğramıştım.' }
];

export default data8;
