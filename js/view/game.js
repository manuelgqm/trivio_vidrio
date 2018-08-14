define( [ 'jquery', 'rivets', 'text!app/view/game.html', 'bootstrap' ], function( $, rivets, template ){
	return {
		render: function( $el ){
			var that = this;
			$el.append( template );
			
			rivets.configure({
			  handler: function (target, event, binding) {
			    var eventType = binding.args[0];
			    var arg = target.getAttribute('data-on-' + eventType);
			    if (arg) {
			      this.call(binding.model, arg);
			    } else {
			      this.call(binding.model, event, binding);
			    }
					
			  }
			});
			
			rivets.formatters.is_first = function( id ){ return id == 1	};
			
			rivets.formatters.get_name = function( idx ){
				if( that.model.data.players.length ) return that.model.data.players[ idx ].name;
			};
			
			rivets.formatters.not_max = function( max_players ){
				return that.model.data.players.length < max_players
			};
			
			rivets.formatters.get_definition = function( qolor ){
				return that.model.data.question_colors[ qolor ]
			};
			
			rivets.formatters.render_score = function( score ){
				var score_a = score.split( '#' );
				return _.each( score_a, function( item, idx ){
					score_a[idx] += '_score';
				});
			};
			
			this.rivets = rivets.bind( $el, {
				content: this.model.data,
				controller: this.controller
			})
		},
		
		bind: function(){
			
			this.rivets.bind({
				content: this.model.data,
				controller: this.controller
			})
		},
		
		switch_to: function( screen, callback ){
			$( '.alert' ).fadeOut();
			
			$( '#' + this.model.data.current_screen ).fadeOut(function(){
				$( '#' + screen ).fadeIn();
				if( callback != undefined ){ callback() }
			});
			
			this.model.data.current_screen = screen;
		},
		
		show_alert: function( message_id ){
			$( '#' + message_id ).removeClass( 'hide' );
			setTimeout( function(){ $( '#' + message_id ).addClass('in'); }, 1);
		}
	}
})