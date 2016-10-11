require('./css/style.scss');
const $ = require('jquery');
const Rx = require('rxjs');
const $filesUploader = $('.b-upload-box__status');
const $files = $('.b-files').first();
const $results = $('.b-result-list');

const results = [];

function addToResults(file) {
	results.push(file);
	return Promise.resolve(file.result);
}

function addStatusToResults(i) {
	return function(status) {
		try {
			results[i].faceDetection = JSON.parse(status);
			console.log(status);
			console.log(results)
			return Promise.resolve(results[i]);
		} catch(err) {
			return Promise.reject('Parse result error!');
		}
	};
}

function uploadImage(b64file) {
	return $.post('/detect', { data: b64file }).promise();
}

function readFile(file) {
	return new Promise(function(resolve, reject) {
		if (!file.type.match('image.*')) {
	    reject('Type mismatch');
	  }
	  const reader = new FileReader();
	  reader.onload = ev => {
	  	resolve(ev.target);
	  };
	  reader.readAsDataURL(file);
	});
}

$files.on('change', function() {
	let files = [].slice.call(this.files);
	results = []
	$(".b-result-list").empty();
	files.forEach(function(file, i) {
		readFile(file)
		.then(addToResults)
		.then(uploadImage)
		.then(addStatusToResults(i))
		.then(addResultsToDOM)
		.catch(err => console.error(err));
	})
		
})

$filesUploader
.on('drag dragstart dragend dragover dragenter dragleave drop', ev => {
  ev.preventDefault();
  ev.stopPropagation();
})
.on('dragover dragenter', function() {
  $filesUploader.addClass('b-upload-box__status--drop');
})
.on('dragleave dragend drop', function() {
  $filesUploader.removeClass('b-upload-box__status--drop');
})
.on('drop', function(ev) {
  $files.files = ev.originalEvent.dataTransfer.files;
  $files.trigger('change');
});
