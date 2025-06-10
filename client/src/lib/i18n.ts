import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const en = {
  common: {
    welcomeTo: 'Welcome to the Sanctuary',
    learnMore: 'Learn more',
    contact: 'Contact',
    viewAll: 'View all',
    readMore: 'Read more',
    send: 'Send',
    details: 'Details',
    browse: 'Browse',
    submit: 'Submit',
    required: 'Required',
    close: 'Close',
    back: 'Back',
    seeAll: 'See all'
  },
  navigation: {
    home: 'Home',
    history: 'History',
    architecture: 'Architecture',
    schedule: 'Schedule',
    sacraments: 'Sacraments',
    events: 'Events',
    gallery: 'Gallery',
    contact: 'Contact',
    calendar: 'Calendar'
  },
  home: {
    title: 'Sanctuary of Notre Dame de la Tronchaye',
    subtitle: 'A place of prayer and peace in the heart of Rochefort en Terre',
    viewMassTimes: 'Mass times',
    discoverHistory: 'Discover the history',
    welcome: {
      title: 'Welcome to the Sanctuary',
      paragraph1: 'The Sanctuary of Notre Dame de la Tronchaye welcomes the faithful and visitors in an exceptional setting steeped in history and spirituality.',
      paragraph2: 'As a place of worship and contemplation, our sanctuary is a living witness to the Christian faith in Brittany for centuries. Our community invites you to share in our celebrations and discover this unique religious and architectural heritage.',
      quote: 'A place of encounter and prayer'
    }
  },
  history: {
    title: 'Our History',
    pageHeading: 'History of the Sanctuary',
    pageDescription: 'Discover the rich and spiritual history of the Sanctuary of Notre Dame de la Tronchaye through the centuries.',
    timeline: {
      title: 'Historical Timeline',
      discovery: 'Discovery',
      discoveryText: 'According to tradition, the statue of Notre Dame de la Tronchaye was discovered in the trunk of an oak tree in the 12th century.',
      construction: 'Construction',
      constructionText: 'Building of the first sanctuary around the miraculous statue.',
      revolution: 'French Revolution',
      revolutionText: 'Difficult period during which the sanctuary suffered significant damage.',
      restoration: 'Restoration',
      restorationText: 'Major restoration campaigns that restored the sanctuary to its splendor.',
      coronation: 'Coronation',
      coronationText: 'Solemn coronation of the statue of Notre Dame de la Tronchaye.'
    },
    spiritualSignificance: {
      title: 'Spiritual Significance',
      paragraph1: 'The Sanctuary of Notre Dame de la Tronchaye holds a special place in the hearts of Breton faithful.',
      paragraph2: 'A place of pilgrimage and Marian devotion, it continues to welcome the prayers and hopes of thousands of visitors each year.',
      quote: 'A sanctuary where faith, history and Breton tradition meet'
    },
    origins: {
      title: 'Origins of the sanctuary',
      paragraph1: 'According to tradition, the statue of Notre Dame de la Tronchaye was discovered in the trunk of an oak tree in the 12th century, giving rise to the sanctuary and its name.',
      paragraph2: 'Over the centuries, the sanctuary has experienced prosperous periods and trials, particularly during the French Revolution. Today, it continues to attract pilgrims and visitors from around the world.',
      paragraph3: 'The sanctuary remains at the heart of local spiritual life and is part of the rich religious heritage of Brittany.'
    },
    architecture: {
      title: 'Architecture',
      paragraph1: 'The current building presents a harmonious blend of architectural styles, reflecting the different periods of construction and restoration.',
      choirAndApse: 'The choir and apse date from the 13th century (Gothic style)',
      nave: 'The nave was rebuilt in the 15th century',
      southPorch: 'The south porch is a masterpiece of Breton Renaissance',
      statue: 'The miraculous statue of Our Lady dates from the 12th century',
      restorations: 'Notable Restorations',
      restoration1: 'Major restoration under Napoleon III',
      restoration2: 'Repair of war damage',
      restoration3: 'Restoration of frescoes and stained glass',
      restoration4: 'Structural reinforcement and enhancement'
    }
  },
  schedule: {
    title: 'Schedule',
    subtitle: 'Find the schedule of services, confessions, and adoration times at the Sanctuary of Notre Dame de la Tronchaye.',
    regularMasses: {
      title: 'Regular Masses',
      sunday: 'Sunday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday'
    },
    confessions: {
      title: 'Confessions & Adorations',
      confessionsTitle: 'Confessions',
      confessionsText: 'Confessions are possible after each Mass or by appointment with a priest.',
      adorationsTitle: 'Adorations',
      thursday: 'Thursday',
      thursdayTime: 'After 6:00 PM Mass',
      nightAdoration: 'Night Adoration',
      nightAdorationDay: '(1st and 3rd Friday of the month)',
      nightAdorationTime: '8:00 PM - 11:00 PM',
      rosary: 'Rosary every Saturday',
      rosaryTime: 'After Mass (~9:45 AM)'
    },
    specialEvents: {
      title: 'Special Events',
      date: 'Date',
      event: 'Event',
      time: 'Time',
      noEvents: 'No special events scheduled'
    }
  },
  sacraments: {
    title: 'The Sacraments',
    subtitle: 'Sacraments are perceptible and effective signs of grace, instituted by Christ and entrusted to the Church.',
    baptism: {
      title: 'Baptism',
      description: 'The first of the sacraments, baptism brings us into Christian life and makes us members of the Church.',
      action: 'Make an appointment'
    },
    eucharist: {
      title: 'Eucharist',
      description: 'Source and summit of Christian life, the Eucharist is the celebration in memory of Christ\'s sacrifice.',
      action: 'Mass times'
    },
    confirmation: {
      title: 'Confirmation',
      description: 'Confirmation perfects baptismal grace and gives us a special strength of the Holy Spirit.',
      action: 'Register for preparation'
    },
    reconciliation: {
      title: 'Reconciliation',
      description: 'Also called Confession, this sacrament reconciles us with God and the Church when we have sinned.',
      action: 'Confession times'
    },
    marriage: {
      title: 'Marriage',
      description: 'The matrimonial covenant, by which a man and a woman establish a partnership of life.',
      action: 'Prepare your marriage'
    },
    anointing: {
      title: 'Anointing of the Sick',
      description: 'This sacrament brings spiritual strength and comfort to those who are seriously ill or weakened by old age.',
      action: 'More information'
    }
  },
  events: {
    title: 'Events',
    subtitle: 'Discover upcoming events at the Sanctuary of Notre Dame de la Tronchaye.',
    viewAll: 'View all events',
    date: 'Date',
    time: 'Time',
    relatedEvents: 'Related Events',
    interestedInEvent: 'Interested in this event?'
  },
  gallery: {
    title: 'Photo Gallery',
    pageHeading: 'Photo Gallery',
    pageDescription: 'Discover the sanctuary through our collection of photographs.',
    subtitle: 'Discover the sanctuary through our collection of photographs.',
    viewAll: 'View all photos',
    uploadSection: {
      title: 'Add Photos',
      subtitle: 'Section reserved for site administrators to add new photos to the gallery.',
      dragAndDrop: 'Drag and drop your images here or click to select them',
      browse: 'Browse'
    }
  },
  contact: {
    title: 'Contact',
    subtitle: 'For any information or request regarding the sanctuary, please do not hesitate to contact us.',
    contactInfo: {
      title: 'Contact Information',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      openingHours: 'Opening Hours',
      mondayToSaturday: 'Monday - Saturday',
      sunday: 'Sunday'
    },
    form: {
      title: 'Contact Form',
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      consent: 'I agree that my data will be used to process my request',
      send: 'Send',
      subjectOptions: {
        information: 'Information request',
        baptism: 'Baptism preparation',
        marriage: 'Marriage preparation',
        mass: 'Mass request',
        visit: 'Organizing a visit',
        other: 'Other'
      }
    }
  },
  calendar: {
    title: 'Event Calendar',
    subtitle: 'Check our calendar to not miss any event at the sanctuary.',
    legend: {
      title: 'Legend',
      sundayMass: 'Sunday Mass',
      religiousFeast: 'Religious Feast',
      nightAdoration: 'Night Adoration'
    },
    noEventsForDate: 'No events scheduled for this date',
    upcomingEvents: 'Upcoming Events',
    eventManagement: {
      title: 'Event Management',
      subtitle: 'Section reserved for administrators to add or modify events.',
      addEvent: 'Add an event'
    },
    days: {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun'
    }
  },
  footer: {
    quickLinks: 'Quick Links',
    information: 'Information',
    newsletter: {
      title: 'Newsletter',
      subtitle: 'Subscribe to receive our news and events.',
      placeholder: 'Your email',
      subscribe: 'Subscribe'
    },
    rights: '© 2023 Sanctuary of Notre Dame de la Tronchaye. All rights reserved.',
    termsAndPolicy: {
      legalNotice: 'Legal Notice',
      privacyPolicy: 'Privacy Policy',
      siteMap: 'Site Map'
    }
  }
};

