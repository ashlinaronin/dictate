(function(){
	'use strict';

	angular
        .module('faceworld')
		.factory('TextTextureService', TextTexture);

        TextTexture.$inject = ['$q'];

        function TextTexture($q) {

            var canvas, context;
            var textureDeferred = $q.defer();
            var canvasDeferred = $q.defer();

            // @immediate
            _createElements();
            _writeTexture();

            return {
                getTextCanvas: _getTextCanvas,
                getTextTexture: _getTextTexture
            }

            function _getTextCanvas() {
                return canvasDeferred.promise;
            }

            function _getTextTexture() {
                return textureDeferred.promise;
            }

            function _createElements() {
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');

                canvas.width = 512;
                canvas.height = 512;
            }

            function _writeTexture() {
                context.fillStyle = '#000000';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.font = "64px serif";
                context.fillStyle = '#ffffff';
                context.fillText("Hello world", 108, 256);

                angular.element(document.body).append(canvas);

                // save both for now
                var texture = new THREE.Texture(canvas);
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.needsUpdate = true;

                textureDeferred.resolve(texture);
                canvasDeferred.resolve(canvas);
            }

        }

})();
