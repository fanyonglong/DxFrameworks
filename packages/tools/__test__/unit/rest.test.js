
import rest from '../../src/function/rest'

test('测试rest funcction', (done) => {

    var fn=rest(function(name,names){
        expect(names.length).toBe(2);
        done();
    })
    fn('a','b','c')
  });