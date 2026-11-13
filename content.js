// All copy, board rows and links for the site, in English and Albanian.
// Change texts here; the page markup only holds the English fallback.
window.SITE = {
  wa: '355685727406',
  waDisplay: '+355 68 57 27 406',
  email: 'joelkaso8@gmail.com',
  links: {
    portfolio: 'https://joelkaso8-cyber.github.io/portfolio/',
    pcremote: 'https://joelkaso8-cyber.github.io/pcremote/',
    kaso: 'https://joelkaso8-cyber.github.io/portfolio/work/kaso-ervehe/index.html',
    github: 'https://github.com/joelkaso8-cyber'
  },

  // The departures board. Columns: service, destination, gate, status.
  // Letters must exist in the flap alphabet in script.js (A–Z, Ç, Ë, 0–9, space, · . - &).
  board: {
    en: [
      { service: 'WEBSITES', to: 'ALBANIA·UK·EU·USA', gate: '1', status: 'TAKING BOOKINGS', live: true, href: '#websites' },
      { service: 'PC REMOTE', to: 'WINDOWS·ANDROID·IOS', gate: '2', status: 'FREE DOWNLOAD', live: true, href: '#pc-remote' },
      { service: 'KASO ERVEHE', to: 'PËRMET', gate: '3', status: 'DEPARTED', live: false, href: '#first' }
    ],
    sq: [
      { service: 'FAQE INTERNETI', to: 'SHQIPËRI·UK·BE·SHBA', gate: '1', status: 'MERR POROSI', live: true, href: '#websites' },
      { service: 'PC REMOTE', to: 'WINDOWS·ANDROID·IOS', gate: '2', status: 'SHKARKIM FALAS', live: true, href: '#pc-remote' },
      { service: 'KASO ERVEHE', to: 'PËRMET', gate: '3', status: 'NISUR', live: false, href: '#first' }
    ]
  },

  t: {
    en: {
      'skip': 'Skip to content',
      'nav.work': 'What I make', 'nav.how': 'How I work', 'nav.contact': 'Contact', 'nav.wa': 'WhatsApp',
      'hero.role': 'Web designer from Albania',
      'hero.lead': 'I design and build fast websites for hotels, restaurants and local businesses, with direct booking, WhatsApp and two languages. I also made PC Remote, a free app that turns your phone into a remote for your PC.',
      'hero.cta': 'Message me on WhatsApp', 'hero.more': 'See what I make',
      'hero.note': 'I reply within a day, in English or Albanian.',
      'board.title': 'Departures', 'board.title2': 'Nisjet', 'board.clock': 'Time in Tirana',
      'board.h.service': 'Service', 'board.h.to': 'To', 'board.h.gate': 'Gate', 'board.h.status': 'Status',
      'work.title': 'What I make',
      'web.title': 'Websites for small businesses',
      'web.text': 'Custom, fast websites for hotels, restaurants and local businesses: a direct booking calendar, WhatsApp, a map and two languages, built for phones first. I do the design, the code and the setup myself, so you talk to one person.',
      'web.price': 'From €400 for my first 10 clients. Usually €800–1,200.',
      'web.link': 'See the websites I have built',
      'web.f1': 'Direct booking', 'web.f2': 'WhatsApp', 'web.f3': 'English + Albanian', 'web.f4': 'No monthly fees',
      'pc.title': 'PC Remote',
      'pc.text': 'A free app I made: control your Windows PC from your phone over home Wi-Fi. Volume, touchpad and keyboard, send photos and files, launch your games, or put the PC to sleep.',
      'pc.platforms': 'Free · Windows PC with Android or iPhone',
      'pc.link': 'Download PC Remote',
      'how.title': 'How I work',
      'how.lead': 'One person from the first message to launch.',
      'how.s1.t': 'Message me', 'how.s1.p': 'Tell me about your business on WhatsApp. I reply within a day.',
      'how.s2.t': 'Design', 'how.s2.p': 'I design the site for phones first, then desktop, in your language and your customers’.',
      'how.s3.t': 'Build and test', 'how.s3.p': 'Booking, WhatsApp, maps and both languages, tested on every screen.',
      'how.s4.t': 'Launch', 'how.s4.p': 'You pay once and the website is 100% yours. Your only ongoing cost is the domain, about €10–15 a year.',
      'first.title': 'First departure: Hotel Kaso Ervehe',
      'first.text': 'My family’s hotel in Përmet was my first real project. Guests book in English or Albanian, find the route on Google Maps, and every booking reaches the hotel on Telegram.',
      'first.link': 'Visit the hotel’s website',
      'first.alt': 'The Hotel Kaso Ervehe website on a desktop screen',
      'contact.title': 'Your boarding pass',
      'contact.from': 'From', 'contact.fromv': 'Your business',
      'contact.to': 'To', 'contact.tov': 'A website that brings bookings',
      'contact.gate': 'Gate', 'contact.gatev': 'WhatsApp',
      'contact.cta': 'Message me on WhatsApp',
      'contact.or': 'Or write to', 'contact.copy': 'Copy email', 'contact.copied': 'Copied',
      'contact.phone': 'WhatsApp and phone',
      'contact.note': 'I reply within a day, in English or Albanian.',
      'stub.role': 'Web designer · Albania → UK, EU & USA',
      'foot.portfolio': 'Portfolio', 'foot.pc': 'PC Remote', 'foot.gh': 'GitHub',
      'dock.cta': 'Message me on WhatsApp',
      'wa.msg': 'Hi Joel, I found your website. I’d like to talk about a website for my business.',
      'alt.kripe': 'Kripë fish taverna demo site', 'alt.balte': 'Baltë Studio pottery demo site', 'alt.ura': 'Ura Coffee Roasters demo site',
      'alt.pc': 'PC Remote on a phone: volume, brightness, media buttons and app shortcuts for a PC called LIVING-ROOM-PC'
    },
    sq: {
      'skip': 'Kalo te përmbajtja',
      'nav.work': 'Çfarë bëj', 'nav.how': 'Si punoj', 'nav.contact': 'Kontakt', 'nav.wa': 'WhatsApp',
      'hero.role': 'Web dizajner nga Shqipëria',
      'hero.lead': 'Dizajnoj dhe ndërtoj faqe interneti të shpejta për hotele, restorante dhe biznese lokale, me rezervim direkt, WhatsApp dhe dy gjuhë. Kam bërë edhe PC Remote, një aplikacion falas që e kthen telefonin në telekomandë për kompjuterin.',
      'hero.cta': 'Më shkruaj në WhatsApp', 'hero.more': 'Shiko çfarë bëj',
      'hero.note': 'Përgjigjem brenda një dite, në shqip ose në anglisht.',
      'board.title': 'Nisjet', 'board.title2': 'Departures', 'board.clock': 'Ora në Tiranë',
      'board.h.service': 'Shërbimi', 'board.h.to': 'Për', 'board.h.gate': 'Porta', 'board.h.status': 'Statusi',
      'work.title': 'Çfarë bëj',
      'web.title': 'Faqe interneti për biznese të vogla',
      'web.text': 'Faqe të shpejta e të personalizuara për hotele, restorante dhe biznese lokale: kalendar rezervimi direkt, WhatsApp, hartë dhe dy gjuhë, të ndërtuara së pari për telefon. Dizajnin, kodin dhe konfigurimin i bëj vetë, kështu që flisni me një person të vetëm.',
      'web.price': 'Nga 400 € për 10 klientët e mi të parë. Zakonisht 800–1.200 €.',
      'web.link': 'Shiko faqet që kam ndërtuar',
      'web.f1': 'Rezervim direkt', 'web.f2': 'WhatsApp', 'web.f3': 'Shqip + anglisht', 'web.f4': 'Pa tarifa mujore',
      'pc.title': 'PC Remote',
      'pc.text': 'Një aplikacion falas që kam bërë: kontrolloni kompjuterin Windows nga telefoni përmes Wi-Fi-t të shtëpisë. Volumi, touchpad dhe tastierë, dërgoni foto e skedarë, hapni lojërat ose vëreni kompjuterin në gjumë.',
      'pc.platforms': 'Falas · Kompjuter Windows me Android ose iPhone',
      'pc.link': 'Shkarko PC Remote',
      'how.title': 'Si punoj',
      'how.lead': 'Një person i vetëm, nga mesazhi i parë deri në publikim.',
      'how.s1.t': 'Më shkruani', 'how.s1.p': 'Më tregoni për biznesin tuaj në WhatsApp. Përgjigjem brenda një dite.',
      'how.s2.t': 'Dizajni', 'how.s2.p': 'E dizajnoj faqen së pari për telefon, pastaj për desktop, në gjuhën tuaj dhe të klientëve tuaj.',
      'how.s3.t': 'Ndërtimi dhe testimi', 'how.s3.p': 'Rezervimi, WhatsApp, hartat dhe të dyja gjuhët, të testuara në çdo ekran.',
      'how.s4.t': 'Publikimi', 'how.s4.p': 'Paguani një herë dhe faqja është 100% e juaja. Kostoja e vetme e vazhdueshme është domeni, rreth 10–15 € në vit.',
      'first.title': 'Nisja e parë: Hotel Kaso Ervehe',
      'first.text': 'Hoteli i familjes sime në Përmet ishte projekti im i parë i vërtetë. Mysafirët rezervojnë në shqip ose në anglisht, gjejnë rrugën në Google Maps, dhe çdo rezervim i vjen hotelit në Telegram.',
      'first.link': 'Vizito faqen e hotelit',
      'first.alt': 'Faqja e Hotel Kaso Ervehe në një ekran desktopi',
      'contact.title': 'Bileta juaj e imbarkimit',
      'contact.from': 'Nga', 'contact.fromv': 'Biznesi juaj',
      'contact.to': 'Për', 'contact.tov': 'Një faqe që sjell rezervime',
      'contact.gate': 'Porta', 'contact.gatev': 'WhatsApp',
      'contact.cta': 'Më shkruaj në WhatsApp',
      'contact.or': 'Ose shkruani te', 'contact.copy': 'Kopjo email-in', 'contact.copied': 'U kopjua',
      'contact.phone': 'WhatsApp dhe telefon',
      'contact.note': 'Përgjigjem brenda një dite, në shqip ose në anglisht.',
      'stub.role': 'Web dizajner · Shqipëri → UK, BE & SHBA',
      'foot.portfolio': 'Portofoli', 'foot.pc': 'PC Remote', 'foot.gh': 'GitHub',
      'dock.cta': 'Më shkruaj në WhatsApp',
      'wa.msg': 'Përshëndetje Joel, gjeta faqen tënde. Dua të flas për një faqe interneti për biznesin tim.',
      'alt.kripe': 'Faqja demo e tavernës Kripë', 'alt.balte': 'Faqja demo e Baltë Studio', 'alt.ura': 'Faqja demo e Ura Coffee Roasters',
      'alt.pc': 'PC Remote në telefon: volumi, ndriçimi, butonat e medias dhe shkurtoret për kompjuterin LIVING-ROOM-PC'
    }
  }
}
