# SGI 2023/2024 - TP2

## Group: T01G01

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Francisco Prada  | 202004646 | up202004646@edu.fe.up.pt |
| Vítor Cavaleiro  | 202004724 | up202004724@edu.fe.up.pt |

----
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
  src="screenshots/tp2_v1.png"
  alt="Version1">
  <figcaption align="center">Fig.01 - First Version </figcaption>
</figure>

<figure>
  <img
  src="screenshots/tp2_v2.png"
  alt="Version1">
  <figcaption align="center">Fig.02 - Second Version </figcaption>
</figure>

<figure>
  <img
  src="screenshots/tp2_v3.png"
  alt="Version1">
  <figcaption align="center">Fig.03 - Final Version </figcaption>
</figure>



## Issues/Problems

- The GUI is not as complete as we wished for: we tried to implement methods that could change the Bump Scale of certain materials (which had associated bump maps). However, this was not possible due to both time restrictions and the complexity of this process;
- Although we don't have manual mipmaps on the e XML scene, we still created methods that take care of them, in case they exist;
- It was a bit complex to implement textures texlength_s and texlength_t. However, we did it to every material that objects with a rectangle primitive, due to its simplicity in comparison to the other kinds of objects;
- Initially, we had an issue with the rotation angles: we were converting them into degrees. However, this issue has already been corrected in the final version of this project.
- Finally, to implement the sprite, we changed and added an attribute to the material descriptor so it could apply transparency to the PNG's image format. If necessary, this attribute should be removed from both the MySceneData parser and the XML file.