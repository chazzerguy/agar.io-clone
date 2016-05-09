/*jshint expr:true */

var expect = require('chai').expect,
    util   = require('../src/server/lib/util');

var cfg = require('../config.json');


/**
 * Tests for server/lib/util.js
 *
 * This is mostly a regression suite, to make sure behavior
 * is preserved throughout changes to the server infrastructure.
 */

describe('util.js', function () {

  describe('#massToRadius', function () {

    it('should return non-zero radius on zero input', function () {
      var r = util.massToRadius(0);
      expect(r).to.be.a('number');
      expect(r).to.equal(4);
    });

    it('should convert masses to a circle radius', function () {
      var r1 = util.massToRadius(4),
          r2 = util.massToRadius(16),
          r3 = util.massToRadius(1);

      expect(r1).to.equal(16);
      expect(r2).to.equal(28);
      expect(r3).to.equal(10);
    });
  });


  describe('#validNick', function () {

    it('should allow empty player nicknames', function () {
      var bool = util.validNick('');
      //expect(bool).to.be.true;
    });

    it('should allow ascii character nicknames', function () {
      var n1 = util.validNick('Walter_White'),
          n2 = util.validNick('Jesse_Pinkman'),
          n3 = util.validNick('hank'),
          n4 = util.validNick('marie_schrader12'),
          n5 = util.validNick('p');

      expect(n1).to.be.true;
      expect(n2).to.be.true;
      expect(n3).to.be.true;
      expect(n4).to.be.true;
      expect(n5).to.be.true;
    });

    it('should disallow unicode-dependent alphabets', function () {
      var n1 = util.validNick('Йèæü');

      expect(n1).to.be.false;
    });

    it('should allow spaces in nicknames', function () {
        var n1 = util.validNick('Walter White');
        expect(n1).to.be.true;
    });
  });

  describe('#validPass', function() {

    it('should match entered password to what is in config.json', function () {
      var t1 = util.validPass(cfg.playerPass);
      var t2 = util.validPass('');
      var t3 = util.validPass('password');

      expect(t1).to.be.true;
      expect(t2).to.be.false;
      expect(t3).to.be.false;
    });
  });

  describe('#badWords', function() {

    it('should disallow bad words if the filter is on (currently set to ' + cfg.badWordFilter + ')', function () {
      var n1 = util.badNames('fuck'),
          n2 = util.badNames('shit'),
          n3 = util.badNames('Fuck'),
          n4 = util.badNames('FUCK'),
          n5 = util.badNames('gary');
          n6 = util.badNames('fucktard');
          n7 = util.badNames('shithead');
          n8 = util.badNames('');
          n9 = util.badNames('mother fucker');
          n10 = util.badNames('f u c k');

          if (cfg.badWordFilter) {
            expect(n1).to.be.true;
            expect(n2).to.be.true;
            expect(n3).to.be.true;
            expect(n4).to.be.true;
            expect(n5).to.be.false;
            expect(n6).to.be.true;
            expect(n7).to.be.true;
            expect(n8).to.be.false;
            expect(n9).to.be.true;
            expect(n10).to.be.true;
          } else {    
            expect(n1).to.be.false;
            expect(n2).to.be.false;
            expect(n3).to.be.false;
            expect(n4).to.be.false;
            expect(n5).to.be.false;
            expect(n6).to.be.false;
            expect(n7).to.be.false;
            expect(n8).to.be.false;
            expect(n9).to.be.false;
            expect(n10).to.be.false;
    }
    });

   
  });

  describe('#log', function () {

    it('should compute the log_{base} of a number', function () {
      var base10 = util.log(1, 10),
          base2  = util.log(1, 2);

      var identity = util.log(10, 10);

      var logNineThree = util.log(9,3);

      //  log(1) should equal 0, no matter the base
      expect(base10).to.eql(base2);

      // log(n,n) === 1
      expect(identity).to.eql(1);

      // perform a trivial log calculation: 3^2 === 9
      expect(logNineThree).to.eql(2);
    });

  });

  describe('#getDistance', function () {

    // helper class
    function Point(x,y,r) {
      return {
        x      : x,
        y      : y,
        radius : r
      };
    }

    var p1 = Point(-100, 20, 1),
        p2 = Point(0, 40, 5),
        p3 = Point(0,0,100);

    it('should return a positive number', function () {
      var d = util.getDistance(p1, p2);
      expect(d).to.be.above(-1);
    });
  });
});
