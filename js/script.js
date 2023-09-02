"use strict";
(function () {
	// Global variables
	var userAgent = navigator.userAgent.toLowerCase(),
			initialDate = new Date(),

			$document = $(document),
			$window = $(window),
			$html = $("html"),
			$body = $("body"),

			isDesktop = $html.hasClass("desktop"),
			isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			windowReady = false,
			isNoviBuilder = false,

			plugins = {
				bootstrapTooltip: $("[data-toggle='tooltip']"),
				materialParallax: $(".parallax-container"),
				rdNavbar: $(".rd-navbar"),
				rdInputLabel: $(".form-label"),
				swiper: $(".swiper-slider"),
				isotope: $(".isotope"),
				customToggle: $("[data-custom-toggle]"),
			};



	// Initialize scripts that require a loaded page
	$window.on('load', function () {
		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				target: document.querySelector('.page'),
				delay: 0,
				duration: 500,
				classIn: 'fadeIn',
				classOut: 'fadeOut',
				classActive: 'animated',
				onReady: function () {
					plugins.preloader.addClass('loaded');
					windowReady = false;
				}
			});
		}
	});

	// Initialize scripts that require a finished document
	$(function () {
		isNoviBuilder = window.xMode;

		/**
		 * @desc Calculate the height of swiper slider basing on data attr
		 * @param {object} object - slider jQuery object
		 * @param {string} attr - attribute name
		 * @return {number} slider height
		 */
		function getSwiperHeight(object, attr) {
			var val = object.attr("data-" + attr),
					dim;

			if (!val) {
				return undefined;
			}

			dim = val.match(/(px)|(%)|(vh)|(vw)$/i);

			if (dim.length) {
				switch (dim[0]) {
					case "px":
						return parseFloat(val);
					case "vh":
						return $window.height() * (parseFloat(val) / 100);
					case "vw":
						return $window.width() * (parseFloat(val) / 100);
					case "%":
						return object.width() * (parseFloat(val) / 100);
				}
			} else {
				return undefined;
			}
		}

		/**
		 * @desc Toggle swiper videos on active slides
		 * @param {object} swiper - swiper slider
		 */
		function toggleSwiperInnerVideos(swiper) {
			var prevSlide = $(swiper.slides[swiper.previousIndex]),
					nextSlide = $(swiper.slides[swiper.activeIndex]),
					videos,
					videoItems = prevSlide.find("video");

			for (var i = 0; i < videoItems.length; i++) {
				videoItems[i].pause();
			}

			videos = nextSlide.find("video");
			if (videos.length) {
				videos.get(0).play();
			}
		}

		/**
		 * @desc Toggle swiper animations on active slides
		 * @param {object} swiper - swiper slider
		 */
		function toggleSwiperCaptionAnimation(swiper) {
			var prevSlide = $(swiper.container).find("[data-caption-animate]"),
					nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
					delay,
					duration,
					nextSlideItem,
					prevSlideItem;

			for (var i = 0; i < prevSlide.length; i++) {
				prevSlideItem = $(prevSlide[i]);

				prevSlideItem.removeClass("animated")
				.removeClass(prevSlideItem.attr("data-caption-animate"))
				.addClass("not-animated");
			}


			var tempFunction = function (nextSlideItem, duration) {
				return function () {
					nextSlideItem
					.removeClass("not-animated")
					.addClass(nextSlideItem.attr("data-caption-animate"))
					.addClass("animated");
					if (duration) {
						nextSlideItem.css('animation-duration', duration + 'ms');
					}
				};
			};

			for (var i = 0; i < nextSlide.length; i++) {
				nextSlideItem = $(nextSlide[i]);
				delay = nextSlideItem.attr("data-caption-delay");
				duration = nextSlideItem.attr('data-caption-duration');
				if (!isNoviBuilder) {
					if (delay) {
						setTimeout(tempFunction(nextSlideItem, duration), parseInt(delay, 10));
					} else {
						setTimeout(tempFunction(nextSlideItem, duration), 0);
					}

				} else {
					nextSlideItem.removeClass("not-animated")
				}
			}
		}









		// RD Navbar
		if (plugins.rdNavbar.length) {
			var aliaces, i, j, len, value, values, responsiveNavbar;

			aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
			values = [0, 576, 768, 992, 1200, 1600];
			responsiveNavbar = {};

			for (i = j = 0, len = values.length; j < len; i = ++j) {
				value = values[i];
				if (!responsiveNavbar[values[i]]) {
					responsiveNavbar[values[i]] = {};
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'layout')) {
					responsiveNavbar[values[i]].layout = plugins.rdNavbar.attr('data' + aliaces[i] + 'layout');
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
					responsiveNavbar[values[i]]['deviceLayout'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout');
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
					responsiveNavbar[values[i]]['focusOnHover'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
					responsiveNavbar[values[i]]['autoHeight'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
				}

				if (isNoviBuilder) {
					responsiveNavbar[values[i]]['stickUp'] = false;
				} else if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
					responsiveNavbar[values[i]]['stickUp'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true';
				}

				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
					responsiveNavbar[values[i]]['stickUpOffset'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
				}
			}


			plugins.rdNavbar.RDNavbar({
				anchorNav: !isNoviBuilder,
				stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
				responsive: responsiveNavbar
			});


			if (plugins.rdNavbar.attr("data-body-class")) {
				document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
			}
		}

		var interleaveOffset = -.7;

		var interleaveEffect = {
			effect: 'slide',
			speed: 1200,
			watchSlidesProgress: true,
			onProgress: function (swiper, progress) {
				for (var i = 0; i < swiper.slides.length; i++) {

					var slide = swiper.slides[i];
					var translate, innerTranslate;
					progress = slide.progress;

					if (progress > 0) {
						translate = progress * swiper.width;
						innerTranslate = translate * interleaveOffset;
					} else {
						innerTranslate = Math.abs(progress * swiper.width) * interleaveOffset;
						translate = 0;
					}

					slide.style.transform = 'translate3d(' + translate + 'px,0,0)';
					slide.getElementsByClassName('slide-inner')[0].style.transform = 'translate3d(' + innerTranslate + 'px,0,0)';
				}
			},

			onTouchStart: function (swiper) {
				for (var i = 0; i < swiper.slides.length; i++) {
					this.slide.style.transition = '0s';
				}
			},

			onSetTransition: function (swiper, speed) {
				for (var i = 0; i < swiper.slides.length; i++) {
					$(swiper.slides[i])
					.find('.slide-inner')
					.andSelf()
					.css({transition: speed + 'ms'});
				}
			},
			onSlideNextStart: function (swiper) {
				setTimeout(function () {
					toggleSwiperCaptionAnimation(swiper);
				}, 300);
			},
			onSlidePrevStart: function (swiper) {
				setTimeout(function () {
					toggleSwiperCaptionAnimation(swiper);
				}, 300);
			},

			onTransitionEnd: function (swiper) {
				return false;
			}
		};






		// Swiper Slider
		if (plugins.swiper.length) {
			var i;
			for (i = 0; i < plugins.swiper.length; i++) {
				var s = $(plugins.swiper[i]);
				var pag = s.find(".swiper-pagination"),
						next = s.find(".swiper-button-next"),
						prev = s.find(".swiper-button-prev"),
						bar = s.find(".swiper-scrollbar"),
						swiperSlide = s.find(".swiper-slide");

				for (j = 0; j < swiperSlide.length; j++) {
					var $this = $(swiperSlide[j]),
							url;

					if (url = $this.attr("data-slide-bg")) {
						$this.css({
							"background-image": "url(" + url + ")",
							"background-size": "cover"
						})
					}
				}

				swiperSlide.end()
				.find("[data-caption-animate]")
				.addClass("not-animated")
				.end();

				var swiperOptions = {
					autoplay: isNoviBuilder ? false : s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
					direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
					effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
					speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
					keyboardControl: s.attr('data-keyboard') === "true",
					mousewheelControl: s.attr('data-mousewheel') === "true",
					mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
					nextButton: next.length ? next.get(0) : (s.attr('data-custom-next') ? $(s.attr('data-custom-next')) : null),
					prevButton: prev.length ? prev.get(0) : (s.attr('data-custom-prev') ? $(s.attr('data-custom-prev')) : null),
					pagination: pag.length ? pag.get(0) : null,
					paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
					paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (index, className) {
						return '<span class="' + className + '">' + (index + 1) + '</span>';
					} : null : null,
					scrollbar: bar.length ? bar.get(0) : null,
					scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
					scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
					loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
					loopAdditionalSlides: s.attr('data-additional-slides') ? parseInt(s.attr('data-additional-slides')) : 0,
					simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
					onTransitionStart: function (swiper) {
						toggleSwiperInnerVideos(swiper);
					},
					onTransitionEnd: function (swiper) {
						toggleSwiperCaptionAnimation(swiper);
					},
					onInit: function (swiper) {
						toggleSwiperInnerVideos(swiper);
						toggleSwiperCaptionAnimation(swiper);
						$window.on('resize', function () {
							swiper.update(true);
						});
					},
					onPaginationRendered: function (swiper, paginationContainer) {
						var container = $(paginationContainer);
						if (container.hasClass('swiper-pagination_marked')) {
							container.append('<span class="swiper-pagination__mark"></span>');
						}
					}

				};

				if (s.attr('data-custom-slide-effect') === 'interLeaveEffect') {
					swiperOptions = $.extend(swiperOptions, interleaveEffect);
				}

				plugins.swiper[i] = s.swiper(swiperOptions);

				$window
				.on("resize", function () {
					var mh = getSwiperHeight(s, "min-height"),
							h = getSwiperHeight(s, "height");
					if (h) {
						s.css("height", mh ? mh > h ? mh : h : h);
					}
				})
				.trigger("resize");
			}
		}









		// Custom Toggles
		if (plugins.customToggle.length) {
			for (var i = 0; i < plugins.customToggle.length; i++) {
				var $this = $(plugins.customToggle[i]);

				$this.on('click', $.proxy(function (event) {
					event.preventDefault();

					var $ctx = $(this);
					$($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
				}, $this));

				if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
					$body.on("click", $this, function (e) {
						if (e.target !== e.data[0]
								&& $(e.data.attr('data-custom-toggle')).find($(e.target)).length
								&& e.data.find($(e.target)).length === 0) {
							$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
						}
					})
				}

				if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
					$body.on("click", $this, function (e) {
						if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
							$(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
						}
					})
				}
			}
		}

		// Fixed height
		if (plugins.fixedHeight) {
			for (var i = 0; i < plugins.fixedHeight.length; i++) {
				$window.on('resize orientationchange', function (object) {
					object.style.minHeight = object.offsetHeight + 'px';
				}(plugins.fixedHeight[i]))
			}

			$window.trigger("resize");
		}





	});
}());
