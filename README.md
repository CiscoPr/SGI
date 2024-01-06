# SGI 2023/2024

## Group T01G01
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Francisco Prada  | 202004646 | up202004646@edu.fe.up.pt |
| Vítor Cavaleiro  | 202004724 | up202004724@edu.fe.up.pt |

----

## Projects

### [TP1 - ThreeJS Basics](tp1)
----
## Project information

This scene has many different details and items. Some of them are the ones referenced in the specification of the project:
- 4 walls and a floor
- a table with 4 legs
- a cake with a candle
- a spotlight from the candle that is projected into the cake and table
- a car picture
- a spring
- a flower pot with a flower on it
- a journal
- a picture of the two elements of the group
- a window

We also added some other extra elements:
- a window with borders, a curtain, and the light projected from it
- a Kirby that casts a shadow :)
- a rug with a repeated texture that receives shadows (from the kirby and table)
- two spotlights above the  pictures of the elements of the group
- a border for the car picture
- both walls and floor with textures
- a door with a texture
- a circle that imitates a clock with its texture
- the cake has two halfs, in order to simulate a topping of some sort
- added 3 methods of interactive color change in the GUI (petals, cake topping and house walls)
- added 2 methods of object display and corresponding lights (window and candle)

There are some images below that show this scene final version. The reader can also checkout some prints that show part of this project's evolution in [here](tp1/screenshots/evolution/).

![screenshot1](tp1/screenshots/image8.png)

![screenshot2](tp1/screenshots/image7.png)

![screenshot3](tp1/screenshots/image9.png)

![GUI](tp1/screenshots/gui.png)
----
## Issues/Problems

There was a main issue during the development: during the parts where we had to update, for example, the wrapS value using the GUI, we weren't able to render the updated texture.


-----

### [TP2 - 3D graphics application ](tp2)
## Project information

- In this project, we resort to the scene graph structure and create a concise scene structure where groups of objects can be manipulated, whether by applying transformations or by changing the materials. We thus take full advantage of object hierarchies and heritage of properties. After parsing the XML file, we create a scene comprised of groups on three.js, by using recursive calls to apply a BFS-like algorithm that processes the information on the scene graph. In the end we render the root group of the scene, which contains all the other groups and objects.

- In order to optimize the rendering of the scene, lods are used on the app trougth three.js. Given the distance of the camera to a certain structure, the user might decide to show a less detailed version of it if it is further away or show it with more detail in case it is close for example;

- For advanced textures, we apply video textures, sky boxes, mipmaps and bumptextures, thus adding more dynamic alternatives to the use of textures in the scene;

- We allow a large number of primitives to be drawn as wireframes if specified in the XML file.

- We implement the polygon structure based on buffer geometry. This is applied to render objects that can be easily drawn using only triangles. Being one of the simplest structures and by writing data directly into buffers, we can optimize the rendering of the scene;

### Scene
  This scene represents one of the first areas from the indie game Undertale, reuniting various elements from it:ief description of the created scene
  - 2 walls with a repeated texture, bump map, associated to LOD's and that receive shadows
  - 1 plane with texture of an entrance door (taken from the game itself) which receives shadows
  - 2 columns that were initially rectangles but both were changed to cylander primitives, both have textures and bump maps
  - 1 board with a bump map and which casts a shadow into the wall
  - 1 nurb corresponding to the golden flower bed with the "transparent" attribute and also has an associated bump map and a LOD
  - 3 planes associated to materials also with the "transparent" attribute representing three different characters from the game (Frisk, Toriel and Flowey), which cast shadows
  - 1 plane with a video texture and the attribute "transparent" corresponding to the "Save Game" icon in the above mentioned game
  - 3 small polygons arround Flowey that correspond to an special attack from this creature in the game, in which it throws at the player several little white pellats
  - 2 green wireframes which represent vines plants that can be found thorughout the ruins in the game
  - a skybox wich has a texture of the game corresponding to a night sky
  - a dark fog
  - two opposite directional lights
  - one point light that casts shadows (intended to be the light comming from the above mentioned save star)
  - ambient light
  - GUI with 3 methods:
    - active camera: the user can change between the perspective camera and 4 different orthogonal cameras: **Right**, **Left**, **Top**, **Bottom**
    - show skybox: the user can choose to display the skybox or not
    - turn on the lights: the user can turn on or off the different lights that were used (for a beautiful scenario the user can turn off the used lights and look at the skybox :)
  - To access the scene xml, click [here](scenes/tp2scene/scene.xml)

