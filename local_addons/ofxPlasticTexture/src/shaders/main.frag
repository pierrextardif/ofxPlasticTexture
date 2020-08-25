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


float imperfections(vec2 uv, float impurityAmnt){
    
    uv *= 50;
    
    uv += noise(uv * 2.);
    uv -= noise(uv * .1);
    
    return 1.0 - smoothstep(.0,impurityAmnt, noise(uv));
}

void main( void )
{
    vec2 uv = texCoordVarying;
    uv.x *= u_resImg.x / u_resImg.y;
    
    float impurityAmnt = .02;
    float n = imperfections(uv, impurityAmnt);
    
    vec3 color = vec3(0);
    color += vec3(n);
//    color += noise(vec2(uv.x * 61, uv.y * 67)) * noise(uv * u_resImg / 2)* noise(vec2(uv.x * 149, uv.y * 151)) * noise(vec2(uv.x * 433, uv.y * 439));
    color += .1 * Hash22(vec2(uv.x,uv.y + 0 * fract(0.001 * u_time) ) );
    
    outputColor = vec4(color, 1.0);
}

