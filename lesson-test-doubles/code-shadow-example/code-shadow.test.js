const moduleToTest = {
    a: function () {
        this.b("some argument");
        this.c("some argument");
    },
    b: function () {},
    c: function () {}
}



















const sinon = require('sinon')

//The code shadow 🕵🏼‍ Anti-pattern
test('a should call b & c', () => {
    const mock = sinon.mock(moduleToTest);
    mock.expects('b').exactly(1).withArgs("some argument");
    mock.expects('c').exactly(1).withArgs("some argument");;

    moduleToTest.a();

    mock.verify();
});