Here is a quick recap of the evolution of the project over time:
<figure>
  <img
  src="tp2/screenshots/tp2_v1.png"
  alt="Version1">
  <figcaption align="center">Fig.01 - First Version </figcaption>
</figure>

<figure>
  <img
  src="tp2/screenshots/tp2_v2.png"
  alt="Version1">
  <figcaption align="center">Fig.02 - Second Version </figcaption>
</figure>

<figure>
  <img
  src="tp2/screenshots/tp2_v3.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version </figcaption>
</figure>



## Issues/Problems

- The GUI is not as complete as we wished for: we tried to implement methods that could change the Bump Scale of certain materials (which had associated bump maps). However, this was not possible due to both time restrictions and the complexity of this process;
- Although we don't have manual mipmaps on the e XML scene, we still created methods that take care of them, in case they exist;
- It was a bit complex to implement textures texlength_s and texlength_t. However, we did it to every material that objects with a rectangle primitive, due to its simplicity in comparison to the other kinds of objects;
- Initially, we had an issue with the rotation angles: we were converting them into degrees. However, this issue has already been corrected in the final version of this project.
- Finally, to implement the sprite, we changed and added an attribute to the material descriptor so it could apply transparency to the PNG's image format. If necessary, this attribute should be removed from both the MySceneData parser and the XML file.

----

### [TP3 - ...](tp3)
----
## Project information

