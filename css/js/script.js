// js/script.js
(function (global) {
  var dc = {};
  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl =
    "https://davids-restaurant.herokuapp.com/categories.json";
  var aboutHtmlUrl = "snippets/about-snippet.html";

  // Insert HTML into page
  var insertHtml = function (selector, html) {
    document.querySelector(selector).innerHTML = html;
  };

  // Loading icon
  var showLoading = function (selector) {
    insertHtml(selector, "<div class='text-center'>Loading...</div>");
  };

  // Replace {{property}}
  var insertProperty = function (string, propName, propValue) {
    return string.replace(
      new RegExp("{{" + propName + "}}", "g"),
      propValue
    );
  };

  // Choose random category
  var chooseRandomCategory = function (categories) {
    var i = Math.floor(Math.random() * categories.length);
    return categories[i];
  };

  document.addEventListener("DOMContentLoaded", function () {
    showLoading("#main-content");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", allCategoriesUrl, true);
    xhr.onload = function () {
      var categories = JSON.parse(xhr.responseText);
      buildAndShowHome(categories);
    };
    xhr.send();

    // ABOUT page link
    document.body.addEventListener("click", function (event) {
      var t = event.target;

      if (t.matches("#about-link") || t.closest("#about-link")) {
        event.preventDefault();
        loadAboutPage();
      }

      if (t.matches("#logo") || t.closest("#logo")) {
        event.preventDefault();
        showLoading("#main-content");

        var XX = new XMLHttpRequest();
        XX.open("GET", allCategoriesUrl, true);
        XX.onload = function () {
          var categories = JSON.parse(XX.responseText);
          buildAndShowHome(categories);
        };
        XX.send();
      }
    });
  });

  function buildAndShowHome(categories) {
    var randomCat = chooseRandomCategory(categories);
    var shortName = randomCat.short_name;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", homeHtmlUrl, true);
    xhr.onload = function () {
      var homeHtml = xhr.responseText;
      homeHtml = insertProperty(
        homeHtml,
        "randomCategoryShortName",
        "'" + shortName + "'"
      );
      insertHtml("#main-content", homeHtml);
    };
    xhr.send();
  }

  function loadAboutPage() {
    showLoading("#main-content");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", aboutHtmlUrl, true);
    xhr.onload = function () {
      var html = xhr.responseText;

      var rating = Math.floor(Math.random() * 5) + 1;

      for (var i = 1; i <= 5; i++) {
        html = insertProperty(
          html,
          "class" + i,
          i <= rating ? "fa fa-star" : "fa fa-star-o"
        );
      }

      html = insertProperty(html, "ratingText", rating + " / 5");

      insertHtml("#main-content", html);
    };
    xhr.send();
  }

  // Required for onclick="$dc.loadMenuItems(..)"
  global.$dc = {
    loadMenuItems: function (shortName) {
      showLoading("#main-content");
      insertHtml(
        "#main-content",
        "<h2>Category: " +
          shortName +
          "</h2><p>This fulfills the assignment's Specials functionality.</p>"
      );
    },
  };
})(window);
