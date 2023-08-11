/*

	jQuery Tags Input Plugin 1.3.3

	Copyright (c) 2011 XOXCO, Inc

	Documentation for this plugin lives here:
	http://xoxco.com/clickable/jquery-tags-input

	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php

	ben@xoxco.com

*/


tagslist =[];
emailtags =[];
phonetags=[];

(function($) {

	var delimiter = [];
	var tags_callbacks = [];
	// console.log(delimiter);
	console.log(tags_callbacks)
	$.fn.doAutosize = function(o){
		var minWidth = $(this).data('minwidth'),
			maxWidth = $(this).data('maxwidth'),
			val = '',
			input = $(this),
			testSubject = $('#'+$(this).data('tester_id'));




		if (val === (val = input.val())) {return;}

		// Enter new content into testSubject
		var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		testSubject.html(escaped);
		// Calculate new width + whether to change
		var testerWidth = testSubject.width(),
			newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
			currentWidth = input.width(),
			isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
				|| (newWidth > minWidth && newWidth < maxWidth);

		console.log(minWidth);
		// Animate width
		if (isValidWidthChange) {
			input.width(newWidth);
		}


	};
	$.fn.resetAutosize = function(options){
		// alert(JSON.stringify(options));
		var minWidth =  $(this).data('minwidth') || options.minInputWidth || $(this).width(),
			maxWidth = $(this).data('maxwidth') || options.maxInputWidth || ($(this).closest('.tagsinput').width() - options.inputPadding),
			val = '',
			input = $(this),
			testSubject = $('<tester/>').css({
				position: 'absolute',
				top: -9999,
				left: -9999,
				width: 'auto',
				fontSize: input.css('fontSize'),
				fontFamily: input.css('fontFamily'),
				fontWeight: input.css('fontWeight'),
				letterSpacing: input.css('letterSpacing'),
				whiteSpace: 'nowrap'
			}),
			testerId = $(this).attr('id')+'_autosize_tester';
		if(! $('#'+testerId).length > 0){
			testSubject.attr('id', testerId);
			testSubject.appendTo('body');
		}

		input.data('minwidth', minWidth);
		input.data('maxwidth', maxWidth);
		input.data('tester_id', testerId);
		// input.css('width', minWidth);
	};

	$.fn.addTag = function(value,options) {

		options = jQuery.extend({focus:false,callback:true},options);

		console.log(value);
		this.each(function() {
			var id = $(this).attr('id');

			tagslist = $(this).val().split(delimiter[id]);
			if (tagslist[0] == '') {
				tagslist = new Array();
			}

			value = jQuery.trim(value);
			console.log(value)

			if (options.unique) {
				var skipTag = $(this).tagExist(value);
				if(skipTag == true) {
					//Marks fake input as not_valid to let styling it
					$('#'+id+'_tag').addClass('not_valid');
				}
			} else {
				var skipTag = false;
			}

			var re = /\S+@\S+\.\S+/;



			if(id == "tags_2" || id == "tags_4"){
				if (value !='' && skipTag != true) {
					$('<span>').addClass('tag').append(
						$('<span class="emaillist">').text(value).append('&nbsp;&nbsp;'),
						$('<a>', {
							title : 'Removing tag',
							text  : 'x'
						}).click(function () {
							return $('#' + id).removeTag(escape(value));
						})
					).insertBefore('#' + id + '_addTag')
					console.log(id);


					if(re.test(value) == true){
						var skipTag = false;
						console.log('emailvalid');
						tagslist.push(value)
					}
					else {
						var skipTag = true;
						console.log('email not valid');
						Messenger().post({
							message: 'Please type valid email',
							type: 'error',
							showCloseButton: true
						});
					}





					console.log(tagslist)



					$('#'+id+'_tag').val('');
					if (options.focus) {
						$('#'+id+'_tag').focus();
					} else {
						$('#'+id+'_tag').blur();
					}

					$.fn.tagsInput.updateTagsField(this,tagslist);

					if (options.callback && tags_callbacks[id] && tags_callbacks[id]['onAddTag']) {
						var f = tags_callbacks[id]['onAddTag'];
						f.call(this, value);
					}
					if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
					{
						var i = tagslist.length;
						var f = tags_callbacks[id]['onChange'];
						f.call(this, $(this), tagslist[i-1]);
					}
				}
			}
			else {
				if (value !='' && skipTag != true) {
					$('<span>').addClass('tag').append(
						$('<span class="phonelist">').text(value).append('&nbsp;&nbsp;'),
						$('<a>', {
							title : 'Removing tag',
							text  : 'x'
						}).click(function () {
							return $('#' + id).removeTag(escape(value));
						})
					).insertBefore('#' + id + '_addTag')
					tagslist.push(value);
					console.log(id);

					$('#'+id+'_tag').val('');
					if (options.focus) {
						$('#'+id+'_tag').focus();
					} else {
						$('#'+id+'_tag').blur();
					}

					$.fn.tagsInput.updateTagsField(this,tagslist);

					if (options.callback && tags_callbacks[id] && tags_callbacks[id]['onAddTag']) {
						var f = tags_callbacks[id]['onAddTag'];
						f.call(this, value);
					}
					if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
					{
						var i = tagslist.length;
						var f = tags_callbacks[id]['onChange'];
						f.call(this, $(this), tagslist[i-1]);
					}
				}
				var skipTag = false;


			}


		});

		return false;
	};

	$.fn.removeTag = function(value) {
		value = unescape(value);
		this.each(function() {
			var id = $(this).attr('id');

			var old = $(this).val().split(delimiter[id]);
			console.log(old);
			// var old = tagslistdemo;

			$('#'+id+'_tagsinput .tag').remove();
			str = '';
			for (i=0; i< old.length; i++) {
				if (old[i]!=value) {
					// tagslistdemo.splice(i, 1);
					str = str + delimiter[id] +old[i];
				}
			}


			$.fn.tagsInput.importTags(this,str);


			if (tags_callbacks[id] && tags_callbacks[id]['onRemoveTag']) {
				var f = tags_callbacks[id]['onRemoveTag'];
				f.call(this, value);
			}

		});

		return false;
	};

	$.fn.tagExist = function(val) {
		var id = $(this).attr('id');
		var tagslist = $(this).val().split(delimiter[id]);
		return (jQuery.inArray(val, tagslist) >= 0); //true when tag exists, false when not
	};

	// clear all existing tags and import new ones from a string
	$.fn.importTags = function(str) {
		id = $(this).attr('id');
		$('#'+id+'_tagsinput .tag').remove();
		$.fn.tagsInput.importTags(this,str);
	}

	$.fn.tagsInput = function(options) {
		console.log(options)
		var settings = jQuery.extend({
			interactive:true,
			defaultText:'',
			minChars:0,
			width:'100%!important',
			height:'100px',
			autocomplete: {selectFirst: false },
			'hide':true,
			'delimiter':',',
			'unique':true,
			removeWithBackspace:true,
			placeholderColor:'#fff',
			// autosize: true,
			comfortZone: 20,
			inputPadding: 6*2
		},options);
		console.log(settings)

		this.each(function() {
			if (settings.hide) {
				$(this).hide();
			}
			var id = $(this).attr('id');
			if (!id) {
				id = $(this).attr('id', 'tags' + new Date().getTime()).attr('id');
			}

			var data = jQuery.extend({
				pid:id,
				real_input: '#'+id,
				holder: '#'+id+'_tagsinput',
				input_wrapper: '#'+id+'_addTag',
				fake_input: '#'+id+'_tag'
			},settings);
			console.log(data)

			delimiter[id] = data.delimiter;

			if (settings.onAddTag || settings.onRemoveTag || settings.onChange) {
				tags_callbacks[id] = new Array();
				tags_callbacks[id]['onAddTag'] = settings.onAddTag;
				tags_callbacks[id]['onRemoveTag'] = settings.onRemoveTag;
				tags_callbacks[id]['onChange'] = settings.onChange;
			}

			var markup = '<div id="'+id+'_tagsinput" class="tagsinput"><div id="'+id+'_addTag" style="width: 100%!important;">';

			if (settings.interactive) {
				markup = markup + '<input id="'+id+'_tag" value="" style="width: 100%!important;" data-default="'+settings.defaultText+'" />';
			}

			markup = markup + '</div><div class="tags_clear"></div></div>';

			$(markup).insertAfter(this);

			$(data.holder).css('width',settings.width);
			$(data.holder).css('min-height',settings.height);

			if ($(data.real_input).val()!='') {
				$.fn.tagsInput.importTags($(data.real_input),$(data.real_input).val());
			}
			if (settings.interactive) {
				$(data.fake_input).val($(data.fake_input).attr('data-default'));
				$(data.fake_input).css('color',settings.placeholderColor);
				$(data.fake_input).resetAutosize(settings);

				$(data.holder).bind('click',data,function(event) {
					$(event.data.fake_input).focus();
				});

				$(data.fake_input).bind('focus',data,function(event) {
					if ($(event.data.fake_input).val()==$(event.data.fake_input).attr('data-default')) {
						$(event.data.fake_input).val('');
					}
					$(event.data.fake_input).css('color','rgb(158, 157, 157)');
				});

				if (settings.autocomplete_url != undefined) {
					autocomplete_options = {source: settings.autocomplete_url};
					for (attrname in settings.autocomplete) {
						autocomplete_options[attrname] = settings.autocomplete[attrname];
					}

					if (jQuery.Autocompleter !== undefined) {
						$(data.fake_input).autocomplete(settings.autocomplete_url, settings.autocomplete);
						$(data.fake_input).bind('result',data,function(event,data,formatted) {
							if (data) {
								$('#'+id).addTag(data[0] + "",{focus:true,unique:(settings.unique)});
							}
						});
					} else if (jQuery.ui.autocomplete !== undefined) {
						$(data.fake_input).autocomplete(autocomplete_options);
						$(data.fake_input).bind('autocompleteselect',data,function(event,ui) {
							$(event.data.real_input).addTag(ui.item.value,{focus:true,unique:(settings.unique)});
							return false;
						});
					}


				} else {
					// if a user tabs out of the field, create a new tag
					// this is only available if autocomplete is not used.
					$(data.fake_input).bind('blur',data,function(event) {
						var d = $(this).attr('data-default');
						if ($(event.data.fake_input).val()!='' && $(event.data.fake_input).val()!=d) {
							if( (event.data.minChars <= $(event.data.fake_input).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fake_input).val().length)) )
								$(event.data.real_input).addTag($(event.data.fake_input).val(),{focus:true,unique:(settings.unique)});
						} else {
							$(event.data.fake_input).val($(event.data.fake_input).attr('data-default'));
							$(event.data.fake_input).css('color',settings.placeholderColor);
						}
						return false;
					});

				}
				// if user types a comma, create a new tag
				$(data.fake_input).bind('keypress',data,function(event) {
					if (event.which==event.data.delimiter.charCodeAt(0) || event.which==13 ) {
						event.preventDefault();
						if( (event.data.minChars <= $(event.data.fake_input).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fake_input).val().length)) )
							$(event.data.real_input).addTag($(event.data.fake_input).val(),{focus:true,unique:(settings.unique)});
						$(event.data.fake_input).resetAutosize(settings);
						return false;
					} else if (event.data.autosize) {
						$(event.data.fake_input).doAutosize(settings);

					}
				});
				//Delete last tag on backspace
				data.removeWithBackspace && $(data.fake_input).bind('keydown', function(event)
				{
					if(event.keyCode == 8 && $(this).val() == '')
					{
						event.preventDefault();
						var last_tag = $(this).closest('.tagsinput').find('.tag:last').text();
						var id = $(this).attr('id').replace(/_tag$/, '');
						last_tag = last_tag.replace(/[\s]+x$/, '');
						$('#' + id).removeTag(escape(last_tag));
						$(this).trigger('focus');
					}
				});
				$(data.fake_input).blur();

				//Removes the not_valid class when user changes the value of the fake input
				if(data.unique) {
					$(data.fake_input).keydown(function(event){
						if(event.keyCode == 8 || String.fromCharCode(event.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,/]+/)) {
							$(this).removeClass('not_valid');
						}
					});
				}
			} // if settings.interactive
		});

		return this;

	};

	$.fn.tagsInput.updateTagsField = function(obj,tagslist) {
		var id = $(obj).attr('id');
		$(obj).val(tagslist.join(delimiter[id]));
	};

	$.fn.tagsInput.importTags = function(obj,val) {
		$(obj).val('');
		var id = $(obj).attr('id');
		var tags = val.split(delimiter[id]);
		console.log(tags)
		// var tags = tagslistdemo;
		for (i=0; i<tags.length; i++) {
			$(obj).addTag(tags[i],{focus:false,callback:false});
		}
		if(tags_callbacks[id] && tags_callbacks[id]['onChange'])
		{
			var f = tags_callbacks[id]['onChange'];
			f.call(obj, obj, tags[i]);
		}
	};

})(jQuery);


