Roguelike Tutorial Workshop
===============

Working through the roguelike tutorials at:
* http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/
* http://trystans.blogspot.ca/2011/08/roguelike-tutorial-01-java-eclipse.html

As I work through the tutorial, I'll be making minor adjustments along the way and documenting them as I work through them

Tutorial 01
====
* converted to using Browserify for dependencies
* switched to using the npm version of rot-js ( https://github.com/blinkdog/rot.js )

Tutorial 02
====
* Normal Tutorial 2 stuff
* Instead of having a screen object with all the screens, I have each screen as it's own file in assets/screens directory
* Launching a screen is handled by 'requiring' the screen and passing it to the switch screen function
* added a gameconfig.js that currently just contains the screen dimensions
* gameconfig is accessible from Game.config
* TODO: may create an array of screens in the Game object that auto-loads each screen..not sure yet.