- In this project, we created a 3d fantasy racing game based on the mechanics of the famous game Mario Kart with a Final Fantasy theme. The user is first greeted with a menu where he inputs his name and chooses the character he wants to play with. After that, the user is taken to the game scene where he can race against another character. The game consists of 3 laps and the user can control the character with the keys (WASD). The user can also pause the game by pressing the spacebar or return to the menu by pressing escape. When the game is over, the user is taken to the game-over scene where he can see his time, the result of the match, and the difficulty.
- The used models were downloaded in the following website: [Models Resource](https://www.models-resource.com/)

## Game elements

- The game's track is a closed curve defined by multiple control points and the material applies a texture. The player controller has a function that calculates if the player is inside track. When the user leaves the track the car slows down.
- The game has a single-car model and two different characters. The models were loaded using GLTFLoader and they were modified in blender. The car wheels are animated based on the car's speed and trajectory. Characters have different stats and the user can choose which one he prefers to race with.
- The track is populated by power-ups and obstacles. The power-ups are randomly generated and the user can collect them by driving over them. The obstacles are also initially randomly generated but when a power-up is selected the user needs to place a new obstacle on the track. Power-ups have two different effects(speed boost and decrease timer), Obstacles also come in the same two types but with opposite effects. The user can only have one power-up and one obstacle at a time.
- The game's information is displayed on a hud and an outdoor billboard. The information displayed is speed, timer, lap, collision effect countdown. The hud also displays messages regarding the game's state.
- At the beginning of the race there is a traffic light hovering on the track, it signals the beginning of the race and the user can start driving when the lights turn green.
- The user selects the respective car as well as the competitor and the obstacles from a park belonging to the scene. The scene also has a skybox, and building models and is built on the base created by the improved parser of TP2. The parser includes new features like displacement maps which we use to build the terrain.

## Game mechanics

The game implements the following mechanics:

**Picking**: The user can select the car, the competitor, and the obstacles from the park using this mechanic. The placement of the obstacle on the track also relies on this technique.

**KeyFrame Animation**: key points were defined to implement the course of the competitor using the keyframe animation with linear interpolation. The objects also have a rotation animation and wheels animation. Different car models correspond to different animations. The speed of the animation is based on the speed of the car.

**Collision Detection**: Different objects come in contact with each other and the game reacts accordingly. The car can collide with the competitor, the obstacles, and the power-ups. each object has a surrounding circumference and when the distance between the centers of two objects is smaller than the sum of their radiuses a collision is detected. On each frame, collision detection is performed and the game reacts differently depending on the collision with the player. Obstacles and power-ups are temporarily removed and their effect is applied to the player. As for the collision with the competitor, the player is sent in the opposite direction of the impact and is slowed down for a short period. The player is also restricted to a certain area of the map.

**SpriteSheets**: To display text, such as in the hud, the user's name, or in the game over scene, we used sprite sheets. The sprite sheets are loaded using a predefined texture and we change the text by manipulating the uv attribute of the object's geometry so that we can map the specified letter.

**Shaders**: We implement shaders on the obstacle animation, by changing the visual object radius(not the actual radius used for the collisions). We  also implemented shaders on the terrain successfully, although we first tried to have this effect with Three.js **displacementMap()** method. We then discarded this option and implemented it with shaders.

**Particle System**: We implemented a particle system to simulate fireworks which were used on the game over scene. The particle system is composed of a group of particles that are randomly generated and have a limited lifespan. After a particle reaches the end of its lifespan it radially explodes in many others which fade away.

## Interaction
We mentioned many interactions in these previous sections as well as the user manual, including picking, text input, and the manipulation of the player's car using (WASD) keys. Every state of the game has the functionality to reset back to the menu by pressing escape. After the race is over the user can press the spacebar to restart the match. Here is an image representing an overview of the game's interaction:

<figure>
  <img
  src="tp3/screenshots/interaction.png"
  alt="Interaction">
  <figcaption align="center">Fig.01 - Interaction </figcaption>
</figure>

Additional notes on interaction: The hud besides representing textual data, also shows information on the player's status. For instance, if the player is outside of the track, the hud will display a yellow arrow beside the speed indicator representing the slow-down effect. When the player catches a speed boost power-up, the hud will display a green arrow beside the speed indicator representing the speed boost effect. The hud also displays a timer which is used to represent the time left for the power-up or obstacle effect to end. An audio player is also used to run background music.


## Screenshots

Here is a quick recap of the of the project in the form of screenshots:
<figure>
  <img
  src="tp3/screenshots/tp3_v1.png"
  alt="Version1">
  <figcaption align="center">Fig.01 - First Version </figcaption>
</figure>

<figure>
  <img
  src="tp3/screenshots/tp3_v2.png"
  alt="Version1">
  <figcaption align="center">Fig.02 - Second Version </figcaption>
</figure>

<figure>
  <img
  src="tp3/screenshots/tp3_mainMenu.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version's main menu </figcaption>
</figure>

<figure>
  <img
  src="tp3/screenshots/tp3_inputMenu.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version's input menu </figcaption>
</figure>

<figure>
  <img
  src="tp3/screenshots/tp3_carSelec.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version's player's car selection </figcaption>
</figure>


<figure>
  <img
  src="tp3/screenshots/tp3_enemySelec.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version's adversary's car selection </figcaption>
</figure>

<figure>
  <img
  src="tp3/screenshots/tp3_obsSelec.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version's obstacle selection </figcaption>
</figure>

<figure>
  <img
  src="tp3/screenshots/tp3_obsPlacer.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version's obstacle's placer </figcaption>
</figure>

<figure>
  <img
  src="tp3/screenshots/tp3_raceStart.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version's beginning of race </figcaption>
</figure>

<figure>
  <img
  src="tp3/screenshots/tp3_midrace.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version's during the race out of the tracks </figcaption>
</figure>

<figure>
  <img
  src="tp3/screenshots/tp3_raceEnd.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version's end of race with results </figcaption>
</figure>


## Issues/Problems

- Depending on the machine, the program sometimes can crash the browser due to the amount of models;
- The secondary shaders mentioned in the requirements could have been implemented, but, due to time restrictions it was impossible for us to do it.
- The scene could be more improved with more objects than the models;
- Movement could probably be smoother than it is, although we consider already to be good enough for a racing game.

