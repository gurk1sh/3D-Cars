import React, {Suspense, useEffect, useRef, useState} from "react";
import "./App.scss";
//Components
import Header from "./components/header";
import { Section } from "./components/section";
import { Canvas, useFrame } from "react-three-fiber";

import { Html, useGLTFLoader } from "drei";

//page states
import state from './components/state';

//intersection observer
import { useInView } from 'react-intersection-observer';

const Model = ({modelPath}) => {
  const gltf = useGLTFLoader(modelPath, true);
  gltf.scene.scale.setScalar(0.33);
  return <primitive object={gltf.scene} dispose={null} />
}

const Lights = () => {
  return (
    <>
    <ambientLight intensity={0.3} />
    <directionalLight position={[10,10,5]} intensity={1} />
    <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
    </>    
  )
}

const HTMLContent = ({direction, bgColor, domContent, children, modelPath, positionY}) => {
  const ref = useRef();
  let spinAcceleration;
  if (direction) {
    spinAcceleration = 0.01;
  } else if (!direction) {
    spinAcceleration = -0.01;
  }
  useFrame(() => (ref.current.rotation.y += spinAcceleration));
  const [refItem, inView] = useInView({
    threshold: 0,
  });

  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  });

  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, positionY, 0]}>
        <mesh ref={ref} position = {[0, -35, 0]}>
          <Model modelPath={modelPath} />
        </mesh>
        <Html fullscreen portal={domContent}>
          <div ref={refItem} className="container">{children}</div>
        </Html>
      </group>
    </Section>
  )
}



export default function App() {
  const domContent = useRef();
  const scrollArea = useRef();
  const [direction, setDirection] = useState(true);
  
  const onScroll = (e) => (state.top.current) = e.target.scrollTop;

  useEffect(() => void onScroll({target: scrollArea.current}), []);
  
  return (
    <>
      <Header 
      changeDirection={setDirection}
      />
      <Canvas colorManagement camera={{ position: [0, 0, 120], fov: 70 }}>
        <Lights />
        <Suspense fallback={null}>
          <HTMLContent direction={direction} domContent={domContent} modelPath="/mcqueen.gltf" positionY={250} bgColor={'#E9302A'} >
            <h1 className="title">McQueen</h1> 
          </HTMLContent>
          <HTMLContent direction={direction} domContent={domContent} modelPath="/king.gltf" positionY={0} bgColor={'#25B3F5'} >
            <h1 className="title">King</h1> 
          </HTMLContent>
          <HTMLContent direction={direction} domContent={domContent} modelPath="/hicks.gltf" positionY={-250} bgColor={'#75D859'} >
            <h1 className="title">Hicks</h1>
          </HTMLContent>
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{position: 'sticky', top:0}} ref={domContent}></div>  
        <div style={{ height: `${state.pages * 100}vh` }} />
      </div>
    </>
  );
}