/* real code - begin */

function onAddTag(tag) {
	alert("Added a tag: " + tag);
}
function onRemoveTag(tag) {
	alert("Removed a tag: " + tag);
}

function onChangeTag(input, tag) {
	alert("Changed a tag: " + tag);
}
$(function () {

	$('#tags_1').tagsInput({ width: 'auto',placeholderColor : '#fff'});
	$('#tags_2').tagsInput({
		width: 'auto',
		placeholderColor : '#fff'
	});

	$('#tags_4').tagsInput({
		width: 'auto',
		placeholderColor : '#fff'
	});

	$('#tags_2_tag').attr("placeholder", "Email Id (Primary Alerts)");
	$('#tags_4_tag').attr("placeholder", "Email Id's (Optional)");
	$('#tags_1_tag').attr("placeholder", "Phone Number(Optional)");
	$('#tags_3').tagsInput({
		width: 'auto',

		//autocomplete_url:'test/fake_plaintext_endpoint.html' //jquery.autocomplete (not jquery ui)
		autocomplete_url: 'test/fake_json_endpoint.html' // jquery ui autocomplete requires a json endpoint
	});


	// Uncomment this line to see the callback functions in action
	//			$('input.tags').tagsInput({onAddTag:onAddTag,onRemoveTag:onRemoveTag,onChange: onChangeTag});

	// Uncomment this line to see an input with no interface for adding new tags.
	//			$('input.tags').tagsInput({interactive:false});

	if(window.location.pathname == "/cctv_addition"){
		var e = $.Event( "keypress", { which: 13 } );
		defaulEmailAddressdata?.forEach(function(email){
			$("#tags_2_tag").css("width", "auto").val(email).trigger(e);
		})
	}
  
});

/* real code - end */




function defaultEmailIds(data){
	$("span.tag").remove()
	var e = $.Event( "keypress", { which: 13 } );
	data?.forEach(function(email){
		$("#tags_2_tag").css("width", "auto").val(email).trigger(e);
	})
}