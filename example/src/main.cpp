#include "ofMain.h"
#include "ofApp.h"
//========================================================================
int main( ){

    ofGLWindowSettings settings;
    settings.setSize(2000, 1000);
    settings.setGLVersion(3,2);
    ofCreateWindow(settings);
    
    
	ofRunApp( new ofApp());

}
