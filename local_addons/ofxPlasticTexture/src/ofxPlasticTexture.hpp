//
//  ofxPlasticTexture.hpp
//  example
//
//  Created by Pierre Tardif on 25/08/2020.
//

#ifndef ofxPlasticTexture_hpp
#define ofxPlasticTexture_hpp

using namespace std;

// ==== path definition ==== //
#define LOCALADDON

#ifdef LOCALADDON
    #define PATHTOSHADERS "../../../local_addons/ofxPlasticTexture/src/shaders/"
#else
    #define PATHTOSHADERS "../../../../../addons/ofxPlasticTexture/src/shaders/"
#endif
// ==== path definition ==== //


#include <stdio.h>
#include "ofMain.h"

 // ---- dependency ---- //
#include "ofxAutoReloadedShader.h"

class ofxPlasticTexture{
    public :
    ofxPlasticTexture(){
        
    }
    
    void setup(){
        
        resImg = ofVec2f(ofGetWidth(), ofGetHeight());
        
        string shaderFullPath = PATHTOSHADERS;
        shaderFullPath.append( "main" );
        if(shader.load(shaderFullPath))cout << "loaded plastic shader" << endl;
        
        initPlane();
        
        // init vars
        timer = 0.0f;
        offset = glm::vec2(0,0);
        textureMoving = false;
    }
    
    void initPlane(){
        plane.set(resImg.x, resImg.y, 10, 10);
        plane.setPosition({resImg.x / 2, resImg.y / 2, 0.0f});
    }
    
    void begin(){
        shader.begin();{
        
            shader.setUniform2f("u_resImg", resImg.x, resImg.y);
            shader.setUniform1f("u_time", timer);
            shader.setUniform2f("u_offset", offset);

            plane.draw();
        }
    }
    void end(){
        shader.end();
        if(textureMoving)timer += .1;
    }
    
    void updateTexture()        {offset = glm::vec2(ofRandom(5.), ofRandom(5.));}
    void resetTextureOffset()   {offset = glm::vec2(0,0);}
    void moveTexture()          {textureMoving = !textureMoving;}
    
    ofVec3f resImg;
    ofPlanePrimitive plane;
    ofxAutoReloadedShader shader;
    
    
    float timer;
    glm::vec2 offset;
    bool textureMoving;

};

#endif /* ofxPlasticTexture_hpp */
