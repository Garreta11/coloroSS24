
uniform vec4 resolution;
uniform float uTime;
uniform vec2 uMouse;
uniform sampler2D uMatcap;
uniform sampler2D uMatcap1;
varying vec2 vUv;

float PI = 3.1415926535897932384626433832795;

float hash(vec2 x)
{
	return fract(cos(dot(x.xy,vec2(2.31,53.21))*124.123)*412.0); 
}

vec3 cc(vec3 color, float factor,float factor2) //a wierd color modifier
{
	float w = color.x+color.y+color.z;
	return mix(color,vec3(w)*factor,w*factor2);
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec2 getmatcap(vec3 eye, vec3 normal){
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt( reflected.z+1.0 );
  return reflected.xy / m + 0.5;
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float smin( float a, float b, float k )
{
    // float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    // return mix( b, a, h ) - k*h*(1.0-h);
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*h*k*(1.0/6.0);
}

float sdSphere(vec3 p, float r) {
    return length(p)-r;
}

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 sdf(vec3 p) {
    float type = 0.;
    vec3 p1 = rotate(p, vec3(1.), uTime * 0.001);

    float s = 0.1 + 0.008 * sin((uTime * 0.001)) + 0.02 * sin((uTime * 0.001));
    
    float final = sdSphere(p, s);

    for (float i = 0.; i < 3.; i++) {
        float randOffset = rand(vec2(i, 0.));
        float progr = 0.15 * sin(uTime * 0.001 + randOffset * 1000.);
        
        vec3 pos = vec3(sin(randOffset * 3. * PI), cos(randOffset * 3. * PI), 1.0);

        float gotoCenter = sdSphere(p - pos * progr, 0.03);
        final = smin(final, gotoCenter, 0.2);
    }

    float mouseSphere = sdSphere(p - vec3(uMouse, 0.), 0.03 + 0.01 * sin(uTime * 0.001));

    type = clamp((final - mouseSphere) / 0.2, 0., 1.);

    return vec2(smin(final, mouseSphere, 0.4), type);

}

vec3 calcNormal( in vec3 p ) // for function f(p)
{
    const float eps = 0.0001; // or some other value
    const vec2 h = vec2(eps,0);
    return normalize( vec3(sdf(p+h.xyy).x - sdf(p-h.xyy).x,
                           sdf(p+h.yxy).x - sdf(p-h.yxy).x,
                           sdf(p+h.yyx).x - sdf(p-h.yyx).x ) );
}

void main() {
    float dist = length(vUv - vec2(0.5));
    vec3 bg = mix(vec3(0.3),vec3(0.0), dist);

    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec3 camPos = vec3(0.0, 0.0, 2.);
    vec3 ray = normalize(vec3((vUv - vec2(0.5)), -1));

    vec3 rayPos = camPos;
    float t = 0.0;
    float tMax = 10.0;
    float type = -1.;
    for (int i = 0; i < 256; ++i) {
        vec3 pos = camPos + t*ray;
        float h = sdf(pos).x;
        type = sdf(pos).y;
        if (h < 0.0001|| t > tMax) break;
        t+=h;
    }

    vec3 color = bg;
    float opacity = 0.0;
    if ( t < tMax) {
        vec3 pos = camPos + t*ray;
        vec3 normal = calcNormal(pos);
        vec2 matcapUV = getmatcap(ray, normal);
        // if (type < 0.5) {
        //     color = texture2D(uMatcap, matcapUV).rgb;
        // } else {
        //     color = texture2D(uMatcap1, matcapUV).rgb;
        // }

        color = mix(texture2D(uMatcap, matcapUV).rgb, texture2D(uMatcap1, matcapUV).rgb, type);
        float fresnel = pow(1. + dot(ray,normal), 100.);
        color = mix(color,bg,fresnel);

        opacity = 1.0;
    }

    // post procesing
	// color *=.85;
	// color = mix(color, color * color, 0.3);
	// color -= hash(color.xy + vUv.xy) * .015;
	// color -= length(vUv) * .1;
	// color = cc(color,.5,.6);

    gl_FragColor = vec4(color, opacity);
}