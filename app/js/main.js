'use strict';

window.addEventListener('DOMContentLoaded', () => {
  // Slider
  $(function () {
    $('.slider').slick({
      dots: true,
      arrows: false,
      fade: true,
      autoplay: true,
      autoplaySpeed: 2000,
    });
  });

  // The main part of JS

  const articlesContent = document.querySelector('.articles__content'),
    select = document.querySelector('select'),
    articlesSearch = document.querySelector('.articles__search'),
    datesFrom = document.querySelector('#dates__from'),
    datesTo = document.querySelector('#dates__to');

  function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());
    const dates = [];

    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }
  // С указанного API посты датируются одной датой (те что  я брал), поэтому добавлял рандомные месяцы, чтобы имитировать разные даты
  const getRandomMonth = () => {
    return Math.floor(Math.random() * 100);
  };
  // Проверка дат на совпадение
  const datesAreSame = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
  // Вставка статей
  const insertArticles = (parent, data, i) => {
    parent.innerHTML += `
    <div class='articles__content-item'>
        <p class='articles__content-date'>${new Date(data[i].publishedAt).toLocaleString('ru', {
          day: '2-digit',
          year: 'numeric',
          month: 'long',
        })}</p>
        <a class='articles__content-link' href='#'><h4 class='articles__content-title'>${
          data[i].title
        }</h4></a>
        <p class='articles__content-text'>${data[i].description}</p>
        <a class='articles__content-auther' href="#">${data[i].author}</a>
    </div>`;
  };

  async function getData() {
    try {
      let response = await fetch('https://mocki.io/v1/a5814d24-4e22-49fc-96d1-0e9ae2952afc');
      if (response.ok) {
        let data = await response.json();
        let articles = data.articles;
        for (let i = 0; i < 6; i++) {
          articles[i].publishedAt = new Date(articles[i].publishedAt);
          articles[i].publishedAt.setDate(articles[i].publishedAt.getDate() + getRandomMonth());
          insertArticles(articlesContent, articles, i);
          select.innerHTML += `
          <option class="search-name__item"  value='${articles[i].author.toLowerCase()}'>
            ${articles[i].author}
          </option>`;
        }
        // Selecting author
        select.addEventListener('click', (event) => {
          const value = event.target.value;
          articlesContent.innerHTML = ``;
          for (let i = 0; i < 6; i++) {
            if (value == 'init') {
              insertArticles(articlesContent, articles, i);
            } else if (articles[i].author.toLowerCase() == value) {
              insertArticles(articlesContent, articles, i);
            }
          }
        });

        // Searching articles with the same dates
        datesFrom.addEventListener('change', () => {
          const d1 = new Date(datesFrom.value);
          datesTo.addEventListener('change', () => {
            articlesContent.innerHTML = ``;
            const d2 = new Date(datesTo.value);
            let datesArr = getDatesInRange(d1, d2);
            for (let i = 0; i < datesArr.length - 1; i++) {
              for (let j = 0; j < 6; j++) {
                if (datesAreSame(datesArr[i], articles[j].publishedAt)) {
                  console.log(datesAreSame(datesArr[i], articles[j].publishedAt));
                  insertArticles(articlesContent, articles, j);
                }
              }
            }
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  // Scrolls for sticky elements
  window.addEventListener('scroll', () => {
    if (this.scrollY > 635) {
      articlesSearch.classList.add('stickytop-search');
    } else {
      articlesSearch.classList.remove('stickytop-search');
    }
  });

  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (this.scrollY > 0) {
      header.classList.add('stickytop');
    } else {
      header.classList.remove('stickytop');
    }
  });

  getData();
});
// Добавление картинки телефона и почты при ресайзе контента в браузере
window.addEventListener('resize', () => {
  (contactsTelLink = document.querySelector('.contacts__tel-link')),
    (contactsMailLink = document.querySelector('.contacts__email-link'));
  if (window.innerWidth <= 505) {
    contactsTelLink.innerHTML = `<img src='../images/phone.svg' />`;
    contactsMailLink.innerHTML = `<img src='../images/mail.svg' />`;
  } else {
    contactsTelLink.innerHTML = `8 800 000 00 00`;
    contactsMailLink.innerHTML = `sales@logo.ru`;
  }
});
