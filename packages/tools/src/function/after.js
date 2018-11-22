
/**
 * @param  {number} count
 * @param  {functon} fn
 */
export default function after(n, func) {
    return function() {
      if (--n < 1) {
        return func.apply(this, arguments);
      }
    };
  }