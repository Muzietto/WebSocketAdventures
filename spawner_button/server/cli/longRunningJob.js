iterate(1);

function iterate(i) {
  if (i < 50) {
    console.log('current i: ' + i);
    setTimeout(() => iterate(++i), 100);
  } else {
    console.log('OVER AND OUT!!!');
  }
}
