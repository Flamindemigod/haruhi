const getCurrentSeason = () => {
  let currentTime = new Date();
  let currentYear = currentTime.getUTCFullYear();
  let currentMonth = currentTime.getMonth();

  if (currentMonth >= 2 && currentMonth < 4) {
    return ["SPRING", currentYear];
  } else if (currentMonth >= 4 && currentMonth < 9) {
    return ["SUMMER", currentYear];
  } else if (currentMonth >= 9 && currentMonth < 10) {
    return ["FALL", currentYear];
  } else {
    if (currentMonth >= 10) {
      return ["WINTER", currentYear];
    } else {
      return ["WINTER", currentYear - 1];
    }
  }
};

export default getCurrentSeason;
