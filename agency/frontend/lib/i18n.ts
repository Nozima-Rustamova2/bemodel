export type Lang = "en" | "ru";

function ruPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export interface Dict {
  nav: {
    models: string;
    newFaces: string;
    academy: string;
    contact: string;
    becomeModel: string;
  };
  footer: {
    tagline: string;
    explore: string;
    aboutLink: string;
    contactHeader: string;
    social: string;
    location: string;
    terms: string;
    staffLogin: string;
    copyright: (year: number) => string;
  };
  stats: {
    height: string;
    bust: string;
    waist: string;
    hips: string;
    shoes: string;
    hair: string;
    eyes: string;
  };
  photoLabels: {
    portrait: string;
    fullLength: string;
    profile: string;
    front: string;
    smile: string;
  };
  home: {
    heroEyebrowDefault: string;
    heroPreDefault: string;
    heroEmDefault: string;
    heroPostDefault: string;
    heroBodyDefault: string;
    newestWork: string;
    editorialStories: string;
    recentShoots: string;
    noStories: string;
    viewAllModels: string;
    theAgency: string;
    manifestoTitleDefault: string;
    manifestoBody1Default: string;
    manifestoBody2Default: (city: string) => string;
    ourStory: string;
    openCall: string;
    thinkYouHaveIt: string;
    becomeModelCta: string;
  };
  about: {
    aboutOf: (name: string) => string;
    headingDefault: string;
    body1Default: (name: string, city: string) => string;
    body2Default: string;
    step1TitleDefault: string;
    step1BodyDefault: string;
    step2TitleDefault: string;
    step2BodyDefault: string;
    step3TitleDefault: string;
    step3BodyDefault: string;
  };
  academy: {
    eyebrow: string;
    headlineDefault: string;
    bodyDefault: string;
    applyToAcademy: string;
    aboutTitleEyebrow: string;
    aboutHeadingDefault: string;
    aboutBody1Default: (name: string) => string;
    aboutBody2Default: string;
    weeks: string;
    sessions: string;
    perCohort: string;
    curriculumEyebrow: string;
    insideLessons: string;
    curriculumComingSoon: string;
    goodToKnow: string;
    questionsAnswered: string;
    stillUnsure: string;
    getInTouch: string;
    faqComingSoon: string;
  };
  contactShared: {
    getInTouchEyebrow: string;
    studio: string;
    studioLocation: string;
    email: string;
    instagram: string;
    received: string;
    backToHome: string;
    fullName: string;
    somethingWrong: string;
  };
  contact: {
    heading: string;
    intro: string;
    joinInstead: string;
    applyLink: string;
    thankYouTitle: string;
    thankYouBody: string;
    messageLabel: string;
    namePlaceholder: string;
    messagePlaceholder: string;
    sending: string;
    sendMessage: string;
  };
  apply: {
    heading: string;
    intro: string;
    thankYouBody: string;
    phone: string;
    cityCountry: string;
    dob: string;
    height: string;
    tellUsAboutYourself: string;
    messagePlaceholder: string;
    submitting: string;
    submitApplication: string;
  };
  roster: {
    eyebrow: (count: number) => string;
    noModelsInCategory: string;
  };
  modelDetail: {
    backToRoster: string;
    bookModel: string;
    portfolio: string;
    noPhotosYet: string;
    polaroidsDigitals: string;
    polaroidNote: string;
  };
  modelCard: {
    noPhoto: string;
    viewPortfolio: string;
    view: string;
  };
  lightbox: {
    close: string;
    previousPhoto: string;
    nextPhoto: string;
  };
}

