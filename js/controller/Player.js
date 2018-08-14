define( [ 'lodash', 'app/model/player'], function( _, Model ){
	return function(){
		this.model = {};
		_.assign( this.model, new Model );
	}
});