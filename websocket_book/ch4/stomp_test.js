/*jshint asi: true, expr: true */

var expect = chai.expect;

/////////////////////////////////////////////////////
////////////////// TEST START HERE //////////////////
/////////////////////////////////////////////////////
describe('the STOMP server', function () {
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
  
  it('should detect the namespace', function() {
    expect(Stomp).to.be.ok;
  });

  it('should objectify a CONNECT command string', function() {
    var connectString = "CONNECT\nlogin: websockets\npasscode: rabbitmq\nnickname: anonymous\n\n\0";
    var result = Stomp.process_frame(connectString);
    expect(result.command).to.be.equal('CONNECT');
    expect(result.headers.login).to.be.equal('websockets');
    expect(result.headers.nickname).to.be.equal('anonymous');
    expect(result.headers.passcode).to.be.equal('rabbitmq');
  });
  
  it('should stringify a CONNECT frame', function() {
    var connectFrame = {
      command: 'CONNECT',
      headers: {
        nickname:'anonymous',
        passcode:'rabbitmq',
        login:'websockets'
      }
    };
    
    var result = Stomp.process_frame(Stomp.stringify_frame(connectFrame));
    expect(result.command).to.be.equal('CONNECT');
    expect(result.headers.login).to.be.equal('websockets');
    expect(result.headers.nickname).to.be.equal('anonymous');
    expect(result.headers.passcode).to.be.equal('rabbitmq');
  });
});
