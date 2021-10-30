'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

///////////////////////////////////////

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); //gets position of element on page
  console.log(s1coords);
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); //current position from top of the page/left of the page
  //how much you've scrolled up/down and right/left

  //to scroll the oldschool way
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //add smooth scroll
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //modern implementation
  section1.scrollIntoView({ behavior: 'smooth' });
});

//page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//event delegation steps
// 1. add event listener to common parent element
// 2. determine what element originated the event to work out where the event was created.

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //guard clause
  if (!clicked) return;
  //active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //activate content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//passing 'arg' into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//sticky navigation
// const initalCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//bad for performance
//   console.log(window.scrollY);
//   if (window.scrollY > initalCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//intersection observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };
// callback function is  called
// each time that the observed element,
// (target element) is intersecting
// the root (viewport) element at the threshold (10%) that we defined
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// }; //
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stickyNav = function (entries) {
  const [entry] = entries;
  nav.classList.add('sticky');

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//reveal section
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//lazy loading
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

//slider

//temp

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const slider = document.querySelector('.slider');

  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  let curSlide = 0;
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (maxSlide === curSlide + 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();
};
slider();
///////////////////////////////THEORY///////////////////////
///////////////////////////////////////////////////////////

//ways of selecting elements:
/*
const header = document.querySelector('.header'); //returns first element with class name header
const allSections = document.querySelectorAll('.section'); //returns node list of all elements with class name section
document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); //returns HTML collection - if DOM changes, this list automatically changes as well.

document.getElementsByClassName('btn'); //return HTML collection

creating and inserting elements

.insertAdjacentHTML //discussed in the bankist app in the previous section

const message = document.createElement('div'); //creates a dom element. not in the dom yet. created only.
it needs to be manually inserted into the dom.

message is an object that represents a dom element.
message.classList.add('cookie-message'); // adds a new class
message.textContent =
  'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

inserting into dom
header.prepend(message); //adds element as first child of the element (inserted at the top)
header.append(message); //adds element as last child (inserted at the bottom)

the html element can only be inserted once. so first it would be inserted at the top, then moved to the bottom.
to insert it in multiple places, the element needs to be copied.

header.append(message.cloneNode(true));

header.before(message);
inserts message before header element

header.after(message);
inserts message after header element
as sister element not child

deleting elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); // recent method
    previously it was
    message.parentElement.removeChild(message); instead
  });

styles
to set a style
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

to get the style of an element
console.log(getComputedStyle(message).color); //returns the color only
console.log(getComputedStyle(message)); //returns all styles applied

change css variable
document.documentElement.style.setProperty('--color-primary', 'orangered');

attributes
const logo = document.querySelector('.nav__logo');
can read standard properties through JS
console.log(logo.alt); //returns alt text
console.log(logo.src); //returns src
JS automatically creates these properties for the object

set attributes
logo.alt = 'Beautiful mimimalist logo';
logo.setAttribute('company', 'Bankist');

non-standard attribute
console.log(logo.designer); //undefined
to read from the DOM
console.log(logo.getAttribute('designer'));
logo.getAttribute('src');

difference
console.log(logo.getAttribute('src')); //returns img/logo.png
console.log(logo.src); //returns absolute url http://127.0.0.1:8080/logo.png

const link = document.querySelector('.nav__link--btn');
console.log(link.href); //returns absolute URL
console.log(link.getAttribute('href')); //returns # as written in the HTML

data attributes
attrbutes that start with the word data
console.log(logo.dataset.versionNumber);

classes
logo.classList.add('c');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); //not includes

DONT USE
logo.className = 'Jonas';

*/

// rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });

//dom traversing

//going downwards: child
// const h1 = document.querySelector('h1');
// h1.querySelectorAll('.highlight'); //nodelist  of elements in h1
// h1.childNodes; //nodelist
// h1.childNodes.innerHTML; //returns text
// h1.children; //html collection of elements in h1
// h1.firstElementChild; //returns first child
// h1.lastElementChild; //returns last child

//upwards: parent
// h1.parentNode; //returns direct parent
// h1.parentElement; //returns direct parent
// h1.closest('.header'); //returns closest parent element with this class

//queryselector returns children and closest returns parents with said classname.

// h1.previousElementSibling;
// h1.nextElementSibling;

// h1.previousSibling;
// h1.nextSibling;

// h1.parentElement.children;
