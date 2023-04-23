import React, { useRef, useEffect } from 'react'
import * as THREE from 'three';

function Cube({ value }) {

  const mountRef = useRef(null);

  useEffect(() => {
    const { current } = mountRef;
    // Set up the scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#18163A');
    const camera = new THREE.PerspectiveCamera(75, current.clientWidth / current.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(current.clientWidth, current.clientHeight);

    // set up texture
    const texture = new THREE.TextureLoader().load('https://raw.githubusercontent.com/SuboptimalEng/three-js-tutorials/main/06-textures/assets/space.jpeg');

    // Set up the cube
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1), map: texture })

    const cube = new THREE.Mesh(geometry, material);
    // rotation in radians
    cube.rotation.y = Math.PI * value / 180;
    scene.add(cube);

    current.appendChild(renderer.domElement);

    // Set up the camera position
    camera.position.z = 5

    // Animate the scene
    const animate = function () {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      current.removeChild(renderer.domElement);
    };
  }, [value])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      ref={mountRef}
    >
    </div>
  )
}

export default Cube;