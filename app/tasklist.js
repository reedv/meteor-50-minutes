/**
 * Created by reedvilanueva on 10/8/16.
 */

Tasks = new Mongo.Collection('tasks')

if (Meteor.isClient) {
  // Name of a subscription. Matches the name of the server's `publish()` call.
  Meteor.subscribe('tasks');

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
  Meteor.publish('tasks', function(){
    // Function called on the server each time a client subscribes
    //   to the record set 'tasks'

    // return all Tasks items associated with the current user's userID
    return Tasks.find({userID: this.userId});
  })
}

// using methods is more secure and allows us to keep all functions in one place
Meteor.methods({
  addTask: function(name) {
    // check if user is logged in
    if(!Meteor.userId()) {
      throw new Meteor.Error('No Access');
    }

    // add an obj. with 'name' and 'createdAt' date to the DB
    Tasks.insert({
      name: name, createdAt: new Date(), userID: Meteor.userId()
    });
  },

  deleteTask: function(taskId) {
    Tasks.remove(taskId);
  }
})
