"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

//Show story-form on click on "submit"

function navSubmitClick() {
  hidePageComponents();
  $('#story-form').show();
  putStoriesOnPage();
}

$('#nav-story-form').on('click', navSubmitClick);

function navFavoriteClick(){
  hidePageComponents();
  putFavoritesOnPage()
  $('.favorite-page container').show();
}

$('#nav-favorite').on('click', navFavoriteClick);



/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
