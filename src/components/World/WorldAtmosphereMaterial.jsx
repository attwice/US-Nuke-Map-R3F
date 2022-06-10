//shaders based on Chris Courses from Youtube
//https://youtu.be/vM8M4QloVL0

import { ShaderMaterial } from "three";
import { extend } from "@react-three/fiber";
import glsl from "glslify";

class WorldAtmosphereMaterial extends ShaderMaterial {
  constructor() {
    super({
      fragmentShader: glsl`
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;

                void main() {
                    vec3 color = vec3(0.0, 0.6, 1.0);
                    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    float alpha = 1.0;
                    gl_FragColor = vec4(color,intensity) * intensity ;
                }
            `,
      vertexShader: glsl`
                varying vec3 vNormal;
                varying vec2 vUv;
                varying vec3 vPosition;

                void main() {
                    /**
                    * Position
                    */
                    
                    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    gl_Position = projectedPosition;
                    
                    vNormal = normal;
                    vPosition = position;
                    vUv = uv;
                }
            `
    });
  }
}

extend({ WorldAtmosphereMaterial });

export { WorldAtmosphereMaterial };
