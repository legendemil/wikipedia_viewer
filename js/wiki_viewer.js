$(function () {
	var WikiViewer = (function () {
		// variables holds DOM elements
		var $searchContainer,
			$searchInput;
		
		// modue for handled events
		var WikiViewerEvents = (function(){
			var wikiQueryOffset = 0;

			// resize text input
			function resizeUpSearchInput(ev) {
				ev.stopPropagation();
				$(this).attr('placeholder', 'Type here');
				$(this).animate({
					width: '200px',
					borderRadius: '20px'
				}, 300);
			}

			// resize down text field
			function resizeDownSearchInput() {
				$($searchInput).attr('placeholder', '');
				$($searchInput).animate({
					width: '40px'
				}, 300);
			}

			// get data using wikipedia api
			function getWikiArticles() {
				$.ajax({
					type: 'GET',
					url: 'https://en.wikipedia.org/w/api.php?callback=?',
					data: {
						action: 'query',
						format: 'json',
						srsearch: 'Barca',
						srprop: 'titlesnippet|snippet',
						list: 'search',
						sroffset: wikiQueryOffset,
						continue: ''
						// prop: 'revisions',
						// rvprop: 'content',
						// titles: 'Barca',
						// prop: 'imageinfo',
						// iiprop: 'url'
						// generator: 'allpages',
						// gaplimit: 6,
						// gapfilterredir: 'nonredirects',
					},
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function (data, status) {
						console.log(data);
						data.query.search.forEach(function (element) {
							var link = '<a href="http://en.wikipedia.org/wiki/' + encodeURIComponent(element.title) +'" target="_blank">Read more</a>';
							$('body').append(element.snippet + link + '<br><br>');
						});
						//$('body').append(data.parse.text['*']);
						wikiQueryOffset += 10;
					},
					error: function (error) {
						console.log(error);
					}
				});				
			}

			// handler for get data from wikipdia
			function getWikiData(ev) {
				ev.preventDefault();
				getWikiArticles();
			}
			
			function bindEvents() {
				// on click resize input field
				$searchInput.on('click', resizeUpSearchInput);
				$($searchInput.closest('form')).on('submit', getWikiData);
				// resize down search box
				$('body').on('click', resizeDownSearchInput);


			}

			return {
				bindEvents: bindEvents
			}
		})();

		function cacheDOM() {
			$searchContainer = $('#search-container');
			$searchInput = $searchContainer.find('#search-input');
		}

		function init() {
			cacheDOM();
			WikiViewerEvents.bindEvents();
		}

		return {
			init: init
		}

	})();

	WikiViewer.init();
});