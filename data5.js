const data5 = [
    // --- İsimler ---
    { id: 206, category: 'isimler', germanWord: 'der Zusammenbruch', pronunciation: 'der tsu-za-mın-bruh', germanSentence: 'Der wirtschaftliche Zusammenbruch hatte fatale Folgen.', turkishWord: 'çöküş', turkishSentence: 'Ekonomik çöküşün ölümcül sonuçları oldu.' },
    { id: 207, category: 'isimler', germanWord: 'die Anspielung /-en', pronunciation: 'di an-şpi-lung', germanSentence: 'Ich habe deine Anspielung genau verstanden.', turkishWord: 'ima, gönderme', turkishSentence: 'İmanı (göndermeni) tam olarak anladım.' },
    { id: 208, category: 'isimler', germanWord: 'der Widerspruch /"e', pronunciation: 'der vi-dır-şpruh', germanSentence: 'Das steht in krassem Widerspruch zu deinen Taten.', turkishWord: 'çelişki, itiraz', turkishSentence: 'Bu, eylemlerinle tam bir çelişki oluşturuyor.' },
    { id: 209, category: 'isimler', germanWord: 'das Zugeständnis /-se', pronunciation: 'das tsu-ge-ştent-nis', germanSentence: 'Wir mussten einige Zugeständnisse machen.', turkishWord: 'ödün, taviz', turkishSentence: 'Bazı tavizler vermek zorunda kaldık.' },
    { id: 210, category: 'isimler', germanWord: 'die Zumutung /-en', pronunciation: 'di tsu-mu-tung', germanSentence: 'Dieses Verhalten ist eine absolute Zumutung.', turkishWord: 'küstahlık, haksız talep', turkishSentence: 'Bu davranış tam bir haksız taleptir (küstahlıktır).' },
    
    // --- Fiiller ---
    { id: 211, category: 'fiiller', germanWord: 'eindämmen', pronunciation: 'ayn-de-mın', germanSentence: 'Wir müssen diese Krise rechtzeitig eindämmen.', turkishWord: 'sınırlandırmak, önünü almak', turkishSentence: 'Bu krizi zamanında sınırlandırmalıyız(önünü almalıyız).' },
    { id: 212, category: 'fiiller', germanWord: 'entlarven', pronunciation: 'ent-lar-fın', germanSentence: 'Der Betrüger wurde schließlich entlarvt.', turkishWord: 'maskesini düşürmek, açığa çıkarmak', turkishSentence: 'Dolandırıcının maskesi sonunda düşürüldü.' },
    { id: 213, category: 'fiiller', germanWord: 'revanchieren (sich)', pronunciation: 're-van-şi-rın', germanSentence: 'Ich möchte mich für deine Hilfe revanchieren.', turkishWord: 'karşılığını vermek, ödeşmek', turkishSentence: 'Yardımının karşılığını vermek (ödeşmek) istiyorum.' },
    { id: 214, category: 'fiiller', germanWord: 'sträuben (sich)', pronunciation: 'ştroy-bın', germanSentence: 'Er sträubt sich gegen jede Veränderung.', turkishWord: 'direnmek, karşı çıkmak', turkishSentence: 'O her değişikliğe karşı direniyor.' },
    { id: 215, category: 'fiiller', germanWord: 'verweilen', pronunciation: 'fer-vay-lın', germanSentence: 'Lass uns noch ein wenig hier verweilen.', turkishWord: 'duraklamak, kalmak', turkishSentence: 'Hadi biraz daha burada kalalım(duraklayalım).' },

    // --- Sıfatlar ---
    { id: 216, category: 'sıfatlar', germanWord: 'einleuchtend', pronunciation: 'ayn-loyh-tınt', germanSentence: 'Deine Erklärung ist sehr einleuchtend.', turkishWord: 'açık, anlaşılır, mantıklı', turkishSentence: 'Açıklaman çok mantıklı(akla yatkın).' },
    { id: 217, category: 'sıfatlar', germanWord: 'gelegentlich', pronunciation: 'ge-ley-gınt-lih', germanSentence: 'Ich trinke nur gelegentlich Alkohol.', turkishWord: 'ara sıra, fırsat buldukça', turkishSentence: 'Sadece ara sıra alkol alırım.' },
    { id: 218, category: 'sıfatlar', germanWord: 'absehbar', pronunciation: 'ap-zey-baar', germanSentence: 'Das Ende des Projekts ist in absehbarer Zeit.', turkishWord: 'öngörülebilir, yakın (zaman)', turkishSentence: 'Projenin sonu öngörülebilir bir zamanda.' },
    { id: 219, category: 'sıfatlar', germanWord: 'heikel', pronunciation: 'hay-kıl', germanSentence: 'Das ist ein sehr heikles Thema.', turkishWord: 'hassas, nazik, çetrefilli (konu)', turkishSentence: 'Bu çok çetrefilli (hassas) bir konu.' },
    { id: 220, category: 'sıfatlar', germanWord: 'schleierhaft', pronunciation: 'şlay-ır-haft', germanSentence: 'Ihre Motive sind mir völlig schleierhaft.', turkishWord: 'meçhul, anlaşılmaz', turkishSentence: 'Onun niyetleri bana tamamen meçhul/anlaşılmaz.' },

    // --- Bağlaçlar / Zarflar ---
    { id: 221, category: 'bağlaçlar', germanWord: 'allenfalls', pronunciation: 'a-lın-fals', germanSentence: 'Das reicht allenfalls für eine Person.', turkishWord: 'olsa olsa, en fazla', turkishSentence: 'Bu olsa olsa bir kişiye yeter.' },
    { id: 222, category: 'bağlaçlar', germanWord: 'gewissermaßen', pronunciation: 'ge-vi-sır-ma-sın', germanSentence: 'Das ist gewissermaßen unser Geheimnis.', turkishWord: 'bir bakıma, adeta', turkishSentence: 'Bu bir bakıma bizim sırrımız.' },
    { id: 223, category: 'bağlaçlar', germanWord: 'gleichwohl', pronunciation: 'glayh-vool', germanSentence: 'Es ist gefährlich, gleichwohl reizt es mich.', turkishWord: 'bununla birlikte, yine de', turkishSentence: 'Bu tehlikeli, bununla birlikte beni cezbediyor.' },
    { id: 224, category: 'bağlaçlar', germanWord: 'mangels', pronunciation: 'man-gıls', germanSentence: 'Mangels Beweisen wurde er freigesprochen.', turkishWord: 'eksikliğinden (dolayı)', turkishSentence: 'Kanıt eksikliğinden (dolayı) beraat etti.' },
    { id: 225, category: 'bağlaçlar', germanWord: 'schlechthin', pronunciation: 'şleht-hin', germanSentence: 'Sie ist die Expertin schlechthin.', turkishWord: 'ta kendisi, kelimenin tam anlamıyla', turkishSentence: 'O, (kelimenin tam anlamıyla) uzman birisidir.' }
];

export default data5;
