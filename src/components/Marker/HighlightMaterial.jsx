import {Color, ShaderMaterial} from "three"
import { extend } from "@react-three/fiber"
import glsl from "glslify"

// import fs from './shader/highlight.frag?raw'
// import vs from './shader/highlight.vert?raw'

class HighlightMaterial extends ShaderMaterial{
    constructor(color){
        super({
            uniforms:{
                uTime: {value: 0.0},
                uColor: { value: new Color(color)}
            },
            vertexShader: glsl`
                uniform float uTime;

                varying vec3 vPosition;

                void main() {
                    
                    vPosition = position;
                    
                    vec4 modelPosition = modelMatrix * vec4(vPosition, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    
                    gl_Position = projectedPosition;
                }
            `,
            fragmentShader: glsl`
                uniform vec3 uColor;

                varying vec3 vPosition;

                void main() {
                    
                    vec3 color = uColor;
                    float alpha = 0.35 - vPosition.y;
                    alpha *= 0.05 / (1.0 - distance(vPosition.xz, vec2(0.0)));
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `
        })
    }

    set time(v) {
        this.uniforms["uTime"].value = v;
    }
    get time() {
        return this.uniforms["uTime"].value;
    }
    set color(c) {
        return (this.uniforms["uColor"].value = c);
    }
    get color() {
        return this.uniforms["uColor"].value;
    }

}

extend({HighlightMaterial})

export {HighlightMaterial}