// German translations
const de = {
  common: {
    welcomeTo: 'Willkommen im Heiligtum',
    learnMore: 'Mehr erfahren',
    contact: 'Kontakt',
    viewAll: 'Alle anzeigen',
    readMore: 'Weiterlesen',
    send: 'Senden',
    details: 'Details',
    browse: 'Durchsuchen',
    submit: 'Absenden',
    required: 'Erforderlich',
    close: 'Schließen',
    back: 'Zurück',
    seeAll: 'Alle sehen'
  },
  navigation: {
    home: 'Startseite',
    history: 'Geschichte',
    architecture: 'Architektur',
    schedule: 'Zeitplan',
    sacraments: 'Sakramente',
    events: 'Veranstaltungen',
    gallery: 'Galerie',
    contact: 'Kontakt',
    calendar: 'Kalender'
  },
  home: {
    title: 'Heiligtum Notre Dame de la Tronchaye',
    subtitle: 'Ein Ort des Gebets und des Friedens im Herzen von Rochefort en Terre',
    viewMassTimes: 'Messzeiten',
    discoverHistory: 'Geschichte entdecken',
    welcome: {
      title: 'Willkommen im Heiligtum',
      paragraph1: 'Das Heiligtum Notre Dame de la Tronchaye empfängt Gläubige und Besucher in einer außergewöhnlichen Umgebung voller Geschichte und Spiritualität.',
      paragraph2: 'Als Ort der Anbetung und Besinnung ist unser Heiligtum ein lebendiges Zeugnis des christlichen Glaubens in der Bretagne seit Jahrhunderten. Unsere Gemeinschaft lädt Sie ein, an unseren Feiern teilzunehmen und dieses einzigartige religiöse und architektonische Erbe zu entdecken.',
      quote: 'Ein Ort der Begegnung und des Gebets'
    }
  },
  history: {
    title: 'Unsere Geschichte',
    pageHeading: 'Geschichte des Heiligtums',
    pageDescription: 'Entdecken Sie die reiche und spirituelle Geschichte des Heiligtums Notre Dame de la Tronchaye durch die Jahrhunderte.',
    timeline: {
      title: 'Historische Zeitleiste',
      discovery: 'Entdeckung',
      discoveryText: 'Der Überlieferung nach wurde die Statue von Notre Dame de la Tronchaye im 12. Jahrhundert im Stamm einer Eiche entdeckt.',
      construction: 'Bau',
      constructionText: 'Errichtung des ersten Heiligtums um die wundertätige Statue.',
      revolution: 'Französische Revolution',
      revolutionText: 'Schwierige Zeit, in der das Heiligtum erhebliche Schäden erlitt.',
      restoration: 'Restaurierung',
      restorationText: 'Große Restaurierungskampagnen, die dem Heiligtum seine Pracht zurückgaben.',
      coronation: 'Krönung',
      coronationText: 'Feierliche Krönung der Statue von Notre Dame de la Tronchaye.'
    },
    spiritualSignificance: {
      title: 'Spirituelle Bedeutung',
      paragraph1: 'Das Heiligtum Notre Dame de la Tronchaye nimmt einen besonderen Platz in den Herzen der bretonischen Gläubigen ein.',
      paragraph2: 'Als Ort der Pilgerfahrt und marianischen Verehrung empfängt es weiterhin die Gebete und Hoffnungen von Tausenden von Besuchern jedes Jahr.',
      quote: 'Ein Heiligtum, wo sich Glaube, Geschichte und bretonische Tradition treffen'
    },
    origins: {
      title: 'Ursprünge des Heiligtums',
      paragraph1: 'Der Überlieferung nach wurde die Statue von Notre Dame de la Tronchaye im 12. Jahrhundert im Stamm einer Eiche entdeckt, was dem Heiligtum seinen Namen gab.',
      paragraph2: 'Im Laufe der Jahrhunderte hat das Heiligtum wohlhabende Zeiten und Prüfungen erlebt, insbesondere während der Französischen Revolution. Heute zieht es weiterhin Pilger und Besucher aus aller Welt an.',
      paragraph3: 'Das Heiligtum bleibt im Mittelpunkt des lokalen spirituellen Lebens und ist Teil des reichen religiösen Erbes der Bretagne.'
    },
    architecture: {
      title: 'Architektur',
      paragraph1: 'Das heutige Gebäude präsentiert eine harmonische Mischung architektonischer Stile, die die verschiedenen Bau- und Restaurierungsperioden widerspiegeln.',
      choirAndApse: 'Chor und Apsis stammen aus dem 13. Jahrhundert (gotischer Stil)',
      nave: 'Das Kirchenschiff wurde im 15. Jahrhundert wieder aufgebaut',
      southPorch: 'Die südliche Vorhalle ist ein Meisterwerk der bretonischen Renaissance',
      statue: 'Die wundertätige Statue Unserer Lieben Frau stammt aus dem 12. Jahrhundert',
      restorations: 'Bedeutende Restaurierungen',
      restoration1: 'Umfangreiche Restaurierung unter Napoleon III.',
      restoration2: 'Reparatur von Kriegsschäden',
      restoration3: 'Restaurierung von Fresken und Buntglasfenstern',
      restoration4: 'Strukturelle Verstärkung und Aufwertung'
    }
  },
  schedule: {
    title: 'Zeitplan',
    subtitle: 'Finden Sie den Zeitplan für Gottesdienste, Beichten und Anbetungszeiten im Heiligtum Notre Dame de la Tronchaye.',
    regularMasses: {
      title: 'Regelmäßige Messen',
      sunday: 'Sonntag',
      tuesday: 'Dienstag',
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag'
    },
    confessions: {
      title: 'Beichten & Anbetungen',
      confessionsTitle: 'Beichten',
      confessionsText: 'Beichten sind nach jeder Messe oder nach Vereinbarung mit einem Priester möglich.',
      adorationsTitle: 'Anbetungen',
      thursday: 'Donnerstag',
      thursdayTime: 'Nach der 18:00 Uhr Messe',
      nightAdoration: 'Nachtanbetung',
      nightAdorationDay: '(1. und 3. Freitag des Monats)',
      nightAdorationTime: '20:00 - 23:00 Uhr',
      rosary: 'Rosenkranz jeden Samstag',
      rosaryTime: 'Nach der Messe (~9:45 Uhr)'
    },
    specialEvents: {
      title: 'Besondere Veranstaltungen',
      date: 'Datum',
      event: 'Veranstaltung',
      time: 'Zeit',
      noEvents: 'Keine besonderen Veranstaltungen geplant'
    }
  },
  sacraments: {
    title: 'Die Sakramente',
    subtitle: 'Sakramente sind wahrnehmbare und wirksame Zeichen der Gnade, von Christus eingesetzt und der Kirche anvertraut.',
    baptism: {
      title: 'Taufe',
      description: 'Das erste der Sakramente, die Taufe führt uns ins christliche Leben ein und macht uns zu Mitgliedern der Kirche.',
      action: 'Termin vereinbaren'
    },
    eucharist: {
      title: 'Eucharistie',
      description: 'Quelle und Höhepunkt des christlichen Lebens, die Eucharistie ist die Feier im Gedenken an das Opfer Christi.',
      action: 'Messzeiten'
    },
    confirmation: {
      title: 'Firmung',
      description: 'Die Firmung vervollkommnet die Taufgnade und verleiht uns eine besondere Kraft des Heiligen Geistes.',
      action: 'Zur Vorbereitung anmelden'
    },
    reconciliation: {
      title: 'Versöhnung',
      description: 'Auch Beichte genannt, versöhnt uns dieses Sakrament mit Gott und der Kirche, wenn wir gesündigt haben.',
      action: 'Beichtzeiten'
    },
    marriage: {
      title: 'Ehe',
      description: 'Der Ehebund, durch den ein Mann und eine Frau eine Lebensgemeinschaft begründen.',
      action: 'Ihre Hochzeit vorbereiten'
    },
    anointing: {
      title: 'Krankensalbung',
      description: 'Dieses Sakrament bringt geistliche Stärke und Trost für diejenigen, die ernsthaft krank oder durch Alter geschwächt sind.',
      action: 'Weitere Informationen'
    }
  },
  events: {
    title: 'Veranstaltungen',
    subtitle: 'Entdecken Sie kommende Veranstaltungen im Heiligtum Notre Dame de la Tronchaye.',
    viewAll: 'Alle Veranstaltungen anzeigen',
    date: 'Datum',
    time: 'Zeit',
    relatedEvents: 'Ähnliche Veranstaltungen',
    interestedInEvent: 'Interessiert an dieser Veranstaltung?'
  },
  gallery: {
    title: 'Fotogalerie',
    pageHeading: 'Fotogalerie',
    pageDescription: 'Entdecken Sie das Heiligtum durch unsere Fotosammlung.',
    subtitle: 'Entdecken Sie das Heiligtum durch unsere Fotosammlung.',
    viewAll: 'Alle Fotos anzeigen',
    uploadSection: {
      title: 'Fotos hinzufügen',
      subtitle: 'Bereich für Website-Administratoren, um neue Fotos zur Galerie hinzuzufügen.',
      dragAndDrop: 'Ziehen Sie Ihre Bilder hierher oder klicken Sie, um sie auszuwählen',
      browse: 'Durchsuchen'
    }
  },
  contact: {
    title: 'Kontakt',
    subtitle: 'Für Informationen oder Anfragen bezüglich des Heiligtums zögern Sie bitte nicht, uns zu kontaktieren.',
    contactInfo: {
      title: 'Kontaktinformationen',
      address: 'Adresse',
      phone: 'Telefon',
      email: 'E-Mail',
      openingHours: 'Öffnungszeiten',
      mondayToSaturday: 'Montag - Samstag',
      sunday: 'Sonntag'
    },
    form: {
      title: 'Kontaktformular',
      name: 'Name',
      email: 'E-Mail',
      subject: 'Betreff',
      message: 'Nachricht',
      consent: 'Ich bin damit einverstanden, dass meine Daten zur Bearbeitung meiner Anfrage verwendet werden',
      send: 'Senden',
      subjectOptions: {
        information: 'Informationsanfrage',
        baptism: 'Taufvorbereitung',
        marriage: 'Ehevorbereitung',
        mass: 'Messanfrage',
        visit: 'Organisation eines Besuchs',
        other: 'Sonstiges'
      }
    }
  },
  calendar: {
    title: 'Veranstaltungskalender',
    subtitle: 'Überprüfen Sie unseren Kalender, um keine Veranstaltung im Heiligtum zu verpassen.',
    legend: {
      title: 'Legende',
      sundayMass: 'Sonntagsmesse',
      religiousFeast: 'Religiöses Fest',
      nightAdoration: 'Nachtanbetung'
    },
    noEventsForDate: 'Keine Veranstaltungen für diesen Tag geplant',
    upcomingEvents: 'Kommende Veranstaltungen',
    eventManagement: {
      title: 'Veranstaltungsverwaltung',
      subtitle: 'Bereich für Administratoren, um Veranstaltungen hinzuzufügen oder zu ändern.',
      addEvent: 'Veranstaltung hinzufügen'
    },
    days: {
      mon: 'Mo',
      tue: 'Di',
      wed: 'Mi',
      thu: 'Do',
      fri: 'Fr',
      sat: 'Sa',
      sun: 'So'
    }
  },
  footer: {
    quickLinks: 'Schnelllinks',
    information: 'Informationen',
    newsletter: {
      title: 'Newsletter',
      subtitle: 'Abonnieren Sie, um unsere Neuigkeiten und Veranstaltungen zu erhalten.',
      placeholder: 'Ihre E-Mail',
      subscribe: 'Abonnieren'
    },
    rights: '© 2023 Heiligtum Notre Dame de la Tronchaye. Alle Rechte vorbehalten.',
    termsAndPolicy: {
      legalNotice: 'Impressum',
      privacyPolicy: 'Datenschutzrichtlinie',
      siteMap: 'Seitenverzeichnis'
    }
  }
};

