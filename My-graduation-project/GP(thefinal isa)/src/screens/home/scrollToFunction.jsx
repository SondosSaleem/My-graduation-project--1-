function scrollToFunction(elementId) {
  var element = document.getElementById(elementId);
  var scrollToTop = window.pageYOffset + element.getBoundingClientRect().top;
  var scrollStep = scrollToTop / 100;

  var scrollInterval = setInterval(function () {
    var distanceRemaining = Math.abs(window.pageYOffset - scrollToTop);
    if (distanceRemaining < 1) {
      // Clear interval when the scrolling is close enough to the target
      clearInterval(scrollInterval);
    } else if (window.pageYOffset < scrollToTop) {
      window.scrollBy(0, scrollStep);
    } else {
      clearInterval(scrollInterval);
    }
  }, 10);
}

export default scrollToFunction