
var {Observer}=require('../src/core/observer')

let o=new Observer({});
 describe('测试Observer', () => {
    test('测试age是否等于43', () => {
        expect(o.age).toBe(43);
    });

  });