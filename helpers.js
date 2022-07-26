const duration = 1000;

//array randomization function
export function randomize(array) {
  let current = array.length,
    temporary,
    random;

  while (current > 0) {
    random = Math.trunc(Math.random() * current);
    current--;
    temporary = array[current];
    array[current] = array[random];
    array[random] = temporary;
  }

  return array;
}

//stop clicking function
export function stopClicking(element) {
  element.classList.add("unclickable");
  setTimeout(() => {
    element.classList.remove("unclickable");
  }, duration);
}
