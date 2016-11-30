(function() {
  'use strict';

  let movies = [];

  const renderMovies = () => {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.attr('id', 'buttonPlot');
      $plot.attr('val', `${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  $('button').on('click', (event) => {
    event.preventDefault();
    movies = [];

// AJAX Request
    const $xhr = $.ajax({
      method: 'GET',
      url: `http://www.omdbapi.com/?s=${$('#search').val()}`,
      dataType: 'json'
    });

    $xhr.done((data) => {   //
      if ($xhr.status !== 200) {
        return;
      }
      if (data.Response === 'True') {
            // getting data and filling array movies
        for (let i = 0; i < data.Search.length; i++) {
          let $mov = (data.Search)[i];

          // Replacing from capital letter to lowercase keys
          let str = JSON.stringify($mov);

          str = str.replace(/Title/g, 'title');
          str = str.replace(/Year/g, 'year');
          str = str.replace(/Poster/g, 'poster');
          str = str.replace(/Type/g, 'type');
          str = str.replace(/imdbID/g, 'id');
          $mov = JSON.parse(str);
          for (const key in $mov) {
            if (key === 'id') {
              // AJAX request for getting plot from API

              const $xhrID = $.ajax({
                method: 'GET',
                url: `http://www.omdbapi.com/?i=${$mov[key]}`,
                dataType: 'json'
              });
              $xhrID.done((data) => {   // getting data by id
                if ($xhrID.status !== 200) {
                  return;
                }
                for (const pl in data) {
                  // Looking plot key in object and getting it

                  if (pl === 'Plot') {
                    $mov[pl.toLowerCase()] = `${data[pl]}`;
                  }
                  renderMovies(); // Rendering inside of second AJAX response
                }
              });
            }
          }
          movies.push($mov); // pushing to global variable movies
        }
      }
      else {
        return Materialize.toast('Not found! Try again.', 4000);
      }
    });
  });
})();


// Other version of JavaScript

// (function() {
//   'use strict';
//
//   let movies = [];
//
//   const renderMovies = function() {
//     $('#listings').empty();
//     $('.material-tooltip').remove();
//
//     for (const movie of movies) {
//       const $col = $('<div>').addClass('col s6');
//       const $card = $('<div>').addClass('card hoverable');
//       const $content = $('<div>').addClass('card-content center');
//       const $title = $('<h6>').addClass('card-title truncate');
//
//       $title.attr({
//         'data-position': 'top',
//         'data-tooltip': movie.title
//       });
//
//       $title.tooltip({ delay: 50 }).text(movie.title);
//
//       const $poster = $('<img>').addClass('poster');
//
//       $poster.attr({
//         src: movie.poster,
//         alt: `${movie.poster} Poster`
//       });
//
//       $content.append($title, $poster);
//       $card.append($content);
//
//       const $action = $('<div>').addClass('card-action center');
//       const $plot = $('<a>');
//
//       $plot.addClass('waves-effect waves-light btn modal-trigger');
//       $plot.attr('href', `#${movie.id}`);
//       $plot.text('Plot Synopsis');
//
//       $action.append($plot);
//       $card.append($action);
//
//       const $modal = $('<div>').addClass('modal').attr('id', movie.id);
//       const $modalContent = $('<div>').addClass('modal-content');
//       const $modalHeader = $('<h4>').text(movie.title);
//       const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
//       const $modalText = $('<p>').text(movie.plot);
//
//       $modalContent.append($modalHeader, $movieYear, $modalText);
//       $modal.append($modalContent);
//
//       $col.append($card, $modal);
//
//       $('#listings').append($col);
//
//       $('.modal-trigger').leanModal();
//     }
//   };
//
//   const getMovies = function(searchTerm) {
//     movies = [];
//
//     const $xhr = $.ajax({
//       method: 'GET',
//       url: `http://www.omdbapi.com/?s=${searchTerm}`,
//       dataType: 'json'
//     });
//
//     $xhr.done((data) => {
//       const results = data.Search;
//
//       for (const result of results) {
//         const movie = {
//           id: result.imdbID,
//           poster: result.Poster,
//           title: result.Title,
//           year: result.Year
//         };
//
//         getPlot(movie);
//       }
//     });
//
//     $xhr.fail((err) => {
//       console.error(err);
//     });
//   };
//
//   const getPlot = function(movie) {
//     const $xhr = $.ajax({
//       method: 'GET',
//       url: `http://www.omdbapi.com/?i=${movie.id}&plot=full`,
//       dataType: 'json'
//     });
//
//     $xhr.done((data) => {
//       movie.plot = data.Plot;
//
//       movies.push(movie);
//
//       renderMovies();
//     });
//
//     $xhr.fail((err) => {
//       console.error(err);
//     });
//   };
//
//   $('form').on('submit', (event) => {
//     event.preventDefault();
//
//     const searchTerm = $('#search').val();
//
//     if (searchTerm.trim() === '') {
//       return;
//     }
//
//     getMovies(searchTerm);
//   });
// })();
