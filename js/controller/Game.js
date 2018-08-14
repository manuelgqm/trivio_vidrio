define( [ 'lodash', 
					'jquery',
					'app/model/Game', 
					'app/view/game', 
					'app/controller/Player' ],
	function( _, $, Model, view, Player ){
		return function( $el ){
			this.$el = $el;
			this.model = {};
			this.controller = {};
			this.player = new Player;
			
			_.assign( this.model, new Model );
			_.assign( this, view );

			this.render( this.$el );
			
			var model = this.model;
			var that = this;
			
			this.controller.add_player = function(){
				if( model.data.players.length != model.data.max_players ){
					var max_id = _.max( that.model.data.players, 'id');
					model.command.add_player( that.player.model.get( max_id.id + 1 ) );
				}
			};
			
			this.controller.remove_player = function( a, b ){
				var id = $( b.el ).val();
				model.command.remove_player( id );
				that.bind();
			};
			
			this.controller.start = function(){
				that.bind();
				if ( model.command.players_ok() ){
					model.command.get_question();
					that.switch_to( 'screen3', function(){ $( '#score' ).fadeIn(); } )
				} else {
					that.show_alert('player_names');
				}
			};
			
			this.controller.get_question = function(a, b){
				that.bind();
				model.command.get_question();
				that.switch_to( 'screen3' );
			};
			
			this.controller.correct = function(a, b){
				var answer = $( b.el ).attr( 'answer' );
				model.command.correct( answer );
				that.switch_to( 'screen4' );
			};
			
			this.controller.next_player = function(){
				if( !that.controller.gameover() ){
					model.command.get_question();
					model.command.next_player();
					that.switch_to( 'screen3' );
				} else {
					model.command.final_score();
					that.switch_to( 'screen5' );
				}
			};
			
			this.controller.gameover = function(){
				var current_player_idx = model.data.current_player_idx;
				return current_player_idx == model.data.players.length - 1 && model.data.players[ current_player_idx ].attempts == 0;
			};
			
			this.controller.new_game = function(){
				that.switch_to( 'screen1', function(){ $( '#score' ).fadeOut() });
				model.command.initialize();
				model.command.add_player( that.player.model.get( 1 ) );
				that.bind();
			};
			
			this.controller.new_game();
		}
	}
);