
const heroesWrapper = document.querySelector('.heroes');
const loader = document.querySelector('.loader-wrapper');
const btnShowMore = document.querySelector('.show-more');

let numberPage = 0;



const chunkArray = (array, size) => {
	return array.reduce((acc, item, index) => {
		if (index % size === 0) {
			acc.push([item]);
		} else {
			acc[acc.length - 1].push(item);
		}
		return acc;
	}, []);
};

function renderHeroes(object) {

  for (const hero of object) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = hero.name;
    card.onclick = openHeroDetails;

    const html = `
        <img src="${hero.photo}" alt=${hero.name} class="card__img">
        <div class="card__content">
          <h3 class="card__name">${hero.name}</h3>
          <p class="card__realName">${hero.realName}</p>
          <p class="card__films">${hero.movies}</p>
          <p class="card__status">${hero.status}</p>
        </div>
    `;

    card.insertAdjacentHTML('beforeend', html);
    heroesWrapper.insertAdjacentElement('beforeend', card);
  }
}

async function openHeroDetails(e) {
  const id = e.currentTarget.id;
  const data = await fetchData();
  const hero = data.find(hero => hero.name === id);
  console.log(hero);
  renderHero(hero);
}

function renderHero(hero) {
  if (document.querySelector('.container-right')) {
    document.querySelector('.container-right').remove();
  }
  const containerRight = document.createElement('div');
  containerRight.classList.add('container-right');
  document.body.insertAdjacentElement('beforeend', containerRight);

  const btnClose = document.createElement('button');
  btnClose.classList.add('btn-close');
  btnClose.innerHTML = '<img src="./img/cross.svg" alt="Close" width="24">';
  containerRight.insertAdjacentElement('afterbegin', btnClose);

  btnClose.onclick = () => {
    containerRight.remove();
  };

  const html = `
    <div class="hero">

            <div class="hero__title">${hero.name}</div>

            <div class="hero__img">
                <img src=${hero.photo} alt=${hero.name}>
            </div>

            <div class="hero__desc">
                <p class="hero__details">real name: ${hero.realName}</p>
                <p class="hero__details">species: ${hero.species}</p>
                <p class="hero__details">actors: ${hero.actors}</p>
                <p class="hero__details">citizenship: ${hero.citizenship}</p>
                <p class="hero__details">gender: ${hero.gender}</p>
                <p class="hero__text">${hero.movies}</p>
            </div>

        </div>
  `;
  containerRight.insertAdjacentHTML('beforeend',	html)
};





async function fetchData () {

  try {
    const response = await fetch('dbHeroes.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error:', error);
  }
};

async function fetchAndRender(numberPage) {
	const data = await fetchData();
	let pages = chunkArray(data, 8);
	loader.classList.remove('none');
	renderHeroes(pages[numberPage]);
	loader.classList.add('none');
}

fetchAndRender(numberPage);

btnShowMore.addEventListener('click', () => {
  numberPage++;
  if (numberPage == 6) {
    btnShowMore.classList.add('none');
  }
  fetchAndRender(numberPage);

});
