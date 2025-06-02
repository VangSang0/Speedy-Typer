# Speedy-Typer
A Typing speed test.


# Motivation
 - I wanted to learn more about JavaScript and how it manipulates the DOM. With a base HTML and CSS setup, I was interested in building a quick game.

# Tech Stack
 - Frontend: JavaScript, HTML, and CSS
 - Backend: Express (for API call to Google's Gemini AI)
  - I used an API call to Gemini's AI to create a short paragraph for the user to test their typing speed

# How does it work?
 - Similar to other speed typing games, it gives the user a paragraph and times them on how quickly they can type. Once the user is done typing, it calculates the user's words per minute (WPM) and their accuracy.

# Things that could be improved
  - Instead of an "alert" with the stats, I could have created a "pop-up" overlay with the stats, featuring a "restart" button to provide the user with a better experience.
  - A better color scheme to give the user an idea of where they're at in the paragraph. As of right now, the user cannot tell (when the correct characters are inputted) where they are, as the green color kind of blends in with the black text and the background.
  - Calculate incorrect button presses as they are made instead of whether or not they are fixed. For example, a user can input an incorrect character and fix it, which does not count towards the "incorrect" counter. In this case, the user can always have 100% accuracy regardless of making  a few errors.

