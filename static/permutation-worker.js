function *permutationGenerator(arr, n = arr.length) {
  if (n <= 1) {
    yield arr.slice();
  } else {
    for (let i = 0; i < n; i++) {
      yield *permutationGenerator(arr, n - 1);

      const j = n % 2 ? 0 : i;
      // if N is even, swap A[i] with A[n-1]
      // otherwise, swap A[0] with A[n-1]
      [arr[n-1], arr[j]] = [arr[j], arr[n-1]];
    }
  }
}

onmessage = (event) => {
  for (var permutation of permutationGenerator(event.data.split(''))) {
    postMessage(permutation.join(''))
  }

  postMessage(0)
}
