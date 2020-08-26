# ofxPlasticTexture

[OpenFrameworks](https://openframeworks.cc/) Plastic textures generator.

![.](./Assets/textureExample.gif)


## Install OF
In order to install [OpenFrameworks](https://openframeworks.cc/), find the guide [here](https://openframeworks.cc/download/).

## Description


### Structure
The addon works with `ofxAutoReloadedShader`, that's the only dependency. It has been added as a local addon in order to get the exact same version.
This is only for development purposes as it is the `dev branch`.
The addon can be used as a local_addon or not, the line 14 of `ofxPlasticTexture.hpp` must be commented out if not used as a local addon:
```cpp
#define LOCALADDON
```
in order to get the right path.
## Getting Started

### Local Addon
Add this to your `OF/apps` folder.
### Normal Addon
Add this to your `OF/addons` folder, and comment out :
```cpp
#define LOCALADDON
```
from `ofxPlasticTexture.hpp` line 14.


</br>
Try the example.

## ShortCuts:


```cpp
    // ==== ofApp.cpp  
    if(key == ' ')plastic.updateTexture(); // changes textures offset
    if(key == 'r')plastic.resetTextureOffset(); // reset offset to (0,0)
    if(key == 'm')plastic.moveTexture(); // noise Offset Moves / Stops
```

## Author

* _pierre Tardif_   [codingcoolsh.it](codingcoolsh.it)   :floppy_disk:

## License

This project is licensed under the MIT License - see the [LICENSE.md](./Assets/LICENSE) file for details.


## Acknowledgments

* [TheBookOfShaders](https://thebookofshaders.com/) :crystal_ball:
* [noise](https://www.shadertoy.com/view/4dS3Wd) :triangular_ruler:
