require('dotenv').config();
const mongoose = require('mongoose');
//MongoDB connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true ,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
//Schema definition
const personSchema = new mongoose.Schema({
  name: { type: String, required: true},
  age: Number,
  favoriteFoods: [String],
});

const Person = mongoose.model('Person', personSchema);
//Function to create and save a person
const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Javier",
    age: 30,
    favoriteFoods: ["milanesa", "empanada"],
  });

  person.save((err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

const arrayOfPeople = [
  { name: "Alicia", age: 25, favoriteFoods: ["pizza", "hamburguesa"] },
  { name: "Esteban", age: 33, favoriteFoods: ["sushi", "pasta"] },
  { name: "Maria", age: 27, favoriteFoods: ["ensalada", "pollo al horno"] },
];
//Function to create many people
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return done(err); //Handle the error by passing to the done function
    done(null, people);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, people) => {
    if (err) return done(err);
    done(null, people);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, person) => {
    if (err) return done(err);
    done(null, person);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return done(err);
    done(null, person);
  });
};

const findEditThenSave = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return done(err);
    person.favoriteFoods.push("hamburger");//Add hamburger to array
    person.markModified('favoriteFoods');//Mark the array as modified
    person.save((err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);//Save the updated document
    });
  });
};

const findAndUpdate = (personName, done) => {
  Person.findOneAndUpdate(
    { name: personName },//Find the person by name
    { age: 20 },//Set the age to 20
    { new: true },//Return the updated document
    (err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return done(err);
    done(null, removedPerson);//Return removed document
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, (err, response) => {
    if (err) return done(err);
    done(null, response);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find( {favoriteFoods: foodToSearch} )
    .sort( {name: 1} ) //Sort by name ascending
    .limit(2) //limit to 2 results
    .select( {age: 0} ) //Exclude age field
    .exec( (err, data) => {
      if (err) return done(err);
      done(null, data);
    });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
