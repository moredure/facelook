require('./css/style.scss');
const $ = require('jquery');
const Api = require('./api')
const $filesUploader = $('.b-upload-box__status');
const $files = $(document.querySelector('.b-files'));
const $results = $('.b-result-list');

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/static/cache.js').then(function(reg) {
//     // регистрация сработала
//     console.log('Registration succeeded. Scope is ' + reg.scope);
//   }).catch(function(error) {
//     // регистрация прошла неудачно
//     console.log('Registration failed with ' + error);
//   });
// };

var results = [];

function addToResults(file) {
	results.push(file);
	return Promise.resolve(file.result);
}

function addStatusToResults(i) {
	return function(status) {
		try {
			results[i].faceDetection = JSON.parse(status);
			return Promise.resolve(results[i]);
		} catch(err) {
			return Promise.reject('Parse result error!');
		}
	};
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

function addResultToDOM(file) {
	let correctStatus = file.faceDetection.result ? 'correct' : 'incorrect'
  let elements = `<li class="b-result-list__item b-result-list__item--${correctStatus}">
    <img class="b-smart-img" src="${file.result}">
    <div class="b-smart-img-status"></div>
  </li>`;
  if($results.children().length === 0) {
  	$('.b-container').addClass('b-container--active');
  	$('.b-darkness').one('click', function() {
  		$('.b-container').removeClass('b-container--active');
  	})
  }
  $results.append(elements);
}

$files
.on('change', function(ev, dropedFiles) {
	$(".b-result-list").empty();
	results = [];
	let files = [].slice.call(dropedFiles || this.files);
	files.forEach(function(file, i) {
		readFile(file)
		.then(addToResults)
		.then(Api.uploadImage)
		.then(addStatusToResults(i))
		.then(addResultToDOM)
		.catch(err => alert(err));
	});
})

$filesUploader
.on({
	'dragover': function(ev) {
	  ev.preventDefault();
	  $filesUploader.addClass('b-upload-box__status--drop');
	},
  'dragleave': function() {
  	$filesUploader.removeClass('b-upload-box__status--drop');
	},
	'drop': function(ev) {
		ev.preventDefault();
	  $files.files = ev.originalEvent.dataTransfer.files;
	  $files.trigger('change', [$files.files]);
	  $filesUploader.removeClass('b-upload-box__status--drop');
	}
});
