$(function () {
	var WikiViewer = (function () {
		// variables holds DOM elements
		var $searchContainer,
			$searchInput,
			$wikiArticlesBox;
		
		// modue for handled events
		var WikiViewerEvents = (function(){
			var wikiQueryOffset = 0,
				wikiTmpl = $('#wiki-tmpl').html(),
				tmplCompiled =  Handlebars.compile(wikiTmpl);

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
				var title = $searchInput.val() || '';
				$.ajax({
					type: 'GET',
					url: 'https://en.wikipedia.org/w/api.php?callback=?',
					data: {
						action: 'query',
						format: 'json',
						srsearch: title,
						srprop: 'titlesnippet|snippet',
						list: 'search',
						sroffset: wikiQueryOffset
					},
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function (data, status) {
						console.log(data);
						var output  = '';

						data.query.search.forEach(function (element) {
							var context = {
								title: element.title,
								content: element.snippet,
								url: 'http://en.wikipedia.org/wiki/' + encodeURIComponent(element.title)
							};
							output += tmplCompiled(context);
						});
						$wikiArticlesBox.html(output);
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
			$wikiArticlesBox = $('#wiki-articles-box');
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