// https://www.shadertoy.com/new
// https://soundcloud.com/midland/caribou-sun-midland-re-edit

vec3 palette( float t ) {
    vec3 a = vec3(0.788, 0.508, 0.500);
    vec3 b = vec3(0.388, 0.500, 0.500);
    vec3 c = vec3(6.277, 3.437, 6.277);
    vec3 d = vec3(-0.682, 0.333, 0.667);

    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) /iResolution.y ;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    int numIterations = 10; // recommended: 2-12, 8
    
    for(int i = 0; i < numIterations; i++) {
        float numTiles = 1.5;  // 1.8
        
        // frequency data
        float fft  = textureLod( iChannel0, vec2(uv.x,0.25), 0.0 ).x; 
        
        // sound wave
        float wave = textureLod( iChannel0, vec2(uv.x,0.75), 0.0 ).x;
        
        float addMotionFromSound = fft  * .1;
        // if(i > 9) addMotionFromSound = 0.;
        
        float zoomTime_inverse = 30.;
        uv = fract(uv * numTiles *(sin(iTime/zoomTime_inverse))) - 0.5; // zoom in and out
        // uv = fract(uv * numTiles ) - 0.5;


        float distanceFromCenter = length(uv) * exp(-length(uv0)) ;
        float bigRingWidth = 0.07;
        float bigRingSpeed_inverse = 12.;
        vec3 color = palette(length(uv0 * bigRingWidth) + (iTime/bigRingSpeed_inverse));

        float stretch = 10.0;
        float fractalSpeed_inverse = 30.;
        distanceFromCenter = sin(distanceFromCenter * stretch - iTime/fractalSpeed_inverse +addMotionFromSound) / stretch;

        distanceFromCenter = abs(distanceFromCenter);


        float amplitude = 0.03;
        float speed = 0.5;
        // float ringWidth = amplitude * sin(iTime* speed) + amplitude + 0.01;

        float ringWidth = 0.004;
        float neonGlow_inverse = 1.2;
        distanceFromCenter = pow(ringWidth / distanceFromCenter, neonGlow_inverse);


        // color *= distanceFromCenter;
        finalColor += color * distanceFromCenter;

        };
    
    // Output to screen
    fragColor = vec4(finalColor, 1.0);
}


