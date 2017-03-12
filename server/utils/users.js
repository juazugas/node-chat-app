

// addUser(id, name, room);
// removeUser(id);
// getUser(id)
// getUserList(room)

class Users {

  constructor () {
    this.users = [];
  }

  addUser(id, name, room) {
    let user = { id, name, room };

    this.users.push(user);
  }

  removeUser(id) {
    let user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((luser) => luser.id !== id);
    }
    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  // array of strings of the user in the room
  getUsersList(room) {
    let users = this.users.filter((user) => user.room === room);
    let namesArray = users.map((user)=> user.name);

    return namesArray;
  }

}

module.exports = {Users};
