const data4 = [
    // --- İsimler ---
    { id: 181, category: 'isimler', germanWord: 'der Maßnahme', pronunciation: 'der maas-na-mı', germanSentence: 'Wir müssen sofortige Maßnahmen ergreifen.', turkishWord: 'önlem, tedbir', turkishSentence: 'Derhal önlem almalıyız.' },
    { id: 182, category: 'isimler', germanWord: 'der Nachschub', pronunciation: 'der nah-şuup', germanSentence: 'Wir warten auf den Nachschub an Material.', turkishWord: 'takviye, ikmal, tedarik', turkishSentence: 'Malzeme takviyesi bekliyoruz.' },
    { id: 183, category: 'isimler', germanWord: 'die Qualifikation', pronunciation: 'di kva-li-fi-ka-tsion', germanSentence: 'Seine Qualifikationen sind beeindruckend.', turkishWord: 'nitelik, vasıf', turkishSentence: 'Nitelikleri(vasıfları) etkileyici.' },
    { id: 184, category: 'isimler', germanWord: 'der Ruf', pronunciation: 'der ruuf', germanSentence: 'Das Unternehmen hat einen hervorragenden Ruf.', turkishWord: 'ün, şöhret', turkishSentence: 'Şirketin mükemmel bir ünü var.' },
    { id: 185, category: 'isimler', germanWord: 'die Sanktion /-en', pronunciation: 'di zank-tsi-yon', germanSentence: 'Gegen das Land wurden Sanktionen verhängt.', turkishWord: 'yaptırım', turkishSentence: 'Ülkeye yaptırımlar uygulandı.' },
    { id: 186, category: 'isimler', germanWord: 'das Schicksal /-e', pronunciation: 'das şik-zaal', germanSentence: 'Man kann seinem Schicksal nicht entgehen.', turkishWord: 'kader, alın yazısı', turkishSentence: 'İnsan kaderinden kaçamaz.' },
    { id: 187, category: 'isimler', germanWord: 'die Tendenz /-en', pronunciation: 'di ten-dents', germanSentence: 'Es gibt eine steigende Tendenz.', turkishWord: 'eğilim, meyil', turkishSentence: 'Artan bir eğilim var.' },
    { id: 188, category: 'isimler', germanWord: 'der Umfang /"e', pronunciation: 'der um-fank', germanSentence: 'Der Umfang des Projekts ist riesig.', turkishWord: 'kapsam, hacim', turkishSentence: 'Projenin kapsamı devasa.' },
    { id: 189, category: 'isimler', germanWord: 'das Urteil /-e', pronunciation: 'das ur-tayl', germanSentence: 'Das Gericht hat ein hartes Urteil gefällt.', turkishWord: 'hüküm, yargı, karar', turkishSentence: 'Mahkeme sert bir karar(hüküm) verdi.' },
    { id: 190, category: 'isimler', germanWord: 'die Vorgehensweise', pronunciation: 'di for-gey-ıns-vay-zı', germanSentence: 'Diese Vorgehensweise ist nicht sehr effektiv.', turkishWord: 'hareket tarzı, yol, yöntem', turkishSentence: 'Bu hareket tarzı çok etkili değil.' },

    // --- Fiiller ---
    { id: 191, category: 'fiiller', germanWord: 'abbauen', pronunciation: 'ap-bau-ın', germanSentence: 'Wir müssen Vorurteile abbauen.', turkishWord: 'azaltmak, yıkmak (engel/önyargı)', turkishSentence: 'Önyargıları yıkmalıyız.' },
    { id: 192, category: 'fiiller', germanWord: 'verdrängen', pronunciation: 'fer-dre-ngın', germanSentence: 'Er versucht, die Erinnerung zu verdrängen.', turkishWord: 'bastırmak, itmek (psikolojik)', turkishSentence: 'Hatırayı bastırmaya çalışıyor.' },
    { id: 193, category: 'fiiller', germanWord: 'widerlegen', pronunciation: 'vi-dır-ley-gın', germanSentence: 'Die Theorie wurde längst widerlegt.', turkishWord: 'çürütmek, aksini ispatlamak', turkishSentence: 'Teori çoktan çürütüldü.' },
    { id: 194, category: 'fiiller', germanWord: 'zugestehen', pronunciation: 'tsu-ge-ştey-ın', germanSentence: 'Er musste den Fehler zähneknirschend zugestehen.', turkishWord: 'itiraf etmek, hak tanımak', turkishSentence: 'Hatayı dişlerini gıcırdatarak itiraf etmek zorunda kaldı.' },
    { id: 195, category: 'fiiller', germanWord: 'beschleunigen', pronunciation: 'be-şloy-ni-gın', germanSentence: 'Wir müssen den Prozess beschleunigen.', turkishWord: 'hızlandırmak', turkishSentence: 'Süreci hızlandırmalıyız.' },
    { id: 196, category: 'fiiller', germanWord: 'gewöhnen (sich an)', pronunciation: 'ge-vö-nın', germanSentence: 'Ich muss mich erst an das Klima gewöhnen.', turkishWord: 'alışmak (-e)', turkishSentence: 'Önce iklime alışmam lazım.' },
    { id: 197, category: 'fiiller', germanWord: 'veranschaulichen', pronunciation: 'fer-an-şau-li-hın', germanSentence: 'Diese Grafik veranschaulicht das Problem.', turkishWord: 'somutlaştırmak, örnekle açıklamak', turkishSentence: 'Bu grafik sorunu somutlaştırıyor(göz önüne seriyor).' },
    { id: 198, category: 'fiiller', germanWord: 'prägen', pronunciation: 'prey-gın', germanSentence: 'Diese Erfahrung hat ihn stark geprägt.', turkishWord: 'şekil vermek, etkilemek, damga vurmak', turkishSentence: 'Bu tecrübe ona güçlü bir şekil verdi (damga vurdu).' },
    { id: 199, category: 'fiiller', germanWord: 'überwinden', pronunciation: 'ü-bır-vin-dın', germanSentence: 'Sie hat ihre Angst endlich überwunden.', turkishWord: 'aşmak, üstesinden gelmek', turkishSentence: 'Korkusunu sonunda yendi(aştı).' },
    { id: 200, category: 'fiiller', germanWord: 'verblassen', pronunciation: 'fer-bla-sın', germanSentence: 'Die Erinnerungen beginnen langsam zu verblassen.', turkishWord: 'solmak, etkisini yitirmek', turkishSentence: 'Anılar yavaş yavaş solmaya başlıyor.' },

    // --- Sıfatlar ---
    { id: 201, category: 'sıfatlar', germanWord: 'trügerisch', pronunciation: 'trü-ge-riş', germanSentence: 'Der erste Eindruck kann oft trügerisch sein.', turkishWord: 'aldatıcı, yanıltıcı', turkishSentence: 'İlk izlenim çoğu zaman yanıltıcı olabilir.' },
    { id: 202, category: 'sıfatlar', germanWord: 'verhältnismäßig', pronunciation: 'fer-helt-nis-mey-sik', germanSentence: 'Das Auto war verhältnismäßig billig.', turkishWord: 'nispeten, orantılı olarak', turkishSentence: 'Araba nispeten ucuzdu.' },
    { id: 203, category: 'sıfatlar', germanWord: 'willkürlich', pronunciation: 'vil-kür-lih', germanSentence: 'Die Entscheidung war völlig willkürlich.', turkishWord: 'keyfi, rastgele', turkishSentence: 'Karar tamamen keyfi(rastgele) idi.' },
    { id: 204, category: 'sıfatlar', germanWord: 'zuversichtlich', pronunciation: 'tsu-fer-ziht-lih', germanSentence: 'Ich blicke zuversichtlich in die Zukunft.', turkishWord: 'umutlu, güven dolu', turkishSentence: 'Geleceğe umutla(güvenle) bakıyorum.' },
    { id: 205, category: 'sıfatlar', germanWord: 'zweckmäßig', pronunciation: 'tsvek-mey-sik', germanSentence: 'Ihre Kleidung war einfach und zweckmäßig.', turkishWord: 'amaca uygun, pratik', turkishSentence: 'Kıyafeti basit ve amaca uygundu.' }
];

export default data4;
