#version 150

#define     PI      3.14159265358979323
#define TWO_PI      6.28318530718

// ==== global ==== //
uniform float               u_time;
uniform vec2                u_resImg;
uniform vec2                u_offset;
uniform int                 u_localAddon;


in vec2 texCoordVarying;

out vec4 outputColor;



float Hash(vec2 p){
    p = fract(p * vec2( 123.34, 456.21));
    p += dot(p, p + 5.32);
    return fract(p.x*p.y);
}

float noise(vec2 st) {
    
    st += u_time * 0.1;
    
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( Hash( i + vec2(0.0,0.0) ),
                     Hash( i + vec2(1.0,0.0) ), u.x),
                mix( Hash( i + vec2(0.0,1.0) ),
                     Hash( i + vec2(1.0,1.0) ), u.x), u.y);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}


float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}



float imperfections(vec2 uv, float impurityAmnt, float size){
    
    uv *= size;
    
    uv += noise(uv * 2.);
    uv -= noise(uv * .1);
    
    return 1 - smoothstep(.0,impurityAmnt, noise(uv));
}

float outlineNoise(vec2 uv, float n){
    
    float outline = 0;
    
    uv = .3 * rotate2d( .5 * noise(uv) ) * uv;
    outline += .6 * (1. - smoothstep(0, n, abs(sin(uv.x * TWO_PI))));
    
    return outline;
}

float layer(vec2 uv, float startVal, float coeffSmooth, float coeffNoise){
    float l = 0;
    
    float t = smoothstep(startVal, 1. - coeffSmooth * noise(uv), noise(uv));
    l += coeffNoise * t;
    
    l +=  outlineNoise(uv, .1 * t);
    
    return l;
}


float globalNoise(vec2 uv){
    
    float n = 0;
    
    
    uv *= 3.;
    
    uv = rotate2d(PI / 6) * uv;
    uv -= noise(uv * .6);
    
    float coeff1 = random(uv);
    float coeff2 = random(uv + 1);
    n = .4 * (1 - smoothstep(0, .5, noise(uv)));
    
    

    uv += .3 * rotate2d(noise(uv)) * uv;
    n += .1 * (1 - smoothstep(.4, 1., noise(uv)));
    
    n += layer(uv, .4, .4, .6);
    n += layer(uv, -.1, .2, .1);

    n -= .6 * smoothstep(.6, 1. - .2 * noise(uv), noise(uv));
    n += .03 * smoothstep(.96, 1. - .06 * noise(uv), noise(uv));
    n += .02 * smoothstep(.2, .2 + .4 * noise(uv), noise(uv));
    
    return n;
}




void main( void )
{
    vec2 uv = texCoordVarying;
    uv.x *= u_resImg.x / u_resImg.y;
    
    
    uv += u_offset;
    
    vec3 color = vec3(globalNoise( uv ));
    
    float impurityAmnt = .02;
    float size = 50;
    color += imperfections(uv, impurityAmnt, size);
    color += .04 * Hash( uv );
    
    
    outputColor = vec4(color, 1.0);
}

