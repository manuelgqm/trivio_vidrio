define([ 'lodash', 'underscore-string', 'app/model/Questions' ], function( _, _s, Questions ){
	return function( player ){
		this.data = {
			question_colors: {
				red: 'Generalidades y definiciones sobre el riesgo de estrés térmico en la industria del vidrio',
				blue: 'Normativa',
				yellow: 'Medidas preventivas',
				green: 'Factores que contribuyen al estrés térmico',
				cyan: 'Factores personales',
				purple: 'Efectos en la salud'
			},
			questions_counter: { red: 0, blue: 0, yellow: 0, green: 0, cyan: 0, purple: 0 },
			questions: []
		}
		
		var model = this;
		
		//methods
		this.command = {
			
			initialize: function(){
				model.data.players = [];
				model.data.max_players = 4;
				model.data.current_player_id = 1;
				model.data.current_player_idx = 0;
				model.data.current_question = {};
				model.data.current_question_success = false;
				model.data.current_screen = 'screen1';
				model.data.questions_used = '#';
				model.data.final_score_text = '';
				model.data.questions = new Questions();
			},
			
			add_player: function( player ){ model.data.players.push( player ) },
			
			remove_player: function( id ){
				_.remove( model.data.players, function( player ){
					return player.id == id;
				});
				
			},
			
			players_ok: function(){
				var output = true;
				_.each( model.data.players, function( player ){
					if ( !player.name.length ) output = false;
				})
				return output;
			},
			
			get_question: function(){
				
				var q = _.sample( model.data.questions );
				model.data.current_question = q;
				_.remove( model.data.questions, function( question ){
					return question.id == q.id;
				})
				
			},
			
			correct: function( answer ){
				
				var current_question = model.data.current_question;
				if( eval( answer ) == current_question.solution ){ 
					model.data.current_question_success = true;
					if( !model.command.have_score( current_question.color ) ){
						model.command.add_score();
					}
				} else {
					if( model.command.have_score( current_question.color ) ){
						model.command.remove_score( current_question.color );
					};
					model.data.current_question_success = false;
				}
				
				model.command.sus_attempt();
				
			},
			
			add_score: function(){
				var current_player_idx = model.data.current_player_idx;
				if( model.data.players[ current_player_idx ].score.length != 0 ) { 
					model.data.players[ current_player_idx ].score = model.data.players[ current_player_idx ].score + '#';
				};
				model.data.players[ current_player_idx ].score += model.data.current_question.color;
			},
			
			remove_score: function( qolor ){
				var current_player_idx = model.data.current_player_idx;
				model.data.players[ current_player_idx ].score = _s.replaceAll( model.data.players[ current_player_idx ].score, qolor + '#', '');
				model.data.players[ current_player_idx ].score = _s.replaceAll( model.data.players[ current_player_idx ].score, qolor, '');
			},
			
			sus_attempt: function(){
				--model.data.players[ model.data.current_player_idx ].attempts;
			},
			
			next_player: function(){
				var current_player_idx = model.data.current_player_idx;
				if( current_player_idx == model.data.players.length - 1 ){
					model.data.current_player_idx = 0;
				} else {
					++model.data.current_player_idx;
				};
			
			},
			
			have_score: function( qolor ){
				return _s.include(model.data.players[ model.data.current_player_idx ].score, qolor);
			},
			
			final_score: function(){
				var fs_text = '';
				var players = model.data.players;
				
				_.forEach( players, function( player, idx ){
					players[ idx ].total_points = ( player.score.length) ? _s.count( player.score, '#' ) + 1 : 0;
				});
				
				if( players.length == 1 ){
					
					var player = players[0];
					
					switch( player.total_points ){
					case 0:
						fs_text = 'Lástima' + player.name + ', no has conseguido acertar ninguna pregunta. No te desanimes y vuelve a intentarlo cuando quieras';
						break
					case 2:
						fs_text = '¡Enhorabuena! ' + player.name + ' has conseguido completar todos los colores.';
						break
					default:
						fs_text = 'Bien hecho ' + player.name + ' has coseguido ' + player.total_points + ' colores de los 6 posibles. Vuelve a jugar cuando quieras para mejorar tu puntuación.';
					};
				} else {
					var points = _.uniq( players, 'total_points' );
					var max_points = _.max( points, 'total_points' ).total_points;
					var winners = _.filter( players, function( player ){
						return player.total_points == max_points;
					});
					
					if( winners.length == players.length ){
						fs_text = 'Hay un empate, todos los jugadores han conseguido completar ' + max_points + ' colores.'
					} else {
						if( winners.length > 1 ){
							fs_text = 'Hay un empate, los jugadores ' + _s.toSentence( _.pluck( winners, 'name' ), ", ", " y " );
							fs_text += ' con ' + max_points + ' colores, son los que han obtenido mayor puntuación';
						} else {
							fs_text += '¡Enhorabuena! jugador ' + winners[0].name + ' con ' + max_points + ' colores, eres el que mayor número ha conseguido. Por lo tanto has ganado la partida.'
						};
					};
				};
				model.data.final_score_text = fs_text;
			}
			
		}
		
		model.command.initialize();
	}
})