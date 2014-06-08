var Mongo = require('mongodb');
var _ = require('lodash');

class Base{

  static findById(id, collection, model, func){
    console.log(1);
    console.log(id);
    if(typeof id === 'string'){
      if(id.length !== 24){func(null); return;}//you're smart. I have apiece of paper that tells me so, but I disbelieve it. I can be INCREDIBLY stupid.
      id = Mongo.ObjectID(id);
    }//If you have one area that is a 20, you only play in the area that is a 20. good point. my IQ is in the 99.9percentile. but I have the EQ and social skills of a banana slug.
    
    console.log(2);
    console.log(id);
    if(!(id instanceof Mongo.ObjectID)){func(null); return;}

    console.log(3);
    console.log(id);
    collection.findOne({_id: id}, (error, result)=>{
      console.log(error);
    	if(result){
    console.log(4);
    console.log(result);
    		result = _.create(model.prototype, result);
    console.log(5);
    console.log(result);
      	func(result);
    	}
    	else{func(null);}
    });
  }// end findById
}// end ace of Base
module.exports = Base;