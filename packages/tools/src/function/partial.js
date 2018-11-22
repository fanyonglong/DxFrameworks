

const PLACEHOLDER='____dx_partial____' // 函数参数占位符
function getHolder(func) {
    var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
    return object.placeholder;
  }
function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }
export default function partial(func,...partials){

}