
var {Observer}=require('../src/core/observer')

let o=new Observer({});
 describe('测试Observer', () => {
    test('测试Observer-一级属性值变化监听', () => {
        expect(o.age).toBe(43);
    });

  });