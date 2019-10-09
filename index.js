'use strict';
var newsPageNumber = 1;
let input = document.querySelector('#addressBox').value;
document.addEventListener("touchstart", function() {}, true);


function getWiki(searchQuery, callback) {
  let wikiEP = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchQuery}&limit=1&format=json&callback=?`;
  $.ajax({
    type: 'GET',
    url: wikiEP,
    async: true,
    dataType: 'json',      
    success: callback
  });
}

//searches description given from API for Wiki's default phrase "may refer to" and replaces it with a more helpful explanation
function filterWikiResults(wikiData) {
  if (wikiData[2][0].includes("may refer to")) {
    $('.historyContainer').append(`<p>Uh oh!  There seems to be a few places with that name.</p>
    <p>You can try making your search more specific, or clicking <a href="${wikiData[3][0]}" target="_blank">here</a> to see results on Wikipedia.</p>`);
  }
  else {
    printWikiResults(wikiData);
  }
}

function printWikiResults(wikiData) {
  let title = wikiData[1][0];
  let description = wikiData[2][0];
  let link = wikiData[3][0];
  description = description.replace("( ( listen))", "");
  description = description.replace("( listen);", "");
  description = description.replace("US:", "");
  description = description.replace("()", "");

  $('.historyContainer').append(`<h1 id="wikiTitle">${title}</h1>
  <h2 id="wikiDescription">${description}</h2>`);
}

function getNews(searchQuery, callback) {
  let newsEP = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=relevancy&pageSize=5&page=${newsPageNumber}&apiKey=0b1e1594e959400e9c6179dd16bd5369`;
  $.ajax({
    type: 'GET',
    url: newsEP,
    async: true,
    datatype: 'json',
    success: callback,
  });
}

//checks to see if there is more than one result and prints a response if there is not
function filterNewsResults(newsData) {
  if (newsData.articles.length < 1) {
    $('.newsContainer').html("<h2>Sorry!  We couldn't find any news results for that search!</h2>");
  }
  else {
    printNewsResults(newsData);
  }   
}

function printNewsResults(newsData) {
  $('.newsContainer').prepend(`<h1 class="trendingNews">Trending News:</h1>`);
  for (var i=0; i<newsData.articles.length; i++) { 
    let title = newsData.articles[i].title;
    let sourceName = newsData.articles[i].source.name;
    let description = newsData.articles[i].description;
    let articleUrl = newsData.articles[i].url;

    $('.newsContainer').append(`<h2 class="newsArticleTitle">${title}</h2>
    <h3 class="newsContent">${sourceName}</h3>
    <p class="newsContent">${description}</p>
    <a href="${articleUrl}" target="_blank" class="newsContent newsUrl">${articleUrl}</a>`);
  }
}

function handleSubmit() {
  //search news using raw input so results aren't as limited as a Wiki search
  input = document.querySelector('#addressBox').value;
  getNews(input, filterNewsResults);

  //reformat raw input to retrieve more accurate Wiki results
  let searchQuery = toTitleCase(input);
  searchQuery = searchQuery.replace(" ", "_");
  searchQuery = searchQuery.replace(",", "");
  getWiki(searchQuery, filterWikiResults);

  $('#stickThis').addClass("topAndBottomBars");
  $('header').addClass("adjustAfterSearch");
  $('.websiteDescription').addClass("hideAfterSearch");
  $('#politicalMap').removeClass("hideOnLoad");
  $('#geographicMap').removeClass("hideOnLoad");
  $('.currentEvents').removeClass("hideOnLoad");
  $('header').removeClass("centerOnLoad");
  $('.nextPage').removeClass("hideOnLoad");
  $('.historyContainer').html(" ");
  $('.newsContainer').html(" ");
}

//standardizes the capitalization to search Wiki for proper names
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

//allows user to load the next 5 articles
$('.nextPage').on('click', function(e){
  e.preventDefault();
  $('.newsContainer').html(" ");
  newsPageNumber++;
  getNews(input, filterNewsResults);
  $('.pageNumber').removeClass("hideOnLoad");
  $('.pageNumber').html(`<p>Page ${newsPageNumber}</p>`);
  if (newsPageNumber > 1) {
    $('.previousPage').removeClass("hideOnLoad");
  }
});

//allows user to see the previous 5 articles displayed
$('.previousPage').on('click', function(e){
  e.preventDefault();
  $('.newsContainer').html(" ");
  newsPageNumber--;
  getNews(input, filterNewsResults);
  $('.pageNumber').html(`<p>${newsPageNumber}</p>`);
  if (newsPageNumber === 1) {
    $('.previousPage').addClass("hideOnLoad");
    $('.pageNumber').addClass("hideOnLoad");
  }
});

//listener that starts Wiki and News searches
document.getElementById('searchButton').addEventListener('click',  function (e) {
  e.preventDefault();
  handleSubmit();
});

function sticktothetop() {
  var window_top = $(window).scrollTop();
  var top = $('#stick-here').offset().top;
  // var top = $('#stickThis').offset().top;
  if (window_top > top) {
      $('#stickThis').addClass('stick');
      // $('#stick-here').height($('#stickThis').outerHeight(true));
  } else {
      $('#stickThis').removeClass('stick');
      // $('#stick-here').height(0);
  }
}
$(function() {
  $(window).scroll(sticktothetop);
  sticktothetop();
});
