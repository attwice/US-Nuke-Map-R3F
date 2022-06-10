import {Color, ShaderMaterial} from "three"
import { extend } from "@react-three/fiber"
import glsl from "glslify"

// import fs from './shader/marker.frag?raw'
// import vs from './shader/marker.vert?raw'

class DiscMaterial extends ShaderMaterial{
    constructor(discColor, outlineColor){
        super({
            uniforms:{
                uDiscColor: { value: new Color(discColor)},
                uOutlineColor: {value: new Color(outlineColor)},
                uTime: {value: 0}
            },
            vertexShader: glsl`
                varying vec2 vUv;

                void main(){

                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;

                    gl_Position = projectedPosition;

                    vUv = uv;
                }
            `,
            fragmentShader: glsl`
                uniform vec3 uDiscColor;
                uniform vec3 uOutlineColor;

                varying vec2 vUv;

                void main() {
                    
                    float strength = 1.0 - step(0.40, distance(vUv, vec2(0.5)) + 0.25);
                    float outline = 1.0 - step(0.025, abs(distance(vUv, vec2(0.5)) - 0.25));
                    vec3 color_disk = uDiscColor * strength;
                    vec3 color_outline = uOutlineColor * outline;
                    vec3 color = color_disk + color_outline;
                    float alpha = strength + outline;
                    
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
    set discColor(c) {
        return (this.uniforms["uDiscColor"].value = c);
    }
    get discColor() {
        return this.uniforms["uDiscColor"].value;
    }
    set outlineColor(c) {
        return (this.uniforms["uOutlineColor"].value = c);
    }
    get outlineColor() {
        return this.uniforms["uOutlineColor"].value;
    }
    get speed() {
        return this.uniforms["uSpeed"].value;
    }

}

extend({DiscMaterial})

export {DiscMaterial}