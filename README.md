Roguelike Tutorial Workshop
===============

Working through the roguelike tutorials at:
* http://www.codingcookies.com/2013/04/01/building-a-roguelike-in-javascript-part-1/
* http://trystans.blogspot.ca/2011/08/roguelike-tutorial-01-java-eclipse.html

As I work through the tutorial, I'll be making minor adjustments along the way and documenting them as I work through them

Note that there is a dependency on my Entity-Blueprint-Manager repo that is under active development and not in NPM yet.  For development, I've been linking it in via npm-link.

Tutorial 01
====
* Normal Tutorial 01 stuff
* converted to using Browserify for dependencies
* switched to using the npm version of rot-js ( https://github.com/blinkdog/rot.js )

Tutorial 02
====
* Normal Tutorial 2 stuff
* Instead of having a screen object with all the screens, I have each screen as it's own file in assets/screens directory
* Launching a screen is handled by 'requiring' the screen and passing it to the switch screen function
* added a gameconfig.js that currently just contains the screen dimensions
* gameconfig is accessible from Game.config
* DONE: may create an array of screens in the Game object that auto-loads each screen..not sure yet.

Tutorial 03
====
* Normal Tutorial 3 stuff
* TODO: Make revealing module pattern on all screens
* TODO: hang everything off Game
* DONE: add screenManager to game object, have it load screens via config entries (uses ScreenCatalog now)
* Made a base screen and extended it for each screen
* moved the logic from the playscreen that generates the world to a separate worldbuilder class to mimic the Java tutorial
* modified the key bindings to also allow Vi style movement keys
* created a CellularAutomataWorldBuilder object

Tutorial 04
====
* Normal Tutorial 4 stuff
* switched over to Bower to pull official rot.js so we can get latest
* had to build a rot.js shim that can be used as a commonjs interface to the bower rot.js
* TODO: need to come up with a better build pattern for bower components
* Started adding in support for the blueprint manager (along with additional development of entity-blueprint system)

Tutorial 05
===
* Normal Tutorial 5 stuff
* x,y,map moved from Entity to mixin called "Position"
* mixin.groupName renamed to mixin.type
* added Entity.attachMixin from a previous work I did.  In the prior work, I had mixins attached as sub properties a'la Dungeon Siege, but decided we probably don't need this level and it might not be optimal for Javascript
* added Entity.hasMixin and have it look at either the 'type' or the 'name' and ignore case
* added new mixin called Aspect that handles entity visuals
* migrated the "draw" functions to the Tile object and the Aspect mixin instead of inside the play screen
* DONE: look into the browserify plugin that converts a directory of files to a single JSON object (for entities and blueprints) - Note: just have a _index in the root of blueprint or mixins and require the files in


Tutorial 06
===
* Normal Tutorial 6 stuff

Tutorial 07
===
* Normal Tutorial 7 stuff
* modified Entity constructor to take the name of a blueprint and it will look it up in the blueprint catalog
* moved the routine that renders the map out of the playscreen and into the map prototype
* refactored the tiles to use the blueprint system to allow for blueprint inheritance
* created a new TileCatalog that has instances of each type of tile to be used to build the map
* removed the Tile class since it's no longer used
* created a Tile mixin that tiles all use
* created a new tiles.js that defines the tiles
* renamed the entities.js to singletons.js and added an initialize() export that is called at game startup.  This will load up all the mixins, the tiles, and the blueprints.
* exposed TileCatalog, BlueprintCatalog, and MixinCatalog from the Singletons object
* removed base class "Glyph" and all reliance on it...the mixin handler will handle building object by composition instead of inheritance
* clean up Entity class to use the Dictionary object for holding on to mixin references
* modify the builders to use blueprints to allow for configuring building a level
* create a new LevelBuilder object that takes in a blueprint and returns a World object
* refactored World to Level
* implemented a new way of handling stairs by using a Portal mixin and having that mixin handle moving the player between levels
* instead of having a single 3 dimensional array for levels, just have an array of Level objects
* redid the way regions were determined and linked together between levels
* created a new 'Portal' type of gizmo that will respond to an active message from the player and transport them between levels
* created an activate subsystem that will send an activate to any entity on the current square if the player sends an activate keystroke (or if it's sent via another component)
* TODO: need to filter activate messages in case there are specific messages that an activate needs to respond to
* moved Player into Singletons so the player is accessed from everywhere
* created new World singleton that contains all the levels
* store each level by name in the world.  Levels will become active/inactive as the player traverses through them and the entities will be added/removed from the scheduler
* created specific directories for mixins and blueprints with an index on each that requires in the appropriate files.  The Singletons.initialize will now just require in the index and load the blueprints and mixins into the catalogs

Tutorial 08 
====
* From: http://www.codingcookies.com/2013/08/25/building-a-roguelike-in-javascript-part-8a/
* Normal Tutorial 8 stuff
* Playing with the idea of moving the FOV algorithm into a separate builder.
* modified aspect.draw to accept a options field with { outsideFOV: true|false } to determine if it should render with the obscuredForeground setting or not.
* TODO: render entities, but have actors use the obscuredForeground valud of 'invisible' so they don't show up

Tutorial 09
====
* From: http://www.codingcookies.com/2013/08/29/building-a-roguelike-in-javascript-part-9/
* Normal Tutorial 9 stuff
* added concept of render layers to "Aspect" so that things such as decals would render below actors
* added bloodstain decal on death of some actors
* deviated from way tutorial 9 stored entities..just filter to viewport, then sort entities by renderLayer
* TODO: discovered that in some cases a wandering monster and the player were ending up moving to the same space

Tutorial 10
====
* From: http://www.codingcookies.com/2013/08/31/building-a-roguelike-in-javascript-part-10a/
* Note - didn't actually take anything from tutorial 10A.  The Entity Blueprint system basically accomplishes the repository pattern
* Created a screen Catalog that screens populate and just call ScreenCatalog.getScreen('name') so we can put screen names into templates
* moved all references to screens to use the new ScreenCatalog singleton
* moved all calls to Math.random to a new RNG singleton that just delegates to ROT.RNG for now
* display RNG seed on first screen

Tutorial 11
====
* From: http://www.codingcookies.com/2013/09/05/building-a-roguelike-in-javascript-part-11/
* TODO: need way to override mixin methods and then call the base method.  Maybe have a flag on the mixin? or have something in the init method that causes the mixin system to keep track of the original
* TODO: need to define some kind of randomized content flag or mixin that can be used to pull from the catalog *only* items matching a random content flag.  ideas would be some kind of 1) random content type.  2) random content level(min/max) 3) random content rarity
* TODO: adding on to the random content system, maybe have a random content mixin builder?..adding specific mixins to a template randomly?
* TODO: create a ActionList with all game actions then just map keys to that action list
* TODO: have actions as lists that have an action as well as a "helptext" and add or remove them from the global "available actions" list.  That way 1) each screen can have it's own actions and 2) each screen can provide a ? help button
* TODO: Modify the "parentScreen" property to be dynamically set by the screen calling the subscreen


