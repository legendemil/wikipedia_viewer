$(function () {
	var WikiViewer = (function () {
		// variables holds DOM elements
		var $searchContainer,
			$searchInput,
			$wikiArticlesBox,
			$clearBtn,
			$loadMoreBtn;
		
		// modue for handled events
		var WikiViewerEvents = (function(){
			var wikiQueryOffset = 0,
				wikiTmpl = $('#wiki-tmpl').html(),
				tmplCompiled =  Handlebars.compile(wikiTmpl);

			// toggle clearbtn
			function toggleClearBtn(show) {
				if(show) {
					$clearBtn.css('display', 'block');
					$clearBtn.removeClass('anim-clear-btn-hide');
					$clearBtn.addClass('anim-clear-btn');
				}
				else {
					
					$clearBtn.addClass('anim-clear-btn-hide');
					$clearBtn.removeClass('anim-clear-btn');
					setTimeout(function () {
						$clearBtn.css('display', 'none');
					},400);
				}
			}

			//close clearBtn
			function clearWikiArticles() {
				resizeDownSearchInput();
				$searchInput.val('');
				$loadMoreBtn.css('display', 'none');
				$wikiArticlesBox.addClass('wiki-box-hide');
				setTimeout(function () {
					$wikiArticlesBox.empty();
					$wikiArticlesBox.removeClass('wiki-box-hide');
				}, 1000);
			}

			// laod more wikis
			function loadMoreWikis(argument) {
				wikiQueryOffset += 10;
				getWikiArticles(true);
			}

			// resize text input
			function resizeUpSearchInput(ev) {
				ev.stopPropagation();
				$(this).attr('placeholder', 'Type here');
				$(this).animate({
					width: '200px',
					borderRadius: '20px'
				}, 300);
				toggleClearBtn(true);

			}

			// resize down text field
			function resizeDownSearchInput() {
				$($searchInput).attr('placeholder', '');
				$($searchInput).animate({
					width: '40px'
				}, 300);
				toggleClearBtn(false);
			}

			function showNoWikisAlert() {
				var noDataDiv = '<div class="no-wikis-alert">Sorry but we can\'t find anything :(</div>';
				$wikiArticlesBox.html(noDataDiv);
			}

			// get data using wikipedia api
			function getWikiArticles(loadMore) {
				var title = $searchInput.val() || '';
				if(!title) {
					showNoWikisAlert();
					return;
				}

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
						var wikis = data.query.search;

						//check if find any wikis
						if(wikis.length > 0) {
							wikis.forEach(function (element) {
								var context = {
									title: element.title,
									content: element.snippet,
									url: 'http://en.wikipedia.org/wiki/' + encodeURIComponent(element.title)
								};
								output += tmplCompiled(context);
							});
							//if user want to laod more
							if(loadMore) {
								$wikiArticlesBox.append(output);
							}
							else {
								$wikiArticlesBox.html(output);
								$loadMoreBtn.show();
							}
						} else {
							$loadMoreBtn.hide();
							showNoWikisAlert();
						}

						
						
						
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
				// resize down search box and
				// clear wiki articles after click clearBtn
				$clearBtn.on('click', clearWikiArticles);

				// laod more wikis
				$loadMoreBtn.on('click', loadMoreWikis);


			}

			return {
				bindEvents: bindEvents
			}
		})();

		function cacheDOM() {
			$searchContainer = $('#search-container');
			$searchInput = $searchContainer.find('#search-input');
			$wikiArticlesBox = $('#wiki-articles-box');
			$clearBtn = $searchContainer.find('#clear-btn');
			$loadMoreBtn = $('#load-more-btn');
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