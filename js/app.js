requirejs.config({
	urlArgs: 'bust=v3',	
	baseUrl: 'js/lib',
	shim : {
		"bootstrap" : { "deps" :['jquery', 'css!bootstrap-3.3.6-dist/css/bootstrap.min'] }
	},
	paths: { 
		app: '..',
		bootstrap: 'bootstrap-3.3.6-dist/js/bootstrap.min',
		rivets: 'rivets-0.6.9',
		'underscore-string': 'underscore.string.min'
	},
	map: {
		'*': {
			'css': 'require-css/css.min'
		}
	}
});
define( [ 'app/controller/game' ], function( Game ){
	var game = new Game( $( '#game' ) );
} );