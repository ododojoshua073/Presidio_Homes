export const getMenuStyles = (menuOpened) => {
  if (document.documentElement.clientWidth <= 800) {
    return { right: !menuOpened && "-100%" };
  }
};

export const sliderSettings = {
  slidesPerView: 1,
  spaceBetween: 20,
  breakpoints: {
    480: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    600: {
      slidesPerView: 1.3,
      spaceBetween: 25,
    },
    700: {
      slidesPerView: 1.8,
      spaceBetween: 30,
    },
    800: {
      slidesPerView: 2.2,
      spaceBetween: 30,
    },
    900: {
      slidesPerView: 2.5,
      spaceBetween: 35,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 35,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
  },
};

export const updateFavourites = (id, favourites) => {
  if (favourites.includes(id)) {
    return favourites.filter((resId) => resId !== id);
  } else {
    return [...favourites, id];
  }
};

export const checkFavourites = (id, favourites) => {
  return favourites?.includes(id) ? "#fa3e5f" : "white";
};

export const validateString = (value) => {
  return value?.length < 3 || value === null
    ? "Must have atleast 3 characters"
    : null;
};