// French translations
const fr = {
  common: {
    welcomeTo: 'Bienvenue au Sanctuaire',
    learnMore: 'En savoir plus',
    contact: 'Contact',
    viewAll: 'Voir tout',
    readMore: 'Lire plus',
    send: 'Envoyer',
    details: 'Détails',
    browse: 'Parcourir',
    submit: 'Soumettre',
    required: 'Requis',
    close: 'Fermer',
    back: 'Retour',
    seeAll: 'Voir tout'
  },
  navigation: {
    home: 'Accueil',
    history: 'Histoire',
    architecture: 'Architecture',
    schedule: 'Horaires',
    sacraments: 'Sacrements',
    events: 'Événements',
    gallery: 'Galerie',
    contact: 'Contact',
    calendar: 'Calendrier'
  },
  home: {
    title: 'Sanctuaire Notre Dame de la Tronchaye',
    subtitle: 'Un lieu de prière et de paix au cœur de Rochefort en Terre',
    viewMassTimes: 'Horaires des messes',
    discoverHistory: 'Découvrir l\'histoire',
    welcome: {
      title: 'Bienvenue au Sanctuaire',
      paragraph1: 'Le Sanctuaire Notre Dame de la Tronchaye accueille les fidèles et les visiteurs dans un cadre exceptionnel chargé d\'histoire et de spiritualité.',
      paragraph2: 'Lieu de culte et de recueillement, notre sanctuaire est un témoin vivant de la foi chrétienne en Bretagne depuis des siècles. Notre communauté vous invite à partager nos célébrations et à découvrir ce patrimoine religieux et architectural unique.',
      quote: 'Un lieu de rencontre et de prière'
    }
  },
  history: {
    title: 'Notre Histoire',
    pageHeading: 'Histoire du Sanctuaire',
    pageDescription: 'Découvrez l\'histoire riche et spirituelle du Sanctuaire Notre Dame de la Tronchaye à travers les siècles.',
    timeline: {
      title: 'Chronologie historique',
      discovery: 'Découverte',
      discoveryText: 'Selon la tradition, la statue de Notre Dame de la Tronchaye aurait été découverte dans le tronc d\'un chêne au XIIe siècle.',
      construction: 'Construction',
      constructionText: 'Édification du premier sanctuaire autour de la statue miraculeuse.',
      revolution: 'Révolution française',
      revolutionText: 'Période difficile durant laquelle le sanctuaire a subi des dommages importants.',
      restoration: 'Restauration',
      restorationText: 'Grandes campagnes de restauration qui ont redonné au sanctuaire sa splendeur.',
      coronation: 'Couronnement',
      coronationText: 'Couronnement solennel de la statue de Notre Dame de la Tronchaye.'
    },
    spiritualSignificance: {
      title: 'Signification spirituelle',
      paragraph1: 'Le Sanctuaire Notre Dame de la Tronchaye occupe une place particulière dans le cœur des fidèles bretons.',
      paragraph2: 'Lieu de pèlerinage et de dévotion mariale, il continue d\'accueillir les prières et les espérances de milliers de visiteurs chaque année.',
      quote: 'Un sanctuaire où se rencontrent foi, histoire et tradition bretonne'
    },
    origins: {
      title: 'Les origines du sanctuaire',
      paragraph1: 'Selon la tradition, la statue de Notre Dame de la Tronchaye aurait été découverte dans le tronc d\'un chêne au XIIe siècle, donnant ainsi naissance au sanctuaire et à son nom.',
      paragraph2: 'À travers les siècles, le sanctuaire a connu des périodes fastes et des épreuves, notamment pendant la Révolution française. Aujourd\'hui, il continue d\'attirer pèlerins et visiteurs du monde entier.',
      paragraph3: 'Le sanctuaire reste au cœur de la vie spirituelle locale et s\'inscrit dans le riche patrimoine religieux de la Bretagne.'
    },
    architecture: {
      title: 'Architecture',
      paragraph1: 'L\'édifice actuel présente un mélange harmonieux de styles architecturaux, témoins des différentes périodes de construction et de restauration.',
      choirAndApse: 'Le chœur et l\'abside datent du XIIIe siècle (style gothique)',
      nave: 'La nef a été reconstruite au XVe siècle',
      southPorch: 'Le porche sud est un chef-d\'œuvre de la Renaissance bretonne',
      statue: 'La statue miraculeuse de Notre Dame date du XIIe siècle',
      restorations: 'Restaurations notables',
      restoration1: 'Restauration majeure sous Napoléon III',
      restoration2: 'Réparation des dommages de guerre',
      restoration3: 'Restauration des fresques et vitraux',
      restoration4: 'Renforcement structurel et mise en valeur'
    }
  },
  schedule: {
    title: 'Horaires',
    subtitle: 'Retrouvez les horaires des offices, confessions et temps d\'adoration au Sanctuaire Notre Dame de la Tronchaye.',
    regularMasses: {
      title: 'Messes régulières',
      sunday: 'Dimanche',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi'
    },
    confessions: {
      title: 'Confessions & Adorations',
      confessionsTitle: 'Confessions',
      confessionsText: 'Les confessions sont possibles après chaque messe ou sur rendez-vous avec un prêtre.',
      adorationsTitle: 'Adorations',
      thursday: 'Jeudi',
      thursdayTime: 'Après la messe de 18h',
      nightAdoration: 'Adoration nocturne',
      nightAdorationDay: '(1er et 3ème vendredi du mois)',
      nightAdorationTime: '20h00 - 23h00',
      rosary: 'Chapelet tous les samedis',
      rosaryTime: 'Après la messe (~9h45)'
    },
    specialEvents: {
      title: 'Événements spéciaux',
      date: 'Date',
      event: 'Événement',
      time: 'Horaires',
      noEvents: 'Aucun événement spécial programmé'
    }
  },
  sacraments: {
    title: 'Les Sacrements',
    subtitle: 'Les sacrements sont des signes sensibles et efficaces de la grâce, institués par le Christ et confiés à l\'Église.',
    baptism: {
      title: 'Le Baptême',
      description: 'Premier des sacrements, le baptême nous fait entrer dans la vie chrétienne et devient membre de l\'Église.',
      action: 'Prendre rendez-vous'
    },
    eucharist: {
      title: 'L\'Eucharistie',
      description: 'Source et sommet de la vie chrétienne, l\'Eucharistie est la célébration en mémoire du sacrifice du Christ.',
      action: 'Horaires des messes'
    },
    confirmation: {
      title: 'La Confirmation',
      description: 'La confirmation parfait la grâce baptismale et nous donne une force spéciale de l\'Esprit Saint.',
      action: 'S\'inscrire à la préparation'
    },
    reconciliation: {
      title: 'La Réconciliation',
      description: 'Aussi appelé Confession, ce sacrement nous réconcilie avec Dieu et avec l\'Église lorsque nous avons péché.',
      action: 'Horaires des confessions'
    },
    marriage: {
      title: 'Le Mariage',
      description: 'L\'alliance matrimoniale, par laquelle un homme et une femme constituent une communauté de vie.',
      action: 'Préparer votre mariage'
    },
    anointing: {
      title: 'L\'Onction des malades',
      description: 'Ce sacrement apporte force spirituelle et réconfort à ceux qui sont gravement malades ou affaiblis par l\'âge.',
      action: 'Plus d\'informations'
    }
  },
  events: {
    title: 'Événements',
    subtitle: 'Découvrez les événements à venir au Sanctuaire Notre Dame de la Tronchaye.',
    viewAll: 'Voir tous les événements',
    date: 'Date',
    time: 'Heure',
    relatedEvents: 'Événements similaires',
    interestedInEvent: 'Intéressé par cet événement ?'
  },
  gallery: {
    title: 'Galerie Photos',
    pageHeading: 'Galerie Photos',
    pageDescription: 'Découvrez le sanctuaire à travers notre collection de photographies.',
    subtitle: 'Découvrez le sanctuaire à travers notre collection de photographies.',
    viewAll: 'Voir toutes les photos',
    uploadSection: {
      title: 'Ajouter des photos',
      subtitle: 'Section réservée aux administrateurs du site pour l\'ajout de nouvelles photos à la galerie.',
      dragAndDrop: 'Glissez et déposez vos images ici ou cliquez pour les sélectionner',
      browse: 'Parcourir'
    }
  },
  contact: {
    title: 'Contact',
    subtitle: 'Pour toute information ou demande concernant le sanctuaire, n\'hésitez pas à nous contacter.',
    contactInfo: {
      title: 'Informations de contact',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      openingHours: 'Horaires d\'ouverture',
      mondayToSaturday: 'Lundi - Samedi',
      sunday: 'Dimanche'
    },
    form: {
      title: 'Formulaire de contact',
      name: 'Nom',
      email: 'Email',
      subject: 'Sujet',
      message: 'Message',
      consent: 'J\'accepte que mes données soient utilisées pour le traitement de ma demande',
      send: 'Envoyer',
      subjectOptions: {
        information: 'Demande d\'information',
        baptism: 'Préparation au baptême',
        marriage: 'Préparation au mariage',
        mass: 'Demande de messe',
        visit: 'Organisation d\'une visite',
        other: 'Autre'
      }
    }
  },
  calendar: {
    title: 'Calendrier des événements',
    subtitle: 'Consultez notre calendrier pour ne manquer aucun événement au sanctuaire.',
    legend: {
      title: 'Légende',
      sundayMass: 'Messe dominicale',
      religiousFeast: 'Fête religieuse',
      nightAdoration: 'Adoration nocturne'
    },
    noEventsForDate: 'Aucun événement prévu à cette date',
    upcomingEvents: 'Événements à venir',
    eventManagement: {
      title: 'Gestion des événements',
      subtitle: 'Section réservée aux administrateurs pour ajouter ou modifier des événements.',
      addEvent: 'Ajouter un événement'
    },
    days: {
      mon: 'Lu',
      tue: 'Ma',
      wed: 'Me',
      thu: 'Je',
      fri: 'Ve',
      sat: 'Sa',
      sun: 'Di'
    }
  },
  footer: {
    quickLinks: 'Liens rapides',
    information: 'Informations',
    newsletter: {
      title: 'Infolettre',
      subtitle: 'Inscrivez-vous pour recevoir nos actualités et événements.',
      placeholder: 'Votre email',
      subscribe: 'S\'inscrire'
    },
    rights: '© 2023 Sanctuaire Notre Dame de la Tronchaye. Tous droits réservés.',
    termsAndPolicy: {
      legalNotice: 'Mentions légales',
      privacyPolicy: 'Politique de confidentialité',
      siteMap: 'Plan du site'
    }
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
    fr: { translation: fr }
  },
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