const en: Dict = {
  nav: {
    models: "Models",
    newFaces: "New Faces",
    academy: "Academy",
    contact: "Contact",
    becomeModel: "Become a Model",
  },
  footer: {
    tagline:
      "A boutique modeling agency representing women and new faces, based in Almaty and placed worldwide.",
    explore: "Explore",
    aboutLink: "About",
    contactHeader: "Contact",
    social: "Social",
    location: "Almaty, Kazakhstan",
    terms: "Terms · Privacy · Model Rights",
    staffLogin: "Staff Login",
    copyright: (year) => `© ${year} bemodel — All rights reserved`,
  },
  stats: {
    height: "Height",
    bust: "Bust",
    waist: "Waist",
    hips: "Hips",
    shoes: "Shoes",
    hair: "Hair",
    eyes: "Eyes",
  },
  photoLabels: {
    portrait: "Portrait",
    fullLength: "Full length",
    profile: "Profile",
    front: "Front",
    smile: "Smile",
  },
  home: {
    heroEyebrowDefault: "Almaty — Worldwide · Est. 2014",
    heroPreDefault: "Faces that",
    heroEmDefault: "define",
    heroPostDefault: "the moment.",
    heroBodyDefault:
      "A boutique agency representing women and new faces across editorial, runway and campaign. Scouted with intention, developed with care.",
    newestWork: "Newest work",
    editorialStories: "Editorial Stories",
    recentShoots: "Recent photoshoots, campaigns & runway",
    noStories: "No stories yet — add some from the admin dashboard.",
    viewAllModels: "View all models →",
    theAgency: "The agency",
    manifestoTitleDefault: "We build careers, not just portfolios.",
    manifestoBody1Default:
      "From first test to global campaign, every face on our board is placed with intention. We work closely with a small roster so no one gets lost in the crowd.",
    manifestoBody2Default: (city) =>
      `Editorial, commercial, runway and digital — represented in ${city} and placed worldwide through our partner network.`,
    ourStory: "Our story →",
    openCall: "Open call",
    thinkYouHaveIt: "Think you have it?",
    becomeModelCta: "Become a Model →",
  },
  about: {
    aboutOf: (name) => `About ${name}`,
    headingDefault: "A small board, a global reach, and a lot of care.",
    body1Default: (name, city) =>
      `We founded ${name} in ${city} with a simple conviction: talent deserves attention, not a spreadsheet. We keep our roster intentionally small so every model is developed personally — from the first digitals to international placement.`,
    body2Default:
      "Today we represent women and new faces working in editorial, campaign, runway and digital, placed across Europe, Asia and the Middle East through a trusted partner network.",
    step1TitleDefault: "Scouting",
    step1BodyDefault:
      "We find faces with something the camera can't invent — and we develop them slowly, properly.",
    step2TitleDefault: "Development",
    step2BodyDefault:
      "Tests, coaching, portfolio and digitals — everything a career needs before the first booking.",
    step3TitleDefault: "Placement",
    step3BodyDefault:
      "Direct clients and partner agencies worldwide, matched to each model's strengths and pace.",
  },
  academy: {
    eyebrow: "bemodel Academy",
    headlineDefault: "Learn the craft before the camera finds you.",
    bodyDefault:
      "An 8-week foundation in runway, posing, styling and the business of modeling — taught by working professionals in Almaty.",
    applyToAcademy: "Apply to the Academy →",
    aboutTitleEyebrow: "About the Academy",
    aboutHeadingDefault: "A real education, not a photoshoot.",
    aboutBody1Default: (name) =>
      `The ${name} Academy takes small groups through everything a new model needs — from the first nervous walk to a confident casting. Every cohort is capped at twelve so each student gets real attention.`,
    aboutBody2Default:
      "Classes are led by our own bookers alongside visiting photographers and stylists, and finish with a full portfolio shoot you keep.",
    weeks: "Weeks",
    sessions: "Sessions",
    perCohort: "Per cohort",
    curriculumEyebrow: "The curriculum",
    insideLessons: "Inside the lessons",
    curriculumComingSoon: "Curriculum coming soon.",
    goodToKnow: "Good to know",
    questionsAnswered: "Questions, answered.",
    stillUnsure: "Still unsure? Send us a note and we'll walk you through it.",
    getInTouch: "Get in touch →",
    faqComingSoon: "FAQs coming soon.",
  },
  contactShared: {
    getInTouchEyebrow: "Get in touch",
    studio: "Studio",
    studioLocation: "Almaty, KZ",
    email: "Email",
    instagram: "Instagram",
    received: "Received",
    backToHome: "Back to home →",
    fullName: "Full name",
    somethingWrong: "Something went wrong. Please try again.",
  },
  contact: {
    heading: "Contact",
    intro:
      "Questions, bookings, press or partnership enquiries — send us a note and we'll get back to you shortly.",
    joinInstead: "Looking to join the roster instead?",
    applyLink: "Apply to become a model →",
    thankYouTitle: "Thank you. We'll be in touch.",
    thankYouBody: "Your message is with our team. We'll reply as soon as we can.",
    messageLabel: "Message",
    namePlaceholder: "Your name",
    messagePlaceholder: "How can we help?",
    sending: "Sending...",
    sendMessage: "Send message →",
  },
  apply: {
    heading: "Become a Model",
    intro:
      "Send us your details and a few unretouched photos — full length, portrait and profile. If there's a fit, we'll be in touch within two weeks.",
    thankYouBody:
      "Your application is with our scouting team. If there's a fit, you'll hear from us within two weeks.",
    phone: "Phone",
    cityCountry: "City / Country",
    dob: "Date of birth",
    height: "Height",
    tellUsAboutYourself: "Tell us about yourself",
    messagePlaceholder: "Experience, availability, anything we should know…",
    submitting: "Submitting...",
    submitApplication: "Submit application →",
  },
  roster: {
    eyebrow: (count) => `Roster · ${count} talents`,
    noModelsInCategory: "No models in this category yet.",
  },
  modelDetail: {
    backToRoster: "← Back to roster",
    bookModel: "Book this model →",
    portfolio: "Portfolio",
    noPhotosYet: "No photos yet.",
    polaroidsDigitals: "Polaroids · Digitals",
    polaroidNote: "Unretouched, natural light — measurements confirmed on the day.",
  },
  modelCard: {
    noPhoto: "No photo",
    viewPortfolio: "View portfolio →",
    view: "View →",
  },
  lightbox: {
    close: "Close",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
  },
};

