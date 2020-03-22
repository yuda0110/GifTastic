// http://api.giphy.com/v1/gifs/search?api_key=1sjuds6ZKI5gKnDVhsyFsT55ptYVnuUG&q=mickey%20mouse&limit=5

$(document).ready(function () {
  const favKeyInLocalStorage = 'favoriteGifs';

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

    maxNumGifs: 100,

    gifsViewState: null,

    defaultMessage: 'Please click any button to show gif images of a Disney character.',

    favGifsList: null,

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
      gifTastic.renderGifs(false);
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
        gifTastic.renderGifs(true);
      }
    },

    renderGifs: function (showMore) {
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
          const dataNum = index + 1 + gifTastic.gifsViewState.offset;
          const dataName = `${char.replace(' ', '-')}_${dataNum}`;
          const gifItemEl = $('<div class="gif-item">').attr('id', dataName);
          const title = item.title.length > 1 ? item.title : 'No Title';
          const titleEl = $('<p class="title">').text(`${dataNum} ${title}`);
          const ratingEl = $('<div class="rating">').text(item.rating);
          const stillImage = item.images.fixed_height_still.url;
          const animateImage = item.images.fixed_height.url;
          const imageContainerEl = $('<div class="image-container">');
          const imageEl = $('<img class="gif-image">');
          const favoriteEl = $('<button class="favorite-btn">');
          const favoriteIcon = $('<ion-icon name="heart">');
          const favoriteTxtEl = $('<span>');

          imageEl.attr('src', stillImage);
          imageEl.attr('alt', `${char} Gif Animation ${index}`);
          imageEl.attr(gifTastic.imageAttr.dataStill, stillImage);
          imageEl.attr(gifTastic.imageAttr.dataAnimate, animateImage);
          imageEl.attr(gifTastic.imageAttr.dataState, gifTastic.imageState.still);
          favoriteTxtEl.text('Add to Favorite');

          if (gifTastic.favGifsList.length > 0) {
            gifTastic.favGifsList.forEach(function(obj) {
              if (animateImage === obj.animateImage) {
                console.log(`it already fav!!!!`);
                favoriteTxtEl.text('My Favorite')
              }
            });
          }

          favoriteEl.attr('data-name', dataName);
          favoriteEl.append(favoriteTxtEl, favoriteIcon);
          imageContainerEl.append(imageEl, ratingEl, favoriteEl);

          gifItemEl.append(titleEl, imageContainerEl);
          gifsViewEl.append(gifItemEl);
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

    getFavGifsData: function () {
      if (!localStorage.getItem(favKeyInLocalStorage)) {
        console.log('NO favoriteGifs');
        this.favGifsList = [];
      } else {
        // Get fav gifs data from local storage
        console.log('favoriteGifs exists!');
        this.favGifsList = JSON.parse(localStorage.getItem(favKeyInLocalStorage));
      }
    },

    renderFavGifs: function (list) {
      if ($('#favorite-gifs-container')){
        $('#favorite-gifs-container').remove();
      }
      const favGifsContainerEl = $('<div id="favorite-gifs-container">');
      const favGifsEl = $('<div id="favorite-gifs">');
      if (list.length > 0) {
        const heading = $('<h2>').text('Favorite Gifs');

        list.forEach(function(item) {
          const gifItemEl = $('<div class="gif-item">');
          const titleEl = $('<p class="title">').text(item.title);
          const ratingEl = $('<div class="rating">').text(item.rating);
          const imageContainerEl = $('<div class="image-container">');
          const imageEl = $('<img class="gif-image">');
          const stillImage = item.stillImage;
          imageEl.attr('src', stillImage);
          imageEl.attr('alt', item.title);
          imageEl.attr(gifTastic.imageAttr.dataStill, stillImage);
          imageEl.attr(gifTastic.imageAttr.dataAnimate, item.animateImage);
          imageEl.attr(gifTastic.imageAttr.dataState, gifTastic.imageState.still);
          imageContainerEl.append(imageEl, ratingEl);
          gifItemEl.append(titleEl, imageContainerEl);
          favGifsEl.append(gifItemEl);
        });

        favGifsContainerEl.append(heading, favGifsEl);
        $('#gifs-container').prepend(favGifsContainerEl);
      } else {
        console.log('There is no favorite gif!!');
      }
    },



    initialize: function () {
      this.resetGifsViewState();
      this.renderButtons();
      this.renderMessage();
      this.getFavGifsData();
      this.renderFavGifs(this.favGifsList);
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



  $(document).on('click', '.favorite-btn', function () {
    const favObj = {};
    const gifItemID = '#' + $(this).attr('data-name');
    console.log(gifItemID);

    favObj.title = $(`${gifItemID} .title`).text();
    favObj.rating = $(`${gifItemID} .rating`).text();
    favObj.stillImage = $(`${gifItemID} .gif-image`).attr('data-still');
    favObj.animateImage = $(`${gifItemID} .gif-image`).attr('data-animate');
    console.log(favObj);

    let isFavorite = false;

    gifTastic.favGifsList.forEach(function(obj) {
      if (favObj.animateImage === obj.animateImage) {
        console.log(`it already exists!!!!`);
        isFavorite = true;
      }
    });

    console.log('isFav: ' + isFavorite);

    if (!isFavorite) {
      gifTastic.favGifsList.push(favObj);
      localStorage.setItem(favKeyInLocalStorage, JSON.stringify(gifTastic.favGifsList));
      gifTastic.renderFavGifs(gifTastic.favGifsList);
    }

    console.log(gifTastic.favGifsList);

  });


});