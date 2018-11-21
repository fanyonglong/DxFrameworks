
import {Observable} from '../../src/core/observable'

test('测试 Observable 单个事件', () => {
    let _Observable=new Observable();

    let count=0;
    _Observable.on('mess',function(name){
        console.log(name+":"+this.age)
        count=2;
    },{age:'18岁时'})
    _Observable.on('mess',function(name){
        console.log(name+":"+this.age)
        count=1;
    },{age:'17岁时'},true)
    
    _Observable.emit('mess','李三')
    
    expect(count).toBe(2);
 });
 
test('测试 Observable 对象事件', () => {
    let _Observable=new Observable();

    let count=0;
    _Observable.on({
        'mess':function(name){
            count++;
        },
        'hello':function(name){
            count++;
        }
    },{age:'17岁时'})

    _Observable.emit('hello','李三')
    _Observable.emit('mess','李三')
    expect(count).toBe(2);
 });