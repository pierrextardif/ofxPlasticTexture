#version 150
#define LOCALADDON

#define M_PI 3.1415926535897932

// ==== global ==== //
//uniform sampler2DRect       u_tex_unit0;
uniform float               u_time;
uniform vec2                u_resImg;


in vec2 texCoordVarying;

out vec4 outputColor;

// ===== import elements ==== //

//#ifdef LOCALADDON
//#   pragma include "../../../local_addons/ofxPlasticTexture/src/Shaders/utils.glsl"
//#else
//#   pragma include "../../../../../addons/ofxPlasticTexture/src/Shaders/utils.glsl"
//#endif


// test colors
vec3 magenta = vec3(1.0, .3, .6);
vec3 avocado = vec3(0.34, .51, .01);
vec3 turquoise = vec3(0.1, .21, .99);



float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}



float Hash(vec2 p){
    p = fract(p * vec2( 123.34, 456.21));
    p += dot(p, p + 5.32);
    return fract(p.x*p.y);
}

float Hash22(vec2 p) {
    p = fract(p*vec2(123.34, 456.21));
    p += dot(p, p+45.32);
    return clamp(fract(p.x * p.y), 0.0, 1.0);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( Hash( i + vec2(0.0,0.0) ),
                     Hash( i + vec2(1.0,0.0) ), u.x),
                mix( Hash( i + vec2(0.0,1.0) ),
                     Hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

float noise_(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}


float imperfections(vec2 uv, float impurityAmnt, float size){
    
    uv *= size;
    
    uv += noise(uv * 2.);
    uv -= noise(uv * .1);
    
    return 1 - smoothstep(.0,impurityAmnt, noise(uv));
}

float fold(vec2 originalUvs){
    
    vec2 uv = originalUvs;
    
    uv.x -= .5 * u_resImg.x / u_resImg.y;
    uv = .1 * rotate2d( .5 * noise_(uv) ) * uv;
    
    float v1 = .2 * (1. - smoothstep(0, .1, abs(sin(uv.x * 2 * M_PI)) * .5));
    
    uv = originalUvs;
    
    uv.x -= .5 * u_resImg.x / u_resImg.y;
    uv = .3 * rotate2d( .5 * noise_(uv) ) * uv;
    v1 += .6 * (1. - smoothstep(0, .005, abs(sin(uv.x * 2 * M_PI))));
    
    
    uv = originalUvs;
    
    uv.y -= .3 * u_resImg.x / u_resImg.y;
    uv = .1 * rotate2d( .04 * noise_(uv) ) * uv;
    v1 += .2 * (1. - smoothstep(0, .1, abs(sin(uv.y * 2 * M_PI)) * .5));
    
    uv = originalUvs;
    
    uv.y -= .3 * u_resImg.x / u_resImg.y;
    uv = .3 * rotate2d( .04 * noise_(uv) ) * uv;
    v1 += .6 * (1. - smoothstep(0, .005, abs(sin(uv.y * 2 * M_PI)) * .9));

    
    
    uv = originalUvs;
    
    uv *= 10;
    uv = .1 * rotate2d( .3 * noise_(uv) ) * uv;
    
    float v2 = 1. - smoothstep(0, .1, abs(sin( (uv.x + uv.y * .4) * 2 * M_PI)) * .9);
    
    
    uv = originalUvs;
    
    uv *= 10;
    uv = .1 * rotate2d( .2 * noise_(uv) ) * uv;
    
    float v3 = 1. - smoothstep(0, .1, abs(sin((uv.x * .2 + uv.y) * 2 * M_PI)) * .9);
    
    float v4 = 1 - smoothstep(0, .1, abs(cos(uv.x * 2 * M_PI)));
    
    return (v1 + v2 + v2 + v3) * ( .3 + .7 * v4) + 3. * v4 * v3;
    return v1;
}

void main( void )
{
    vec2 uv = texCoordVarying;
    uv.x *= u_resImg.x / u_resImg.y;
    
    
    uv.y += u_time * 0.001;
    
    
    float impurityAmnt = .02;
    float size = 50;
    float n = imperfections(uv, impurityAmnt, size);
    
    float waves = .6 * fold(uv);
    
    vec3 color = vec3(0);
    
    color += waves;
    
    color += vec3(n);
    color += .1 * Hash22( uv );
    
    
    
    outputColor = vec4(color, 1.0);
}

