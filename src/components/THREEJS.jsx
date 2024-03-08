import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import './ThreeScene.css'; // Import CSS file
import MyImage from './MOHINH3D.glb'; // Import CSS file
const ThreeScene = () => {
    const sceneRef = useRef(null);


    //let camera, scene, renderer, Chantrai, Chanphai, Bapchantrai, Bapchanphai;

    useEffect(() => {
        let camera, scene, renderer, Taytrai, Tayphai, Cotaytrai, Cotayphai;
        const init = () => {


            // Khởi tạo scene, camera, renderer, và các biến cần thiết

            camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 10);
            camera.position.set(3, 3, 1);
            camera.lookAt(0, 0, 0);

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);

            const light = new THREE.HemisphereLight(0xffffff, 0x444422);
            light.position.set(0, 1, 0);
            scene.add(light);

            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(6, 6),
                new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
            );

            mesh.rotation.x = - Math.PI / 2;
            mesh.receiveShadow = true;
            scene.add(mesh);

            const grid = new THREE.GridHelper(6, 20, 0x000000, 0x000000);
            grid.material.opacity = 0.1;
            grid.material.transparent = true;
            scene.add(grid);
            const maxContainerWidth = 1000;
            const maxContainerHeight = 1000;
            const scaleFactor = Math.min(maxContainerWidth / window.innerWidth, maxContainerHeight / window.innerHeight);
            // ... (thêm code khởi tạo)

            // Khởi tạo GLTFLoader và tải model
            const loader = new GLTFLoader();
            loader.load(MyImage, function (gltf) {
                // Xử lý mô hình 3D
                const model = gltf.scene;

                // ... (thêm code xử lý mô hình)
                console.log(model);

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

                // Thêm mô hình vào scene
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

                async function fetchData() {
                    fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/data-tqlme/endpoint/GET_MOTION_API')
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
                // Cập nhật scene khi model đã được tải
                sceneRef.current.add(scene);

                // Khởi tạo OrbitControls
                const controls = new OrbitControls(camera, sceneRef.current);
                controls.target.set(0, 1, 0);
                controls.update();
            });

            // Khởi tạo renderer và thêm vào DOM
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            sceneRef.current.appendChild(renderer.domElement);
            const onWindowResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                // Thu nhỏ kích thước của renderer lại 1/2
                renderer.setSize(window.innerWidth, window.innerHeight);
            };

            // Xử lý sự kiện thay đổi kích thước cửa sổ
            window.addEventListener('resize', onWindowResize, false);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0, 1, 0);
            controls.update();

            // Hàm xử lý thay đổi kích thước cửa sổ
            // function onWindowResize() {
            //     camera.aspect = window.innerWidth / window.innerHeight;
            //     camera.updateProjectionMatrix();
            //     renderer.setSize(window.innerWidth, window.innerHeight);
            // }
        };
        // Hàm animate để tạo vòng lặp render
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        // Gọi hàm animate để bắt đầu vòng lặp render
        init();
        animate();

        // Cleanup
        return () => {
            //window.removeEventListener('resize', onWindowResize);
            if (renderer && renderer.domElement) {
                renderer.domElement.remove();
            }
        };
    }, []); // Chỉ chạy một lần khi component được mount

    return <div className="three-scene-wrapper" ref={sceneRef}></div>;
};

export default ThreeScene;