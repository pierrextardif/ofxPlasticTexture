#include "ofApp.h"


//--------------------------------------------------------------
void ofApp::setup()
{
	ofSetLogLevel(OF_LOG_VERBOSE);
    plastic.setup();
    
    
}

//--------------------------------------------------------------
void ofApp::update()
{
    
   
}

//--------------------------------------------------------------
void ofApp::draw()
{
    plastic.begin();
//    ofSetColor(255, 20, 120);
    
    plastic.end();
    
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key) {
}
