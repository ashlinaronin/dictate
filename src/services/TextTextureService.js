(function(){
	'use strict';

	angular
        .module('faceworld')
		.factory('TextTextureService', TextTexture);

        TextTexture.$inject = ['$q', 'MicrophoneService'];

        function TextTexture($q, MicrophoneService) {

            var canvas, context, texture;
            var textureDeferred = $q.defer();
            var canvasDeferred = $q.defer();

			var textOffset = 0;

            // @immediate
            _createElements();
            _createTexture();

			MicrophoneService.subscribe(_updateTexture);

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

                canvas.width = 2048;
                canvas.height = 2048;
            }

            function _createTexture() {
                context.fillStyle = '#000000';
                context.fillRect(0, 0, canvas.width, canvas.height);

                angular.element(document.body).append(canvas);

                // save both for now
                texture = new THREE.Texture(canvas);
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.needsUpdate = true;

                textureDeferred.resolve(texture);
                canvasDeferred.resolve(canvas);
            }

			function _updateTexture(text) {
				var textToWrite = text ? text : '';

				if (textOffset * 60 > canvas.height) {
					textOffset = 0;
				}

                context.font = "280px serif";
                context.fillStyle = '#ffffff';
				var textX = 0;
				var textY = (textOffset * 60);
                context.fillText(textToWrite, textX, textY);

				angular.element(document.body).append(canvas);

				texture.image.src = canvas.toDataURL();
				texture.needsUpdate = true;

				textOffset++;
			}

        }

})();
