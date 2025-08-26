require('dotenv').config();
const mongoose = require('mongoose');




mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true });

const arrayOfPeople = [{ name: "Ana", age: 25 }, { name: "Carlos", age: 32 }];

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model('Person', personSchema);


const createAndSavePerson = (done) => {

  // 1. Cria uma nova "pessoa" usando o Model como um construtor.
  // Isso é como preencher um formulário na memória do servidor.
  var person = new Person({
    name: "Maria Souza",
    age: 28,
    favoriteFoods: ["Açaí", "Sushi"]
  });

  // 2. Chama .save() para enviar os dados para o MongoDB.
  // O callback será executado quando a operação terminar.
  person.save(function (err, data) {
    if (err) {
      // Algo deu errado (ex: falha na conexão, dado inválido)
      return done(err);
    }

    // Sucesso! Os dados foram salvos.
    // O parâmetro 'data' é o documento como ele foi salvo no banco.
    done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) {
      return done(err);
    }
    done(null, people);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, function (err, data) {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, function (err, data) {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, function (err, data) {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  
  Person.findById(personId, function (err, person) { 
    if (err) {
      return done(err);
    }

    person.favoriteFoods.push(foodToAdd);

    person.save(function (err, updatedPerson) {
      if (err) {
        return done(err);
      }

      // 4. Avise que tudo terminou com sucesso, DENTRO do callback do save.
      done(null, updatedPerson);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  // O primeiro argumento DEVE ser um objeto de consulta {campo: valor}
  Person.findOneAndUpdate(
    { name: personName },          // 1. Filtro: procure onde o campo 'name' é igual a personName
    { age: ageToSet },             // 2. Atualização: defina o campo 'age' para o valor de ageToSet
    { new: true },                 // 3. Opções: retorne o documento APÓS a atualização
    (err, updatedDoc) => {         // 4. Callback para lidar com o resultado
      if (err) {
        return done(err);
      }
      done(null, updatedDoc);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  // 1. Chame o método .remove() diretamente no Model Person
  Person.remove(
    { name: nameToRemove },       // Filtro: apague os documentos onde o nome é "Mary"
    function (err, result) {       // Callback que recebe o relatório da operação
      if (err) {
        return done(err);
      }

      // 'result' é um objeto como: { ok: 1, n: 2 }, onde 'n' é o número de documentos removidos.
      done(null, result);
    }
  );
};

const queryChain = (done) => {
  const foodToSearch = "burrito"; // ou qualquer outra comida

  Person.find({ favoriteFoods: foodToSearch }) // 1. Encontre pessoas que gostam de 'burrito'
    .sort('name')                            // 2. Ordene os resultados pelo nome (A-Z)
    .limit(2)                                // 3. Limite a apenas 2 resultados
    .select('-age')                          // 4. Exclua o campo 'age' dos resultados
    .exec(function (err, data) {              // 5. Execute a consulta!
      if (err) {
        return done(err);
      }
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
