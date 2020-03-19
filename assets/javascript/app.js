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

    selectedCharacter: null,

    maxNumGifs: 30,

    gifsViewState: null,

    defaultMessage: 'Please click any button to show gif images of a Disney character.',

    resetGifsViewState: function () {
      this.gifsViewState = this.gifsViewStateFactory();
    },

    gifsViewStateFactory: function () {
      return {
        offset: 0,
        showMoreCount: 0,
        maxGifsReached: false,
        message: this.defaultMessage
      }
    },

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

    firstGifs: function () {
      gifTastic.resetGifsViewState();
      gifTastic.renderMessage(gifTastic.gifsViewState.message);
      gifTastic.selectedCharacter = $(this).attr('data-name');
      gifTastic.displayGifs(false);
    },

    moreGifs: function () {
      if (gifTastic.gifsViewState && gifTastic.gifsViewState.maxGifsReached) {
        return;
      }

      if (!gifTastic.gifsViewState || !gifTastic.selectedCharacter) {
        gifTastic.renderMessage('Please select a character first!');
        return;
      } else {
        gifTastic.renderMessage();
      }

      const addedGifNumPerClick = 10;
      gifTastic.gifsViewState.showMoreCount += 1;

      if (gifTastic.gifsViewState.showMoreCount < gifTastic.maxNumGifs / addedGifNumPerClick) {
        gifTastic.gifsViewState.offset = gifTastic.gifsViewState.showMoreCount * addedGifNumPerClick;
      } else {
        gifTastic.renderMessage('You have reached max number of images to show.');
        gifTastic.gifsViewState.maxGifsReached = true;
      }

      if (!gifTastic.gifsViewState.maxGifsReached) {
        gifTastic.displayGifs(true);
      }
    },

    displayGifs: function (showMore) {
      let char = '';
      if (this.selectedCharacter) {
        char = gifTastic.selectedCharacter;
        console.log('char1: ' + char);
      }

      const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${char}&limit=${this.limit}&offset=${this.gifsViewState.offset}`;

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
          const titleEl = $('<p>').text(`${index + 1 + gifTastic.gifsViewState.offset}. "${item.title}"`);
          const ratingEl = $('<p>').text(`Rating: ${item.rating}`);
          const stillImage = item.images.fixed_height_still.url;
          const imageEl = $('<img>').addClass('gif-image');
          imageEl.attr('src', stillImage);
          imageEl.attr('alt', `${char} Gif Animation ${index}`);
          imageEl.attr(gifTastic.imageAttr.dataStill, stillImage);
          imageEl.attr(gifTastic.imageAttr.dataAnimate, item.images.fixed_height.url);
          imageEl.attr(gifTastic.imageAttr.dataState, gifTastic.imageState.still);

          gifContainerEl.append(titleEl, ratingEl, imageEl);
          gifsViewEl.append(gifContainerEl);
        });
      });
    },

    renderMessage: function (message) {
      const messageEl = $('#message');
      if (message) {
        messageEl.text(message);
      } else {
        messageEl.text(gifTastic.defaultMessage);
      }

      if (this.gifsViewState) {
        this.gifsViewState.message = message;
      }
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
    },

    initialize: function () {
      this.resetGifsViewState();
      this.renderButtons();
      this.renderMessage();
    }
  };

  gifTastic.initialize();

  $(document).on('click', '.btn-char', gifTastic.firstGifs);

  $('#show-more').on('click', gifTastic.moreGifs);

  $(document).on('click', '.gif-image', gifTastic.changeImage);

  $('#add-character').on('click', function (e) {
    e.preventDefault();
    gifTastic.renderMessage('');
    const charInputEl = $('#character-input');
    const newChar = charInputEl.val().toLowerCase().trim();
    const charLowercaseArray = gifTastic.characters.map(function (char) {
      return char.toLowerCase();
    });
    if (charLowercaseArray.includes(newChar)) {
      gifTastic.renderMessage('The character you typed in already exists. Please add a different character.');
    } else if (newChar.length < 1) {
      gifTastic.renderMessage('Please type in a character\'s name.');
    } else {
      charInputEl.val('')
      gifTastic.characters.push(newChar);
      gifTastic.renderButtons();
    }
  });

});