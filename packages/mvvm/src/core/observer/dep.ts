import Watcher  from './watcher'
import {remove} from '../util'
export default class Dep{
    static target?:Watcher;// 全局监听对象
    id: number;
    subs: Array<Watcher>;
    constructor()
    {
        this.id=0;
        this.subs=[];
    }
    /**
     * 添加依赖观察对象
     * @param sub 
     */
    addSub (sub: Watcher) {
      this.subs.push(sub)
    }
    removeSub (sub: Watcher) {
      remove(this.subs, sub)
    }
    depend () {
      if (Dep.target) {
        Dep.target.addDep(this)
      }
    }
    notify () {
      const subs = this.subs.slice()
      for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update()
      }
    }
}