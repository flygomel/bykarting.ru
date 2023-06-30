let isMobile = false;
if( /Android|webOS|iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) ) {
	isMobile = true;
}

$(function() {
	if(isMobile)
		$('.oplati .oplati-details-qr').hide();
	else
		$('.oplati .oplati-details-button').hide();

	$(window).resize(function() {
		var old_width = $(window).data('old_width'),
			new_width = $(window).width();
		if(old_width != new_width)
			$(window).data('old_width', new_width).trigger('wresize');
	});
	$('header a').click(function() {
		var id = $(this).attr('href'),
			$el = $(id);

		if(id == '#menu')
			$('body').toggleClass('menu-opened');
		else if(id == '#book')
			$('.book').show();
		else if(id == '#payment')
			$('.payment').show();
		else
			$('html, body')
				.removeClass('menu-opened')
				.animate({scrollTop: $el.offset().top - $('header').height()});
		return false;
	});
	function init_map() {
		$('#map').empty('');
		$.getScript('https://api-maps.yandex.ru/services/constructor/1.0/js/?sid=scnOI4X6t79BOOyMoPbA_P593TqPqjZ0&width=100%&height=' + $('#map').height() + '&lang=ru_RU&sourceType=constructor&scroll=false&id=map');
	}
	var timer;
	$(window).on("wresize", function() {
		clearInterval(timer);
		timer = setTimeout(init_map, 300);
	}).trigger('wresize');

	$('body').on("click", ".promo .prev", function() {
		var $prev = $('.promo .item.selected').removeClass('selected').prev();
		if(!$prev.length)
			$prev = $('.promo .item:last')

		$prev.addClass('selected');
		clearInterval(pTimer);
		pTimer =setInterval(function() {
			$('.promo .next').click();
		}, 5000);
	});
	$('body').on("click", ".promo .next", function() {
		var $next = $('.promo .item.selected').removeClass('selected').next();
		if(!$next.length)
			$next = $('.promo .item:first')

		$next.addClass('selected');
		clearInterval(pTimer);
		pTimer =setInterval(function() {
			$('.promo .next').click();
		}, 5000);
	});
	var pTimer =setInterval(function() {
		$('.promo .next').click();
	}, 5000);


	$('.actions nav span').click(function() {
		var idx = $(this).index();
		$(this)
			.addClass('selected')
			.siblings()
			.removeClass('selected')
		var $item =	$('.actions .item')
			.eq(idx);
		$item
			.addClass('selected')
			.siblings()
			.removeClass('selected');
		$('.actions').css('background-image', 'url(' + $item.attr('data-image') + ')');
		clearInterval(aTimer);
		aTimer =setInterval(function() {
			$('.actions .next').click();
		}, 5000);
	});
	$('body').on("click", ".actions .prev", function() {
		var $prev = $('.actions nav span.selected').removeClass('selected').prev();
		if(!$prev.length)
			$prev = $('.actions nav span:last')

		$prev.click();
	});
	$('body').on("click", ".actions .next", function() {
		var $next = $('.actions nav span.selected').removeClass('selected').next();
		if(!$next.length)
			$next = $('.actions nav span:first')
		$next.click();
	});
	var aTimer =setInterval(function() {
		$('.actions .next').click();
	}, 5000);


	$('body').on("click", ".photos-view .close", function() {
		$(this).parent().remove();
		$('.photos .current').removeClass('current');
	});

	$('body').on("click", ".photos-view .prev", function() {
		var $img = $(this).parent().find('.image img');
			$prev = $('.photos a.current').removeClass('current').prev();
		if(!$prev.length)
			$prev = $('.photos a:last')

		$img.attr('src', $prev.addClass('current').attr('href'));
	});

	$('body').on("click", ".photos-view .next, .photos-view .image", function() {
		var $img = $(this).parent().find('.image img');
			$next = $('.photos a.current').removeClass('current').next();
		if(!$next.length)
			$next = $('.photos a:first')
		
		$img.attr('src', $next.addClass('current').attr('href'));
	});

	var date = new Date();
	date.setMonth(date.getMonth() + 1);
	$(".book [name=date]").datepicker({
		inline: true,
		language: 'ru',
		minDate: new Date(),
		maxDate: date,
		dateFormat: 'yyyy-mm-dd',
		onSelect: function(value) {
			$('.book [name=time]').empty();
			// $.get('/book/get_time/', {date: value}, function(data) {
			// 	for(i in data)
			// 		$('.book [name=time]').append(
			// 			$('<option>')
			// 				.text(i)
			// 				.val(i)
			// 				.prop('disabled', !data[i])
			// 		);
			// });
		}
	}).data('datepicker').selectDate(new Date());

	$('.book form').submit(function() {
		var $form = $(this),
			$book = $form.parent();
		$.post('/book/', $(this).serialize(), function(data) {
			if(data == 'OK') {
				alert("Спасибо, для получение скидки вам необходимо подойти к этому времени на карт-трек");
				$book.hide();
			} else if(data.error) {
				alert(data.error);
			} else if(data == 'RESERVED') {
				alert("Выбранное время уже зарезервировано");
			} else {
				alert("Произошла неизвестная ошибка")
			}
		});
		return false;
	});

	$('.callback form').submit(function() {
		var $form = $(this),
			$callback = $form.parent();
		$.post('/callback/', $(this).serialize(), function(data) {
			if(data == 'OK') {
				alert("Спасибо, наш менеджер свяжется с вами");
				$callback.hide();
			} else {
				alert("Произошла неизвестная ошибка")
			}
		});
		return false;
	});

	$('[href="#callback"]').click(function() {
		$('.callback').show();
		$('.callback [name=type]').val($(this).attr('data-type'));
		return false;
	});

	$('[href="#oplati"]').click(function() {
		$('.oplati').show();
		$('.oplati-form').show();
		$('.oplati-details').hide();
		$('.oplati-success').hide();
		$('.oplati-error').hide();
		return false;
	});

	$('.podarit').click(function() {
		$('.podarok').show();
		return false;
	});

	$('.podarok form').submit(function() {
		var $form = $(this),
			$callback = $form.parent();

		const count = parseInt($form.find('[name=count]').val());
		
		$('.podarok').hide();
		$('[href="#oplati"]').click();

		$('.oplati form [name=sum]').val(25 * count);
		$('.oplati form [name=comment]').val('Подарок');
		

		return false;
	});

	const checkPayment = () => {
		const visible = $('.oplati').is(':visible');
		const paymentId = $('.oplati').attr('data-payment-id');
		if(!visible && !paymentId) return;

		fetch(`https://cashboxapi.o-plati.by/ms-pay/pos/payments/${paymentId}`, {
			headers: {
				regNum: 'OPL000055563',
				password: 'Savichya65',
				'Content-Type': 'application/json'
			},
		}).then(_ => _.json()).then(data => {
			if(data.status > 0) {
				$('.oplati').attr('data-payment-id', null);
				$('.oplati-form').hide();
				$('.oplati-details').hide();
				if(data.status === 1)
					$('.oplati-success').show();
				else
					$('.oplati-error').show();
				return;
			}
			setTimeout(checkPayment, 3000);
		}).catch(() => setTimeout(checkPayment, 3000));

	}

	$('.oplati form').submit(function() {
		var $form = $(this);

		const num = Date.now();

		$form.find('.continue').hide();
		$form.find('.loading').show();
		$form.find('[type=number]').attr('disabled', true);
		const sum = parseFloat($form.find('[type=number]').val());
		const comment = $form.find('[name=comment]').val();
		$('.oplati-details-sum').text(`К оплате ${sum} BYN`);
		fetch('https://cashboxapi.o-plati.by/ms-pay/pos/webPayments', {
			method: 'POST',
			headers: {
				regNum: 'OPL000055563',
				password: 'Savichya65',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"sum": sum,
				// "shift": "smena 2",
				"orderNumber" : num,
				"regNum": "OPL000055563",
				"details": {
					"receiptNumber": num,
					"items": comment ? [
						{
							"type": 1,
							"name": comment,
							"quantity": 1,
							"price": sum,
							"cost": sum
						}
					] : [{
						"type": 1,
						"name": `Заказ №${num}`,
						"quantity": 1,
						"price": sum,
						"cost": sum
					}],
					"amountTotal": sum,
					// "footerInfo": "ЛВО - QR для всех!"
				}
			})
		}).then(_ => _.json()).then(data => {
			$('.oplati-form').hide();
			$('.oplati-details').show();
			$('.oplati-details-qr').attr('src', `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data.dynamicQR}`);
			$('.oplati-details-button').attr('href', `https://getapp.o-plati.by/map/?app_link=${data.dynamicQR}`);
			$('.oplati').attr('data-payment-id', data.paymentId);
			checkPayment();
		}).finally(() => {
			$form.find('[type=number]').attr('disabled', false);
			$form.find('.continue').show();
			$form.find('.loading').hide();
		});
		return false;
	});

	VK.api('photos.get',{owner_id: -27320212, album_id: 231117377, count: 8},function(data) { 
		if (data.response)
			$.each(data.response, function() {
				$('<a target="_blank">')
					.attr('href', this.src_xbig ? this.src_big : this.src_big)
					.append('<div class="image" style="background-image: url(' + this.src_big + ')">')
					.appendTo('.photos')
					.click(function() {
						var $view = $('<div class="photos-view">');
						$view.append('<div class="image"><img src="' + this.href + '"></div>');
						$view.append('<div class="prev"></div><div class="next"></div><div class="close"></div>');
						$('body').append($view);
						$(this).addClass('current');
						return false;
					});
			});
	});
});