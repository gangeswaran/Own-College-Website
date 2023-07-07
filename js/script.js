$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) {

var gce = {};

var allcoursesUrl = "data/courses.json";
var homeHtml = "home-snippet.html";
var courseTitleHtml = "course-title.html";
var courseHtml = "course-snippet.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};


var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});

gce.loadcourses = function (){
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(allcoursesUrl,buildAndShowCoursesHtml);
};

function buildAndShowCoursesHtml(courses){
  $ajaxUtils.sendGetRequest(courseTitleHtml,function(courseTitleHtml){

    $ajaxUtils.sendGetRequest(courseHtml,function(courseHtml){

      var courseViewHtml = 
      buildCourseViewHtml( courses,
       courseTitleHtml,
       courseHtml);
      insertHtml("#main-content",courseViewHtml);
    },
    false);
  },
  false);
}


function buildCourseViewHtml(courses,courseTitleHtml,courseHtml){
  var finalHtml = courseTitleHtml;
  finalHtml += "<section class = 'row'>";

  for (var i = 0 ; i < courses.length; i++){
    var html = courseHtml;
    var name = "" + courses[i].name;
    var short_name = courses[i].short_name;
    var item = courses[i].item;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name", short_name);
    html = insertProperty(html,"item", item)
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

global.$gce = gce;

})(window);
