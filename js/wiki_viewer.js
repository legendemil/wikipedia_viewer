$(function () {
	var WikiViewer = (function () {
		// variables holds DOM elements
		var $searchContainer,
			$searchInput;

		// modue for handled events
		var WikiViewerEvents = (function(){

			// resize text input
			function resizeUpSearchInput(ev) {
				ev.stopPropagation();
				$(this).attr('placeholder', 'Type here');
				$(this).animate({
					width: '200px',
					borderRadius: '20px'
				}, 300);
				//$(this).off('click', resizeUpSearchInput);
			}

			// resize down text field
			function resizeDownSearchInput() {
				$($searchInput).attr('placeholder', '');
				$($searchInput).animate({
					width: '40px'
				}, 300);
				//$(this).on('click', resizeUpSearchInput);
			}
			
			function bindEvents() {
				// on click resize input field
				$searchInput.on('click', resizeUpSearchInput);
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