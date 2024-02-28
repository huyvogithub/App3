import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './ThreeJSComponent.css'; // Import CSS file
import MyImage from './MOHINH3D.glb'; // Import CSS file

const SmallFrame = () => {
    const mount = useRef(null);

    useEffect(() => {
        let camera, scene, renderer, Taytrai, Tayphai, Cotaytrai, Cotayphai, Chantrai, Chanphai, Bapchantrai, Bapchanphai, Dau, Co1;

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

                // Chân 
                Chantrai = Bones.find((bone) => bone.name === 'mixamorigLeftUpLeg');
                Chanphai = Bones.find((bone) => bone.name === 'mixamorigRightUpLeg');
                Bapchantrai = Bones.find((bone) => bone.name === 'mixamorigLeftLeg');
                Bapchanphai = Bones.find((bone) => bone.name === 'mixamorigRightLeg');
                // Đầu 
                Dau = Bones.find((bone) => bone.name === 'mixamorigHead');
                Co1 = Bones.find((bone) => bone.name === 'mixamorigNeck');







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



                // Chân 
                async function fetchData_chân() {
                    fetch('https://asia-south1.gcp.data.mongodb-api.com/app/application-0-iatxy/endpoint/TEST_GET')
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            //const apiDataDiv = document.getElementById('apiData');


                            const DUITRAI = data[0].public.output.jsonData.Roll_dui_trai_moi;
                            const BAPCHANTRAI = data[0]?.public?.output?.jsonData?.Roll_bap_chan_trai_moi;
                            const DUIPHAI = data[0]?.public?.output?.jsonData?.Roll_dui_phai_moi;
                            const BAPCHANPHAI = data[0]?.public?.output?.jsonData?.Roll_bap_chan_phai_moi;
                            Chantrai.rotation.x = DUITRAI;
                            Chanphai.rotation.x = DUIPHAI;
                            Bapchantrai.rotation.x = BAPCHANTRAI;
                            Bapchanphai.rotation.x = BAPCHANPHAI;


                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                }


                // Đầu 
                async function fetchData_Đầu() {

                    fetch('https://ap-southeast-1.aws.data.mongodb-api.com/app/application-0-khcpn/endpoint/Get_motion').then(response => {
                        if (!response.ok) {
                            throw new Error('Cannot Connect');
                        }
                        return response.json();
                    })
                        .then(data => {

                            const Daux = data[0]?.public?.input?.jsonData?.Roll;
                            const Dauz = data[0]?.public?.input?.jsonData?.Pitch;
                            const Co = data[0]?.public?.input?.jsonData?.Yaw;
                            Dau.rotation.z = Dauz;
                            Dau.rotation.x = Daux;
                            Co1.rotation.y = Co;
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                }
                fetchData_Đầu();
                fetchData();
                fetchData_chân();
                setInterval(() => {
                    fetchData_Đầu();
                    fetchData();
                    fetchData_chân();
                }, 500);


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
            camera.aspect = (window.innerWidth) / (window.innerHeight);
            camera.updateProjectionMatrix();
            // Thu nhỏ kích thước của renderer lại 1/2
            renderer.setSize(window.innerWidth, window.innerHeight);
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