const ru: Dict = {
  nav: {
    models: "Модели",
    newFaces: "Новые лица",
    academy: "Академия",
    contact: "Контакты",
    becomeModel: "Стать моделью",
  },
  footer: {
    tagline:
      "Бутик-агентство моделей, представляющее женщин и новые лица, базирующееся в Алматы и работающее по всему миру.",
    explore: "Навигация",
    aboutLink: "О нас",
    contactHeader: "Контакты",
    social: "Соцсети",
    location: "Алматы, Казахстан",
    terms: "Условия · Конфиденциальность · Права моделей",
    staffLogin: "Вход для персонала",
    copyright: (year) => `© ${year} bemodel — Все права защищены`,
  },
  stats: {
    height: "Рост",
    bust: "Грудь",
    waist: "Талия",
    hips: "Бёдра",
    shoes: "Обувь",
    hair: "Волосы",
    eyes: "Глаза",
  },
  photoLabels: {
    portrait: "Портрет",
    fullLength: "В полный рост",
    profile: "Профиль",
    front: "Анфас",
    smile: "Улыбка",
  },
  home: {
    heroEyebrowDefault: "Алматы — по всему миру · С 2014 года",
    heroPreDefault: "Лица, которые",
    heroEmDefault: "определяют",
    heroPostDefault: "момент.",
    heroBodyDefault:
      "Бутик-агентство, представляющее женщин и новые лица в editorial-съёмках, на подиуме и в рекламных кампаниях. Ищем таланты осознанно, развиваем — с заботой.",
    newestWork: "Новые работы",
    editorialStories: "Редакционные истории",
    recentShoots: "Последние съёмки, кампании и показы",
    noStories: "Историй пока нет — добавьте их через панель администратора.",
    viewAllModels: "Смотреть всех моделей →",
    theAgency: "Агентство",
    manifestoTitleDefault: "Мы строим карьеры, а не просто портфолио.",
    manifestoBody1Default:
      "От первого тестового кадра до глобальной кампании — каждое лицо в нашем агентстве продвигается осознанно. Мы работаем с небольшим ростером, чтобы никто не терялся в толпе.",
    manifestoBody2Default: (city) =>
      `Editorial, коммерция, подиум и digital — представляем таланты в ${city} и размещаем по всему миру через нашу партнёрскую сеть.`,
    ourStory: "Наша история →",
    openCall: "Открытый кастинг",
    thinkYouHaveIt: "Думаешь, у тебя есть то, что нужно?",
    becomeModelCta: "Стать моделью →",
  },
  about: {
    aboutOf: (name) => `О ${name}`,
    headingDefault: "Небольшая команда, глобальный охват и много заботы.",
    body1Default: (name, city) =>
      `Мы основали ${name} в ${city}, руководствуясь простым убеждением: талант заслуживает внимания, а не строчки в таблице. Мы намеренно держим небольшой ростер, чтобы развивать каждую модель лично — от первых дигиталов до международных контрактов.`,
    body2Default:
      "Сегодня мы представляем женщин и новые лица, работающие в editorial, рекламе, на подиуме и в digital — размещая таланты по Европе, Азии и Ближнему Востоку через проверенную партнёрскую сеть.",
    step1TitleDefault: "Скаутинг",
    step1BodyDefault:
      "Мы находим лица с тем, что невозможно придумать перед камерой, — и развиваем их постепенно и правильно.",
    step2TitleDefault: "Развитие",
    step2BodyDefault:
      "Тестовые съёмки, коучинг, портфолио и дигиталы — всё, что нужно карьере перед первым букингом.",
    step3TitleDefault: "Размещение",
    step3BodyDefault:
      "Прямые клиенты и партнёрские агентства по всему миру — подбираем с учётом сильных сторон и темпа каждой модели.",
  },
  academy: {
    eyebrow: "Академия bemodel",
    headlineDefault: "Освойте мастерство ещё до того, как вас найдёт камера.",
    bodyDefault:
      "8-недельный базовый курс по подиуму, позированию, стилю и бизнесу в модельной индустрии — от практикующих профессионалов в Алматы.",
    applyToAcademy: "Подать заявку в академию →",
    aboutTitleEyebrow: "Об академии",
    aboutHeadingDefault: "Настоящее образование, а не просто фотосессия.",
    aboutBody1Default: (name) =>
      `Академия ${name} проводит небольшие группы через всё, что нужно новой модели, — от первого волнительного прохода до уверенного кастинга. В каждом потоке не более двенадцати человек, чтобы каждому ученику досталось настоящее внимание.`,
    aboutBody2Default:
      "Занятия ведут наши букеры вместе с приглашёнными фотографами и стилистами, а курс завершается полноценной портфолио-съёмкой, которая останется у вас.",
    weeks: "Недель",
    sessions: "Занятий",
    perCohort: "Мест в потоке",
    curriculumEyebrow: "Программа обучения",
    insideLessons: "Что входит в программу",
    curriculumComingSoon: "Программа скоро появится.",
    goodToKnow: "Полезно знать",
    questionsAnswered: "Ответы на вопросы.",
    stillUnsure: "Остались вопросы? Напишите нам, и мы всё объясним.",
    getInTouch: "Связаться с нами →",
    faqComingSoon: "Вопросы скоро появятся.",
  },
  contactShared: {
    getInTouchEyebrow: "Свяжитесь с нами",
    studio: "Студия",
    studioLocation: "Алматы, Казахстан",
    email: "Email",
    instagram: "Instagram",
    received: "Получено",
    backToHome: "На главную →",
    fullName: "Полное имя",
    somethingWrong: "Что-то пошло не так. Попробуйте ещё раз.",
  },
  contact: {
    heading: "Контакты",
    intro:
      "Вопросы, букинг, пресса или предложения о сотрудничестве — напишите нам, и мы ответим в ближайшее время.",
    joinInstead: "Хотите присоединиться к ростеру?",
    applyLink: "Подать заявку на роль модели →",
    thankYouTitle: "Спасибо. Мы свяжемся с вами.",
    thankYouBody: "Ваше сообщение получено нашей командой. Мы ответим как можно скорее.",
    messageLabel: "Сообщение",
    namePlaceholder: "Ваше имя",
    messagePlaceholder: "Чем можем помочь?",
    sending: "Отправка...",
    sendMessage: "Отправить сообщение →",
  },
  apply: {
    heading: "Стать моделью",
    intro:
      "Отправьте нам свои данные и несколько нередактированных фото — в полный рост, портрет и профиль. Если подойдёте, мы свяжемся с вами в течение двух недель.",
    thankYouBody:
      "Ваша заявка передана нашей скаутинговой команде. Если подойдёте, вы услышите от нас в течение двух недель.",
    phone: "Телефон",
    cityCountry: "Город / Страна",
    dob: "Дата рождения",
    height: "Рост",
    tellUsAboutYourself: "Расскажите о себе",
    messagePlaceholder: "Опыт, доступность — всё, что нам стоит знать…",
    submitting: "Отправка...",
    submitApplication: "Отправить заявку →",
  },
  roster: {
    eyebrow: (count) => `Ростер · ${count} ${ruPlural(count, "модель", "модели", "моделей")}`,
    noModelsInCategory: "В этой категории пока нет моделей.",
  },
  modelDetail: {
    backToRoster: "← Назад к ростеру",
    bookModel: "Забронировать эту модель →",
    portfolio: "Портфолио",
    noPhotosYet: "Пока нет фото.",
    polaroidsDigitals: "Полароиды · Дигиталы",
    polaroidNote: "Без ретуши, при естественном свете — параметры подтверждены в день съёмки.",
  },
  modelCard: {
    noPhoto: "Нет фото",
    viewPortfolio: "Смотреть портфолио →",
    view: "Смотреть →",
  },
  lightbox: {
    close: "Закрыть",
    previousPhoto: "Предыдущее фото",
    nextPhoto: "Следующее фото",
  },
};

export const dict: Record<Lang, Dict> = { en, ru };
