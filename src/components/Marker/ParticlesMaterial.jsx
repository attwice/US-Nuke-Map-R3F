import {ShaderMaterial} from 'three'
import {extend} from "@react-three/fiber"
import glsl from "glslify"

import fs from './shader/particles.frag?raw'
import vs from './shader/particles.vert?raw'

class ParticlesMaterial extends ShaderMaterial {
    constructor(color, texture, maxHeight){
        super({
            uniforms:{
                uTexture: { value: texture},
                uTime: { value: 0.0 },
                uMaxHeight: { value: maxHeight},
                uColor: { value: color },
            },
            fragmentShader: glsl`
                uniform vec3 uColor;
                uniform float uSize;
                uniform sampler2D uTexture;

                varying vec3 vPosition;
                varying vec2 vUv;

                void main() {
                    
                    float position_mx = 5.0;
                    float vert_strength = 0.5 - abs(vPosition.y);
                    vec3 color = uColor * step(0.5, (0.25 / (distance(gl_PointCoord, vec2(0.5)))));
                    float alpha = vert_strength * step(0.5, (0.25 / (distance(gl_PointCoord, vec2(0.5)))));
                    // if(alpha < 0.2) discard;
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            vertexShader: glsl`
                attribute float aSpeed;
                attribute float aSize;
                attribute float aLife;

                uniform float uTime;

                varying vec3 vPosition;
                varying vec2 vUv;

                void main() {
                    /**
                    * Position
                    */
                    
                    vPosition = position;
                    vPosition.y += uTime * aSpeed;
                    vPosition.y = -fract(vPosition.y);
                    // vPosition.y = -fract(sin(vPosition.y - 0.5));
                    float dist = abs(1.0 - distance(position.xz, vec2(0.5, 0.5)));
                    
                    vec4 modelPosition = modelMatrix * vec4(vPosition, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    gl_Position = projectedPosition;
                    
                    /**
                    * Size
                    */
                    gl_PointSize = aSize;
                    
                    vUv = uv;
                }
            `
        })       

    }
    set texture(v) {
        this.uniforms["uTexture"].value = v;
    }
    get texture() {
        return this.uniforms["uTexture"].value;
    }
    set time(v) {
        this.uniforms["uTime"].value = v;
    }
    get time() {
        return this.uniforms["uTime"].value;
    }
    set maxHeight(v) {
        this.uniforms["uMaxHeight"].value = v;
    }
    get maxHeight() {
        return this.uniforms["uMaxHeight"].value;
    }
    set color(c) {
        return (this.uniforms["uColor"].value = c);
    }
    get color() {
        return this.uniforms["uColor"].value;
    }
}

extend({ParticlesMaterial})

export{ParticlesMaterial}