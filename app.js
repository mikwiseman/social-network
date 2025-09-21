const seedProfiles = [
  {
    id: 'p1',
    ownerName: 'Марина Фёдорова',
    dogName: 'Ральф',
    dogBreed: 'Золотистый ретривер',
    dogAge: 4,
    city: 'Санкт-Петербург',
    about:
      'Мы любим долгие прогулки по набережной и плавание в Финском заливе. Ищем компанию для выходных.',
    contacts: '@marina_walks',
  },
  {
    id: 'p2',
    ownerName: 'Илья Ковалев',
    dogName: 'Нора',
    dogBreed: 'Бордер-колли',
    dogAge: 2,
    city: 'Москва',
    about:
      'Нора обожает аджилити и бег. Хотим познакомиться с активными собаками для совместных тренировок.',
    contacts: '@kovalev.agility',
  },
  {
    id: 'p3',
    ownerName: 'Света Грин',
    dogName: 'Клёпа',
    dogBreed: 'Джек-рассел-терьер',
    dogAge: 5,
    city: 'Калининград',
    about:
      'Дружелюбная и энергичная Клёпа никогда не откажется от новых друзей. Любим исследовать новые места.',
    contacts: 'tg: @sveta_green',
  },
  {
    id: 'p4',
    ownerName: 'Максим Орлов',
    dogName: 'Дюна',
    dogBreed: 'Самоед',
    dogAge: 3,
    city: 'Новосибирск',
    about:
      'Каждые выходные устраиваем снежные забеги. Будем рады компании для зимних приключений.',
    contacts: '@max_orlov',
  },
  {
    id: 'p5',
    ownerName: 'Динара Каримова',
    dogName: 'Боня',
    dogBreed: 'Французский бульдог',
    dogAge: 6,
    city: 'Казань',
    about:
      'Боня предпочитает спокойные прогулки по центру города и уютные вечера в кафе с собачьими меню.',
    contacts: 'dinara.kaz',
  },
  {
    id: 'p6',
    ownerName: 'Антон Лисицын',
    dogName: 'Вулкан',
    dogBreed: 'Маламут',
    dogAge: 7,
    city: 'Екатеринбург',
    about:
      'Суперобщительный маламут, любит походы и длинные прогулки по лесу. Ищем друзей для выездных поездок.',
    contacts: '@anton_trails',
  },
];

const state = {
  profiles: [...seedProfiles],
  filters: {
    search: '',
    city: '',
  },
};

const refs = {
  cards: document.querySelector('#cards'),
  template: document.querySelector('#card-template'),
  statTotal: document.querySelector('#stat-total'),
  statDogs: document.querySelector('#stat-dogs'),
  search: document.querySelector('#search'),
  cityFilter: document.querySelector('#city-filter'),
  form: document.querySelector('#profile-form'),
};

renderAll();
setupEvents();

function setupEvents() {
  refs.search.addEventListener('input', (event) => {
    state.filters.search = event.target.value.trim().toLowerCase();
    renderAll();
  });

  refs.cityFilter.addEventListener('change', (event) => {
    state.filters.city = event.target.value;
    renderAll();
  });

  refs.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(refs.form);
    const profile = {
      id: generateId(),
      ownerName: sanitize(formData.get('ownerName')),
      dogName: sanitize(formData.get('dogName')),
      dogBreed: sanitize(formData.get('dogBreed')),
      dogAge: parseAge(formData.get('dogAge')),
      city: sanitize(formData.get('city')),
      about: sanitize(formData.get('about')),
      contacts: sanitize(formData.get('contacts')),
    };

    state.profiles = [profile, ...state.profiles];
    refs.form.reset();
    renderAll();
    refs.form.ownerName.focus();
  });
}

function renderAll() {
  const filtered = applyFilters(state.profiles, state.filters);
  renderCards(filtered);
  updateStats();
  updateCityOptions();
}

function applyFilters(profiles, filters) {
  let result = profiles;

  if (filters.search) {
    const query = filters.search;
    result = result.filter((profile) =>
      [profile.ownerName, profile.dogName, profile.dogBreed]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }

  if (filters.city) {
    result = result.filter((profile) => profile.city === filters.city);
  }

  return result;
}

function renderCards(profiles) {
  refs.cards.innerHTML = '';
  const fragment = document.createDocumentFragment();

  profiles.forEach((profile) => {
    const node = refs.template.content.firstElementChild.cloneNode(true);
    const avatar = node.querySelector('.card__avatar');
    const title = node.querySelector('.card__title');
    const city = node.querySelector('.card__city');
    const dog = node.querySelector('.card__dog');
    const about = node.querySelector('.card__about');
    const contacts = node.querySelector('.card__contacts');

    avatar.textContent = initials(profile.ownerName);
    title.textContent = profile.ownerName;
    city.textContent = profile.city || 'Город не указан';
    dog.textContent = buildDogLine(profile);
    about.textContent = profile.about || 'Пока без описания.';
    contacts.textContent = profile.contacts || 'Контакты появятся позже.';

    fragment.appendChild(node);
  });

  if (!profiles.length) {
    const emptyState = document.createElement('li');
    emptyState.className = 'card card--empty';
    emptyState.innerHTML = `
      <div class="card__content">
        <h3 class="card__title">Пока пусто</h3>
        <p class="card__about">
          Измените фильтры или добавьте новую карточку через форму слева.
        </p>
      </div>
    `;
    fragment.appendChild(emptyState);
  }

  refs.cards.appendChild(fragment);
}

function buildDogLine(profile) {
  const parts = [profile.dogName];
  if (profile.dogBreed) {
    parts.push(`· ${profile.dogBreed}`);
  }

  if (Number.isFinite(profile.dogAge)) {
    const age = profile.dogAge;
    const mod10 = age % 10;
    const mod100 = age % 100;
    let ageLabel = 'лет';
    if (mod10 === 1 && mod100 !== 11) {
      ageLabel = 'год';
    } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      ageLabel = 'года';
    }
    parts.push(`· ${age} ${ageLabel}`);
  }

  return parts.filter(Boolean).join(' ');
}

function updateStats() {
  const totalPeople = state.profiles.length;
  const totalDogs = state.profiles.length; // одна собака на карточку
  refs.statTotal.textContent = pluralize(totalPeople, 'участник', 'участника', 'участников');
  refs.statDogs.textContent = pluralize(totalDogs, 'собака', 'собаки', 'собак');
}

function updateCityOptions() {
  const currentValue = state.filters.city;
  const uniqueCities = Array.from(
    new Set(state.profiles.map((profile) => profile.city).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, 'ru'));

  const select = refs.cityFilter;
  select.innerHTML = '';

  const baseOption = document.createElement('option');
  baseOption.value = '';
  baseOption.textContent = 'Все города';
  select.append(baseOption);

  uniqueCities.forEach((city) => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    select.append(option);
  });

  select.value = uniqueCities.includes(currentValue) ? currentValue : '';
}

function initials(name = '') {
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

function parseAge(value) {
  if (!value) return undefined;
  const age = Number(value);
  return Number.isFinite(age) ? age : undefined;
}

function sanitize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function generateId() {
  if (window.crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return `profile-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function pluralize(value, formOne, formTwo, formFive) {
  const mod10 = value % 10;
  const mod100 = value % 100;

  let form = formFive;
  if (mod10 === 1 && mod100 !== 11) {
    form = formOne;
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    form = formTwo;
  }

  return `${value} ${form}`;
}
