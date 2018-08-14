define([], function(){
	return function(){
		this.get = function( id ){
			return { id: id, name: '', score: '', attempts: 8}
		}
	}
});