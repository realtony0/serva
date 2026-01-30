"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Dish3DSceneProps {
	imageUrl: string;
	model3DUrl?: string;
}

export default function Dish3DScene({ imageUrl, model3DUrl }: Dish3DSceneProps) {
	const mountRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Fonction pour créer un modèle 3D à partir de l'image avec depth map
	const create3DModelFromImage = async (img: HTMLImageElement): Promise<THREE.Group> => {
		return new Promise((resolve) => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				resolve(new THREE.Group());
				return;
			}

			ctx.drawImage(img, 0, 0);
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

			// Créer une depth map
			const depthCanvas = document.createElement("canvas");
			depthCanvas.width = canvas.width;
			depthCanvas.height = canvas.height;
			const depthCtx = depthCanvas.getContext("2d");
			if (!depthCtx) {
				resolve(new THREE.Group());
				return;
			}

			const depthData = depthCtx.createImageData(canvas.width, canvas.height);
			for (let i = 0; i < imageData.data.length; i += 4) {
				const r = imageData.data[i];
				const g = imageData.data[i + 1];
				const b = imageData.data[i + 2];
				const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
				const depth = Math.pow(1 - brightness, 1.5) * 255;
				depthData.data[i] = depth;
				depthData.data[i + 1] = depth;
				depthData.data[i + 2] = depth;
				depthData.data[i + 3] = 255;
			}
			depthCtx.putImageData(depthData, 0, 0);

			// Créer la géométrie avec displacement
			const segments = 48; // Plus de segments pour un meilleur rendu
			const geometry = new THREE.PlaneGeometry(4, 4, segments, segments);
			const positions = geometry.attributes.position;
			const uvs = geometry.attributes.uv;

			// Appliquer le displacement basé sur la depth map
			for (let i = 0; i < positions.count; i++) {
				const u = uvs.getX(i);
				const v = uvs.getY(i);
				const x = Math.floor(u * canvas.width);
				const y = Math.floor((1 - v) * canvas.height);
				const idx = (y * canvas.width + x) * 4;
				
				if (idx >= 0 && idx < depthData.data.length) {
					const depth = depthData.data[idx] / 255;
					const displacement = (1 - depth) * 0.4; // Intensité du relief
					positions.setZ(i, displacement);
				}
			}

			geometry.computeVertexNormals();
			geometry.attributes.position.needsUpdate = true;

			// Créer la texture
			const texture = new THREE.CanvasTexture(canvas);
			texture.wrapS = THREE.ClampToEdgeWrapping;
			texture.wrapT = THREE.ClampToEdgeWrapping;

			// Créer le matériau
			const material = new THREE.MeshStandardMaterial({
				map: texture,
				displacementMap: new THREE.CanvasTexture(depthCanvas),
				displacementScale: 0.4,
				roughness: 0.2,
				metalness: 0.1,
				side: THREE.DoubleSide,
			});

			const mesh = new THREE.Mesh(geometry, material);
			const group = new THREE.Group();
			group.add(mesh);

			resolve(group);
		});
	};

	useEffect(() => {
		if (!mounted || !mountRef.current) return;

		// Capturer la référence pour le cleanup
		const mountElement = mountRef.current;
		const width = mountElement.clientWidth;
		const height = mountElement.clientHeight;

		// Scène
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);

		// Caméra
		const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
		camera.position.set(0, 0, 6);

		// Renderer
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		mountElement.appendChild(renderer.domElement);

		// Éclairage professionnel
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
		scene.add(ambientLight);

		const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
		directionalLight1.position.set(5, 8, 5);
		scene.add(directionalLight1);

		const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
		directionalLight2.position.set(-5, 5, -5);
		scene.add(directionalLight2);

		const pointLight = new THREE.PointLight(0xffffff, 1.0);
		pointLight.position.set(0, 6, 0);
		scene.add(pointLight);

		let controls: any = null;
		let animationId: number;
		let modelGroup: THREE.Group | null = null;

		// Charger le modèle 3D ou créer depuis l'image
		(async () => {
			try {
				if (model3DUrl) {
					try {
						const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
						const loader = new GLTFLoader();
						
						modelGroup = await new Promise<THREE.Group>((resolve, reject) => {
							loader.load(
								model3DUrl,
								(gltf) => {
									const model = gltf.scene;
									const box = new THREE.Box3().setFromObject(model);
									const size = box.getSize(new THREE.Vector3());
									const maxDim = Math.max(size.x, size.y, size.z);
									const scale = 4 / maxDim;
									model.scale.multiplyScalar(scale);
									const center = box.getCenter(new THREE.Vector3());
									model.position.sub(center);
									resolve(model);
								},
								undefined,
								reject
							);
						});
					} catch (err) {
						console.warn("Erreur de chargement du modèle 3D, génération depuis l'image:", err);
						modelGroup = null;
					}
				}

				// Si pas de modèle 3D, créer depuis l'image
				if (!modelGroup) {
					const img = new Image();
					img.crossOrigin = "anonymous";
					
					img.onload = async () => {
						modelGroup = await create3DModelFromImage(img);
						scene.add(modelGroup);
						setLoading(false);
					};
					
					img.onerror = () => {
						setLoading(false);
					};
					
					img.src = imageUrl;
				} else {
					scene.add(modelGroup);
					setLoading(false);
				}

				// Bordure élégante
				const ringGeometry = new THREE.RingGeometry(2, 2.1, 64);
				const ringMaterial = new THREE.MeshStandardMaterial({
					color: 0xffffff,
					metalness: 0.9,
					roughness: 0.1,
					side: THREE.DoubleSide,
				});
				const ring = new THREE.Mesh(ringGeometry, ringMaterial);
				ring.position.z = -0.02;
				scene.add(ring);

				// Ombre portée
				const shadowGeometry = new THREE.CircleGeometry(2.5, 64);
				const shadowMaterial = new THREE.MeshStandardMaterial({
					color: 0x000000,
					opacity: 0.3,
					transparent: true,
					side: THREE.DoubleSide,
				});
				const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
				shadow.rotation.x = -Math.PI / 2;
				shadow.position.y = -2.2;
				shadow.position.z = 0.1;
				scene.add(shadow);

				// Contrôles orbitaux
				const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
				controls = new OrbitControls(camera, renderer.domElement);
				controls.enableZoom = true;
				controls.enablePan = false;
				controls.enableRotate = true;
				controls.minDistance = 3;
				controls.maxDistance = 10;
				controls.zoomSpeed = 0.8;
				controls.rotateSpeed = 0.5;

				// Animation
				const animate = () => {
					animationId = requestAnimationFrame(animate);
					controls.update();
					renderer.render(scene, camera);
				};
				animate();
			} catch (err) {
				console.error("Erreur:", err);
				setLoading(false);
			}
		})();

		// Gestion du redimensionnement
		const handleResize = () => {
			if (!mountRef.current) return;
			const newWidth = mountRef.current.clientWidth;
			const newHeight = mountRef.current.clientHeight;
			camera.aspect = newWidth / newHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(newWidth, newHeight);
		};
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			if (mountElement && renderer.domElement && mountElement.contains(renderer.domElement)) {
				mountElement.removeChild(renderer.domElement);
			}
			if (controls) {
				controls.dispose();
			}
			renderer.dispose();
		};
	}, [mounted, imageUrl, model3DUrl]);

	if (!mounted) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-white text-sm">Génération du modèle 3D...</p>
				</div>
			</div>
		);
	}

	return <div ref={mountRef} className="w-full h-full" />;
}