Tutorial 12
====
* From: http://www.codingcookies.com/2013/09/06/building-a-roguelike-in-javascript-part-12/
* renamed "equipper" to "equipslots"
* TODO: refactor the equippable to have a Attack and Defense block and use those for items as well as entities.  
* Added to EquipSlots the methods: getEquippedAttackValue and getEquippedDefenseValue.  Attacker and Destructable now use those 
* Started extracting out the PlayScreen actions into separate methods and just have the handleInput call those in preparation for being able to externalize keybindings

Tutorial 13
====
* From: http://www.codingcookies.com/2013/09/07/building-a-roguelike-in-javascript-part-13/
* DONE: figure out a way to either have a mixin 'type' validate against a common interface to make sure all elements are represented or define a base mixin 'type' that will be descended from when populating the mixin (ie: make sure all mixins of type 'Actor' have the speed component)
* If a mixin 'type' is not the same name as the mixin, the system will first load up and initialize the mixin 'type' mixin, then load up and initialize the mixin requested.  This allows for very simple mixin inheritance.  For example, Actor contains a speed property.  TaskActor, WanderActor, etc. don't need to provide this property since they 'descend' from actor and actor will be loaded and initialized before TaskActor.
* Added bootstrap in the Bower components
* figured out how to use Bower components with Browserify properly by adding a shim to the package.json
* removed the hacky way of accessing rot.js and am now using the Bower version
* added tabs on main page for Game, Blueprints, Mixins, Settings ... WIP
* reworked the TaskActor mixin to break out the tasks as separate mixins.  If you supply the ActorTasks[] with TaskAI names, it will automatically load and register those mixins.  You can always add the AI Task mixins yourself as well if you need to pass parameters to the AI Tasks

Tutorial 14
====
* From: http://www.codingcookies.com/2013/09/14/building-a-roguelike-in-javascript-part-14/
* Started adding stats to be logged from the world building routines

Tutorial 15
====
* From: http://www.codingcookies.com/2013/09/21/building-a-roguelike-in-javascript-part-15/
* implemented zombie with new dynamic TaskActor system
* implemented Boss level with builder pattern
* Added new system for making generic connectors for levels that can be parameterized
* lots of WIP stuff going on, but you can win the game now by killing the zombie

Tutorial 16
====
* From: http://www.codingcookies.com/2013/11/25/building-a-roguelike-in-javascript-part-16/