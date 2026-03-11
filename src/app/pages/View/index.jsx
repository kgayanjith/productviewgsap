"use client";
import React, { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import Lenis from "lenis";
import { metalness, roughness } from "three/src/nodes/core/PropertyNode";

gsap.registerPlugin(ScrollTrigger, SplitText);

function Index() {
  useEffect(() => {
    if (!document.querySelector('script[src*="ionicons"]')) {
      const script1 = document.createElement("script");
      script1.type = "module";
      script1.src =
        "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.setAttribute("nomodule", "");
      script2.src =
        "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js";
      document.head.appendChild(script2);
    }

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const header1Split = new SplitText(".header-1 h1", {
      type: "chars",
      charsClass: "char",
    });
    const titleSplits = new SplitText(".tooltip .title h2", {
      type: "lines",
      linesClass: "line",
    });
    const descriptionSplits = new SplitText(".tooltip .description p", {
      type: "lines",
      linesClass: "line",
    });

    header1Split.chars.forEach(
      (char) => (char.innerHTML = `<span>${char.innerHTML}</span>`),
    );

    [...titleSplits.lines, ...descriptionSplits.lines].forEach(
      (line) => (line.innerHTML = `<span>${line.innerHTML}</span>`),
    );

    const animOptions = { duration: 1, ease: "power3.out", stagger: 0.025 };

    const tooltipSelectors = [
      {
        trigger: 0.65,
        elements: [
          ".tooltip:nth-child(1) .icon ion-icon",
          ".tooltip:nth-child(1) .title .line > span",
          ".tooltip:nth-child(1) .description .line > span",
        ],
      },
      {
        trigger: 0.65,
        elements: [
          ".tooltip:nth-child(2) .icon ion-icon",
          ".tooltip:nth-child(2) .title .line > span",
          ".tooltip:nth-child(2) .description .line > span",
        ],
      },
    ];

    ScrollTrigger.create({
      trigger: ".product-overview",
      start: "75% bottom",
      onEnter: () =>
        gsap.to(".header-1 h1 .char > span", {
          y: "0%",
          duration: 1,
          ease: "power3.out",
          stagger: 0.025,
        }),
      onLeaveBack: () =>
        gsap.to(".header-1 h1 .char > span", {
          y: "100%",
          duration: 1,
          ease: "power3.out",
          stagger: 0.025,
        }),
    });

    let model,
      currentRotation = 0,
      modelSize;

    const cameraDistance = 1.3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1.0;

    const container = document.querySelector(".modal-conatiner");
    container.appendChild(renderer.domElement);

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(1, 2, 3);
    mainLight.castShadow = true;
    mainLight.shadow.bias = -0.001;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.9);
    fillLight.position.set(-2, 0, -2);
    scene.add(fillLight);

    function setupModel() {
      if (!model || !modelSize) return;

      const isMobile = window.innerWidth < 1000;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());

      model.position.set(
        isMobile ? center.x + modelSize.x * 1 : -center.x - modelSize.x * 0.4,
        -center.y + modelSize.y * 0.085,
        -center.z,
      );

      model.rotation.z = isMobile ? 0 : THREE.MathUtils.degToRad(-25);

      const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
      camera.position.set(0, 0, maxDim * cameraDistance);
      camera.near = maxDim * 0.01;
      camera.far = maxDim * 100;
      camera.updateProjectionMatrix();
      camera.lookAt(0, 0, 0);
    }

    new GLTFLoader().load(
      "/shaker.glb",
      (gltf) => {
        model = gltf.scene;
        // console.log("GLB loaded:", model);

        model.traverse((node) => {
          if (node.isMesh && node.material) {
            Object.assign(node.material, {
                metalness:0.1,
                roughness:0.8,
            });
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        modelSize = box.getSize(new THREE.Vector3());
        // console.log("Model size:", modelSize);

        if (modelSize.length() === 0) {
          console.warn("Model size is zero — check your GLB file");
          modelSize = new THREE.Vector3(1, 1, 1);
        }

        scene.add(model);
        setupModel();
        // console.log("Camera position after setup:", camera.position);
      },
      (xhr) => {
        if (xhr.total > 0) {
          console.log(
            `Loading GLB: ${Math.round((xhr.loaded / xhr.total) * 100)}%`,
          );
        }
      },
      (error) => {
        console.error("GLB load error:", error);
      },
    );

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setupModel();
    }
    window.addEventListener("resize", onResize);

    ScrollTrigger.create({
      trigger: ".product-overview",
      start: "top top",
      end: `+=${window.innerHeight * 10}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: ({ progress }) => {
        const headerProgress = Math.max(
          0,
          Math.min(1, (progress - 0.05) / 0.3),
        );
        gsap.to(".header-1", {
          xPercent:
            progress < 0.05
              ? 0
              : progress > 0.35
                ? -100
                : -100 * headerProgress,
        });

        const maskSize =
          progress < 0.2
            ? 0
            : progress > 0.3
              ? 100
              : 100 * ((progress - 0.2) / 0.1);
        gsap.to(".circular-mask", {
          clipPath: `circle(${maskSize}% at 50% 50%)`,
        });

        const header2Progress = (progress - 0.15) / 0.35;
        const header2XPercent =
          progress < 0.15
            ? 100
            : progress > 0.5
              ? -200
              : 100 - 300 * header2Progress;
        gsap.to(".header-2", { xPercent: header2XPercent });

        const scaleX =
          progress < 0.45
            ? 0
            : progress > 0.65
              ? 100
              : 100 * ((progress - 0.45) / 0.2);
        gsap.to(".tooltip .divider", { scaleX: `${scaleX}%`, ...animOptions });

        tooltipSelectors.forEach(({ trigger, elements }) => {
          gsap.to(elements, {
            y: progress > trigger ? "0%" : "125%",
            ...animOptions,
          });
        });

        if (model && progress > 0.05) {
          const rotationProgress = (progress - 0.05) / 0.95;
          const targetRotation = Math.PI * 3 * 4 * rotationProgress;
          const rotationDiff = targetRotation - currentRotation;
          if (Math.abs(rotationDiff) > 0.001) {
            model.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationDiff);
            currentRotation = targetRotation;
          }
        }
      },
    });

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      lenis.destroy();
      renderer.dispose();
    };
  }, []);

  return (
    <main>
      <section className="intro">
        <h1>Precision engineered. Elite by design.</h1>
      </section>
      <section className="product-overview">
        <div className="header-1">
          <h1>Peak Performance Begins.</h1>
        </div>
        <div className="header-2">
          <h1>APEX Shaker.</h1>
        </div>
        <div className="circular-mask"></div>
        <div className="tooltips">
          <div className="tooltip">
            <div className="icon">
              <ion-icon name="flash"></ion-icon>
            </div>
            <div className="divider"></div>
            <div className="title">
              <h2>Crafted to Endure</h2>
            </div>
            <div className="description">
              <p>
                Forged from aerospace-grade materials, APEX is built for
                athletes who accept nothing less than excellence. Session after
                session, it holds its standard.
              </p>
            </div>
          </div>
          <div className="tooltip">
            <div className="icon">
              <ion-icon name="bluetooth"></ion-icon>
            </div>
            <div className="divider"></div>
            <div className="title">
              <h2>Intelligent Hydration</h2>
            </div>
            <div className="description">
              <p>
                Seamlessly synced to your routine, APEX tracks every sip with
                precision. Set targets, measure progress, and elevate your
                performance with data that moves with you.
              </p>
            </div>
          </div>
        </div>
        <div className="modal-conatiner"></div>
      </section>
      <section className="outro">
        <h1>Train With Intent. Perform With APEX.</h1>
      </section>
    </main>
  );
}

export default Index;
