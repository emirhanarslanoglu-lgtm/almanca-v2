const data12 = [
    // --- İsimler ---
    { id: 481, category: 'isimler', germanWord: 'der Verdienst /-e', pronunciation: 'der fer-diinst', germanSentence: 'Sein monatlicher Verdienst ist sehr hoch.', turkishWord: 'kazanç, maaş', turkishSentence: 'Onun aylık kazancı (maaşı) çok yüksek.' },
    { id: 482, category: 'isimler', germanWord: 'die Verfassung /-en', pronunciation: 'di fer-fa-sung', germanSentence: 'Die Meinungsfreiheit steht in der Verfassung.', turkishWord: 'anayasa, durum', turkishSentence: 'İfade özgürlüğü anayasada yer almaktadır.' },
    { id: 483, category: 'isimler', germanWord: 'das Vergehen /-', pronunciation: 'das fer-gey-ın', germanSentence: 'Dieses kleine Vergehen wird nicht hart bestraft.', turkishWord: 'suç, kabahat', turkishSentence: 'Bu küçük kabahat sert(ağır) şekilde cezalandırılmaz.' },
    { id: 484, category: 'isimler', germanWord: 'das Vorhaben /-', pronunciation: 'das for-ha-bın', germanSentence: 'Ich unterstütze dein neues Vorhaben.', turkishWord: 'plan, girişim, proje', turkishSentence: 'Yeni girişimini destekliyorum.' },
    { id: 485, category: 'isimler', germanWord: 'der Zweifel /-', pronunciation: 'der tsvay-fıl', germanSentence: 'Es gibt keinen Zweifel an seiner Unschuld.', turkishWord: 'şüphe', turkishSentence: 'Onun masumiyeti konusunda hiçbir şüphe yok.' },

    // --- Fiiller ---
    { id: 486, category: 'fiiller', germanWord: 'verharmlosen', pronunciation: 'fer-harm-loo-zın', germanSentence: 'Wir dürfen die Gefahr nicht verharmlosen.', turkishWord: 'zararsız göstermek, tehlikeyi küçümsemek', turkishSentence: 'Tehlikeyi küçümsememeliyiz (zararsızmış gibi göstermemeliyiz).' },
    { id: 487, category: 'fiiller', germanWord: 'vermitteln', pronunciation: 'fer-mi-tıln', germanSentence: 'Der Lehrer versucht, Begeisterung zu vermitteln.', turkishWord: 'aktarmak, arabuluculuk yapmak', turkishSentence: 'Öğretmen coşku/heyecan aktarmaya çalışıyor.' },
    { id: 488, category: 'fiiller', germanWord: 'versäumen', pronunciation: 'fer-zoy-mın', germanSentence: 'Du hast eine einmalige Gelegenheit versäumt.', turkishWord: 'kaçırtmak, ihmal etmek', turkishSentence: 'Eşsiz bir fırsatı kaçırdın.' },
    { id: 489, category: 'fiiller', germanWord: 'verteidigen (sich)', pronunciation: 'fer-tay-di-gın', germanSentence: 'Er musste sich vor Gericht verteidigen.', turkishWord: 'savunmak', turkishSentence: 'Mahkemede kendini savunmak zorunda kaldı.' },
    { id: 490, category: 'fiiller', germanWord: 'verwehren', pronunciation: 'fer-vey-rın', germanSentence: 'Ihm wurde der Zutritt leider verwehrt.', turkishWord: 'reddetmek, men etmek, engellemek', turkishSentence: 'Maalesef girişi engellendi (reddedildi).' },

    // --- Sıfatlar ---
    { id: 491, category: 'sıfatlar', germanWord: 'initiativ', pronunciation: 'i-ni-tsiya-tiif', germanSentence: 'Sie hat initiativ das Projekt übernommen.', turkishWord: 'girişimci', turkishSentence: 'Projeyi girişken (girişimci) bir şekilde devraldı.' },
    { id: 492, category: 'sıfatlar', germanWord: 'irrational', pronunciation: 'i-ra-tsiyo-naal', germanSentence: 'Die Handlungen sind oft irrational.', turkishWord: 'akıl dışı', turkishSentence: 'Bu eylemler genellikle akıl dışıdır.' },
    { id: 493, category: 'sıfatlar', germanWord: 'korrupt', pronunciation: 'ko-rupt', germanSentence: 'Das alte Regime war stark korrupt.', turkishWord: 'yozlaşmış, rüşvetçi', turkishSentence: 'Eski rejim fazlasıyla yozlaşmıştı.' },
    { id: 494, category: 'sıfatlar', germanWord: 'kreativ', pronunciation: 'kre-a-tiif', germanSentence: 'Die Werbeagentur hatte eine sehr kreative Idee.', turkishWord: 'yaratıcı', turkishSentence: 'Reklam ajansının çok yaratıcı bir fikri vardı.' },
    { id: 495, category: 'sıfatlar', germanWord: 'lukrativ', pronunciation: 'luk-ra-tiif', germanSentence: 'Der Handel mit seltenen Münzen ist sehr lukrativ.', turkishWord: 'kârlı, kazançlı', turkishSentence: 'Nadir madeni paraların ticareti çok kârlıdır.' },

    // --- Bağlaçlar / Zarflar ---
    { id: 496, category: 'bağlaçlar', germanWord: 'vergebens', pronunciation: 'fer-gey-bıns', germanSentence: 'Ich habe stundenlang vergebens auf dich gewartet.', turkishWord: 'boşuna', turkishSentence: 'Saatlerce boşuna seni bekledim.' },
    { id: 497, category: 'bağlaçlar', germanWord: 'vielfach', pronunciation: 'fiil-fah', germanSentence: 'Dieses Modell hat sich vielfach bewährt.', turkishWord: 'birçok kez', turkishSentence: 'Bu model birçok kez (kendini) kanıtladı.' },
    { id: 498, category: 'bağlaçlar', germanWord: 'weitaus', pronunciation: 'vayt-aus', germanSentence: 'Die Situation ist weitaus komplizierter.', turkishWord: 'çok daha (fazla)', turkishSentence: 'Durum çok daha karmaşıktır.' },
    { id: 499, category: 'bağlaçlar', germanWord: 'wiederum', pronunciation: 'vii-dır-um', germanSentence: 'Er log, und sie glaubte ihm wiederum nicht.', turkishWord: 'buna karşılık, tekrar/yine de', turkishSentence: 'Yalan söyledi ve ona yine inanmadı.' },
    { id: 500, category: 'bağlaçlar', germanWord: 'überwiegend', pronunciation: 'ü-bır-vii-gınt', germanSentence: 'Die Reaktionen waren überwiegend positiv.', turkishWord: 'ağırlıklı olarak', turkishSentence: 'Tepkiler ağırlıklı olarak olumluydu.' }
];

export default data12;
