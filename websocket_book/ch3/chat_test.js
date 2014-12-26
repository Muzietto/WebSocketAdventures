/*jshint asi: true, expr: true */

var expect = chai.expect;

/////////////////////////////////////////////////////
////////////////// TEST START HERE //////////////////
/////////////////////////////////////////////////////
describe('the chat server', function () {
  beforeEach(function () {
  });

  it('should splice by predicate',function(){
    this.clients = [
      { id: 1 },
      { id: 2 }
    ];

    var removed = this.clients.spliceP(function(elem) {
      return (elem.id === 1);
    });
    expect(removed[0].id).to.be.equal(1);
    expect(this.clients.length).to.be.equal(1);
    expect(this.clients[0].id).to.be.equal(2);
  });
});
