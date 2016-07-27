(function(){
	'use strict';

	angular
        .module('faceworld')
		.factory('MicrophoneService', Microphone);

        Microphone.$inject = ['$q'];

        function Microphone($q) {
            var recorder, context, mediaStreamSource, speechRecognition;

            var recognitionResults = {
                interim: null,
                final: null,
                recognizing: false,
                timeRemaining: null
            }

            return {
                init: _init
                start: _start,
                save: _save,
            }

            //@immediates
            _init();

            function _start() {
                _startTimer();
                recorder.record();
                speechRecognition.start();
            }

            function _save() {
                recorder.stop();
                speechRecognition.stop();
                console.log('should save sentence here somehow');
            }

            function _startTimer() {
                console.log('timer start, recognizing=' + recognitionResults.recognizing);
                $timeout(doTimer, 5000);
            }

            function _doTimer() {
                if (!recognitionResults.final) {
                    recognitionResults.recognizing = false;
                    recorder.stop();
                    speechRecognition.stop();
                    recognitionResults.interim = null;
                    recognitionResults.final = null;
                }
            }


            function _init() {
                if (!Modernizr.getusermedia && Modernizr.speechrecognition) {
                    return;
                }

                _initMicrophone();
                _initSpeechRecognition();
            }

            function _initMicrophone() {
                navigator.getUserMedia = (navigator.getUserMedia ||
                                    navigator.webkitGetUserMedia ||
                                       navigator.mozGetUserMedia ||
                                        navigator.msGetUserMedia ||
                             navigator.mediaDevices.getUserMedia);

                navigator.getUserMedia(
                    {audio:true, video: false},
                    gumSuccess, gumError);
            }

            function _getUserMediaSuccess(stream) {
                context = new (window.AudioContext || window.webkitAudioContext)();
                mediaStreamSource = context.createMediaStreamSource(stream);
                recorder = new Recorder(mediaStreamSource, { numChannels: 1 });
            }

            function _getUserMediaError(error) {
                console.log('The following getUserMedia error occurred: ', error);
            }

            function _initSpeechRecognition() {
                // lots of stuff, need to break it down
                if (!('webkitSpeechRecognition' in window)) {
                    return;
                }

                speechRecognition = new webkitSpeechRecognition();
                speechRecognition.interimResults = true;
                speechRecognition.continuous = false;
                speechRecognition.lang = 'en-US';

                speechRecognition.onstart = _onRecognitionStart;
                speechRecognition.onresult = _onRecognitionResult;
                speechRecognition.onerror = _onRecognitionError;
                speechRecognition.onend = _onRecognitionEnd;
            }

            function _onRecognitionStart() {
                recognitionResults.recognizing = true;
            }

            function _onRecognitionResult(event) {
                var sentenceIndex = event.resultIndex;
                var sentence = event.results[sentenceIndex][0].transcript;

                // display interim res ults
                if (!event.results[sentenceIndex].isFinal) {
                    recognitionResults.interim = sentence;
                } else {
                    recognitionResults.final = sentence;
                    console.log('final: ' + sentence);
                    recognitionResults.interim = null;
                    recognitionResults.final = null;
                }
            }

            function _onRecognitionError(error) {
                console.log("speech recognition error:" + error.error);
                if (error.error === "not-allowed") {
                    console.log("Speech recognition not allowed");
                } else {
                    console.log("Other speech recognition error");
                }
            }

            function _onRecognitionEnd() {
                recognitionResults.recognizing = false;
            }
        }

})();