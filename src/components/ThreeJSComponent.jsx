import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './ThreeJSComponent.css'; // Import CSS file
import MyImage from './MOHINH3D.glb'; // Import CSS file

const SmallFrame = () => {
    const mount = useRef(null);

    useEffect(() => {
        let camera, scene, renderer, Taytrai, Tayphai, Cotaytrai, Cotayphai;

        const init = () => {
            camera = new THREE.PerspectiveCamera(40, (window.innerWidth / 2) / (window.innerHeight / 2), 0.01, 10);
            camera.position.set(3, 3, 1);
            camera.lookAt(0, 0, 0);

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);

            const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
            light.position.set(0, 1, 0);
            scene.add(light);

            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(6, 6),
                new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
            );
            mesh.rotation.x = -Math.PI / 2;
            mesh.receiveShadow = true;
            scene.add(mesh);

            const grid = new THREE.GridHelper(6, 20, 0x000000, 0x000000);
            grid.material.opacity = 0.1;
            grid.material.transparent = true;
            scene.add(grid);

            const loader = new GLTFLoader();
            loader.load(MyImage, function (gltf) {
                const model = gltf.scene;

                model.traverse((o) => {
                    if (o.isMesh) {
                        o.material.metalness = false;
                        o.material.wireframe = false;
                        o.castShadow = true;
                        o.receiveShadow = true;
                    }
                });

                const SkinnedMesh = model.children[0].children[1];
                scene.add(model);

                const Skeleton = SkinnedMesh.skeleton;
                const SkeletonHelper = new THREE.SkeletonHelper(Skeleton.bones[0]);
                SkeletonHelper.skeleton = Skeleton;
                SkeletonHelper.visible = true;
                scene.add(SkeletonHelper);

                const Bones = SkinnedMesh.skeleton.bones;
                Taytrai = Bones.find((bone) => bone.name === 'mixamorigLeftArm');
                Tayphai = Bones.find((bone) => bone.name === 'mixamorigRightArm');
                Cotaytrai = Bones.find((bone) => bone.name === 'mixamorigLeftForeArm');
                Cotayphai = Bones.find((bone) => bone.name === 'mixamorigRightForeArm');
                Taytrai.rotation.x = 1.4;
                Tayphai.rotation.x = 1.4;
                // Chỉnh kích thước của model
                //scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
                //model.scale.set(scaleFactor, scaleFactor, scaleFactor);
                // const degreeToRadian = Math.PI / 180;
                /*async function layDuLieu() {
                    try {

                        const response = await fetch('http://localhost:1880/bye2');
                        const data = await response.json();
                        const TAYTRAI = parseFloat(data.TAITRAI);
                        const TAYPHAI = parseFloat(data.TAIPHAI);
                        const CANGTAYTRAI = parseFloat(data.CANGTAYTRAI);
                        const CANGTAYPHAI = parseFloat(data.CANGTAYPHAI);
                        Taytrai.rotation.z = TAYTRAI;
                         Tayphai.rotation.z = TAYPHAI;
                         Cotaytrai.rotation.z = CANGTAYTRAI;
                         Cotayphai.rotation.z = CANGTAYPHAI;
                    } catch (error) {
                        console.error('Lỗi khi lấy dữ liệu:', error);
                    }
                }*/


                async function fetchData() {
                    fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-byptt/endpoint/GET_MOTION_API')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            //const apiDataDiv = document.getElementById('apiData');


                            const taytrai = data[0]?.public?.output?.jsonData?.taytrai_p;
                            const cangtaytrai = data[0]?.public?.output?.jsonData?.cangtaytrai_p;
                            const tayphai = data[0]?.public?.output?.jsonData?.tayphai_p;
                            const cangtayphai = data[0]?.public?.output?.jsonData?.cangtayphai_p;
                            Taytrai.rotation.z = taytrai;
                            Tayphai.rotation.z = tayphai;
                            Cotaytrai.rotation.z = cangtaytrai;
                            Cotayphai.rotation.z = cangtayphai;
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                }

                fetchData();
                setInterval(fetchData, 100);




                //setInterval(layDuLieu, 10);
            });

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            // Thu nhỏ kích thước của renderer lại 1/2
            renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
            renderer.outputEncoding = THREE.sRGBEncoding;

            mount.current.appendChild(renderer.domElement);

            window.addEventListener('resize', onWindowResize, false);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 1, 0);
            controls.update();
        };

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        const onWindowResize = () => {
            camera.aspect = (window.innerWidth / 2) / (window.innerHeight / 2);
            camera.updateProjectionMatrix();
            // Thu nhỏ kích thước của renderer lại 1/2
            renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
        };

        init();
        animate();

        return () => {
            mount.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div className="three-js-container" ref={mount}>
            {null}
        </div>
    );
};

export default SmallFrame;
