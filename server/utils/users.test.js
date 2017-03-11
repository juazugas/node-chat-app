const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id:'1',
      name: 'Dude',
      room: 'Node course'
    },{
      id:'2',
      name: 'Jane',
      room: 'React course'
    },{
      id:'3',
      name: 'Julie',
      room: 'Node course'
    }];
  });

  it('should add a new user', () => {
    let users = new Users();
    let user = {
      id: 123,
      name: 'Juan',
      room: 'The office fans'
    };
    let response = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([ user ]);
  });

  it('should return names for node course', () => {
    let userList = users.getUsersList('Node course');

    expect(userList).toEqual(['Dude', 'Julie']);
  });

  it('should return names for react course', () => {
    let userList = users.getUsersList('React course');

    expect(userList).toEqual(['Jane']);
  });

  it('should remove a user', () => {
    let removeUserId = '1';
    let userRemoved = users.removeUser(removeUserId);

    expect(userRemoved.id).toBe(removeUserId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    let removeUserId = '99';
    let userRemoved = users.removeUser(removeUserId);

    expect(userRemoved).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    let userId = '1';
    let user = users.getUser(userId);

    expect(user.id).toBe(userId);
    expect(user).toEqual(users.users[0]);
  });

  it('should not find user', () => {
    let invalidId = '123';
    let user = users.getUser(invalidId);

    expect(user).toNotExist();
  });

});
