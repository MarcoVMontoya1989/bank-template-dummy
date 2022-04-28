'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const menuNavLink = document.querySelector('.nav');
const cookieMessage = document.createElement('div');
const header = document.querySelector('.header');

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(modalsBtn =>
  modalsBtn.addEventListener('click', openModal)
);

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

cookieMessage.classList.add('cookie-message');
cookieMessage.innerHTML = 'lorem ipsum dolor sit amet, consectetur <button type="button" class="btn btn--close-cookie">Got it!</button>';

// header.prepend(cookieMessage);
header.append(cookieMessage);

document.querySelector('.btn--close-cookie')
  .addEventListener('click', () => {
      cookieMessage.remove();
    }
  );

/////////////////////////////////////// Smooth Scroll

// const btnToScroll = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');
//
// btnToScroll.addEventListener('click', () => {
//   const s1Cords = section1.getBoundingClientRect();
//
//   // window.scrollTo({
//   //   left: s1Cords.left + window.pageXOffset,
//   //   top: s1Cords.top + window.pageYOffset,
//   //   behavior: 'smooth'
//   // });
//
//   section1.scrollIntoView({
//     behavior: "smooth"
//   })
// });


// This is an old way to use scroll motion, you can use pure CSS for this one
// that will apply for all, just add the scroll-behavior: smooth; in html { ... }
// document.querySelectorAll('.nav__link').forEach((link) => {
//
//   link.addEventListener('click', function(e){
//     e.preventDefault();
//
//     const sectionToGo = this.getAttribute('href');
//     const sectionSelected = document.querySelector(sectionToGo);
//
//     sectionSelected.scrollIntoView({
//       behavior: 'smooth'
//     });
//   });
// });


///////////////////////////////////////// Navbar Sticky position

const section1 = document.querySelector('#section--1');
// const initialCords = section1.getBoundingClientRect();
//
// window.addEventListener('scroll', function (e) {
//   if(window.scrollY > 10) {
//     menuNavLink.classList.add('sticky');
//   } else {
//     menuNavLink.classList.remove('sticky');
//   }
// });

///////////////////////////////////////// Observer Intersection API

////////////////start example
// const observerCallbacks = function(entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
//
// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
//
// const observerAPI = new IntersectionObserver(observerCallbacks, observerOptions);
// observerAPI.observe(section1);
////////////////end example

// const header = document.querySelector('.header');
const menuNavLinkHeight = menuNavLink.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) menuNavLink.classList.add('sticky');
  else menuNavLink.classList.remove('sticky');
};

const headerObs = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${menuNavLinkHeight}px`
});

headerObs.observe(header);

///////////////////////////////////////// Page Navigation

/*
* This is the efficient Event Delegation than from the above one
* */

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    });
  }
});

///////////////////////////////////////// Menu Fade Animation

const navLinkHandler = function(event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');

    siblings.forEach(elem => {
      if (elem !== link) elem.style.opacity = this;
    });

    logo.style.opacity = this;
  }
}

menuNavLink.addEventListener('mouseover', navLinkHandler.bind("0.5"));

menuNavLink.addEventListener('mouseout', navLinkHandler.bind("1"));

///////////////////////////////////////// Show hidden sections animation

const sections = document.querySelectorAll('.section');

const sectionAnimation = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionsObserver = new IntersectionObserver(sectionAnimation, {
  root: null,
  threshold: 0.15,
  // rootMargin: '10px'
});

sections.forEach((section) => {
  sectionsObserver.observe(section);
  // section.classList.add('section--hidden');
});


///////////////////////////////////////// Tabbed component

const operationTabs = document.querySelectorAll('.operations__tab');
const operationTabsContainer = document.querySelector('.operations__tab-container');
const operationTabsContent = document.querySelectorAll('.operations__content');

operationTabsContainer.addEventListener('click', evt => {
  const clickedButton = evt.target.closest('.operations__tab');

  if (!clickedButton) return;

  operationTabs.forEach(elem => elem.classList.remove('operations__tab--active'));
  operationTabsContent.forEach(elem => elem.classList.remove('operations__content--active'));

  clickedButton.classList.add('operations__tab--active');

  document.querySelector(`.operations__content--${clickedButton.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////// Lazy Loading Images

const imageTarget = document.querySelectorAll('img[data-src]');

const imgLazyLoading = function(entries, observer) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', (elem) => {
    elem.target.classList.remove('lazy-img');
    observer.unobserve(elem.target);
  });
};

const imgLazyObservable = new IntersectionObserver(imgLazyLoading, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

imageTarget.forEach(image => {
  imgLazyObservable.observe(image);
});

///////////////////////////////////////// Carousel WITHOUT JQUERY THANK GOD !!!!

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');

const btnLeftSlider = document.querySelector('.slider__btn--left');
const btnRightSlider = document.querySelector('.slider__btn--right');
const btnSliderEvent = document.querySelectorAll('.slider__btn');

let curSlide = 0;
const maxSlides = slides.length;

const goToSlide = function(slide) {
  slides.forEach((s,i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

goToSlide(0);

const nextSlide = function() {
  if ((maxSlides - 1) === curSlide) curSlide = 0;
  else curSlide++;

  slides.forEach((s,i) => {
    s.style.transform = `translateX(${100 * (i - curSlide)}%)`;
  });
};

const prevSlide = function() {
  if (curSlide === 0) curSlide = maxSlides - 1;
  else curSlide--;

  goToSlide(curSlide);
}

btnRightSlider.addEventListener('click', nextSlide);
btnLeftSlider.addEventListener('click', nextSlide);