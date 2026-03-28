// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN PANEL TRANSLATIONS  —  English / Korean
//  Add more languages by adding a new key to TRANSLATIONS and a flag button
//  in admin.html. All UI strings live here; input field contents are never
//  translated (they belong to the business owner's content).
// ─────────────────────────────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    // ── Login ────────────────────────────────────────────────────────────────
    loginSub:            'Admin Login — Website Editor',
    loginEmailLabel:     'Email Address',
    loginPasswordLabel:  'Password',
    loginBtn:            'Sign In',
    signingIn:           'Signing in…',
    missingCredentials:  'Please enter your email and password.',
    wrongCredentials:    'Wrong email or password. Please try again.',
    emailNotConfirmed:   'Please confirm your email address first.',
    signInFailed:        'Could not sign in. Please try again.',

    // ── Sidebar ──────────────────────────────────────────────────────────────
    brandSub:            'Website Editor',
    navAnnouncement:     'Announcement Bar',
    navHero:             'Homepage Banner',
    navServices:         'Our Services',
    navPricing:          'Price List',
    navContact:          'Contact Info',
    navFooter:           'Page Footer',
    navLeads:            'New Leads',
    navGallery:          'Gallery Photos',
    signOut:             'Sign Out',

    // ── Topbar ───────────────────────────────────────────────────────────────
    viewLive:            '👁 View Live Site →',

    // ── Section titles + hints (shown in topbar when section is active) ──────
    titleAnnouncement:   'Announcement Bar',
    hintAnnouncement:    'The banner at the very top of your website',
    titleHero:           'Homepage Banner',
    hintHero:            'Edit the headline and description visitors see first',
    titleServices:       'Our Services',
    hintServices:        'Edit service card titles, descriptions, and photos',
    titlePricing:        'Price List',
    hintPricing:         'Add, edit, or remove items from your pricing tables',
    titleContact:        'Contact Information',
    hintContact:         'Update your phone, email, address, and hours',
    titleFooter:         'Page Footer',
    hintFooter:          'Edit the text at the very bottom of your website',
    titleLeads:          'New Leads — Sign-Ups',
    hintLeads:           'People who filled out your sign-up form',
    titleGallery:        'Gallery Photos',
    hintGallery:         'Upload and remove photos shown in the "Our Work" section',

    // ── Announcement section ─────────────────────────────────────────────────
    annH3:               '📢 Announcement Bar',
    annDesc:             'This banner appears at the very top of your website. Use it for promotions, notices, or any timely message. Turn it off with the toggle below.',
    annShowToggleLabel:  'Show Announcement Bar',
    annShowToggleHint:   "Turn this off when you don't have a current promotion",
    annShowing:          'Showing on website',
    annHidden:           'Hidden from website',
    annTextLabel:        'Announcement Message',
    annTextHint:         'Keep it short — one sentence works best',
    annUrlLabel:         'Banner Link',
    annUrlHint:          'Page visitors go to when they click the banner',

    // ── Hero section ─────────────────────────────────────────────────────────
    heroH3:              '🏠 Homepage Banner',
    heroDesc:            'This is the first thing visitors read when they open your website. Keep the headline short and the description friendly.',
    heroHeadlineLabel:   'Main Headline',
    heroHeadlineHint:    'The big bold text at the top of your page',
    heroSubtextLabel:    'Description',
    heroSubtextHint:     'A sentence or two about your business — who you serve and what makes you different',
    heroPhoneLabel:      'Phone Number (shown on Contact Us button)',
    heroPhoneHint:       'Include the area code, e.g. (555) 123-4567',
    heroEmailLabel:      'Email Address (shown on Contact Us button)',

    // ── Services section ─────────────────────────────────────────────────────
    servicesH3:          '⚙️ Our Services',
    servicesDesc:        'Edit the title, description, and photo for each service card on your website. Use the switch to show or hide a card without deleting it.',
    serviceCardN:        'Service Card',
    replacePhoto:        '📷 Replace Photo',
    uploadingPhoto:      'Uploading photo…',
    cardTitleLabel:      'Card Title',
    cardDescLabel:       'Description',
    showCardLabel:       'Show this card on the website',

    // ── Pricing section ──────────────────────────────────────────────────────
    pricingH3:           '💲 Price List',
    pricingDesc:         'Add, edit, or remove price items from each category.',
    pricingRemove:       'To remove an item: click the ✕ button on the right.',
    pricingAdd:          'To add an item: click "+ Add Item" at the bottom of that category.',
    pricingSave:         'When you\'re done, click Save Changes at the bottom.',
    addCategoryBtn:      '➕ Add a New Price Category',
    addRowBtn:           '+ Add Item to this Category',
    deleteCategoryBtn:   '🗑 Delete Category',
    newCategoryName:     'New Category',
    categoryPlaceholder: 'Category name',
    itemNamePlaceholder: 'Item name',
    itemPricePlaceholder:'$0',
    deleteRowConfirm:    'Remove this price item?',
    deleteCategoryConfirm: 'Delete the entire "{name}" category and all its prices?',

    // ── Contact section ──────────────────────────────────────────────────────
    contactH3:           '📞 Contact Information',
    contactDesc:         'Update your phone number, email, address, and hours. Changes will appear on the Contact section of your website.',
    contactPhoneLabel:   'Phone Number',
    contactEmailLabel:   'Email Address',
    contactAddressLabel: 'Street Address',
    contactAddressHint:  'Press Enter between the street and city/zip',
    contactHoursLabel:   'Business Hours',
    contactHoursHint:    'e.g. Mon–Fri 9am–5pm, or "Please call for current hours"',
    contactIntroLabel:   'Contact Section Description',
    contactIntroHint:    'The paragraph of text above your contact details',

    // ── Footer section ───────────────────────────────────────────────────────
    footerH3:            '📄 Page Footer',
    footerDesc:          'This is the small line of text at the very bottom of your website.',
    footerTextLabel:     'Footer Text',

    // ── Leads section ────────────────────────────────────────────────────────
    leadsH3:             '📋 New Leads — Sign-Ups',
    leadsDesc:           'These are people who filled out the sign-up form on your website. Call or email them to follow up.',
    leadsLoading:        'Loading leads…',
    leadsError:          'Could not load leads. Please try again.',
    leadsEmptyTitle:     'No leads yet.',
    leadsEmptyDesc:      "When someone fills out the sign-up form, they'll appear here.",
    leadsColDate:        'Date',
    leadsColName:        'Name',
    leadsColBusiness:    'Business',
    leadsColPhone:       'Phone',
    leadsColEmail:       'Email',
    leadsColCity:        'City',
    leadsTotal:          '{n} lead total',
    leadsTotalPlural:    '{n} leads total',

    // ── Gallery section ──────────────────────────────────────────────────────
    galleryH3:           '📸 Gallery Photos',
    galleryDesc:         'Add or remove photos that appear in the "Our Work" carousel on your website.',
    galleryDescDelete:   'To delete a photo: hover over it and click the red ✕ button.',
    galleryDescAdd:      'To add photos: click the Upload button below. When done, click Save Changes.',
    galleryClickUpload:  'Click here to upload new photos',
    galleryUploadHint:   'You can select multiple photos at once. JPG or PNG files.',
    galleryUploading:    'Uploading photos, please wait…',
    galleryNoPhotos:     'No photos yet. Upload some above!',
    galleryPhotoRemoved: 'Photo removed. Click Save Changes to publish.',
    galleryDeleteConfirm:'Remove this photo from the gallery?',
    galleryUploaded:     '{n} photo uploaded! Click Save Changes to publish.',
    galleryUploadedPlural:'{n} photos uploaded! Click Save Changes to publish.',
    galleryUploadFailed: '{u} uploaded, {f} failed. Check your internet and try again.',

    // ── Save bar ─────────────────────────────────────────────────────────────
    saveBtn:             '💾 Save Changes',
    saving:              '💾 Saving…',
    loadingContent:      'Loading your content…',
    lastSaved:           'Last saved: ',

    // ── Toast messages ───────────────────────────────────────────────────────
    toastSaved:          'Your changes have been saved! The website will update in a moment.',
    toastSaveError:      'Could not save. Please check your internet connection and try again.',
    toastPhotoUploaded:  'Photo uploaded! Remember to click Save Changes.',
    toastPhotoFailed:    'Photo upload failed. Please try again.',
  },

  ko: {
    // ── Login ────────────────────────────────────────────────────────────────
    loginSub:            '관리자 로그인 — 웹사이트 편집기',
    loginEmailLabel:     '이메일 주소',
    loginPasswordLabel:  '비밀번호',
    loginBtn:            '로그인',
    signingIn:           '로그인 중…',
    missingCredentials:  '이메일과 비밀번호를 입력해 주세요.',
    wrongCredentials:    '이메일 또는 비밀번호가 틀렸습니다. 다시 시도해 주세요.',
    emailNotConfirmed:   '먼저 이메일 주소를 확인해 주세요.',
    signInFailed:        '로그인에 실패했습니다. 다시 시도해 주세요.',

    // ── Sidebar ──────────────────────────────────────────────────────────────
    brandSub:            '웹사이트 편집기',
    navAnnouncement:     '공지 배너',
    navHero:             '홈페이지 배너',
    navServices:         '서비스 목록',
    navPricing:          '가격표',
    navContact:          '연락처',
    navFooter:           '페이지 하단',
    navLeads:            '새 문의',
    navGallery:          '갤러리 사진',
    signOut:             '로그아웃',

    // ── Topbar ───────────────────────────────────────────────────────────────
    viewLive:            '👁 라이브 사이트 보기 →',

    // ── Section titles + hints ───────────────────────────────────────────────
    titleAnnouncement:   '공지 배너',
    hintAnnouncement:    '웹사이트 최상단에 표시되는 배너',
    titleHero:           '홈페이지 배너',
    hintHero:            '방문자가 처음 읽는 헤드라인과 설명을 편집합니다',
    titleServices:       '서비스 목록',
    hintServices:        '서비스 카드의 제목, 설명, 사진을 편집합니다',
    titlePricing:        '가격표',
    hintPricing:         '가격표 항목을 추가, 수정 또는 삭제합니다',
    titleContact:        '연락처 정보',
    hintContact:         '전화번호, 이메일, 주소, 영업시간을 업데이트합니다',
    titleFooter:         '페이지 하단',
    hintFooter:          '웹사이트 최하단 텍스트를 편집합니다',
    titleLeads:          '새 문의 — 신청 목록',
    hintLeads:           '신청 양식을 작성한 고객 목록',
    titleGallery:        '갤러리 사진',
    hintGallery:         '"우리의 작업" 섹션의 사진을 업로드하거나 삭제합니다',

    // ── Announcement section ─────────────────────────────────────────────────
    annH3:               '📢 공지 배너',
    annDesc:             '이 배너는 웹사이트 최상단에 표시됩니다. 프로모션, 공지사항 또는 시의적절한 메시지에 활용하세요. 아래 토글로 끌 수 있습니다.',
    annShowToggleLabel:  '공지 배너 표시',
    annShowToggleHint:   '현재 진행 중인 프로모션이 없을 때 끄세요',
    annShowing:          '웹사이트에 표시 중',
    annHidden:           '웹사이트에서 숨김',
    annTextLabel:        '공지 메시지',
    annTextHint:         '짧게 — 한 문장이 가장 좋습니다',
    annUrlLabel:         '배너 링크',
    annUrlHint:          '배너 클릭 시 이동할 페이지',

    // ── Hero section ─────────────────────────────────────────────────────────
    heroH3:              '🏠 홈페이지 배너',
    heroDesc:            '방문자가 웹사이트를 열었을 때 가장 먼저 읽는 내용입니다. 헤드라인은 짧게, 설명은 친근하게 작성하세요.',
    heroHeadlineLabel:   '메인 헤드라인',
    heroHeadlineHint:    '페이지 상단의 크고 굵은 텍스트',
    heroSubtextLabel:    '설명',
    heroSubtextHint:     '비즈니스 소개 — 누구를 위한 서비스이며 무엇이 다른지 한두 문장으로',
    heroPhoneLabel:      '전화번호 (문의 버튼에 표시)',
    heroPhoneHint:       '지역번호 포함, 예: (555) 123-4567',
    heroEmailLabel:      '이메일 주소 (문의 버튼에 표시)',

    // ── Services section ─────────────────────────────────────────────────────
    servicesH3:          '⚙️ 서비스 목록',
    servicesDesc:        '웹사이트의 각 서비스 카드 제목, 설명, 사진을 편집하세요. 스위치로 카드를 삭제하지 않고 숨기거나 표시할 수 있습니다.',
    serviceCardN:        '서비스 카드',
    replacePhoto:        '📷 사진 교체',
    uploadingPhoto:      '사진 업로드 중…',
    cardTitleLabel:      '카드 제목',
    cardDescLabel:       '설명',
    showCardLabel:       '웹사이트에 이 카드 표시',

    // ── Pricing section ──────────────────────────────────────────────────────
    pricingH3:           '💲 가격표',
    pricingDesc:         '각 카테고리에서 가격 항목을 추가, 수정 또는 삭제하세요.',
    pricingRemove:       '항목 삭제: 오른쪽 ✕ 버튼을 클릭하세요.',
    pricingAdd:          '항목 추가: 카테고리 하단의 "+ 항목 추가"를 클릭하세요.',
    pricingSave:         '완료 후 하단의 변경 사항 저장을 클릭하세요.',
    addCategoryBtn:      '➕ 새 가격 카테고리 추가',
    addRowBtn:           '+ 이 카테고리에 항목 추가',
    deleteCategoryBtn:   '🗑 카테고리 삭제',
    newCategoryName:     '새 카테고리',
    categoryPlaceholder: '카테고리 이름',
    itemNamePlaceholder: '항목 이름',
    itemPricePlaceholder:'가격',
    deleteRowConfirm:    '이 가격 항목을 삭제하시겠습니까?',
    deleteCategoryConfirm: '"{name}" 카테고리와 모든 가격을 삭제하시겠습니까?',

    // ── Contact section ──────────────────────────────────────────────────────
    contactH3:           '📞 연락처 정보',
    contactDesc:         '전화번호, 이메일, 주소, 영업시간을 업데이트하세요. 변경 사항은 웹사이트 연락처 섹션에 반영됩니다.',
    contactPhoneLabel:   '전화번호',
    contactEmailLabel:   '이메일 주소',
    contactAddressLabel: '주소',
    contactAddressHint:  '도로명과 시/우편번호 사이에서 Enter를 누르세요',
    contactHoursLabel:   '영업시간',
    contactHoursHint:    '예: 월–금 오전 9시–오후 5시',
    contactIntroLabel:   '연락처 섹션 설명',
    contactIntroHint:    '연락처 정보 위에 표시되는 문단',

    // ── Footer section ───────────────────────────────────────────────────────
    footerH3:            '📄 페이지 하단',
    footerDesc:          '웹사이트 최하단에 표시되는 작은 텍스트입니다.',
    footerTextLabel:     '하단 텍스트',

    // ── Leads section ────────────────────────────────────────────────────────
    leadsH3:             '📋 새 문의 — 신청 목록',
    leadsDesc:           '웹사이트 신청 양식을 작성한 고객 목록입니다. 전화 또는 이메일로 연락하세요.',
    leadsLoading:        '문의 목록 불러오는 중…',
    leadsError:          '문의 목록을 불러올 수 없습니다. 다시 시도해 주세요.',
    leadsEmptyTitle:     '아직 문의가 없습니다.',
    leadsEmptyDesc:      '신청 양식을 작성한 고객이 여기에 표시됩니다.',
    leadsColDate:        '날짜',
    leadsColName:        '이름',
    leadsColBusiness:    '사업체',
    leadsColPhone:       '전화번호',
    leadsColEmail:       '이메일',
    leadsColCity:        '도시',
    leadsTotal:          '총 {n}건의 문의',
    leadsTotalPlural:    '총 {n}건의 문의',

    // ── Gallery section ──────────────────────────────────────────────────────
    galleryH3:           '📸 갤러리 사진',
    galleryDesc:         '웹사이트 "우리의 작업" 섹션에 표시되는 사진을 추가하거나 삭제하세요.',
    galleryDescDelete:   '사진 삭제: 사진 위에 마우스를 올리고 빨간 ✕ 버튼을 클릭하세요.',
    galleryDescAdd:      '사진 추가: 아래 업로드 버튼을 클릭하세요. 완료 후 변경 사항 저장을 클릭하세요.',
    galleryClickUpload:  '클릭하여 새 사진 업로드',
    galleryUploadHint:   '여러 사진을 한 번에 선택할 수 있습니다. JPG 또는 PNG 파일.',
    galleryUploading:    '사진 업로드 중, 잠시만 기다려 주세요…',
    galleryNoPhotos:     '아직 사진이 없습니다. 위에서 업로드하세요!',
    galleryPhotoRemoved: '사진이 삭제되었습니다. 변경 사항 저장을 클릭해 주세요.',
    galleryDeleteConfirm:'이 사진을 갤러리에서 삭제하시겠습니까?',
    galleryUploaded:     '사진 {n}장이 업로드되었습니다! 변경 사항 저장을 클릭해 주세요.',
    galleryUploadedPlural:'{n}장의 사진이 업로드되었습니다! 변경 사항 저장을 클릭해 주세요.',
    galleryUploadFailed: '{u}장 업로드 완료, {f}장 실패. 인터넷 연결을 확인하고 다시 시도해 주세요.',

    // ── Save bar ─────────────────────────────────────────────────────────────
    saveBtn:             '💾 변경 사항 저장',
    saving:              '💾 저장 중…',
    loadingContent:      '콘텐츠 불러오는 중…',
    lastSaved:           '마지막 저장: ',

    // ── Toast messages ───────────────────────────────────────────────────────
    toastSaved:          '변경 사항이 저장되었습니다! 잠시 후 웹사이트가 업데이트됩니다.',
    toastSaveError:      '저장할 수 없습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.',
    toastPhotoUploaded:  '사진이 업로드되었습니다! 변경 사항 저장을 클릭하는 것을 잊지 마세요.',
    toastPhotoFailed:    '사진 업로드에 실패했습니다. 다시 시도해 주세요.',
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  Public API
// ─────────────────────────────────────────────────────────────────────────────
let _lang = localStorage.getItem('admin-lang') || 'en';

/** Translate a key. Falls back to English, then the key itself. */
export function t(key) {
  return TRANSLATIONS[_lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}

/** Switch language, persist to localStorage, update all data-i18n elements. */
export function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  _lang = lang;
  localStorage.setItem('admin-lang', lang);

  // Update static elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t(el.dataset.i18n);
    if (val) el.textContent = val;
  });

  // Update lang toggle button active state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Dispatch so admin.js can re-render dynamic sections
  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

export function getLang() { return _lang; }
