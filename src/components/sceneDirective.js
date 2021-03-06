(function(){
	'use strict';

	angular
        .module('faceworld')
        .directive('scene', sceneDirective);

        sceneDirective.$inject = [
            '$q', 'CameraService', 'PhotosphereService',
            'RendererService', 'WebcamService', 'AsteroidsService',
			'LightsService', 'SpheresService', 'HeadService',
			'StarsService', 'SynthPadService', 'TextTextureService',
			'MicrophoneService'
        ];

        function sceneDirective($q, CameraService, PhotosphereService,
                    RendererService, WebcamService, AsteroidsService,
					LightsService, SpheresService, HeadService,
					StarsService, SynthPadService, TextTextureService,
					MicrophoneService) {

            var directive = {
                link: link,
                restrict: 'EA'
            }

            var components = {
                scene: new THREE.Scene()
            }

            return directive;

            function link(scope, element, attrs) {

                $q.all({
                    camera: CameraService.getCamera(),
                    renderer: RendererService.getRenderer(),
					pointLight: LightsService.getPointLight(),
					ambientLight: LightsService.getAmbientLight(),
                    webcamVideoTexture: WebcamService.getVideoTexture(),
					textTexture: TextTextureService.getTextTexture(),
					bigHead: HeadService.getBigHead(),
					stars: StarsService.getParticles()
                }).then(function(resolved) {
                    // Add all the new resolved components to the components object
                    angular.extend(components, resolved);

					components.scene.add(components.pointLight);
					components.scene.add(components.ambientLight);
                    components.scene.add(components.camera);
					components.scene.add(components.bigHead);
					components.scene.add(components.stars);

					// addTexturedObject(components.scene, components.bigHead, components.webcamVideoTexture);
					addTexturedObject(components.scene, components.bigHead, components.textTexture);

                    animate();

					MicrophoneService.init();
					MicrophoneService.subscribe(function(recognitionResult) {
						console.log('result:', recognitionResult);
					});
                });
            }

			function addTexturedObject(scene, object, texture) {
				object.traverse(function(child) {
					if (child instanceof THREE.Mesh) {
						child.material.map = texture;
						child.material.needsUpdate = true;
					}
				});
				scene.add(object);
			}

            function animate() {
                window.requestAnimationFrame(animate);
                WebcamService.drawVideoFrame();
				StarsService.updateParticles();
                components.renderer.render(components.scene, components.camera);
            }

            function addMouseMoveListener(renderer, camera, cactus) {
                renderer.domElement.addEventListener('mousemove', function(e){
					camera.rotation.x = Math.tan((window.innerHeight - e.x)/(window.innerHeight*2));
					camera.position.z = 20 * Math.tan((window.innerHeight/2 + e.x)/(window.innerHeight));
                }, false);
            }

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			}
        }

})();
