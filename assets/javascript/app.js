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

    apiKey: '1sjuds6ZKI5gKnDVhsyFsT55ptYVnuUG',

    limit: 10,

    offset: 0,

    selectedCharacter: null,

    showMoreCount: 0,

    maxNumGifs: 30,

    maxGifsReached: false,

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

    moreGifs: function (el, showMore) {
      if (showMore && this.maxGifsReached) {
        console.log('showMore && this.maxGifsReached');
        return;
      }

      console.log(showMore);
      console.log(el);

      const addedGifNumPerClick = 10;
      let char = '';
      if (gifTastic.selectedCharacter) {
        char = gifTastic.selectedCharacter;
        console.log('char1: ' + char);
      } else {
        char = el.attr('data-name');
        gifTastic.selectedCharacter = char;
        console.log('char2: ' + char);
      }

      console.log('char3: ' + char);

      const apiKey = '1sjuds6ZKI5gKnDVhsyFsT55ptYVnuUG';
      const limit = '10';

      let offset = 0;
      if (showMore) {
        const count = this.showMoreCount++;
        console.log('this.showMoreCount: ' + this.showMoreCount);
        if (count < 3) {
          offset = gifTastic.showMoreCount * addedGifNumPerClick;
        } else {
          $('#message').text('You have reached max number of images to show.');
          this.maxGifsReached = true;
        }
      } else {
        gifTastic.showMoreCount = 0;
      }

      const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${char}&limit=${limit}&offset=${offset}`;

      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function (response) {
        console.log(response);

        const gifsViewEl = $('#gifs-view');

        if (!showMore) {
          gifsViewEl.empty();
        }

        response.data.forEach(function (item, index) {
          const gifContainerEl = $('<div>');
          const ratingEl = $('<p>').text(`${index + 1}. Rating: ${item.rating}`);
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

    firstGifs: function () {
      gifTastic.selectedCharacter = $(this).attr('data-name');
      gifTastic.displayGifs(false);
    },

    displayGifs: function (showMore) {
      const char = this.selectedCharacter;
      const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${char}&limit=${this.limit}&offset=${this.offset}`;

      $.ajax({
        url: queryURL,
        method: 'GET'
      }).then(function (response) {
        console.log(response);

        const gifsViewEl = $('#gifs-view');

        if (!showMore) {
          gifsViewEl.empty();
        }

        response.data.forEach(function (item, index) {
          const gifContainerEl = $('<div>');
          const ratingEl = $('<p>').text(`${index + 1}. Rating: ${item.rating}`);
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

  $(document).on('click', '.btn-char', gifTastic.firstGifs);

  $('#show-more').on('click', function () {
    if (gifTastic.selectedCharacter) {
      gifTastic.displayGifs($(this),true)
    } else {
      $('#message').text('Please select a character first!');
    }
  });

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