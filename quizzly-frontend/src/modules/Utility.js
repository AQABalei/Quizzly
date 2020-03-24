var Utility = module.exports = {
  CLOSE_IMAGE_PATH: '/assets/img/close.png',
  LOGO_IMAGE_PATH: '/assets/img/logo.png',
  EXPAND_IMAGE_PATH: '/assets/img/expand.png',
  NOTEBOOK_IMAGE_PATH: '/assets/img/courses.png',
  QUIZ_IMAGE_PATH: '/assets/img/quiz.png',
  METRICS_IMAGE_PATH: '/assets/img/metrics.png',
  COURSES_PAGE_PATH: '/assets/img/write-board.png',
  // remove duplicates from array
  removeDuplicates: function(a) {
    var seen = {};
    return a.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }
};
