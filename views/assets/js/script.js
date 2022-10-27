const trailerbtn = document.getElementById('trailer')
const navOpenBtn = document.querySelector("[data-menu-open-btn]");
const navCloseBtn = document.querySelector("[data-menu-close-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");
const navElemArr = [navOpenBtn, navCloseBtn, overlay];

for (let i = 0; i < navElemArr.length; i++) {

  navElemArr[i].addEventListener("click", function () {

    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("active");

  });
}


var menuButton = document.querySelector(".menu-button");
menuButton.addEventListener("click", function(event) {
  event.preventDefault();
  var parent = document.querySelector(".menu-container");
  if (parent.classList.contains("open")) {
    parent.classList.remove("open");
  } else {
    parent.classList.add("open");
  }
});


/**
 * header sticky
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 10 ? header.classList.add("active") : header.classList.remove("active");
});



/**
 * go top
 */

const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  window.scrollY >= 500 ? goTopBtn.classList.add("active") : goTopBtn.classList.remove("active");
});

const pagination = document.querySelector('.pagination')

if (pagination) {
  const paginationNumbers = document.querySelectorAll('.pagination__number')
  let paginationActiveNumber = document.querySelector('.pagination__number--active')
  const paginationNumberIndicator = document.querySelector('.pagination__number-indicator')
  const paginationLeftArrow = document.querySelector('.pagination__arrow:not(.pagination__arrow--right)')
  const paginationRightArrow = document.querySelector('.pagination__arrow--right')

  const postionIndicator = (element) => {
    const paginationRect = pagination.getBoundingClientRect()
    const paddingElement = parseInt(window.getComputedStyle(element, null).getPropertyValue('padding-left'), 10)
    const elementRect = element.getBoundingClientRect()
    paginationNumberIndicator.style.left = `${elementRect.left + paddingElement - paginationRect.left}px`
    paginationNumberIndicator.style.width = `${elementRect.width - paddingElement * 2}px`
    if(element.classList.contains('pagination__number--active')) {
      paginationNumberIndicator.style.opacity = 1
    } else {
      paginationNumberIndicator.style.opacity = .2
    }
  }

  const setActiveNumber = (element) => {
    if (element.classList.contains('pagination__number--active')) return
    element.classList.add('pagination__number--active')
    paginationActiveNumber.classList.remove('pagination__number--active')
    paginationActiveNumber = element
    setArrowState()
  }

  const disableArrow = (arrow, disable) => {
    if (
      (!disable && !arrow.classList.contains('pagination__arrow--disabled')) ||
      (disable && arrow.classList.contains('pagination__arrow--disabled'))
    )
      return
    if (disable) {
      arrow.classList.add('pagination__arrow--disabled')
    } else {
      arrow.classList.remove('pagination__arrow--disabled')
    }
  }

  const setArrowState = () => {
    const previousElement = paginationActiveNumber.previousElementSibling
    const nextElement = paginationActiveNumber.nextElementSibling
    if(previousElement.classList.contains('pagination__number')) {
      disableArrow(paginationLeftArrow, false)
    } else {
      disableArrow(paginationLeftArrow, true)
    }

    if(nextElement.classList.contains('pagination__number')) {
      disableArrow(paginationRightArrow, false)
    } else {
      disableArrow(paginationRightArrow, true)
    }
  }

  paginationLeftArrow.addEventListener('click', () => {
    setActiveNumber(paginationActiveNumber.previousElementSibling)
    postionIndicator(paginationActiveNumber)
  })

  paginationRightArrow.addEventListener('click', () => {
    setActiveNumber(paginationActiveNumber.nextElementSibling)
    postionIndicator(paginationActiveNumber)
  })

  Array.from(paginationNumbers).forEach((element) => {
    element.addEventListener('click', () => {
      setActiveNumber(element)
      postionIndicator(paginationActiveNumber)
    })

    element.addEventListener('mouseover', () => {postionIndicator(element)})

    element.addEventListener('mouseout', () => {postionIndicator(paginationActiveNumber)})
  })

  postionIndicator(paginationActiveNumber)
}

