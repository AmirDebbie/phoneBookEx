const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const url = `mongodb+srv://AmirDebbie:amir123456@cluster0.clkcg.mongodb.net/PhoneBook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
    person.save().then((result) => {
        console.log(`added ${person.name} ${person.number} to phonebook`);
        mongoose.connection.close();
  });
} else {
  console.log("name should be in quotes if it has more than one letter");
  mongoose.connection.close();
}

//   Person.deleteOne({name: 'Hello'}).then(result => {

//       if (result.deletedCount > 0) {
//         console.log("item deleted");
//       } else {
//           console.log('item wasnt found');
//       }
//     mongoose.connection.close()
//   })
