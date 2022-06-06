"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const isLoggedIn = Boolean(currentUser);

  return $(`
  <li id="${story.storyId}">
  <span class="heart">
  <i id="${story.storyId}" 
  class="

  ${isLoggedIn ? `${checkFavorite(story) ? 'fas' : 
  'far'} fa-heart"></i>
  </span>` : `"></i>
  </span>`}
  
  <a href="${story.url}" target="a_blank" class="story-link">
    ${story.title}
  </a>
  ${isLoggedIn ? `${checkAuthor(story) ? '<span class="trash"><i class="fas fa-trash"></i></span>' : ''}` : ''};
  <small class="story-hostname">(${hostName})</small>
  <small class="story-author">by ${story.author}</small>
  <small class="story-user">posted by ${story.username}</small>
 
</li>
    `);
}

//check if story is favorited or not.
//first check if there's any favorites, then check if it matches with the displayed stories' id
function checkFavorite(story) {
  return currentUser.favorites.some((s) => s.storyId === story.storyId);
}

//check if author is currentUser
function checkAuthor(story) {
  return currentUser.ownStories.some((s) => s.storyId === story.storyId);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
};

//add a new story to the list on page.
async function createNewStory(evt) {
  evt.preventDefault();
  console.debug('createNewStory');

  const newStory = {
    title: $('#story-input-title').val(),
    author: $('#story-input-author').val(),
    url: $('#story-input-url').val()
  }
  const {
    loginToken
  } = currentUser;

  const storyInput = await storyList.addStory(currentUser, newStory);
  location.reload()
}

$('#story-form-btn').on('click', createNewStory);

//toggle class of heart
function toggleHeartClass(event) {
  const $targetId = $(event.target).attr('id');
  const story = storyList.stories.filter(s => {
    return s.storyId === $targetId
  });
  if ($(event.target).hasClass('far')) {
    $(event.target).removeClass('far');
    $(event.target).addClass('fas');
    currentUser.toggleStory(story[0], 'favorite');
  } else {
    $(event.target).removeClass('fas');
    $(event.target).addClass('far');
    currentUser.toggleStory(story[0], 'unfavorite');
  }
}

//add eventListener to heart in main page
$allStoriesList.on('click', '.heart', function (event) {
  const id = $(event.target).attr('id');
  toggleHeartClass(event);
});

//add eventListener to heart in favorite page
$('.favorite-page').on('click', '.heart', function (event) {
  const id = $(event.target).attr('id');
  if (storyList.stories.some((s) => s.storyId === id)) {
    toggleHeartClass(event);


    //this is for when story clicked is no longer in the main storyList
  } else {
    const story = currentUser.favorites.filter(function (s) {
      return s.storyId === id
    })
    if ($(event.target).hasClass('far')) {
      $(event.target).removeClass('far');
      $(event.target).addClass('fas');
      currentUser.toggleStory(story[0], 'favorite');
      putFavoritesOnPage()
    } else {
      $(event.target).removeClass('fas');
      $(event.target).addClass('far');
      currentUser.toggleStory(story[0], 'unfavorite');
      putFavoritesOnPage();
    }

  }
});

//put favorites on page
function putFavoritesOnPage() {
  console.debug('putFavoritesOnPage');
  const $favPage = $('.favorite-page');
  $favPage.empty();
  $favPage.append('<ol id="all-fav-list" class="stories-list"></ol>');
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $('#all-fav-list').append($story);
  }
  $favPage.show();
};

//delete story with trash can
async function removeTrashCan(event) {
  console.debug('removeTrashCan');
  const $targetId = $(event.target).closest('li').attr('id');
  const story = storyList.stories.filter(s => {
    return s.storyId === $targetId
  });
  await storyList.deleteStory(story[0])
  if (currentUser.favorites.some((s => s.storyId === $targetId))) {
    const newFavArray = currentUser.favorites.filter(function (s) {
      return s.storyId !== $targetId;
    })
    currentUser.favorites = newFavArray;
    return putFavoritesOnPage();
  }
}

//add eventListener to trash can in main page
$allStoriesList.on('click', '.trash', function (event) {
  removeTrashCan(event);
  putStoriesOnPage();
});

//add eventListener to trash can in favorite page
$('#favorite-page').on('click', '.trash', function (event) {
  removeTrashCan(event);
});