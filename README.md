A scroll driven 3D product showcase built with React, Three.js, GSAP and Lenis.

This project presents the APEX Shaker as an interactive product experience rather than a traditional product page. As you scroll through the page, the 3D shaker model appears, rotates and moves with the content while the product information is revealed through a series of animations.

## Overview

The main idea behind this project was to create a premium product presentation with a strong focus on motion and visual interaction.

The page starts with a simple introduction and gradually transitions into the main product section. The APEX Shaker is loaded as a GLB model and rendered directly in the browser using Three.js.

GSAP and ScrollTrigger control the movement of the headings, product information, circular mask and 3D model. Lenis is used to create a smoother scrolling experience.

## Features

3D APEX Shaker model rendered with Three.js

Scroll controlled 3D model rotation

Smooth scrolling with Lenis

GSAP powered animations

ScrollTrigger based animation timeline

Animated text using GSAP SplitText

Responsive model positioning for smaller screens

Dynamic camera positioning based on the model size

Lighting and shadows for the 3D scene

Animated product feature sections

Ionicons for product feature icons

Responsive canvas resizing

## Tech Stack

React

Next.js

Three.js

GSAP

GSAP ScrollTrigger

GSAP SplitText

Lenis

Ionicons

GLTF / GLB

JavaScript

## How It Works

The main component initializes the animation and 3D scene inside a React `useEffect`.

Lenis handles the smooth scrolling and its scroll updates are connected to GSAP ScrollTrigger. This allows the scroll position to control the different stages of the product presentation.

The 3D scene is created with a perspective camera, transparent WebGL renderer and multiple lights. The APEX Shaker model is then loaded from the public folder using `GLTFLoader`.

The model is automatically measured after loading so the camera and model position can be adjusted depending on its dimensions. The layout also changes slightly when the screen width is below 1000px.

During scrolling, ScrollTrigger controls the complete product sequence. The first heading moves away, a circular mask expands, the second heading enters the screen and the product feature information appears progressively. At the same time, the 3D model rotates according to the scroll progress.

## 3D Model

The project expects the product model to be available at:

```text
/public/shaker.glb
```

The model is loaded using Three.js `GLTFLoader`.

After loading, the materials are adjusted to give the model a more controlled appearance with lower metalness and higher roughness. The model is then added to the scene and positioned according to its calculated dimensions.

If you want to use a different product model, replace `shaker.glb` and adjust the model positioning if the new object has very different proportions.

## Animation Experience

The page uses several layers of animation to create the product reveal.

The opening heading uses SplitText so each character can be animated individually.

The feature titles and descriptions are split into lines so they can enter the screen smoothly.

The main product section stays pinned while the user scrolls through the animation sequence.

The circular mask expands during the transition between the two main headings.

The feature dividers and text appear at specific points in the scroll timeline.

The 3D shaker rotates continuously based on the current scroll progress.

This creates the feeling that the user is moving through a product presentation rather than simply scrolling through a normal webpage.

## Product Sections

The showcase currently contains two product highlights.

### Crafted to Endure

The first section focuses on the durability and materials of the APEX Shaker.

### Intelligent Hydration

The second section presents the concept of connected hydration and tracking.

These sections are defined directly in the React component and can be replaced with different product features depending on the project.

## Getting Started

Clone the repository and install the dependencies.

```bash
npm install
```

Make sure the `shaker.glb` file is placed inside the public folder.

Then start the development server.

```bash
npm run dev
```

Open the local development URL shown by Next.js in your browser.

## Customization

The product experience can be customized by changing the 3D model, product text, animation timings, lighting and camera settings.

The main scroll animation is controlled inside the `ScrollTrigger.create` section, so this is the main place to adjust how the page responds to scrolling.

The model lighting can also be changed by modifying the ambient and directional lights in the Three.js scene.

## Performance

The renderer limits the pixel ratio to a maximum of 2 to avoid unnecessarily high rendering costs on high density displays.

The WebGL renderer also uses antialiasing and transparent rendering so the 3D model can sit naturally over the webpage design.

The animation and renderer are cleaned up when the React component is unmounted. This removes the resize listener, kills active ScrollTriggers, destroys Lenis and disposes the Three.js renderer.

## Project Structure

A simple setup for the project can look like this:

```text
project
│
├── public
│   └── shaker.glb
│
├── app
│   └── page.jsx
│
├── package.json
└── README.md
```

The exact folder structure can be adjusted depending on how the Next.js application is organized.

## Inspiration

The project is focused on exploring how 3D product visualization and scroll based interaction can be combined to create a more engaging web experience.

Rather than presenting the product through static images, the interaction lets the user gradually discover the product through movement, animation and 3D visualization.

## License

This project is intended for learning, experimentation and portfolio purposes.
