// http://api.giphy.com/v1/gifs/search?api_key=1sjuds6ZKI5gKnDVhsyFsT55ptYVnuUG&q=mickey%20mouse&limit=5

$(document).ready(function () {

  const gifTastic = {
    characters: [
      'Mickey Mouse',
      'Goofy',
      'Minnie Mouse',
      'Donald Duck',
      'Elsa',
      'Ariel',
      'Belle'
    ],
    // Ex) Anna, Tiana, Sheriff Woody, Buzz Lightyear, Jasmine, Daisy Duck, Pluto

    imageAttr: {
      dataState: 'data-state',
      dataStill: 'data-still',
      dataAnimate: 'data-animate'
    },

    imageState: {
      still: 'still',
      animate: 'animate'
    },

    renderButtons: function () {
      $('#buttons-view').empty();

      this.characters.forEach(function (char) {
        const btnChar = $('<button>');
        btnChar.addClass('btn-char');
        btnChar.attr('data-name', char);
        btnChar.text(char);
        $('#buttons-view').append(btnChar);
      });
    },

    displayGifs: function () {
      const char = $(this).attr('data-name');
      const apiKey = '1sjuds6ZKI5gKnDVhsyFsT55ptYVnuUG';
      const limit = '10';
      const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${char}&limit=${limit}`;

      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function (response) {
        console.log(response);

        const gifsViewEl = $('#gifs-view');
        gifsViewEl.empty();

        response.data.forEach(function (item, index) {
          const gifContainerEl = $('<div>');
          const ratingEl = $('<p>').text(item.rating);
          const stillImage = item.images.fixed_height_still.url;
          const imageEl = $('<img>').addClass('gif-image');
          imageEl.attr('src', stillImage);
          imageEl.attr('alt', `${char} Gif Animation ${index}`);
          imageEl.attr(gifTastic.imageAttr.dataStill, stillImage);
          imageEl.attr(gifTastic.imageAttr.dataAnimate, item.images.fixed_height.url);
          imageEl.attr(gifTastic.imageAttr.dataState, gifTastic.imageState.still);

          gifContainerEl.append(ratingEl, imageEl);
          gifsViewEl.append(gifContainerEl);
        });
      });
    },

    changeImage: function () {
      const state = $(this).attr(gifTastic.imageAttr.dataState);

      if (state === gifTastic.imageState.still) {
        $(this).attr('src', $(this).attr(gifTastic.imageAttr.dataAnimate));
        $(this).attr(gifTastic.imageAttr.dataState, gifTastic.imageState.animate);
      } else {
        $(this).attr('src', $(this).attr(gifTastic.imageAttr.dataStill));
        $(this).attr(gifTastic.imageAttr.dataState, gifTastic.imageState.still);
      }
    }

  };

  gifTastic.renderButtons();

  $(document).on('click', '.btn-char', gifTastic.displayGifs);

  $(document).on('click', '.gif-image', gifTastic.changeImage);

  $('#add-character').on('click', function (e) {
    e.preventDefault();
    const charInputEl = $('#character-input');
    const newChar = charInputEl.val().trim();
    charInputEl.val('');
    gifTastic.characters.push(newChar);
    gifTastic.renderButtons();
  });

});