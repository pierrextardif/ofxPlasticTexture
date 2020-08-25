#pragma once

#include "ofMain.h"

#include "ofxPlasticTexture.hpp"

class ofApp : public ofBaseApp{

	public:

		void setup();
		void update();
		void draw();
    
        void keyPressed(int key);
    
    
    ofxPlasticTexture plastic;
    
    
    
};

