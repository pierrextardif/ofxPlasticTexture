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

#ifdef LOCALADDON
#   pragma include "../../../local_addons/ofxPlasticTexture/src/Shaders/utils.glsl"
#else
#   pragma include "../../../../../addons/ofxPlasticTexture/src/Shaders/utils.glsl"
#endif


// test colors
vec3 magenta = vec3(1.0, .3, .6);
vec3 avocado = vec3(0.34, .51, .01);
vec3 turquoise = vec3(0.1, .21, .99);



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


float imperfections(vec2 uv, float impurityAmnt, float size){
    
    uv *= size;
    
    uv += noise(uv * 2.);
    uv -= noise(uv * .1);
    
    return 1 - smoothstep(.0,impurityAmnt, noise(uv));
}

float lineThrough(vec2 uv, float rotateFactor, float freq, vec2 offset, float intensity){
    
    float v1 = 0;
    
    uv.x -= offset.x * u_resImg.x / u_resImg.y;
    uv.y -= offset.y * u_resImg.x / u_resImg.y;
    uv = rotateFactor * rotate2d( .02 * noise(uv) ) * uv;
    v1 = .6 * (1. - smoothstep(0, .005, abs(sin(uv.y * 2 * M_PI))));
    
    v1 *= intensity + intensity * cos(uv.x * freq * M_PI);
    return v1;
}

float lines(vec2 uv){
    float v = 0;
    
    
    int amnt = 20;
    for( float i = 0; i < amnt; i++){
        
        float intensity = .1 + .1 * cos(12 * i / amnt * 2 * M_PI);
        v += lineThrough(uv, .8 * ( i / (8 * amnt) +.8), amnt / (i + 1), vec2(i * .05, i * .1), intensity);
        
    }

    
    return v;
}

float outlineNoise(vec2 uv, float n){
    
    float outline = 0;
    
    uv = .3 * rotate2d( .5 * noise_(uv) ) * uv;
    float v1 = .6 * (1. - smoothstep(0, n, abs(sin(uv.x * 2 * M_PI))));
//    v1 += .6 * (1. - smoothstep(0, n, noise(uv * 2 * M_PI * 10)));
    
    return v1;
}

float layer(vec2 uv){
    float l = 0;
    
    
    
    return l;
}

float globalNoise(vec2 uv){
    
    float n = 0;
    
    
    uv *= 3.;
    
    uv = rotate2d(M_PI / 6) * uv;
    uv -= noise(uv * .6);
    
    float coeff1 = random(uv);
    float coeff2 = random(uv + 1);
    n = .4 * (1 - smoothstep(0, .5, noise(uv)));
    
    

    uv += .3 * rotate2d(noise(uv)) * uv;
    n += .1 * (1 - smoothstep(.4, 1., noise(uv)));
    
    n += .6 * smoothstep(.4, 1. - .4 * noise(uv), noise(uv));
    n -= .6 * smoothstep(.6, 1. - .2 * noise(uv), noise(uv));
    n += .1 * smoothstep(.96, 1. - .1 * noise(uv), noise(uv));
    n += .1 * smoothstep(.2, .2 + .4 * noise(uv), noise(uv));
    
    
    float t = .1 * smoothstep(.4, 1. - .4 * noise(uv), noise(uv));
    vec2 nUv = .5 * rotate2d(noise(uv)) * uv;
    float t1 = .1 * smoothstep(.4, 1. - .4 * noise(nUv), noise(nUv));
    float lineFold = outlineNoise(uv, t);
    lineFold = (.2 * t + .8 ) * outlineNoise(uv, t);
    
    uv = rotate2d(M_PI / 8) * uv;
    lineFold += outlineNoise(uv, t1);
    
    n += lineFold;
    
    
    return n;
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
//    return v1;
}




void main( void )
{
    vec2 uv = texCoordVarying;
    uv.x *= u_resImg.x / u_resImg.y;
    
    
    uv.x += u_time * 0.000;
    
    
    
//    uv.y += u_time * 0.001;
    
    
    float impurityAmnt = .02;
    float size = 50;
    float n = imperfections(uv, impurityAmnt, size);
    
//    float waves = .6 * fold(uv);
    float lines = lines(vec2(uv.x, uv.y));
    
    float noise = globalNoise( uv );
    
    vec3 color = vec3(0);
    
    color += lines;
    color += noise;
//    color += waves;
    
    color += n;
    color += .1 * Hash22( uv );
    
    
    
    outputColor = vec4(color, 1.0);
}

