/**
 * Created by rpaulin on 7/19/17.
 */

// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var SavedSchema = new Schema({

    // Just a string
    title: {
        type: String
    },
    link: {
        type: String
    },
    notes: [{
        // Store ObjectIds in the array
        type: String
    }]
});

// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

// Create the Note model with the NoteSchema
var Saved = mongoose.model("Saved", SavedSchema);

// Export the Note model
module.exports = Saved;