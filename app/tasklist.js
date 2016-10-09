/**
 * Created by reedvilanueva on 10/8/16.
 */

Tasks = new Mongo.Collection('tasks')

if (Meteor.isClient) {
  Template.tasks.helpers({
    tasks: function () {
      return Tasks.find({}, { sort: { createdAt: -1 } })
    }
  })

  Template.tasks.events({
    "submit .add-task": function (event) {
      // for a 'submit' event under this template class, get the task name entered in
      //    the form that uses this add-task class.
      let name = event.target.name.value;
      // add an obj. with 'name' and 'createdAt' date to the DB
      Meteor.call('addTask', name);
      // reset the form input
      event.target.name.value = '';

      return false;
    },

    "click .delete-task": function (event) {
      // for a 'click' event under this template class, ask for confirmation and
      //    delete the item from the DB
      if (confirm('Delete Task?')) {
        Meteor.call('deleteTask', this._id);
      }

      return false;
    }

  })
}

if (Meteor.isServer) {

}

// using methods is more secure and allows us to keep all functions in one place
Meteor.methods({
  addTask: function(name) {
    // check if user is logged in
    if(!Meteor.userID()) {
      throw new Meteor.Error('No Access');
    }

    // add an obj. with 'name' and 'createdAt' date to the DB
    Tasks.insert({
      name: name, createdAt: new Date(), userID: Meteor.userID()
    });
  },

  deleteTask: function(taskId) {
    Tasks.remove(taskId);
  }
})
